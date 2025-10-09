import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PiMessengerLogo } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import { io } from "socket.io-client";


export default function Chat({ user, userData }) {
  const [msg, setMsg] = useState([])
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [fileName, setFileName] = useState("");
  const [photoMsg, setPhotoMsg] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null)


  useEffect(() => {
    const fetchMsg = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/findMessage",
          userData
        );
        setMsg(response.data);

      } catch (error) {
        console.log("Error");
      }
    };
    if (userData) {
      fetchMsg();
    }
  }, []);

  // useEffect(() => {
  //   const connectWebSocket = () => {
  //     const newSocket = new WebSocket("ws://localhost:5000");

  //     newSocket.onopen = () => {
  //       console.log("Connected to WebSocket");
  //       setSocket(newSocket);
  //     };

  //     newSocket.onmessage = async (event) => {
  //       try {
  //         let messageData = event.data;
  //         if (event.data instanceof Blob) {
  //           messageData = await event.data.text(); // Convert Blob to text
  //         } else if (event.data instanceof ArrayBuffer) {
  //           messageData = new TextDecoder().decode(event.data);
  //         }

  //         const parsedMessage = JSON.parse(messageData);
  //         console.log("Received message:", parsedMessage);

  //         location.reload()

  //       } catch (error) {
  //         console.error("Error parsing WebSocket message:", error);
  //       }
  //     };

  //     newSocket.onclose = () => {
  //       console.warn("WebSocket closed, attempting to reconnect...");
  //       setTimeout(connectWebSocket, 3000);
  //     };

  //     newSocket.onerror = (error) => console.error("WebSocket error:", error);
  //   };

  //   connectWebSocket();

  //   return () => {
  //     if (socket && socket.readyState === WebSocket.OPEN) {
  //       socket.close();
  //     }
  //   };
  // }, [setMsg]);
  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("message", (data) => {
      // console.log("New message received:", data);
      setMsg((prev) => [...prev, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMsg = async () => {
    if (text.trim() !== "") {
      const updatedMsg = {
        senderId: userData._id,
        receiverId: user._id,
        message: text,
        msgType: "text",
        status: "sent",
      };

      try {
        const response = await axios.post("http://localhost:5000/message", updatedMsg);
        // setMsg((prevMsg) => [...prevMsg, response.data]);
        socket.emit('message', response.data)

        // if (socket && socket.readyState === WebSocket.OPEN) {
        //   socket.send(JSON.stringify(updatedMsg)); // Send as JSON
        // }

        setText(""); // Clear input
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    else if (fileName) {
      const updatedMsg = {
        senderId: userData._id,
        receiverId: user._id,
        message: photoMsg,
        msgType: "photo",
        status: "sent",
      };
      try {
        const response = await axios.post("http://localhost:5000/message", updatedMsg);
        setMsg((prevMsg) => [...prevMsg, response.data]);

        // if (socket && socket.readyState === WebSocket.OPEN) {
        //   socket.send(JSON.stringify(updatedMsg)); // Send as JSON
        // }

        setText(""); // Clear input
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") sendMsg();
  };

  const updateText = (event) => setText(event.target.value);

  const handleIconClick = () => fileInputRef.current?.click();

  const getFileName = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setPhotoMsg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFileName("");
    setPhotoMsg(null);
  };

  const displayPhoto = (photo) => setSelectedPhoto(photo);

  const closePhoto = () => setSelectedPhoto(null);

  const filteredMessages = msg.filter(
    (val) =>
      (val.senderId === userData._id && val.receiverId === user._id) ||
      (val.receiverId === userData._id && val.senderId === user._id)
  ).reverse();

  return (
    <>
      <div className="chat-box" style={{ display: user ? "" : "none" }}>
        <div className="photo-display" style={{ display: selectedPhoto ? "" : "none" }}>
          <div className="blur-bg"></div>
          <button className="cross" onClick={closePhoto}>
            <IoCloseSharp />
          </button>
          <img src={selectedPhoto} className="image-max" />
        </div>

        <div className="chat-head">
          <div className="person">
            <div className="circle">
              <img src={user.profilePicture} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
            </div>
            <div>
              <div>{user.fullName}</div>
              <div className="username">@{user.userName}</div>
              <div style={{ color: "darkgreen", fontSize: "0.8rem" }}>Online</div>
            </div>
          </div>
          <div className="info">
            <CiCircleInfo />
          </div>
        </div>

        <div className="msg-display">
          {filteredMessages.map((val, index) => (
            <div key={index} className="msg-bar" style={{ justifyContent: val.senderId === userData._id ? "right" : "left" }}>
              {val.senderId !== userData._id && (
                <div className="circle2">
                  <img src={user.profilePicture} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                </div>
              )}

              <div className="text" style={{ backgroundColor: val.senderId === userData._id ? "#FCBB15" : "", display: val.msgType === "text" ? "" : "none" }}>
                {val.message}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontSize: "0.8rem", color: "grey" }}>{formatTime(val.createdAt)}</div>
                  <RiCheckDoubleLine style={{ display: val.senderId === userData._id ? "flex" : "none", color: "green" }} />
                </div>
              </div>

              {val.msgType === "photo" && (
                <div className="photo-msg" onClick={() => displayPhoto(val.message)}>
                  <img src={val.message} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="message">
          <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={getFileName} />
          {fileName && <div className="photo-send">{fileName} <div className="remove-photo" onClick={removePhoto}>x</div></div>}
          <GoPaperclip style={{ fontSize: "1.5rem", cursor: "pointer" }} onClick={handleIconClick} />
          <div className="msg-box">
            <input type="text" placeholder="Enter Message" className="msg-text" value={text} onKeyDown={handleKeyPress} onChange={updateText} />
            <button style={{ color: "green" }} onClick={sendMsg}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
