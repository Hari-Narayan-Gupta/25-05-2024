import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { logIn, signUp } from "../../actions/AuthAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forget } from "../../api/AuthRequest";

const Auth = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    forgetEmail: "",
    username: "",
    password: "",
    confirmpass: "",
  };
  const loading = useSelector((state) => state.authReducer.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);
  const [isVerified, setVerified] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  // Reset Form
  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
  };

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = async(e) => {
    setConfirmPass(true);
    e.preventDefault();
    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data, navigate), setVerified(true))
        : setConfirmPass(false);
    }
    else if (isForgetPassword) {
      try {
        const response = await forget({ email: data.forgetEmail });
        setData({ ...data, forgetEmail: "" });
        console.log('Forget Password API Response:', response);
      } catch (error) {
        console.error('Forget Password API Error:', error);
      }
    }  else {
      dispatch(logIn(data, navigate), setVerified(true));
    }
  };

  // Function to handle forget password click
  const handleForgetPasswordClick = () => {
    setIsForgetPassword(true);
  };

  return (
    <div className="Auth">
      {/* left side */}
      <div className="a-left">
        <img src={Logo} alt="" />
        <div className="Webname">
          <h1>Acculizein Tech Pvt. Ltd.</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>

      {/* right form side */}
      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3>{isForgetPassword ? "Forget Password?" : ""}</h3>
          {isForgetPassword ? (
            <>
              <div>
                {/* <h3>Forget Password?</h3> */}
                <input
                  required
                  type="email"
                  placeholder="Enter Your Registered Email"
                  className="infoInput"
                  name="forgetEmail"
                  value={data.forgetEmail}
                  onChange={handleChange}
                />
              </div>
              <button
                className="button infoButton forgetButton"
                type="submit"
              >
                Submit
              </button>
              <span
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setIsForgetPassword(false)}
              >
                Back to Login
              </span>
            </>
          ) : (
            <>
              <h3>{isSignUp ? "Register" : "Login"}</h3>
              {isSignUp && (
                <>
                  <div>
                    <input
                      required
                      type="text"
                      placeholder="First Name"
                      className="infoInput"
                      name="firstname"
                      value={data.firstname}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      required
                      type="text"
                      placeholder="Last Name"
                      className="infoInput"
                      name="lastname"
                      value={data.lastname}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {isSignUp && (
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="infoInput"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <input
                  required
                  type="text"
                  placeholder="Username"
                  className="infoInput"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  required
                  type="password"
                  className="infoInput"
                  placeholder="Password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                />
                {isSignUp && (
                  <>
                    <input
                      required
                      type="password"
                      className="infoInput"
                      name="confirmpass"
                      placeholder="Confirm Password"
                      onChange={handleChange}
                    />
                  </>
                )}
              </div>

              <span
                style={{
                  color: "red",
                  fontSize: "12px",
                  alignSelf: "flex-end",
                  marginRight: "5px",
                  display: confirmPass ? "none" : "block",
                }}
              >
                *Confirm password is not same
              </span>
              <div className="submit">
                <span
                  style={{
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    resetForm();
                    setIsSignUp((prev) => !prev);
                  }}
                >
                  {isSignUp
                    ? "Already have an account Login"
                    : "Don't have an account Sign up"}
                </span>

                {!isSignUp && (
                  <span
                    style={{
                      fontSize: "12px",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={handleForgetPasswordClick}
                  >
                    Forget Password?
                  </span>
                )}
                <button
                  className="button infoButton"
                  type="Submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : isSignUp ? "SignUp" : "Login"}
                </button>
              </div>



              {isVerified && (
                <p className="verfication-msg">
                  Verification email has been sent to your registered email
                  address kindly Verify..
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;