import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

const acceptFriendRequest = async (selfId, friendId) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/acceptFriendRequest",
      { selfId, friendId }
    );
    console.log(response.data.message);
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
    <div>
      <h1>Pending list</h1>
      <div>
        <h1>Pending Friend Requests</h1>
        <ul>
          {pendingRequests.map((user) => (
            <li key={user._id}>
              {user.fullName}
              <button onClick={() => acceptFriendRequest(selfId, user._id)} style={{ backgroundColor: "green", cursor: "pointer", margin:'5px'}}> O </button>
              <button onClick={() => rejectFriendRequest(selfId, user._id)} style={{ backgroundColor: "red", cursor: "pointer", margin:'5px'}}> X </button>
            </li>
          ))}
        </ul>
      </div>

      <br />
      <br />
      <br />

      <h2>Add friends (except self, pending, and accepted)</h2>
      <ul>
        {addFriendData.map((user) => (
          <li key={user._id}>
            {user.fullName}
            <button
              onClick={() => sendFriendRequest(selfId, user._id)}
              style={{ backgroundColor: "yellow", cursor: "pointer" }}
            >
              Add friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
