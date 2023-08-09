import React, {useState} from 'react';
import {Grid, IconButton, Card, Button} from '@material-ui/core';
import {  ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles'
import {HiShoppingCart} from "react-icons/hi";
import {MdLogout} from "react-icons/md";
import {AiOutlineDownload, AiFillHeart} from "react-icons/ai";
import { useMediaQuery } from 'react-responsive';

import HomeScreen from './homeScreen';
import Download from '../UserSongs/downloads';
import Favourite from '../UserSongs/favourites';
import Cart from '../UserSongs/cart';
import SideBar from './sideBar';
import useStyles from './styles';
import{ auth } from "../../services/firebase";
import DialogBox from "../HelperWidget/DialogBox";


const theme = createTheme({
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        position: 'relative',
      },
    },
  },
});



function HomePage() {
  const classes = useStyles();
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton')? localStorage.getItem('activeButton')  : 'Home' );
  const [open, setOpen] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const language = localStorage.getItem('selectedLanguage');
  const handleLogoutConfirm = () => {
    auth.signOut();
    setOpen(false);
  };

  const handleConfirm = () => {
    const music = language === "telugu"? "hindi" : "telugu"
    localStorage.setItem('selectedLanguage', music);
    setOpenLanguage(false)
    window.location.reload();
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    localStorage.setItem('activeButton', buttonName);
  };
  const isMobileDevice = useMediaQuery({ maxWidth: 600 });
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container className={classes.gridContainer}>
          {!isMobileDevice  && (<Grid item xs={2} md={2} className={classes.gridItem} style={{ backgroundColor: '#0073B7' }}>
            {/* <Card className={classes.card}> */}
            <SideBar handleButtonClick={handleButtonClick} />
            {/* </Card> */}
          </Grid>)}
          <Grid item xs={isMobileDevice ? 12 : 10} md={10} className={classes.gridItem} style={{ backgroundColor: 'white' }}>
            <Card className={classes.card}>
            <div style={{ display: 'flex', maxHeight: "45px" , justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ padding : "30px", color : "black"  }}>{`${language === "telugu"? "Telugu" : "Hindi"} Sai Satcharitra`}</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  className={classes.iconButton}
                  onClick={() => setOpenLanguage(true)}
                  style={{ color: 'white', backgroundColor: '#0073B7' }}
                >
                  {language === 'telugu' ? 'हिन्दी' : 'తెలుగు'}
                </Button>
                  <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Cart"); localStorage.setItem('activeButton', "Cart");}}>
                    <HiShoppingCart />
                  </IconButton>
                  <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Downloads"); localStorage.setItem('activeButton', "Downloads");}}>
                    <AiOutlineDownload />
                  </IconButton>
                  <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Favourite"); localStorage.setItem('activeButton', "Favourite  ");}}>
                    <AiFillHeart />
                  </IconButton>
                  <IconButton className={classes.iconButton} onClick={() => setOpen(true)}>
                    <MdLogout />
                  </IconButton>
                </div>
              </div>
            {activeButton==="Home" && <HomeScreen />}
            {activeButton==="Downloads" && <Download />}
            {activeButton==="Favourite" && <Favourite />}
            {activeButton==="Cart" && <Cart setActiveButton={setActiveButton} />}
            </Card>
          </Grid>
        </Grid>
        <DialogBox open={open} setOpen={setOpen} title={"Confirm LogOut"} text={"Are you sure you want to logout?"} onConfirm={handleLogoutConfirm} />
        <DialogBox open={openLanguage} setOpen={setOpenLanguage} title={"Confirm Language"} text={`Are you sure you want to Change Language to ${language === "telugu"? "हिन्दी " : "తెలుగు "}?`} onConfirm={handleConfirm} />
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
