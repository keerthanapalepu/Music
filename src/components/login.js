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

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [resendButtonDisabled, setResendButtonDisabled] = useState(true);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, []);

  const handleSendCode = () => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    }, auth);
    recaptchaVerifierRef.current = recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        console.log('OTP sent');
        setResendButtonDisabled(true);
        setTimeout(() => setResendButtonDisabled(false), 20000);
      })
      .catch((error) => {
        console.error('Error sending verification code:', error);
      });
  };

  const handleResendCode = () => {
    if (recaptchaVerifierRef.current) {
      const recaptchaVerifier = recaptchaVerifierRef.current;
      signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          setVerificationId(confirmationResult.verificationId);
          console.log('OTP resent');
          setResendButtonDisabled(true);
          setTimeout(() => setResendButtonDisabled(false), 20000);
        })
        .catch((error) => {
          console.error('Error resending verification code:', error);
        });
    }
  };

  const handleVerifyCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

    signInWithCredential(auth, credential)
      .then((result) => {
        // User successfully authenticated with their phone number
        console.log('Phone authentication successful:', result.user);
        navigate(location.state?.from || '/');
      })
      .catch((error) => {
        console.error('Error verifying verification code:', error);
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user.auth;
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
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <div>
        <h2>Phone Authentication</h2>
        <div>
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <button onClick={handleSendCode}>Send Code</button>
          <button onClick={handleResendCode} disabled={resendButtonDisabled}>Resend Code</button>
        </div>
        <div>
          <label>Verification Code:</label>
          <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
