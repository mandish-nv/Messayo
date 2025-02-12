import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

const sendFriendRequest = async (selfId, friendId) => {
  try {
      const response = await axios.post("http://localhost:5000/sendFriendRequest", { selfId, friendId });
      console.log(response.data.message);
  } catch (error) {
      console.error("Error sending friend request:", error.response?.data?.message || error.message);
  }
};

export default function UsersList() {
  const userData =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    false;
  //local, session ma db ko value haru
  const selfId = userData._id; // all friend list ko id and status

  const [addFriendData, setAddFriendData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddFriendData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/getAllUsers", {selfId});
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
      {/* render this */}
      <br/><br/><br/>

      <h2>Add friends (except self, pending, and accepted)</h2>
      <ul>
        {addFriendData.map((user) => (
          <li key={user._id}>
            {user.fullName}
            <button onClick={() => sendFriendRequest(selfId, user._id)} style={{backgroundColor:'yellow', cursor:'pointer'}}>Add friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
