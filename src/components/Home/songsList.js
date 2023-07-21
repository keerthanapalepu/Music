import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/authContext";
import { useUserSongs } from "../../context/songsContext";
import { handleCurrentUserSongs } from "../helperFunctions";
import SongsTable from "../HelperWidget/Table"
const SongTable = ({ songs, day, setAllSongsArray }) => {
  const { currentUser } = useAuth();
  const { userCartSongs, userFavSongs, setUserFavSongs, setUserCartSongs } = useUserSongs();
  const [songsList, setSongsList] = useState([]);

  useEffect(() => {
    setSongsList(songs);
  }, [songs]);

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
    <SongsTable
    allSongsArray={songsList}
    handleController={handleController}
  />
  );
};

export default SongTable;
