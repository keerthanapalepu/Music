import { makeStyles } from "@material-ui/core/styles";
import pic from '../../images/pic.jpg'
const useStyles = makeStyles((theme) => ({
    root: {
      backgroundImage: `url(${pic})`, 
      backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },
    card: {
      background: 'transparent', 
      padding: theme.spacing(2),
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      width: "500px",
      marginRight: theme.spacing(100)
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
      paddingTop: '20px'
    },
    input: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: '#f9f1f6',
      backdropFilter: 'blur(4px)',
      width: '200px',
      marginBottom: theme.spacing(2),
    },
    countryCode: {
      marginRight: theme.spacing(1),
      color: '#f50057',
    },
    dialog: {
      backgroundColor: 'beige',
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[10],
    },
  }));
  
export default useStyles;