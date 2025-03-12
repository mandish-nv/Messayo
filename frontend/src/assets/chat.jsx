import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PiMessengerLogo } from "react-icons/pi";
import reactLogo from "./logo.jpeg";
import { IoCloseSharp } from "react-icons/io5";

export default function Chat({ user, msg, setMsg, userData }) {
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [fileName, setFileName] = useState("");
  const [photoMsg, setPhotoMsg] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  let filterMsg = [];
  if (user) {
    filterMsg = msg.filter(
      (val) =>
        (val.senderId == userData._id && val.receiverId == user._id) ||
        (val.receiverId == userData._id && val.senderId == user._id)
    );
    filterMsg.reverse();
  }
  const [newMsg, setNewMsg] = useState({
    senderId: "",
    receiverId: "",
    status: "sent",
    msgType: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
        const newSocket = new WebSocket("ws://localhost:5000");

        newSocket.onopen = () => {
            console.log("Connected to WebSocket");
            setSocket(newSocket);
        };

        newSocket.onmessage = async (event) => {
          try {
            let messageData = event.data;
        
            if (event.data instanceof Blob) {
              messageData = await event.data.text(); // Convert Blob to string
            } else if (event.data instanceof ArrayBuffer) {
              messageData = new TextDecoder().decode(event.data); // Handle binary data
            } else {
              messageData = event.data.toString(); // Ensure it's a string
            }
        
            const parsedMessage = JSON.parse(messageData); // Parse JSON string
            console.log("Received message:", parsedMessage);
            const updatedMsg = {
              ...newMsg,
              message: parsedMessage,
              senderId: userData._id,
              receiverId: user._id,
              msgType: "text",
            };
            
            setMsg((prevMsg) => [...prevMsg, updatedMsg]);
            console.log(msg)
        
          } catch (error) {
            console.error("Error parsing WebSocket message. Received data:", event.data);
          }
        };        

        newSocket.onclose = () => {
            console.warn("WebSocket closed, attempting to reconnect...");
            setTimeout(connectWebSocket, 3000);
        };

        newSocket.onerror = (error) => console.error("WebSocket error:", error);
    };

    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(); // Cleanup
      }
    };
  }, [setMsg]);

  const sendMsg = async () => {
    if (text.trim() !== "") {
      const updatedMsg = {
        ...newMsg,
        message: text,
        senderId: userData._id,
        receiverId: user._id,
        msgType: "text",
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/message",
          updatedMsg
        );
        setMsg((prevMsg) => [...prevMsg, response.data]);

        if (socket && socket.readyState === WebSocket.OPEN) {
          // Check if socket is open
          socket.send(text);
          setText("");
        }

        setText("");
        setNewMsg({
          senderId: "",
          receiverId: "",
          status: "sent",
          msgType: "",
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else if (photoMsg !== null) {
      const updatedMsg = {
        ...newMsg,
        message: photoMsg,
        senderId: userData._id,
        receiverId: user._id,
        msgType: "photo",
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/message",
          updatedMsg
        );
        setMsg((prevMsg) => [...prevMsg, response.data]);

        setPhotoMsg(null);
        setFileName("");
        setNewMsg({
          senderId: "",
          receiverId: "",
          status: "sent",
          msgType: "",
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp); // Parse the timestamp
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format; change to `true` for 12-hour format
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMsg();
    }
  };

  const updateText = (event) => {
    setText(event.target.value);
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileName = (event) => {
    const file = event.target.files[0];
    //     if (files.length > 0) {
    //     setFileName(files[0].name);
    //     setPhotoMsg(files)
    // }
    if (file) {
      setFileName(file.name);
      console.log("Selected file:", file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          console.log("Base64 string:", reader.result); // Debugging
          setPhotoMsg(reader.result);
        } else {
          console.error("FileReader result is empty");
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  };

  const removePhoto = () => {
    setFileName("");
    setPhotoMsg(null);
  };

  const displayPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const [scale, setScale] = useState(1); // Zoom level
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1; // Zoom in or out
    setScale((prev) => Math.max(1, prev + delta)); // Ensure scale doesn't go below 1
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    // setPosition({ x: 0, y: 0 });
  };
  return (
    <>
      <div className="chat-box" style={{ display: user ? "" : "none" }}>
        <div
          className="photo-display"
          style={{ display: selectedPhoto ? "" : "none" }}
        >
          <div className="blur-bg"></div>
          <button className="cross" onClick={() => closePhoto()}>
            <IoCloseSharp />
          </button>
          <img
            src={selectedPhoto}
            className="image-max"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          ></img>
        </div>
        <div className="chat-head">
          <div className="person">
            <div className="circle">
              <img
                src={user.profilePicture}
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
              />
            </div>
            <div>
              <div>{user.fullName}</div>
              <div className="username">@{user.userName}</div>
              <div style={{ color: "darkgreen", fontSize: "0.8rem" }}>
                Online
              </div>
            </div>
          </div>
          <div className="info">
            <CiCircleInfo />
          </div>
        </div>

        <div
          className="msg-display"
          style={{ paddingBottom: fileName ? "20px" : "" }}
        >
          {filterMsg.map((val, index) => {
            if (true) {
              return (
                <div
                  key={index}
                  className="msg-bar"
                  style={{
                    justifyContent:
                      val.senderId == userData._id ? "right" : "left",
                  }}
                >
                  <div
                    className="circle2"
                    style={{
                      display: val.senderId != userData._id ? "" : "none",
                    }}
                  >
                    <img
                      src={user.profilePicture}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div
                    className="text"
                    style={{
                      backgroundColor:
                        val.senderId == userData._id ? "#FCBB15" : "",
                      display: val.msgType === "text" ? "" : "none",
                    }}
                  >
                    {val.message}
                    {messages}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div style={{ fontSize: "0.8rem", color: "grey" }}>
                        {formatTime(val.createdAt)}
                      </div>
                      <RiCheckDoubleLine
                        style={{
                          display:
                            val.senderId === userData._id ? "flex" : "none",
                          color: "green",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="photo-msg"
                    style={{ display: val.msgType === "photo" ? "" : "none" }}
                    onClick={() => displayPhoto(val.message)}
                  >
                    <img
                      src={val.message}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        position: "absolute",
                        right: "10px",
                        bottom: "5px",
                      }}
                    >
                      <div style={{ fontSize: "0.8rem", color: "grey" }}>
                        {formatTime(val.createdAt)}
                      </div>
                      <RiCheckDoubleLine
                        style={{
                          display:
                            val.senderId === userData._id ? "flex" : "none",
                          color: "green",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        <div className="message">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => getFileName(event)}
          />
          <div
            className="photo-send"
            style={{ display: fileName ? "flex" : "none" }}
          >
            {fileName}
            <div className="remove-photo" onClick={() => removePhoto()}>
              x
            </div>
          </div>
          <GoPaperclip
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => handleIconClick()}
          />
          <div className="msg-box">
            <input
              type="text"
              placeholder="Enter Message"
              className="msg-text"
              value={text}
              onKeyDown={(event) => handleKeyPress(event)}
              onChange={(event) => updateText(event)}
            />
            <button
              style={{ color: "green" }}
              onClick={() => {
                sendMsg();
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="default-chat" style={{ display: user ? "none" : "" }}>
        <div>
          <PiMessengerLogo
            style={{ marginLeft: "50px", fontSize: "5rem", color: "grey" }}
          />
          <div style={{ fontSize: "1.5rem", color: "grey" }}>
            Start Messaging
          </div>
        </div>
      </div>
    </>
  );
}
