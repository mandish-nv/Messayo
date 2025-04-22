import "../index.css";
import { CiGlobe } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { CiVideoOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import logo from "./logo.png";
import { Link } from "react-router";

import { useState } from "react";

export default function Control({ value }) {
  const userInfo =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    "not-logged-in";
  // console.log(userInfo)
  const [val, setVal] = useState(value);

  const exit = () => {
    setVal(6);
    localStorage.removeItem("login") || sessionStorage.removeItem("login");
  };

  return (
    <div className="side-bar">
      <div
        style={{
          display: "grid",
          gap: "1rem",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: "1rem",
        }}
      >
        <img src={logo} className="logo" ></img>
        <Link to={`/userProfile/${userInfo._id}`}>
          <div
            className="circle"
            style={{ display: userInfo === "not-logged-in" ? "none" : "" }}
          >
            <img
              src={userInfo === "not-logged-in" ? "" : userInfo.profilePicture} style={{objectFit:'cover',height:'100%',width:'100%'}}
            ></img>
          </div>
        </Link>
        <div
          className={`icon ${val === 1 ? "active" : ""}`}
          onClick={() => setVal(1)}
        >
          <Link to={`/friendRequest`}>
            <CiGlobe />
          </Link>
        </div>
        <div
          className={`icon ${val === 2 ? "active" : ""}`}
          onClick={() => setVal(2)}
        >
          <Link to={`/message`}>
            <FiMessageCircle />
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          justifyContent: "center",
          alignItems:'center'
        }}
      >
        
        <div
          className={`icon ${val === 6 ? "active" : ""}`}
          onClick={() => exit()}
        >
         <Link to={'/'}> <IoExitOutline /></Link>
        </div>
      </div>
    </div>
  );
}
