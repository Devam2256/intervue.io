import React, { useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  
  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString().substring(-4);
    setRoomId(randomId + timestamp);
  };

  const handleOneAndOneCall = () => {
    if (!roomId) {
      alert("Please Generate Room Id First");
      return;
    }
    console.log(`http://localhost:5173/room/${roomId}?type=one-on-one`);
    navigate(`room/${roomId}?type=one-on-one`);
  };
  
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome to Video Calling App</h1>
        <p className="homepage-subtitle">
          Start a video call with a randomly generated Room ID
        </p>
        <div className="room-id-container">
          <button className="generate-button" onClick={handleRoomIdGenerate}>
            Generate
          </button><br/>
          <b className="room-id">Room Id : {roomId}</b>
        </div>
        <div className="call-buttons">
          <button
            className="call-button"
            onClick={handleOneAndOneCall}
            disabled={!roomId}
          >
            One-on-One Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 