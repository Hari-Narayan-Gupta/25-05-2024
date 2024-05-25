import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import { useSelector } from "react-redux";
import Chat from "./pages/Chat/Chat";
import EmailVerification from './pages/EmailVerification/EmailVerification';
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Activity from "./pages/Activity/Activity";

function App() {
  const user = useSelector((state) => state.authReducer.authData);
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  return (
    <div
    className="App"
    style={{
      height: isChatPage ? "calc(100vh - 2rem)" : "auto",
    }}
    >
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth" />}
        />
        <Route
          path="/verify"
          element={<EmailVerification />}
        />
        <Route
          path="/activity"
          element={<Activity/>}
        />
        <Route
          path="/forget-password"
          element={<ForgetPassword/>}
        />
        <Route
          path="/auth"
          element={<Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="../auth" />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />

        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="../auth" />}
        />
      </Routes>
    </div>
  );
}

export default App;