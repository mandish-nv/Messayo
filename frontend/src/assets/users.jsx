import { CiSearch } from "react-icons/ci";
import Message from "./message";
import Chat from "./chat";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import { BiSolidYinYang } from "react-icons/bi";

export default function Users({ parameter }) {
  const [user, setUser] = useState(false);
  useEffect(()=>{

    if (parameter) {
      axios.post('http://localhost:5000/findById', { id: parameter })
        .then(response => {
          setUser(response.data);  // Correctly set user data when the response is received
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  },[])
  
  const userData =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    false;
  const friend = userData.friends;
  const sathi=[]
  friend.map(()=>{

  })
  const [msg, setMsg] = useState([]);
  const [friendData, setFriendData] = useState([]);

  // useEffect(() => {
  //   const fetchFriendData = async () => {
  //     try {
  //       const friendDataPromises = friend.map((val) =>
  //         axios.post("http://localhost:5000/retrieveOne", val)
  //       );

  //       const responses = await Promise.all(friendDataPromises);
  //       const data = responses.map((response) => response.data);

  //       setFriendData(data);
  //     } catch (error) {
  //       console.error("Error fetching friend data:", error);
  //     }
  //   };

  //   if (friend.length > 0) {
  //     fetchFriendData();
  //   }
  // }, [friend]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Fetch current user's data to get the friends list
        const userResponse = await axios.get(`http://localhost:5000/profile/${userData._id}`);

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
        

        setFriendData(friendsResponse.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error.message);
      }
    };

    fetchFriends();
  }, []);

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

  // search functions --- added later by mandish
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchUser = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      setSearchResults([]); // Clear results if search box is empty
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/searchUsers", {
        params: { query: query, selfId: userData._id },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleBackspace = (event) => {
    if (event.key === "Backspace" && searchTerm.length === 1) {
      setSearchResults([]); // Clear results when last character is deleted
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "30% 70%" }}>
      <div className="user-display">
        <Link to={"/message"} style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Messages
        </Link>
        <div className="search-user">
          <CiSearch />
          <input
            type="text"
            style={{ border: "none" }}
            placeholder="Search"
            onChange={searchUser}
            onKeyDown={handleBackspace}
          />
        </div>

        {/* Display search results */}
        {searchResults.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {searchResults.map((user) => (
              <li
                key={user._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setUser(user)} // Set selected user for messaging
              >
                <img
                  src={user.profilePicture || "https://via.placeholder.com/50"}
                  alt={`${user.fullName}'s Profile`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span>{user.fullName}</span>
              </li>
            ))}
          </ul>
        )}

        <Message
          user={user}
          setUser={setUser}
          msg={msg}
          friendData={friendData}
        />
      </div>

      <Chat user={user} userData={userData} />
    </div>
  );
}
