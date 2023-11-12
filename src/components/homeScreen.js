import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { db, storage } from '../services/firebase';
import {collection, limit, orderBy, query, startAfter, getDocs, doc, getDoc} from '@firebase/firestore'
import {
  getDownloadURL,
  ref,
} from "firebase/storage";
import {BsChevronRight, BsChevronLeft} from 'react-icons/bs'
import SongsList from './songsList';
import { useAuth } from "../context/authContext";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    padding: "0px 8px",
  },
  card: {
    width: "200px",
    height: "240px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.3 )",
    },
    cursor: "pointer"
  },
  cardContent: {
    textAlign: "center",
  },
  image: {
    width: "180px",
    height: "180px",
    paddingTop: "20px",
  },
  title: {
    color: "#F4F3CC",
    fontWeight: "bold",
  },
  theme: {
    color: "#F4F3CC",
  },
  chevron: {
    position: "absolute",
    right: 10,
    // bottom: 10,
    opacity: 0.8,
    fontSize: "3rem",
    "&:hover": {
      boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.6)",
    },
    transition: "opacity 0.3s ease",
  },
  chevronLeft: {
    position: "absolute",
    left: "-10px",
    zIndex: 1,
    // bottom: 10,
    opacity: 0.8,
    fontSize: "3rem",
    "&:hover": {
      boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.6)",
    },
    transition: "opacity 0.3s ease",
  },
}));
const HomeScreen = () => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const [weekSongsArray, setWeekSongsArray] = useState([]);
  const [lastAddedOn, setLastAddedOn] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [allSongsArray, setAllSongsArray] = useState([]);
  const [fav, setFav] = useState([]);
  const [cart, setCart] = useState([]);
  const handleNext = () => {
    const nextIndex = startIndex + 4;
    setStartIndex(nextIndex >= weekSongsArray.length ? 0 : nextIndex);
  };

  const handlePrev = async () => {
    const prevIndex = startIndex - 4;
    setStartIndex(prevIndex < 0 ? weekSongsArray.length - 4 : prevIndex);
  };

  const getSongs = async () => {
    const collectionRef = collection(db, 'weeklyAlbum');
    let firestoreQuery = query(collectionRef, orderBy('addedOn'), limit(8));

    if (lastAddedOn) {
      firestoreQuery = query(firestoreQuery, startAfter(lastAddedOn));
    }

    try {
      const querySnapshot = await getDocs(firestoreQuery);
      const newDocs = [];

      await Promise.all(querySnapshot.docs.map(async(doc) => {  
        var imageUrl = "";
          const storageRef = ref(storage, `/music/${doc.data().type}/${doc.data().type}.jpg`);

          try {
            const url = await getDownloadURL(storageRef);
            imageUrl = url;
          } catch (error) {
            switch (error.code) {
              case "storage/object-not-found":
                console.log("File doesn't exist");
                imageUrl = "";
                break;
              default:
                imageUrl = "";
                break;
            }
          }
        newDocs.push({ id: doc.id, url: imageUrl, day: doc.data().name, type: doc.data().type, theme: doc.data().theme, songs: doc.data().songsRef });
        setLastAddedOn(doc.data().addedOn);
      }));

      setWeekSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
      console.log(newDocs)
    } catch (error) {
      console.log('Error getting documents:', error);
    }
  }
  
  const getFavSongs = async () => {
    try {
      const favoritesRef = collection(db, `users/${currentUser.uid}/Favourite`);
      const q = query(favoritesRef);
      const querySnapshot = await getDocs(q);
      
      const favoritesData = await Promise.all(querySnapshot.docs.map((doc) => ({
        ...doc.data()
      })));
      console.log(favoritesData)
      setFav(favoritesData);
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
       getSongs();
       
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
     const songsArray =  weekSongsArray[selectedCard].songs;
     
     const newDocs = await Promise.all(songsArray.map(async (item) => {
      const docRef = doc(db, 'songs', item);
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
          var Fav = false;
          if(fav.length > 0){
             Fav = fav.some(obj => obj.uid === item);
          }
          var Cart = false;
          if(cart.length > 0){
             Cart = cart.some(obj => obj.uid === item);
          }
          
        return {name: data.name, singer: data.artist, url: songUrl, duration: '3:14', fav: Fav, cart: Cart, id: item};
      }
     }))
     console.log(newDocs);
     setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
   }
   if(selectedCard!= null && selectedCard >= 0){
    setAllSongsArray([])
    getFavSongs();
    getCartSongs();
    fetchData();
    
   }
  }, [selectedCard])
  
  return (
    <Grid container style={{ height: '85vh' }}>
      <Grid
        container
        item
        style={{
          height: '45%',
          backgroundColor: 'transparent',
          margin: '0 10px 10px',
          overflow: 'hidden', // Ensure overflow is hidden for the transition effect
          position: 'relative', // Position relative for absolute positioning of cards
          display: 'flex',
          justifyContent: "center",
          alignItems: "center"
        }}
      >
      <IconButton
          className={classes.chevronLeft}
          aria-label="Next"
          onClick={handlePrev}
        >
          <BsChevronLeft />
        </IconButton>
        <div
          style={{
            width: `${weekSongsArray.length * 45}%`, // Adjust the width based on the number of weekSongsArray
            transform: `translateX(-${startIndex * (100 / weekSongsArray.length)}%)`, // Translate the cards based on the start index
            transition: 'transform 0.5s ease', // Apply the transition effect
            display: 'flex',
            marginLeft: '50px'
          }}
        >
          {weekSongsArray.map((item, index) => (
            <Grid
          item
          xs={12}
          className={classes.gridItem}
          key={index}
        >
          <Card className={classes.card} onClick={() => setSelectedCard(index)}>
            <CardContent className={classes.cardContent}>
              <div>
                <img
                  src={item.url}
                  className={classes.image}
                  alt={item.name}
                />
                <Typography className={classes.title}>{item.day}</Typography>
                <Typography className={classes.theme}>{item.theme + "..."}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
          ))}
        </div>
        <IconButton
          className={classes.chevron}
          aria-label="Next"
          onClick={handleNext}
        >
          <BsChevronRight />
        </IconButton>
      </Grid>

      <Grid container item style={{ height: '60%', backgroundColor: '#CCCCCC', margin: '0 10px 0' }}>
         <SongsList songs={allSongsArray} setAllSongsArray={setAllSongsArray} day={weekSongsArray[selectedCard]?.type}/>
      </Grid>

      <div>
      </div>
    </Grid>
  );
};

export default HomeScreen;
