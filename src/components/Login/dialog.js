import React from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const ProfileDialog = ({ open, handleClose, name, setName, email, setEmail, handleSubmit, validateEmail }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter Name and Email</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!validateEmail(email)}
          helperText={!validateEmail(email) ? "Please enter a valid email" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
