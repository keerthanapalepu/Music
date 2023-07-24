import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh', 
  },
  
}));

const WhiteCircularProgress = () => {
  const classes = useStyles();

  return (
    <div className={classes.progressContainer}>
      <CircularProgress style={{color : "white"}} />
    </div>
  );
};

export default WhiteCircularProgress;
