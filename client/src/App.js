import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

let socket;
const CONNECTION_PORT = "http://localhost:5000";

function App() {
  //before login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");

  //after login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT, {
      transport: ["websocket", "polling", "flashsocket"],
    });
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = (e) => {
    setLoggedIn(true);
    e.preventDefault();
    socket.emit("join_room", room);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const msgContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    };
    await socket.emit("send_message", msgContent);
    setMessageList([...messageList, msgContent.content]);
    setMessage("");
  };

  return (
    <div className="container mt-5">
      {!loggedIn ? (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={connectToRoom}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Name..."
                      type="text"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Room..."
                      type="text"
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </div>
                  <button type="submit">Join Chat</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                {messageList.map((val, idx) => {
                  return (
                    <div id={val.author === userName ? "you" : "other"}>
                      <h6 key={idx}>
                        {val.author} : {val.message}
                      </h6>
                    </div>
                  );
                })}
              </div>
              <div className="card-footer">
                <form onSubmit={sendMessage}>
                  <input
                    type="text"
                    placeholder="Message..."
                    size="40"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit">send</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
