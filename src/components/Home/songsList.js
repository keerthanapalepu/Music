import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { BsFillCartFill } from 'react-icons/bs';
import { useAuth } from "../../context/authContext";
import { useUserSongs } from "../../context/songsContext";
import { handleCurrentUserSongs } from "../helperFunctions";
import SongTableRow from "./songRow"
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
              <SongTableRow
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
};

export default SongTable;
