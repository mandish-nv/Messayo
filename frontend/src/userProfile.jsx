import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
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
    window.location.reload();
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
  const [aafu, setAafu] = useState([])

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
    const sathiLine = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/profile/${loggedinId}`);

        // Ensure setAafu always gets a valid object
        setAafu(userResponse.data || { friends: [], pendingRequests: [], receivedRequests: [] });
      } catch (err) {
        console.log(err);
        setAafu({ friends: [], pendingRequests: [], receivedRequests: [] }); // Set default values on error
      }
    };
    sathiLine();
  }, [loggedinId]);


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
  }, [id]); // Runs when selfId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const number = user.friends.length

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

  return (
    <div>
      <div align='center' style={{ fontSize: '2rem', color: '#FCBB15', fontWeight: 'bold', paddingTop: '2rem', paddingBottom: '2rem' }}>User Profile</div>
      <div style={{ display: 'flex', gap: '5rem', alignItems: 'center', justifyContent: 'center' }}>
        <div className="circle4">
          <img
            src={user.profilePicture}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="profile-data">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              {user.userName}
            </div>
            <div className="send-req-button" style={{ display: loggedinId === user._id ? '' : 'none' }}>Edit Profile</div>
            <div
              className="send-req-button"
              style={{
                display: loggedinId !== user._id && aafu?.friends?.includes(user._id) ? '' : 'none'
              }}
              onClick={() => removeFriend(loggedinId, user._id)}
            >
              Remove Friend
            </div>

            <div
              className="send-req-button"
              style={{
                display: loggedinId !== user._id && aafu?.pendingRequests?.includes(user._id) ? '' : 'none'
              }}
            >
              Request Sent
            </div>

            <div
              className="send-req-button"
              onClick={() => acceptFriendRequest(loggedinId, user._id)}
              style={{
                display: loggedinId !== user._id && aafu?.receivedRequests?.includes(user._id) ? '' : 'none'
              }}
            >
              Accept Request
            </div>

            <div
              className="send-req-button"
              onClick={() => sendFriendRequest(loggedinId, user._id)}
              style={{
                display: loggedinId !== user._id &&
                  !aafu?.friends?.includes(user._id) &&
                  !aafu?.receivedRequests?.includes(user._id) &&
                  !aafu?.pendingRequests?.includes(user._id)
                  ? ''
                  : 'none'
              }}
            >
              Add Friend
            </div>

          </div>
          <div style={{ display: 'flex', gap: '10px' }}><div style={{ color: '#FCBB15', fontWeight: 'bold' }}>{number}</div> Friends</div>
          <div style={{ color: '#FCBB15', fontWeight: 'bold' }}>{user.fullName}</div>
          <div>{user._id}</div>
        </div>
      </div>

      <h1 align='center' className="friend-list">Friend list:</h1>
      <div style={{ display: 'flex', gap: '1rem', overflowY: 'scroll' }}>
        {friends.map((friend) => (
          <div className="friend-profile">
            <div className="circle3">
              <img src={friend.profilePicture} style={{ height: '100%', width: '100%', objectFit: 'cover' }}></img>
            </div>
            <Link to={`/userProfile/${friend._id}`}><div>{friend.fullName}</div></Link>
            <div style={{ color: '#FCBB15' }}>@{friend.userName}</div>
            <div className="remove-button" onClick={() => removeFriend(loggedinId, friend._id)} style={{ display: loggedinId === user._id ? '' : 'none' }}>Remove Friend</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
