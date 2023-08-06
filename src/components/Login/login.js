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
import { Button, Card, Box} from '@material-ui/core';
import GoogleSignInButton from './googleLogin';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './login.css';
import OTPInput from "otp-input-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useStyles from './loginStyles';
import { db } from '../../services/firebase';
import ProfileDialog from "./dialog";
import {formatFirebaseErrorCode} from "./loginHelper";
import {createDoc} from "../helperFunctions";
import IntroSongs from './introSong';
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
          const formattedErrorCode = formatFirebaseErrorCode(error, setCountdown);
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
            const formattedErrorCode = formatFirebaseErrorCode(error, setCountdown);
            toast.error(formattedErrorCode);
          });
      }
    }
    
  };

  
  const handleVerifyCode = async () => {
    if(!localStorage.getItem('selectedLanguage')) {
      toast.error("Select your prefered language")
    }
    else{
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
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGoogleLogin = async () => {
    if(!localStorage.getItem('selectedLanguage')) {
      toast.error("Select your prefered language")
    }
    else{
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
      <h1 style={{ fontSize: "40px", marginRight: 'auto', position: "absolute", top: -15, left: 0, paddingLeft: "15px", zIndex: 1 }}>Sri Sai Satcharitra</h1>
      <Card className={`${classes.card} mobileCard`}>
        <h1 style={{ fontSize: "48px", color: "white" }}>Login</h1>
        <GoogleSignInButton handleGoogleLogin={handleGoogleLogin} />
        <div>
          <h1 style={{ color: "FFFfff" }}>Login with Phone</h1>
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
                    <Button variant="contained" onClick={handleSendCode}>
                      Send Code
                    </Button>
                  )}
                  {resendButtonVisible && (
                    <Button
                      variant="contained"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0
                        ? `Resend Code (${countdown})`
                        : "Resend Code"}
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

      {/* IntroSongs component placed on the right side */}
      <Card style={{ position: 'absolute', top: 350, right: 250 , backdropFilter: 'blur(10px)', background: 'transparent',
        padding: "5px",
      textAlign: 'center'}} className={`mobileCard`} >
      <div >
        <IntroSongs />
      </div>

      </Card>

      <ProfileDialog
        open={open}
        handleClose={handleClose}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        validateEmail={validateEmail}
      />
      <h3 style={{ marginLeft: 'auto', position: "absolute", bottom: 0, right: 0, paddingRight: "10px" }}>© By Asmani Music</h3>
    </div>
    <div id="recaptcha-container"></div>
  </>
);

  
};

export default Login;
