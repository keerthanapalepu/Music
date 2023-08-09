import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { db, httpsCallable, functions } from '../../services/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp} from '@firebase/firestore'
import { useAuth } from "../../context/authContext";
import { useUserSongs } from "../../context/songsContext";
import {fetchSongData, handleCurrentUserSongs, toastNotification } from "../helperFunctions";
import SongsTable from "../HelperWidget/Table"
import WhiteCircularProgress from '../HelperWidget/circularProgress';
function Cart({setActiveButton}) {
  const { userCartSongs, userFavSongs, setUserFavSongs, setUserCartSongs, setUserDownloadSongs, userDownloadSongs } = useUserSongs();
  const [allSongsArray, setAllSongsArray] = useState([]);
  const [loader, setLoader] = useState(false); 
  const { currentUser } = useAuth();

  
  useEffect(() => {
    async function fetchData() {
      const songsArray =  userCartSongs
      const newDocs = await fetchSongData(songsArray, userFavSongs, userCartSongs, true);
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    }
    fetchData();
  }, [])
  
  const handleController = async (boolType, index, songId, type) => {
    const updatedSongs = [...allSongsArray];
    if (type === "Favourite") {
      updatedSongs[index].fav = !boolType;
    } else {
      updatedSongs.splice(index, 1);
    }
    toastNotification(!boolType, type);
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
        .then(async () => {
          setAllSongsArray([])
          console.log(response)
          setLoader(true);
          await Promise.all(allSongsArray.map(async (item) => {
              const docRef = doc(db, 'songs', item.id);
              const documentSnapshot = await getDoc(docRef);
              await handleCurrentUserSongs(
                false,
                item.id + "_" + localStorage.getItem('selectedLanguage'),
                "Download",
                currentUser.uid,
                documentSnapshot.data().day,
                setUserDownloadSongs,
                userDownloadSongs,
                localStorage.getItem('selectedLanguage')
              );
          }))
          setActiveButton("Downloads");
          setLoader(false)
          await Promise.all(allSongsArray.map(async (item) => {
            await handleCurrentUserSongs(
              true,
              item.id,
              "Cart",
              currentUser.uid,
              "",
              setUserCartSongs,
              userCartSongs,
            );
            const ordersCollectionRef = collection(db, 'orders');
            const orderData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              userId: currentUser.uid,
              songId: item.id,
              purchasedOn: serverTimestamp()
            };
            try {
              const docRef = await addDoc(ordersCollectionRef, orderData);
              console.log('Document written with ID: ', docRef.id);
            } catch (error) {
              console.error('Error adding document: ', error);
            }
  
        }))
        setUserCartSongs([])
          
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
    setLoader(true)
    const createOrder = httpsCallable(functions, 'createOrder');
    createOrder({amount : allSongsArray.length * 50})
    .then((response) => {
      setLoader(false);
      initPayment(response.data.data);
    })
    .catch(error => {
      setLoader(false);
      console.error('Error:', error);
    });
	};

  return (
    <>
      {loader? (
        <div style={{  height: '88%' , margin: '20px',borderRadius: "8px", backgroundColor: "#edeeef"}}>
        <WhiteCircularProgress />
        </div>
      ) : (
        <div style={{  height: '88%' , margin: '20px',borderRadius: "8px", backgroundColor: "#edeeef"}}>
    <SongsTable
        allSongsArray={allSongsArray}
        handleController={handleController}
        type={"Cart"}
      />
     <div style={{display:'flex', justifyContent: "space-around", alignItems: "center", padding: "20px"}}>
     <Typography variant="h6">Total Amount: {allSongsArray.length * 50} /- </Typography>
      <Button variant="contained" style={{backgroundColor: "#148024"}} onClick={handlePayment} color="primary">
        Checkout
      </Button>
     </div>
    </div>
      )}
    </>
  
  );
}
export default Cart;
