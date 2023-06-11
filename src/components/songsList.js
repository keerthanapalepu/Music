import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { db } from '../services/firebase';
import { collection, query, getDocs, where, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from "../context/authContext";

const SongTable = ({ songs, day, setAllSongsArray }) => {
  const { currentUser } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [songsList, setSongsList] = useState([]);
  useEffect(() => {
    setCurrentSong(null);
    setSongsList(songs)
  }, [songs])
  
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
    const updatedSongs = [...songsList];
  updatedSongs[index].fav = !fav;
  setSongsList([...updatedSongs]);
  setAllSongsArray([...updatedSongs]);
  const favoriteRef = doc(db, `users/${currentUser.uid}/Favourite`, favoriteId);
  if(fav){
    try {
      
      await deleteDoc(favoriteRef);
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  }
  else{
    try {
      const updatedFav = {
        uid : favoriteId,
        addedOn : serverTimestamp(),
        day : day
      };
      
      await setDoc(favoriteRef, updatedFav);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  }

  }

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
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
          {songsList.length > 0 && (
            songsList.map((song, index) => (
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
};

export default SongTable;
