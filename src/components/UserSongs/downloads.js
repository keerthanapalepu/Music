import React, { useState, useEffect } from 'react';

import { useUserSongs } from "../../context/songsContext";
import {fetchSongData } from "../helperFunctions";
import SongsTable from "../HelperWidget/Table"
function Download() {
  const { userDownloadSongs } = useUserSongs();
  const [allSongsArray, setAllSongsArray] = useState([]);


  
  useEffect(() => {
    async function fetchData() {
      const songsArray =  userDownloadSongs.map((obj) => obj.uid);
      const newDocs = await fetchSongData(songsArray, [], []);
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    }
    fetchData();
  }, [])
  


  return (
   <SongsTable
    allSongsArray={allSongsArray}
    type={"Download"}
  />
  );
}
export default Download;
