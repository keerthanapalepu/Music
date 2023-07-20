import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import { db } from '../services/firebase';
import { doc, getDoc} from '@firebase/firestore'
import { useAuth } from "../context/authContext";
import { useUserSongs } from "../context/songsContext";
import {fetchSongData, handleCurrentUserSongs } from "./helperFunctions";
import SongTableRow from "./Home/songRow"

function Favourite() {
  const { userCartSongs, userFavSongs, setUserFavSongs, setUserCartSongs } = useUserSongs();
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);
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
  
  const handlePlay = (song, index) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(song.url);
    newAudio.play();
    newAudio.addEventListener('timeupdate', () => {
      if (newAudio.currentTime > 15) {
        newAudio.pause();
        setCurrentSong(null);
      }
    });
    setAudio(newAudio);
    setCurrentSong(index);
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setCurrentSong(null);
    }
  };
 
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
<div style={{ overflowY: 'auto', height: '88%' , margin: '20px',borderRadius: "8px", backgroundColor: "#A7A7A7"}}>
      <style>
        {`
        ::-webkit-scrollbar {
          width: 0.5rem;
          background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
        `}
      </style>
      <Table style={{ minWidth: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell>Serial No.</TableCell>
            <TableCell>Song Name</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Play</TableCell>
            <TableCell>Favourite</TableCell>
            <TableCell>Cart</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSongsArray.length > 0 && (
            allSongsArray.map((song, index) => (
              <SongTableRow
                key={song.name}
                song={song}
                index={index}
                currentSong={currentSong}
                handlePlay={handlePlay}
                handlePause={handlePause}
                handleController={handleController}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default Favourite;
