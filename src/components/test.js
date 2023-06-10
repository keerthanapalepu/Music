import React from "react";
import { useAuth } from "../context/authContext";
import{auth} from "../services/firebase"

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h2>Welcsfsdome, {currentUser.displayName}!</h2>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default HomePage;
