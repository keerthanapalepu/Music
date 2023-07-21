import { db, storage } from '../services/firebase';
import { getDownloadURL, ref} from "firebase/storage";
import {collection, query, serverTimestamp,  deleteDoc, getDocs, doc, getDoc, setDoc} from '@firebase/firestore'

export const createDoc = async (user) => {
  const docRef = doc(db, 'users', user.uid);
  const documentSnapshot = await getDoc(docRef);

  if (documentSnapshot.exists()) {
    try {
      await setDoc(docRef, { lastLoggedOn: serverTimestamp() }, { merge: true });
      console.log('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  } else {
    try {
      await setDoc(docRef,{ uid : user.uid, name: user.displayName, phoneNumber: user.phoneNumber, createdOn: serverTimestamp(), lastLoggedOn: serverTimestamp(), email: user.email });
      console.log('Document created successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  }
}

export const  getMediaUrl = async  (path) => {
    let mediaUrl = "";
    try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        mediaUrl = url;
      } catch (error) {
        switch (error.code) {
          case "storage/object-not-found":
            console.log("File doesn't exist");
            break;
          default:
            break;
        }
      }
      return mediaUrl;
}



export const getCurrentUserSongs = async (uid, type) => {
    let songsData = [];
    try {
      const songsRef = collection(db, `users/${uid}/${type}`);
      const q = query(songsRef);
      const querySnapshot = await getDocs(q);
      songsData = await Promise.all(querySnapshot.docs.map((doc) => ({
        ...doc.data()
      })));
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
    return songsData;
  }
  
  export const fetchSongData = async (songsArray, userFavSongs = [], userCartSongs = [] ) => {
    const newDocs = await Promise.all(songsArray.map(async (item) => {
     const docRef = doc(db, 'songs', item);
     const documentSnapshot = await getDoc(docRef);
     if (documentSnapshot.exists()) {
       const data = documentSnapshot.data();
       let songUrl = await getMediaUrl(`/music/${data.day}/${documentSnapshot.id}.mp3`);
         let Fav = false;
         if(userFavSongs.length > 0){
            Fav = userFavSongs.some(obj => obj.uid === item);
         }
         let Cart = false;
         if(userCartSongs.length > 0){
            Cart = userCartSongs.some(obj => obj.uid === item);
         }
         
       return {name: data.name, singer: data.artist, url: songUrl, duration: '3:14', fav: Fav, cart: Cart, id: item};
     }
    }))
    return newDocs;
  }

  
  export const handleCurrentUserSongs = async (boolType, songId, type, uid, day, setFunc, array ) => {
    const songRef = doc(db, `users/${uid}/${type}`, songId);
      if(boolType){
        try {
          await deleteDoc(songRef);
          const filtered =  array.filter((obj) => obj.uid !== songId);
          setFunc(() => [...filtered]);
        } catch (error) {
          console.error('Error deleting song:', error);
        }
      }
      else{
        try {
          const updated = {
            uid : songId,
            addedOn : serverTimestamp(),
            day : day
          };
          setFunc((prev) => [...prev, updated])
          await setDoc(songRef, updated);
        } catch (error) {
          console.error('Error updating song:', error);
        }
      }
  }

