import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import { getMediaUrl } from '../helperFunctions';

import CircularProgress from '@mui/material/CircularProgress';

const IntroSongs = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songLanguage, setSongLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const [teluguUrl, setTeluguUrl] = useState(null);
  const [hindiUrl, setHindiUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  useEffect(() => {
    const getSongUrl = async () => {
      const teluguMediaUrl = await getMediaUrl('languages/telugu.mp3');
      const hindiMediaUrl = await getMediaUrl('languages/hindi.mp3');
      setTeluguUrl(teluguMediaUrl);
      setHindiUrl(hindiMediaUrl);
      setLoading(false);
      
    };
    getSongUrl();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
      }
    };
  }, []);

  
  

  const handlePlay = (song, language) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const newAudio = new Audio(song);
    newAudio.play();
    audioRef.current = newAudio; 
    setCurrentSong(language);
  };


  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentSong(null);
    }
  };

  const Languages = ['telugu', 'hindi'];

  return (
    <div style={{padding: "20px" }}>
    <h3 style={{  color: "white" ,paddingBotton : "0px", fontWeight: "bolder" }}>{"Select Language"}</h3> 
      {loading ? (
        <CircularProgress style={{ color: 'white' }} />
      ) : (
        Languages.map((language, index) => (
          <div key={index} style={{ display: 'inline', paddingLeft: '30px' }}>
          <h3 style={{  color: "white", fontWeight: "bolder" }}>{language === 'telugu' ? "శ్రీ సాయి సచ్చరిత్ర పాట రూపం లో" : "श्री साई सत्चरित्र,गीत रूप में"}</h3> 
            {/* <div style={{  display : "flex" }}> */}
            
            <Button
              variant="contained"
              onClick={() => {localStorage.setItem('selectedLanguage', language); setSongLanguage(language) }}
              style={{ backgroundColor: songLanguage === language ? 'white' : 'grey' }}
            >
              {language}
            </Button>
            {currentSong === language ? (
              <IconButton onClick={handlePause}>
                <BsPauseCircleFill style={{ color: 'white' }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => handlePlay(language === 'telugu' ? teluguUrl : hindiUrl, language)}>
                <BsPlayCircleFill style={{ color: 'white' }} />
              </IconButton>
            )}&nbsp;&nbsp;
            <h4 style={{  color: "white", display : "inline" }}>{language === 'telugu' ? "మహాకావ్యం పరిచయం" : "महा काव्य परिचय"}</h4>
            {/* </div> */}
            <br />
          </div>
        ))
      )}
    </div>
  );
};

export default IntroSongs;
