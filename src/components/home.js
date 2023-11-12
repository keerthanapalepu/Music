import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, IconButton, Card} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SideBar from './sideBar';
import {HiShoppingCart} from "react-icons/hi";
import {MdLogout} from "react-icons/md";
import {AiOutlineDownload, AiFillHeart} from "react-icons/ai";
import HomeScreen from './homeScreen';
import Download from './downloads';
import Favourite from './favourites';
import Cart from './cart';
import Profile from './profile';
import DialogBox from "../HelperWidget/DialogBox";
import{ auth } from "../services/firebase";
const theme = createMuiTheme({
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

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginLeft: theme.spacing(1),
    color: "#0C364F"
  },
  root: {
    flexGrow: 1,
    height: '100vh',
  },
  gridContainer: {
    height: '100%',
  },
  gridItem: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: -1,
      backdropFilter: 'blur',
    },
  },
  card: {
    height: 'calc(100%)',
    width: 'calc(100%)',
  },
}));

function HomePage() {
  const classes = useStyles();
  const [activeButton, setActiveButton] = useState('Home');
  const [open, setOpen] = useState(false);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleLogoutConfirm = () => {
    auth.signOut();
    setOpen(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={2} md={2} className={classes.gridItem} style={{ backgroundColor: '#0073B7' }}>
            {/* <Card className={classes.card}> */}
            <SideBar handleButtonClick={handleButtonClick} />
            {/* </Card> */}
          </Grid>
          <Grid item xs={10} md={10} className={classes.gridItem} style={{ backgroundColor: 'white' }}>
            <Card className={classes.card}  style={{ backgroundColor: 'white', border: "2px" }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            {activeButton==="Home" && <HomeScreen />}
            {activeButton==="Downloads" && <Download />}
            {activeButton==="Favourite" && <Favourite />}
            {activeButton==="Cart" && <Cart />}
            {activeButton==="Profile" && <Profile />}
            </Card>
          </Grid>
        </Grid>
        <DialogBox open={open} setOpen={setOpen} title={"Confirm LogOut"} text={"Are you sure you want to logout?"} onConfirm={handleLogoutConfirm} />
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
