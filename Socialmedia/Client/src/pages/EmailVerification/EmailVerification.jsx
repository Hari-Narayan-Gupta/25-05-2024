import React, { useState } from 'react';
import './EmailVerification.css';
import { verify } from '../../api/AuthRequest';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";



function EmailVerification() {
  const [verified, setVerified] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const handleVerification = async () => {
    // console.log(id);
    try {
      await verify({ id });
      setVerified(true);
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };


  return (     
    <div className="container">
      {verified ? ( 
        <div className="thank-you">
          <h1>Thank You!</h1>
          <p>Your email address has been successfully verified.</p>
          <Link to="../home">
             back to login
          </Link>
        </div>
      ) : (
        <div>
          <h1>Email Verification</h1>
          <p>To proceed, please verify your email address...</p>
          <div className="button-container">
            <button onClick={handleVerification}>Verify Email</button>
          </div>
        </div>
      )}  
    </div>
  );
}

export default EmailVerification;
