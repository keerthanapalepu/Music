import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsFillCartFill, BsCart } from 'react-icons/bs';
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
  const handleCart = async(cart, index, songId) => {
    const updatedSongs = [...songsList];
  updatedSongs[index].cart = !cart;
  setSongsList([...updatedSongs]);
  setAllSongsArray([...updatedSongs]);
  const CartRef = doc(db, `users/${currentUser.uid}/Cart`, songId);
  if(cart){
    try {
      
      await deleteDoc(CartRef);
    } catch (error) {
      console.error('Error deleting Cart:', error);
    }
  }
  else{
    try {
      const updatedFav = {
        uid : songId,
        addedOn : serverTimestamp(),
        day : day
      };
      
      await setDoc(CartRef, updatedFav);
    } catch (error) {
      console.error('Error updating Cart:', error);
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
            <TableCell> Add to Cart   <BsFillCartFill /></TableCell>
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
                <TableCell>
                  {song.cart? (
                    <Button variant="contained" style={{backgroundColor: "#A5A492"}} onClick={() => handleCart(song.cart, index, song.id)}>
                       REMOVE
                    </Button>
                  ) : (
                    <Button variant="contained"style={{backgroundColor: "#A5A492"}} onClick={() => handleCart(song.cart, index, song.id)}>
                      ADD
                    </Button>
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
