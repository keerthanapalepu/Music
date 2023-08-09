import React, {useState, useEffect} from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell , Typography} from '@mui/material';
import SongTableRow from './songRow';
import {HiShoppingCart} from "react-icons/hi";

const textStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '50vh',
  width: '600px',
  marginLeft: '400px',
};
function SongsTable({ allSongsArray, handleController, type}) {
    const [currentSong, setCurrentSong] = useState(null);
    const [audio, setAudio] = useState(null);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
      const delayedFunction = () => {
        if(allSongsArray.length === 0){
          setEmpty(true);
        }
      };

      const timer = setTimeout(delayedFunction, 1000);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setCurrentSong(null);
        if(allSongsArray.length !== 0){
          setEmpty(false);
        }
        return () => {
            if (audio) {
              audio.pause();
            }
          };
      }, [allSongsArray]);
        

    const handlePlay = (song, index) => {
        if (audio) {
          audio.pause();
        }
        const newAudio = new Audio(song.url);
        newAudio.play();
        // newAudio.addEventListener('timeupdate', () => {
        //   if (type !== "Download" && newAudio.currentTime > 15) {
        //     newAudio.pause();
        //     setCurrentSong(null);
        //   }
        // });
        setAudio(newAudio);
        setCurrentSong(index);
      };
    
      const handlePause = () => {
        if (audio) {
          audio.pause();
          setCurrentSong(null);
        }
      };

      const handleDownload = async (url, name) => {
        try {
          console.log("hello")
          const response = await fetch(url);
          const blob = await response.blob();
          const urlObject = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = urlObject;
          link.download = name;
          link.target = '_blank';
    
          link.click();
    
          URL.revokeObjectURL(urlObject);
        } catch (error) {
          console.error('Error downloading the song:', error);
        }
      };
      
    return (
    <div style={{ overflowY: 'auto', height: '88%', margin: '20px', borderRadius: "8px", backgroundColor: "#edeeef" }}>
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
            <TableCell>Singer</TableCell>
            {/* <TableCell>Duration</TableCell> */}
            {type !== "Download"  && <TableCell>Preview</TableCell>}
            {type !== "Download" && <TableCell>Favourite</TableCell>}
            {type !== "Download" &&<TableCell><HiShoppingCart style={{ fontSize: '1.3rem' }}/></TableCell>}
            {type === "Download" &&<TableCell>Download</TableCell>}
          </TableRow>
        </TableHead>
        {empty && allSongsArray.length === 0? (
          <Typography variant="h5" component="h5" style={textStyles}>
              {type === "Home" ? "Select from above cards" : `No song avaliable in ${type} section`}
            </Typography>
          ) : (
          <TableBody>
          {allSongsArray.length !== 0 &&
            allSongsArray.map((song, index) => (
              <SongTableRow
                handleDownload={handleDownload}
                type={type}
                key={index}
                song={song}
                index={index}
                currentSong={currentSong}
                handlePlay={handlePlay}
                handlePause={handlePause}
                handleController={handleController}
              />
            ))}
        </TableBody>
          )}
      </Table>
    </div>
  );
}

export default SongsTable;
