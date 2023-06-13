import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Typography } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { db, storage, httpsCallable, functions } from '../services/firebase';
import {collection, limit, orderBy, query, startAfter, getDocs, doc, getDoc, serverTimestamp, deleteDoc, setDoc} from '@firebase/firestore'
import { useAuth } from "../context/authContext";
import axios from "axios";
import {
  getDownloadURL,
  ref,
} from "firebase/storage";
function Cart() {
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [allSongsArray, setAllSongsArray] = useState([]);
  const { currentUser } = useAuth();

  const getCartSongs = async () => {
    try {
      const CartRef = collection(db, `users/${currentUser.uid}/Cart`);
      const q = query(CartRef);
      const querySnapshot = await getDocs(q);
      
      const CartData = await Promise.all(querySnapshot.docs.map((doc) => ({
        ...doc.data()
      })));
      // console.log(CartData)
      // setCart(CartData);
      const newDocs = await Promise.all(CartData.map(async (item) => {
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
           
          return {name: data.name, singer: data.artist, url: songUrl, duration: '3:14', cart: true, id: item.uid};
        }
       }))
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
  
  useEffect(() => {
    async function fetchData() {
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
  
  const handleCart = async(cart, index, songId) => {
    const updatedSongs = [...allSongsArray];
    updatedSongs.splice(index, 1);
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

  const initPayment = (data) => {
		const options = {
			key: "rzp_test_ejCrGqnkEeie69",
			amount: data.amount,
			currency: data.currency,
			name: "Buy Songs",
			description: "Test Transaction",
			order_id: data.id,
			handler: async (response) => {
        const verifyPayment = httpsCallable(functions, 'paymentVerification');
        verifyPayment(response)
        .then(async (response) => {
          console.log(response.data);
          await Promise.all(allSongsArray.map(async (item) => {
            const CartRef = doc(db, `users/${currentUser.uid}/Cart`, item.id);
            const DownloadRef = doc(db, `users/${currentUser.uid}/Download`, item.id);
              try {
                await deleteDoc(CartRef);
              } catch (error) {
                console.error('Error deleting Cart:', error);
              }
              try {
                const docRef = doc(db, 'songs', item.id);
                const documentSnapshot = await getDoc(docRef);
                const updatedFav = {
                  uid : item.id,
                  addedOn : serverTimestamp(),
                  day : documentSnapshot.data().day
                };
                
                await setDoc(DownloadRef, updatedFav);
              } catch (error) {
                console.error('Error updating Cart:', error);
              }
          }))
          setAllSongsArray([])
        })
        .catch(error => {
          console.error('Error:', error);
        });
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async () => {
    const createOrder = httpsCallable(functions, 'createOrder');
    createOrder({amount : allSongsArray.length * 50})
    .then((response) => {
      initPayment(response.data.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
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
        <TableHead >
          <TableRow>
            <TableCell>Serial No.</TableCell>
            <TableCell>Song Name</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Play</TableCell>
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
                  {song.cart? (
                    <Button variant="contained" style={{backgroundColor: "#A5A492"}} onClick={() => handleCart(song.cart, index, song.id)}>
                       REMOVE
                    </Button>
                  ) : (
                    <Button variant="contained" style={{backgroundColor: "#A5A492"}} onClick={() => handleCart(song.cart, index, song.id)}>
                      ADD
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
     <div style={{display:'flex', justifyContent: "space-around", alignItems: "center", padding: "20px"}}>
     <Typography variant="h6">Total Amount: {allSongsArray.length * 50}</Typography>
      <Button variant="contained" style={{backgroundColor: "#A5A492"}} onClick={handlePayment} color="primary">
        Checkout
      </Button>
     </div>
    </div>
  );
}
export default Cart;
