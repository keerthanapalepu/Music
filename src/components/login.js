import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../services/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { makeStyles, TextField, Button, Card, Box} from '@material-ui/core';
import pic from '../images/pic.jpg'
import GoogleSignInButton from './googleLogin';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './login.css';
import OTPInput from "otp-input-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${pic})`, // Replace with the actual path to the background image
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
    background: 'transparent', // Transparent background with 50% opacity
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
  
}));
const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [sendButtonVisible, setSendButtonVisible] = useState(true);
  const [resendButtonVisible, setResendButtonVisible] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const recaptchaVerifierRef = useRef(null);
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, []);
  useEffect(() => {
    let timer;
    if (resendButtonVisible && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendButtonVisible, countdown]);


  function formatFirebaseErrorCode(errorMessage) {
    if(errorMessage){
      console.log(JSON.parse(JSON.stringify(errorMessage)))
    const FirebaseError = JSON.parse(JSON.stringify(errorMessage))
    if(FirebaseError.code){
      const errorCode = FirebaseError.code.split('/')[1]; // Extracting the text inside the brackets
  
      const formattedErrorCode = errorCode
        .replace(/-/g, ' ') // Replacing hyphens with spaces
        .replace(/(^|\s)\S/g, (match) => match.toUpperCase()); // Capitalizing the first letter
    
      return formattedErrorCode;
    }
    else{
      return "Error sending OTP"
    }
    }
    else{
      return "Error sending OTP"
    }
  }

  const handleSendCode = () => {
    if(!phoneNumber || phoneNumber === ""){
      console.log("empty")
      toast.error("Invalid Phone Number")
    }
    else{
      setSendButtonVisible(false);
      setResendButtonVisible(true);
      setCountdown(30);
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      }, auth);
      recaptchaVerifierRef.current = recaptchaVerifier;
  
      signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          setVerificationId(confirmationResult.verificationId);
          console.log('OTP sent');
          toast.success('OTP sent');
        })
        .catch((error) => {
          console.error('Error sending verification code:', error);
          const formattedErrorCode = formatFirebaseErrorCode(error);
          toast.error(formattedErrorCode);
        });
    }
    
  };

  

  const handleResendCode = () => {
    if(!phoneNumber || phoneNumber === ""){
      console.log("empty")
      toast.error("Invalid Phone Number")
    }else{
      setVerificationCode('')
      setCountdown(30)
      if (recaptchaVerifierRef.current) {
        const recaptchaVerifier = recaptchaVerifierRef.current;
        signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
          .then((confirmationResult) => {
            setVerificationId(confirmationResult.verificationId);
            console.log('OTP resent');
            toast.success('OTP resent');
          })
          .catch((error) => {
            console.error('Error resending verification code:', error);
            const formattedErrorCode = formatFirebaseErrorCode(error);
            toast.error(formattedErrorCode);
          });
      }
    }
    
  };

  const handleVerifyCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

    signInWithCredential(auth, credential)
      .then((result) => {
        // User successfully authenticated with their phone number
        console.log('Phone authentication successful:', result.user);
        toast.success('Login Successful!');
        navigate(location.state?.from || '/');
      })
      .catch((error) => {
        console.error('Error verifying verification code:', error);
        toast.error("Invalid OTP")
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user.auth;
          toast.success('Login Successful!');
          navigate(location.state?.from || '/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          console.log(errorCode, errorMessage, email);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className={classes.root}>
    <Card className={classes.card}>
      <h1 style={{fontSize: "48px", color: "#222624"}}>Login</h1>
      <GoogleSignInButton handleGoogleLogin={handleGoogleLogin}/>
      <div>
        <h1>Phone Authentication</h1>
        <div>
      <Box className={classes.container}>
       
      
<div className="container">
  <div className="phone-input-container">
    <PhoneInput
      placeholder="Phone number"
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
      defaultCountry="IN"
      className="custom-phone-input"
    />
  </div>
  <div className="button-container">
    {sendButtonVisible && (
      <Button variant="contained" onClick={handleSendCode} >
        Send Code
      </Button>
    )}
    {resendButtonVisible && (
      <Button
        variant="contained"
        onClick={handleResendCode}
        disabled={countdown > 0}
        
      >
        {countdown > 0 ? `Resend Code (${countdown})` : 'Resend Code'}
      </Button>
    )}
  </div>
</div>

      </Box>
      <Box className={`${classes.container} custom-container`}>
  <OTPInput
    value={verificationCode}
    onChange={setVerificationCode}
    autoFocus
    OTPLength={6}
    otpType="number"
    disabled={false}
  />
  <Button variant="contained" onClick={handleVerifyCode}>
    Verify Code
  </Button>

</Box>

    </div>
        
      </div>
    </Card>
  </div>
  <div id="recaptcha-container"></div>
  </>
  );
};

export default Login;
