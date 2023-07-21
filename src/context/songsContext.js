import React, { useContext, useEffect, useState, createContext } from "react";
import {getCurrentUserSongs} from "../components/helperFunctions";
import { useAuth } from "../context/authContext";
const UserSongsContext = createContext();

export function useUserSongs() {
  return useContext(UserSongsContext);
}

export function UserSongsProvider({ children }) {
    
  const { currentUser } = useAuth();
  const [userFavSongs, setUserFavSongs] = useState([]);
  const [userCartSongs, setUserCartSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  
  useEffect(() => {
    const fetchSongs = async () => {
        const favSongs = await getCurrentUserSongs(currentUser.uid, "Favourite");
        setUserFavSongs(favSongs);
        const cartSongs = await getCurrentUserSongs(currentUser.uid, "Cart");
        setUserCartSongs(cartSongs);
        setLoadingSongs(false);
    }
    if(currentUser){
      fetchSongs();
    }
    else{
      setLoadingSongs(false);
    }
  }, [currentUser]);

  const value = {
    userFavSongs,
    setUserFavSongs,
    userCartSongs,
    setUserCartSongs,
    loadingSongs,
  };

  return (
    <UserSongsContext.Provider value={value}>
      {!loadingSongs && children}
    </UserSongsContext.Provider>
  );
}
