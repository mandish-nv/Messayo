import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function UserProfile() {
  const userData =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    false;
  //local, session ma db ko value haru
  const friend = userData.friends; // all friend list ko id and status

  const [friendData, setFriendData] = useState([]); // all friends info, for {update}
  // if any consequence then send default value (like try catch)
  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const friendDataPromises = friend.map(
          (val) => axios.post("http://localhost:5000/retrieveOne", val) //retrieve multiple BANAAAAAAA
        );

        const responses = await Promise.all(friendDataPromises);
        const data = responses.map((response) => response.data);

        setFriendData(data); // Update state with all data at once
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };

    if (friend.length > 0) {
      fetchFriendData();
    }
  }, [friend]);

  const { userId } = useParams(); // Extract the userId parameter

  const sendFriendRequest = async () => {
    await axios.post("http://localhost:5000/", val);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10rem",
          paddingTop: "5rem",
          borderBottom: "1px solid grey",
        }}
      >
        <div className="profile-photo">
          <img
            src={userData.profilePicture}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="profile-info">
          <div style={{ display: "flex", gap: "50px", alignItems: "center" }}>
            <div>{userData.userName}</div>
            <div
              style={{
                padding: "5px 20px",
                backgroundColor: "#FCBB15",
                borderRadius: "1rem",
              }}
            >
              Edit Profile
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>Followers: 100</div>
            <div>Following: 100</div>
          </div>
          <div>
            <div>{userData.fullName}</div>
            <div>Nyase woneu kha</div>
          </div>
        </div>
      </div>
    </>
  );
}
