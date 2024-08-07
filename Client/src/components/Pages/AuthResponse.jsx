import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const userExist = searchParams.get('userExist');
  const token = searchParams.get('token');

  useEffect(() => {
    const handleRouting = async () => {
      try {
        if (token) {
          localStorage.setItem('token', token);
        }

        if (userExist === '0') {
            navigate('/signin?step=3');
        } else if (userExist === '1') {
            navigate('/tasks');
        }
      } catch {
        setErrorPopup('Unable to set token');
      }
    };

    handleRouting();
  }, [userExist, token, navigate]);

  return (
    <>

        <h1>Loading....</h1>
    </>
  );
};

export default AuthResponse;
