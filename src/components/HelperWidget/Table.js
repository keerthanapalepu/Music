import React, {useState, useEffect} from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import SongTableRow from './songRow';

function SongsTable({ allSongsArray, handleController, type = "NotDownloads" }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        setCurrentSong(null);
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

      const handleDownload = async (url, name) => {
        try {
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
    <div style={{ overflowY: 'auto', height: '88%', margin: '20px', borderRadius: "8px", backgroundColor: "#A7A7A7" }}>
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
            {type !== "Download" && <TableCell>Favourite</TableCell>}
            {type !== "Download" &&<TableCell>Cart</TableCell>}
            {type === "Download" &&<TableCell>Download</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {allSongsArray.length > 0 && (
            allSongsArray.map((song, index) => (
              <SongTableRow
                handleDownload={handleDownload}
                type={type}
                key={song.name}
                song={song}
                index={index}
                currentSong={currentSong}
                handlePlay={handlePlay}
                handlePause={handlePause}
                handleController={handleController}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SongsTable;
