import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../../services/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { makeStyles, TextField, Button, Card, Box, Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core';
import pic from '../../images/pic.jpg'
import GoogleSignInButton from './googleLogin';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './login.css';
import OTPInput from "otp-input-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, query, where, getDocs, setDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '../../services/firebase';
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
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const recaptchaVerifierRef = useRef(null);
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
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
    if(formattedErrorCode === "Invalid Phone Number"){
      setCountdown(0)
    }
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

  const createDoc = async (user) => {
    const docRef = doc(db, 'users', user.uid);
    const documentSnapshot = await getDoc(docRef);
  
    if (documentSnapshot.exists()) {
      try {
        await setDoc(docRef, { lastLoggedOn: serverTimestamp() }, { merge: true });
        console.log('Document updated successfully!');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      try {
        await setDoc(docRef,{ uid : user.uid, name: user.displayName, phoneNumber: user.phoneNumber, createdOn: serverTimestamp(), lastLoggedOn: serverTimestamp(), email: user.email });
        console.log('Document created successfully!');
      } catch (error) {
        console.error('Error creating document:', error);
      }
    }
  }
  const handleVerifyCode = async () => {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

    signInWithCredential(auth, credential)
      .then(async (result) => {
        console.log('Phone authentication successful:', result.user);
        toast.success('Login Successful!');
        await createDoc(result.user);
        
        const docRef = doc(db, 'users', result.user.uid);
        const documentSnapshot = await getDoc(docRef);
        console.log(documentSnapshot.data())
        if(!documentSnapshot.data().name  || !documentSnapshot.data().email ){
          setName(documentSnapshot.data()? documentSnapshot.data().name : "");
          setEmail(documentSnapshot.data()? documentSnapshot.data().email : "");
          setOpen(true);
        }
        else{
          navigate(location.state?.from || '/');
        }
      })
      .catch((error) => {
        console.error('Error verifying verification code:', error);
        toast.error("Invalid OTP")
      });
      
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          toast.success('Login Successful!');
          console.log(user.uid)
          createDoc(user)
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

  const handleSubmit = async () => {
    if(name && validateEmail(email)){
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        name: name,
        email: email
      });
      navigate(location.state?.from || '/');
    }
  }
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
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.dialog }}>
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
          helperText={!validateEmail(email) ? 'Please enter a valid email' : ''}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  </div>
  <div id="recaptcha-container"></div>
  </>
  );
};

export default Login;
