import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const PrivateRoute = ({ component}) => {
    const { currentUser } = useAuth();
    console.log(currentUser);
    const location = useLocation();
  return (
    <>
    {
        currentUser ? <>{component}</> : <Navigate to="/login" replace state={{ from: location }} />
    }
    </>
);
};

export default PrivateRoute;