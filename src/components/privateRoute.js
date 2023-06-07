import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ component}) => {
    const { currentUser } = useAuth();
    console.log(currentUser);
  return (
    <>
    {
        currentUser ? <>{component}</> : <Navigate to="/login" />
    }
    </>
);
};

export default PrivateRoute;