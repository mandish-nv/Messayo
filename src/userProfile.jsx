import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        profilePicture: <img src={user.profilePicture} style={{ height: "30%", width: "30%", objectFit: "cover" }}/>
      </p>
      <br />
      <br />

      <h1>Friend list:</h1>
      <ol>
        {user.friends.map((val, index) => {
          return <li key={index}>{val}</li>;
        })}
      </ol>
      <br />
      <br />
    </div>
  );
};

export default UserProfile;

// <p>{userId === userData._id ? "Same" : "Different"}</p>
//       <button
//         style={{ display: userId === userData._id ? "none" : "" }}
//         onClick={() => sendFriendRequest()}
//       >
//         Add friend
//       </button>