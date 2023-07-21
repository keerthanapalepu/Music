import React from 'react';
import { TableRow, TableCell, IconButton, Button } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';



const SongTableRow = ({ handleDownload, type, song, index, currentSong, handlePlay, handlePause, handleController }) => {
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
     {type !== "Download" && <TableCell>
        {song.fav ? (
          <IconButton onClick={() => handleController(song.fav, index, song.id, "Favourite")}>
            <AiFillHeart />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleController(song.fav, index, song.id, "Favourite")}>
            <AiOutlineHeart />
          </IconButton>
        )}
      </TableCell>}
      {type !== "Download" && <TableCell>
        {song.cart ? (
          <Button variant="contained" style={{ backgroundColor: "#A5A492" }} onClick={() => handleController(song.cart, index, song.id, "Cart")}>
            REMOVE
          </Button>
        ) : (
          <Button variant="contained" style={{ backgroundColor: "#A5A492" }} onClick={() => handleController(song.cart, index, song.id, "Cart")}>
            ADD
          </Button>
        )}
      </TableCell>}
      {type === "Download" && <TableCell>
        <IconButton onClick={() => handleDownload(song.url, song.name)}>
          <AiOutlineDownload />
        </IconButton>
    </TableCell>}
    </TableRow>
  );
};

export default SongTableRow;
