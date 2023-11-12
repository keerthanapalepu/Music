import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import useStyles from './dialogStyles'; 

const DialogBox = ({ open, text, title, setOpen, onConfirm, type }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} className={classes.dialog}>
      <DialogTitle className={classes.title}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.content}>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} className={classes.cancelButton}>
          {!type? "Cancel" : "OK"}
        </Button>
        {!type && <Button onClick={onConfirm} className={classes.pinkButton} autoFocus>
          Confirm
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;