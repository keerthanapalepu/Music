import React from 'react';
import { TableRow, TableCell, IconButton, Button } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';


const SongTableRow = ({ song, index, currentSong, handlePlay, handlePause, handleController }) => {
  return (
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
        {song.fav ? (
          <IconButton onClick={() => handleController(song.fav, index, song.id, "Favourite")}>
            <AiFillHeart />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleController(song.fav, index, song.id, "Favourite")}>
            <AiOutlineHeart />
          </IconButton>
        )}
      </TableCell>
      <TableCell>
        {song.cart ? (
          <Button variant="contained" style={{ backgroundColor: "#A5A492" }} onClick={() => handleController(song.cart, index, song.id, "Cart")}>
            REMOVE
          </Button>
        ) : (
          <Button variant="contained" style={{ backgroundColor: "#A5A492" }} onClick={() => handleController(song.cart, index, song.id, "Cart")}>
            ADD
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default SongTableRow;
