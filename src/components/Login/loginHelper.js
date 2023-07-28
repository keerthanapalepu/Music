
export function formatFirebaseErrorCode(errorMessage, setCountdown) {
    if(errorMessage){
      console.log(JSON.parse(JSON.stringify(errorMessage)))
    const FirebaseError = JSON.parse(JSON.stringify(errorMessage))
    if(FirebaseError.code){
      const errorCode = FirebaseError.code.split('/')[1]; 
  
      const formattedErrorCode = errorCode
        .replace(/-/g, ' ') 
        .replace(/(^|\s)\S/g, (match) => match.toUpperCase()); 
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