import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Control from "./assets/controlbar";
import {Link} from "react-router";

const acceptFriendRequest = async (selfId, friendId) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/acceptFriendRequest",
      { selfId, friendId }
    );
    console.log(response.data.message);
    window.location.reload();
  } catch (error) {
    console.error(
      "Error sending friend request:",
      error.response?.data?.message || error.message
    );
  }
};

const rejectFriendRequest = async (selfId, friendId) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/rejectFriendRequest",
      { selfId, friendId }
    );
    console.log(response.data.message);
    window.location.reload();
  } catch (error) {
    console.error(
      "Error sending friend request:",
      error.response?.data?.message || error.message
    );
  }
};

const sendFriendRequest = async (selfId, friendId) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/sendFriendRequest",
      { selfId, friendId }
    );
    console.log(response.data.message);
    window.location.reload();
  } catch (error) {
    console.error(
      "Error sending friend request:",
      error.response?.data?.message || error.message
    );
  }
};

export default function UsersList() {
  const userData =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    false;
  //local, session ma db ko value haru
  const selfId = userData._id; // all friend list ko id and status
  const userId = userData._id;

  const [pendingRequests, setPendingRequests] = useState([]);
  const [addFriendData, setAddFriendData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/getPendingRequests",
          { selfId }
        );
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending friend requests:", error);
        setError(error.message);
      }
    };

    if (userId) {
      fetchPendingRequests();
    }
  }, [userId]);

  useEffect(() => {
    const fetchAddFriendData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/addFriendUsers",
          { selfId }
        );
        setAddFriendData(response.data);
      } catch (error) {
        console.error("Error fetching friend data:", error);
        setError(error.message);
      }
    };

    fetchAddFriendData();
  }, []); // Fetch once on component mount

  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '6% 94%' }}>
      <Control value={1}/>
      <div style={{ display: 'grid', gridTemplateRows: '15% 85%' }}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:'4rem',color:'#FCBB15',fontWeight:'bold'}}>
          <div>Discover</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem',paddingLeft:'3rem' }}>
          <div style={{ borderRight: '1px rgb(205, 205, 205) solid', paddingTop: '2rem' }}>
            <h1 className="heading">Pending Requests</h1>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {pendingRequests.map((user) => (
                <li key={user._id} className="friend-pending">
                  <div className="pending-detail">
                    <div className="circle">
                      <img src={user.profilePicture} style={{ height: '100%', width: '100%', objectFit: 'cover' }}></img>

                    </div>
                    <div>
                      <Link to={`/userProfile/${user._id}`}><div>{user.fullName}</div></Link>
                      <div style={{ color: 'grey' }}>@{user.userName}</div>
                    </div>
                  </div>
                  <div className="buttons">
                    <button onClick={() => acceptFriendRequest(selfId, user._id)} style={{ backgroundColor: "#FCBB15", cursor: "pointer", margin: '5px', boxShadow: '3px 3px 5px orange' }}>Accept </button>
                    <button onClick={() => rejectFriendRequest(selfId, user._id)} style={{ backgroundColor: "rgb(161, 161, 161)", cursor: "pointer", margin: '5px', boxShadow: '3px 3px 5px grey ' }}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>


          <div style={{ paddingTop: '2rem' }}>
            <h2 className="heading">Add friends</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {addFriendData.map((user) => (
                <li key={user._id} className="friend-pending">
                  <div className="pending-detail">
                    <div className="circle">
                      <img src={user.profilePicture} style={{ height: '100%', width: '100%', objectFit: 'cover' }}></img>

                    </div>
                    <div>
                    <Link to={`/userProfile/${user._id}`}><div>{user.fullName}</div></Link>
                      <div style={{ color: 'grey' }}>@{user.userName}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(selfId, user._id)}
                    className="send-req-button"
                    style={{}}
                  >
                    Add friend
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
