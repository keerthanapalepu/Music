import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        marginLeft: theme.spacing(1),
        color: '#0C364F',
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
      divroot: {
        marginTop: '50px',
        margin: 'auto',
        width: 'calc(100% - 20px)',
        maxWidth: 360,
        backgroundColor: 'transparent',
      },
      listItem: {
        backgroundColor: '#0C364F',
        marginBottom: '10px',
        borderRadius: '5px',
        color: '#A7A7A7',
        '&:hover': {
          backgroundColor: '#082534',
          color: '#333333',
        },
      },
      listItemIcon: {
        color: '#A7A7A7',
        fontSize: '30px'
      },
      listItemText: {
        color: '#A7A7A7',
        fontFamily: 'play-fair',
        fontWeight: 'bolder'
      },
  }));

export default useStyles;
