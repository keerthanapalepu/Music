import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc} from '@firebase/firestore'
import { useAuth } from "../../context/authContext";
import { useUserSongs } from "../../context/songsContext";
import {fetchSongData, handleCurrentUserSongs } from "../helperFunctions";
import SongsTable from "../HelperWidget/Table"

function Favourite() {
  const { userCartSongs, userFavSongs, setUserFavSongs, setUserCartSongs } = useUserSongs();
  const [allSongsArray, setAllSongsArray] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    async function fetchData() {
      const songsArray =  userFavSongs.map((obj) => obj.uid);
      const newDocs = await fetchSongData(songsArray, userFavSongs, userCartSongs);
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    }
    fetchData();
  }, [])
  
 
 
  const handleController = async (boolType, index, songId, type) => {
    const updatedSongs = [...allSongsArray];
    if (type === "Favourite") {
      updatedSongs.splice(index, 1);
    } else {
      updatedSongs[index].cart = !boolType;
    }
    setAllSongsArray([...updatedSongs]);
    const docRef = doc(db, 'songs', songId);
    const documentSnapshot = await getDoc(docRef);
    await handleCurrentUserSongs(
      boolType,
      songId,
      type,
      currentUser.uid,
      documentSnapshot.data().day,
      type === "Favourite" ? setUserFavSongs : setUserCartSongs,
      type === "Favourite" ? userFavSongs : userCartSongs
    );
  };

  return (
  <SongsTable
    allSongsArray={allSongsArray}
    handleController={handleController}
  />
  );
}
export default Favourite;
