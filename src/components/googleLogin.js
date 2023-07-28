import React from 'react';

const GoogleSignInButton = ({handleGoogleLogin}) => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <button
      style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        color: '#444',
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}
      onClick={handleGoogleLogin}
    >
      <img
        alt="Google Logo"
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        style={{
          marginRight: '10px',
          height: '20px',
          verticalAlign: 'middle',
          width: '20px',
        }}
      />
      Sign in with Google
    </button>
    </div>
  );
};

export default GoogleSignInButton;
