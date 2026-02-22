import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../src/api";
import LiquidEther from './effects/LiquidEther';
import loadingGif from "../src/assets/loading1.gif";

// const SERVER = "http://192.168.127.4:8000";

function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [serverIP, setServerIP] = useState("");

  console.log("(example: 192.168.127.4)\nThis is running in port 8000");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);

    if (!username || !password) {
      setError("Fill all fields");
      setLoading(false);
      return;
    }

    // if (!serverIP) {
    //   setError("Server IP not found");
    //   setLoading(false);
    //   return;
    // }

    try {
      const res = await API.get("/users");
      const users = res.data;

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        setError("");
        onLoginSuccess({
          username: username,
          serverApi: `http://${serverIP}:8000`
        }
        );
        navigate("/");
        console.log("login");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("Server not connected");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // axios.get(`http://localhost:8000/serverip`)
    //   .then((response) => {
    //     setServerIP(response.data.server);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching server IP:", error);
    //   });
    const SERVER = window.location.hostname;
    setServerIP(SERVER);
  }, []);


  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Background Effect */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0
      }}>
        <LiquidEther
          // colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          colors={['#2788ff', '#9fccff', '#9ec6ef']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          color0="#5227FF"
          color1="#FF9FFC"
          color2="#B19EEF"
        />
      </div>

      {/* Server IP Address */}
      <div className="server-inline">
        <div className="server-row">
          <span>Host name:</span>
          <span className="server-value">Siddartha Rao</span>
        </div>

        <div className="server-row">
          <span>Version:</span>
          <span className="server-value">
            0.2.7.SR
          </span>
        </div>
      </div>


      {/* Login Content */}
      <div className="loginPage">
        <div className="loginCard">

          {loading && (
            <div className="loadingIcon">
              <img src={loadingGif} alt="Loading..." className="loadingIcon" />
            </div>
          )}


          <h2>CodeHub Login</h2>

          {error && <p className="errorMsg">{error}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>

        </div>
      </div>

    </div>
  );


}

export default LoginPage;