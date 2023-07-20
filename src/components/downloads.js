import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Typography } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiOutlineDownload } from 'react-icons/ai';
import { db, storage } from '../services/firebase';
import {collection, limit, orderBy, query, startAfter, getDocs, doc, getDoc, serverTimestamp, deleteDoc, setDoc} from '@firebase/firestore'
import { useAuth } from "../context/authContext";
import {
  getDownloadURL,
  ref,
} from "firebase/storage";
function Download() {
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [allSongsArray, setAllSongsArray] = useState([]);
  const { currentUser } = useAuth();

  const getDownloadSongs = async () => {
    try {
      const DownloadRef = collection(db, `users/${currentUser.uid}/Download`);
      const q = query(DownloadRef);
      const querySnapshot = await getDocs(q);
      
      const DownloadData = await Promise.all(querySnapshot.docs.map((doc) => ({
        ...doc.data()
      })));
      // console.log(DownloadData)
      // setDownload(DownloadData);
      const newDocs = await Promise.all(DownloadData.map(async (item) => {
        const docRef = doc(db, 'songs', item.uid);
        const documentSnapshot = await getDoc(docRef);
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          let songUrl = "";
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
           
          return {name: data.name, singer: data.artist, url: songUrl, duration: '3:14', id: item.uid};
        }
       }))
       setAllSongsArray((prevDocs) => [...prevDocs, ...newDocs]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
  
  useEffect(() => {
    async function fetchData() {
      getDownloadSongs();
    }
    fetchData();
  }, [])
  
  const handlePlay = (song, index) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(song.url);
    newAudio.play();
    setAudio(newAudio);
    setCurrentSong(index);
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setCurrentSong(null);
    }
  };
  
 
	// const handleDownload = (fileUrl, song) => {
  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.download = song;
  //   link.target = '_blank';

  //   // Simulate a click on the anchor element to start the download
  //   link.click();
  // }
  const handleDownload = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const urlObject = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = urlObject;
      link.download = name;
      link.target = '_blank';

      // Simulate a click on the anchor element to start the download
      link.click();

      // Clean up the URL object after the download
      URL.revokeObjectURL(urlObject);
    } catch (error) {
      console.error('Error downloading the song:', error);
    }
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
            <TableCell>Download</TableCell>
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
                    <IconButton onClick={() => handleDownload(song.url, song.name)}>
                      <AiOutlineDownload />
                    </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default Download;
