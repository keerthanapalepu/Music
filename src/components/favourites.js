import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { db, storage } from '../services/firebase';
import {collection, limit, orderBy, query, startAfter, getDocs, doc, getDoc, serverTimestamp, deleteDoc, setDoc} from '@firebase/firestore'
import { useAuth } from "../context/authContext";
import {
  getDownloadURL,
  ref,
} from "firebase/storage";
function Favourite() {
  const [fav, setFav] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [allSongsArray, setAllSongsArray] = useState([]);
  const { currentUser } = useAuth();

  const getFavSongs = async () => {
    try {
      const favoritesRef = collection(db, `users/${currentUser.uid}/Favourite`);
      const q = query(favoritesRef);
      const querySnapshot = await getDocs(q);
      
      const favoritesData = await Promise.all(querySnapshot.docs.map((doc) => ({
        ...doc.data()
      })));
      // console.log(favoritesData)
      setFav(favoritesData);
      const newDocs = await Promise.all(favoritesData.map(async (item) => {
        const docRef = doc(db, 'songs', item.uid);
        const documentSnapshot = await getDoc(docRef);
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          var songUrl = "";
            const storageRef = ref(storage, `/music/${data.day}/${documentSnapshot.id}.mp3`);
  
            try {
              const url = await getDownloadURL(storageRef);
              songUrl = url;
            } catch (error) {
              switch (error.code) {
                case "storage/object-not-found":
                  console.log("File doesn't exist");
                  songUrl = "";
                  break;
                default:
                  songUrl = "";
                  break;
              }
            }
           
          return {name: data.name, singer: data.artist, url: songUrl, duration: '3:14', fav: true, id: item.uid};
        }
       }))
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
  
  useEffect(() => {
    async function fetchData() {
      getFavSongs();
       
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
  const handleFav = async(fav, index, favoriteId) => {
    const updatedSongs = [...allSongsArray];
  updatedSongs.splice(index, 1);
  setAllSongsArray([...updatedSongs]);
  const favoriteRef = doc(db, `users/${currentUser.uid}/Favourite`, favoriteId);
  if(fav){
    try {
      
      await deleteDoc(favoriteRef);
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  }
  }
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
          </TableRow>
        </TableHead>
        <TableBody>
          {allSongsArray.length > 0 && (
            allSongsArray.map((song, index) => (
              <TableRow key={song.name} hover style={{ height: '50px' }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{song.name}</TableCell>
                <TableCell>{song.singer}</TableCell>
                <TableCell>{song.duration}</TableCell>
                <TableCell>
                  {currentSong === index ? (
                    <IconButton onClick={handlePause}>
                      <BsPauseCircleFill />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handlePlay(song, index)}>
                      <BsPlayCircleFill />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {song.fav? (
                    <IconButton onClick={() => handleFav(song.fav, index, song.id)}>
                      <AiFillHeart />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleFav(song.fav, index, song.id)}>
                      <AiOutlineHeart />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default Favourite;
