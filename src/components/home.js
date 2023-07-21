import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, IconButton, Card} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {  ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles'
import SideBar from './sideBar';
import {HiShoppingCart} from "react-icons/hi";
import {RiAccountCircleFill} from "react-icons/ri";
import {AiOutlineDownload} from "react-icons/ai"
import HomeScreen from './Home/homeScreen';
import Download from './downloads';
import Favourite from './favourites';
import Cart from './cart';
import Profile from './profile';
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
    height: 'calc(100% - 20px)',
    width: 'calc(100% - 20px)',
  },
}));

function HomePage() {
  const classes = useStyles();
  const [activeButton, setActiveButton] = useState('Home');

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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Cart")}}>
                <HiShoppingCart />
              </IconButton>
              <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Profile")}}>
                <RiAccountCircleFill />
              </IconButton>
              <IconButton className={classes.iconButton} onClick={() => {setActiveButton("Downloads")}}>
                <AiOutlineDownload />
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
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
