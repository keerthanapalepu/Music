import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';

const SongTable = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);

  const handlePlay = (song) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(song.url);
    newAudio.play();
    newAudio.addEventListener('timeupdate', () => {
      if (newAudio.currentTime > 15) {
        newAudio.pause();
      }
    });
    setAudio(newAudio);
    setCurrentSong(song.name);
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setCurrentSong(null);
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Serial No.</TableCell>
          <TableCell>Song Name</TableCell>
          <TableCell>Artist</TableCell>
          <TableCell>Duration</TableCell>
          <TableCell>Play</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {songs.map((song, index) => (
          <TableRow key={song.name} hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{song.name}</TableCell>
            <TableCell>{song.singer}</TableCell>
            <TableCell>{song.duration}</TableCell>
            <TableCell>
              {currentSong === song.name ? (
                <IconButton onClick={handlePause}>
                  <BsPauseCircleFill />
                </IconButton>
              ) : (
                <IconButton onClick={() => handlePlay(song)}>
                  <BsPlayCircleFill />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SongTable;
