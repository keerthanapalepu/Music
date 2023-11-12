import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button } from '@mui/material';
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
  const [cart, setCart] = useState([]);
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
            var Cart = false;
            if(cart.length > 0){
               Cart = cart.some(obj => obj.uid === item);
            }
            
           
          return {name: data.name, singer: data.artist, url: songUrl, duration: '3:14', fav: true, cart: Cart, id: item.uid};
        }
       }))
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
  const getCartSongs = async () => {
    try {
      const CartRef = collection(db, `users/${currentUser.uid}/Cart`);
      const q = query(CartRef);
      const querySnapshot = await getDocs(q);
      
      const CartData = await Promise.all(querySnapshot.docs.map((doc) => ({
        ...doc.data()
      })));
      console.log(CartData)
      setCart(CartData);
    } catch (error) {
      console.error('Error fetching Cart:', error);
    }
  }
  useEffect(() => {
    async function fetchData() {
      getFavSongs();
      getCartSongs();
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
  const handleCart = async(cart, index, songId) => {
    const updatedSongs = [...allSongsArray];
  updatedSongs[index].cart = !cart;
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
      const docRef = doc(db, 'songs', songId);
      const documentSnapshot = await getDoc(docRef);
      const updatedFav = {
        uid : songId,
        addedOn : serverTimestamp(),
        day : documentSnapshot.data().day
      };
      
      await setDoc(CartRef, updatedFav);
    } catch (error) {
      console.error('Error updating Cart:', error);
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
            <TableCell>Cart</TableCell>
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
                <TableCell>
                  {song.cart? (
                    <Button variant="contained" style={{backgroundColor: ""}} onClick={() => handleCart(song.cart, index, song.id)}>
                       REMOVE
                    </Button>
                  ) : (
                    <Button variant="contained"style={{backgroundColor: ""}} onClick={() => handleCart(song.cart, index, song.id)}>
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
}
export default Favourite;
