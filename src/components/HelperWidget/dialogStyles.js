import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: '500px',
      minHeight: '200px',
      backgroundColor: '#fff',
    },
  },
  title: {
    backgroundColor: "#A7A7A7",
    color: '#fff',
  },
  content: {
    fontSize: '16px',
    marginBottom: '16px',
  },
  pinkButton: {
    color: '#F63737',
    '&:hover': {
      backgroundColor: '#F63737',
      color: '#fff',
    },
  },
  cancelButton: {
    color: "#0C364F",
    '&:hover': {
      backgroundColor: "#0C364F",
      color: '#fff',
    },
  },
}));

export default useStyles;
