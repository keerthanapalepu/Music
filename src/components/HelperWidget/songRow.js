import React, {useState} from 'react';
import { TableRow, TableCell, IconButton, Button } from '@mui/material';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';
import { useUserSongs } from "../../context/songsContext";
import DialogBox from "../HelperWidget/DialogBox";

const SongTableRow = ({ handleDownload, type, song, index, currentSong, handlePlay, handlePause, handleController }) => {
  const { userDownloadSongs } = useUserSongs();
  const [open, setOpen] = useState(false);
  const checkInDownloads = (cart, index, id, type) => {
    const foundObject = userDownloadSongs.find((obj) => obj.uid === id);
    if (foundObject) {
      setOpen(true);
    } else {
      handleController(cart, index, id, type);
    }
  }
  const language = localStorage.getItem('selectedLanguage');
  return (
    <>
      <TableRow key={song.name} hover style={{ height: '50px' }}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{language === "telugu"? song.teluguName : song.hindiName}</TableCell>
      <TableCell>{song.singer}</TableCell>
      {/* <TableCell>{song.duration}</TableCell> */}
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
          <Button variant="contained" style={{ backgroundColor: "#A5A492" }} onClick={() => checkInDownloads(song.cart, index, song.id, "Cart")}>
            ADD
          </Button>
        )}
      </TableCell>}
      {type === "Download" && <TableCell>
        <IconButton onClick={() => handleDownload(song.url, language === "telugu"? song.teluguName : song.hindiName)}>
          <AiOutlineDownload />
        </IconButton>
    </TableCell>}
    </TableRow>
    <DialogBox open={open} setOpen={setOpen} title={"Check your Downloads"} text={"Song is already downloaded"} type={true} />
    </>
  );
};

export default SongTableRow;
