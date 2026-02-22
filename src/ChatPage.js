import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./index.css";
import API, { BASE_URL } from "../src/api";

function ChatPage({ username, onLogout, api }) {
  const SERVER = api;
  //const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  //setUsername(username);
  const len = messages.length;
  useEffect(() => {
    scroll();
  }, [len]);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);


  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  

  const scroll = async () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  
  const fetchMessages = async () => {
    const res = await API.get(`/chat`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!username || !text) return alert("Enter username & message");

    await API.post(`/chat`, {
      user: username,
      text
    });

    setText("");
    fetchMessages();
    inputRef.current?.focus();
  };

  return (
    <div className="chatPage">

      {/* Messages */}
      <div className="chatBox">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.user === username ? "me" : "other"
              }`}
          >
            <small className={`username ${msg.user === username ? "me" : "other"
              }`}>{msg.user}</small>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>


      {/* Username */}
      <div className="scroll">
        <label className="uploadBtn">
          <img src="scroll.png" alt="scroll" className="btnIcon" />
          <button onClick={scroll} hidden></button>
        </label>
      </div>

      {/* Send Box */}
      <div className="sendBox">
        <input
          ref={inputRef}
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;
