import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
} from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsFillCartFill } from 'react-icons/bs';
import { useAuth } from "../context/authContext";
import { useUserSongs } from "../context/songsContext";
import { handleCurrentUserSongs } from "./helperFunctions";

const SongTable = ({ songs, day, setAllSongsArray }) => {
  const { currentUser } = useAuth();
  const { userCartSongs, userFavSongs, setUserFavSongs, setUserCartSongs } = useUserSongs();
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [songsList, setSongsList] = useState([]);

  useEffect(() => {
    setCurrentSong(null);
    setSongsList(songs);
  }, [songs]);

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

  const handleController = async (boolType, index, songId, type) => {
    const updatedSongs = [...songsList];
    if (type === "Favourite") {
      updatedSongs[index].fav = !boolType;
    } else {
      updatedSongs[index].cart = !boolType;
    }
    setSongsList([...updatedSongs]);
    setAllSongsArray([...updatedSongs]);
    await handleCurrentUserSongs(
      boolType,
      songId,
      type,
      currentUser.uid,
      day,
      type === "Favourite" ? setUserFavSongs : setUserCartSongs,
      type === "Favourite" ? userFavSongs : userCartSongs
    );
  };

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
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
            <TableCell>Favourite</TableCell>
            <TableCell> Add to Cart   <BsFillCartFill /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songsList.length > 0 && (
            songsList.map((song, index) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SongTable;
