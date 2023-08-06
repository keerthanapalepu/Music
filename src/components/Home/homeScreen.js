import React, { useState, useEffect } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import { BsChevronRight } from 'react-icons/bs';
import { collection, limit, orderBy, query, startAfter, getDocs } from '@firebase/firestore';
import { db } from '../../services/firebase';
import CardItem from './cardItem';
import SongsList from './songsList';
import { useUserSongs } from "../../context/songsContext";
import { getMediaUrl, fetchSongData } from "../helperFunctions";
import useStyles from './homeStyles';
import WhiteCircularProgress from '../HelperWidget/circularProgress';

const HomeScreen = () => {
  const classes = useStyles();
  const { userFavSongs, userCartSongs } = useUserSongs();
  const [weekSongsArray, setWeekSongsArray] = useState([]);
  const [lastCreatedOn, setLastCreatedOn] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [allSongsArray, setAllSongsArray] = useState([]);
  const language = localStorage.getItem('selectedLanguage');
  const handleNext = () => {
    getSongsAlbum();
  };

  const getSongsAlbum = async () => {
    const collectionRef = collection(db, 'albums');
    let firestoreQuery = query(collectionRef, orderBy('createdOn', 'desc'), limit(8));

    if (lastCreatedOn) {
      firestoreQuery = query(firestoreQuery, startAfter(lastCreatedOn));
    }

    try {
      const querySnapshot = await getDocs(firestoreQuery);
      const newDocs = [];

      await Promise.all(querySnapshot.docs.map(async (doc) => {
        let imageUrl = await getMediaUrl(`/music/${doc.data().type}/${doc.data().type}.jpg`);

        newDocs.push({ id: doc.id, url: imageUrl, day: doc.data().name, type: doc.data().type, teluguTheme: doc.data().teluguTheme, hindiTheme: doc.data().hindiTheme,  songs: doc.data().songsRef });
        setLastCreatedOn(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }));

      newDocs.sort((a, b) => {
        const numA = parseInt(a.type.split('_')[1]);
        const numB = parseInt(b.type.split('_')[1]);
        return numB - numA;
      });
      setWeekSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
      console.log(newDocs)
    } catch (error) {
      console.log('Error getting documents:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      getSongsAlbum();
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const songsArray = weekSongsArray[selectedCard]?.songs;
      const newDocs = await fetchSongData(songsArray, userFavSongs, userCartSongs, true);
      setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    }
    if (selectedCard != null && selectedCard >= 0) {
      setAllSongsArray([])
      fetchData();
    }
  }, [selectedCard]);

  return (
    <>
   {weekSongsArray.length === 0? (<WhiteCircularProgress />) :
    (<Grid container style={{ height: '85vh' }}>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          {weekSongsArray.map((item, index) => (
            <Grid item xs={12} className={classes.gridItem} key={index}>
              <CardItem item={item} onClick={() => setSelectedCard(index)} />
            </Grid>
          ))}
          <IconButton
            className={classes.chevron}
            aria-label="Next"
            onClick={handleNext}
          >
            <BsChevronRight />
          </IconButton>
        </div>
      </div>

      <Grid container item style={{ height: '72%'}}>
        <SongsList songs={allSongsArray} setAllSongsArray={setAllSongsArray} day={weekSongsArray[selectedCard]?.type} />
      </Grid>

      <div>
      </div>
    </Grid>)}
    </>
  );
};

export default HomeScreen;
