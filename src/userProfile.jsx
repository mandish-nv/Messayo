import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

const removeFriend = async (selfId, friendId) => {
  try {
    const response = await axios.post("http://localhost:5000/removeFriend", {
      selfId,
      friendId,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error(
      "Error removing friend",
      error.response?.data?.message || error.message
    );
  }
};

const UserProfile = () => {
  const userData =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    false;
  //local, session ma db ko value haru
  const loggedinId = userData._id;

  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!id) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${id}`);
        setUser(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Fetch current user's data to get the friends list
        const userResponse = await axios.get(`http://localhost:5000/profile/${id}`);

        if (!userResponse.data.friends) {
          setError("No friends found.");
          return;
        }

        // Fetch friends' details using their IDs
        const friendsResponse = await axios.post(
          "http://localhost:5000/retrieveFriendsInfo",
          {
            friendsList: userResponse.data.friends,
          }
        );

        setFriends(friendsResponse.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error.message);
      }
    };

    fetchFriends();
  }, [loggedinId]); // Runs when selfId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <p>User ID: {user._id}</p>
      <h1>Name: {user.fullName}</h1>
      <br />
      <br />

      <h1>User details: </h1>
      <p>fullName: {user.fullName}</p>
      <p>userName: {user.userName}</p>
      <p>gender: {user.gender}</p>
      <p>dob: {user.dob}</p>
      <p>email: {user.email}</p>
      <p>password: {user.password}</p>
      <p>
        profilePicture:{" "}
        <img
          src={user.profilePicture}
          style={{ height: "30%", width: "30%", objectFit: "cover" }}
        />
      </p>
      <br />
      <br />

      <h1>Friend list:</h1>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={friend.profilePicture || "https://via.placeholder.com/50"}
              alt={`${friend.name}'s Profile`}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <span>{friend.userName}</span>
          </li>
        ))}
      </ul>

      <br />
      <br />

      <p>{loggedinId === user._id ? "Same user" : "Different user"}</p>

      <p>
        {loggedinId != user._id &&
        userData.friends.includes(user._id)
          ? "Friends"
          : ""}
      </p>

      {/* yo link chai milau hai */}
      <p>
        {loggedinId != user._id &&
        userData.friends.includes(user._id)
          ? <Link>Send message</Link>
          : ""}
      </p>

      <p>
        {loggedinId != user._id &&
        userData.friends.includes(user._id) ? (
          <button
            onClick={() => removeFriend(loggedinId, user._id)}
            style={{ backgroundColor: "red", cursor: "pointer", margin: "5px" }}
          >
            Remove friends
          </button>
        ) : (
          ""
        )}
      </p>

      <p>
        {loggedinId != user._id &&
        userData.pendingRequests.includes(user._id) 
          ? "Request sent"
          : ""}
      </p>

      <p>
        {loggedinId != user._id &&
        userData.receivedRequests.includes(user._id) 
          ? "Request received"
          : ""}
      </p>

      <p>
        {loggedinId != user._id &&
        !userData.friends.includes(user._id) &&
        !userData.pendingRequests.includes(user._id) &&
        !userData.receivedRequests.includes(user._id) ? (
          <button
            style={{
              display: loggedinId === user._id ? "none" : "",
              backgroundColor: "yellow",
            }}
            onClick={() => sendFriendRequest(loggedinId, user._id)}
          >
            Add friend
          </button>
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

export default UserProfile;
