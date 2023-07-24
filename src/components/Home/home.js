import React, {useState} from 'react';
import {Grid, IconButton, Card} from '@material-ui/core';
import {  ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles'
import {HiShoppingCart} from "react-icons/hi";
import {MdLogout} from "react-icons/md";
import {AiOutlineDownload} from "react-icons/ai";

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
  const [activeButton, setActiveButton] = useState('Home');
  const [open, setOpen] = useState(false);
  const handleLogoutConfirm = () => {
    auth.signOut();
    setOpen(false);
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={2} md={2} className={classes.gridItem} style={{ backgroundColor: '#42779A' }}>
            <Card className={classes.card}>
            <SideBar handleButtonClick={handleButtonClick} />
            </Card>
          </Grid>
          <Grid item xs={10} md={10} className={classes.gridItem} style={{ backgroundColor: '#a5a492' }}>
            <Card className={classes.card}>
            <div style={{ display: 'flex', maxHeight: "45px" , justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ padding : "30px" }}>{activeButton}</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Cart")}}>
                    <HiShoppingCart />
                  </IconButton>
                  <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Downloads")}}>
                    <AiOutlineDownload />
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
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
