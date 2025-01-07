import { useState,useEffect } from "react";
import axios from 'axios'
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
        const friendDataPromises = friend.map((val) =>
          axios.post("http://localhost:5000/retrieveOne", val) //retrieve multiple BANAAAAAAA
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

  const sendFriendRequest = async () =>{
    await axios.post("http://localhost:5000/", val)
  };

  return (
    <div>
      <p>User ID: {userId}</p>
      <h1>Name: {userData.fullName}</h1>
      <br/><br/>

      <h1>User details: </h1>
      <p>fullName: {userData.fullName}</p>
      <p>userName: {userData.userName}</p>
      <p>gender: {userData.gender}</p>
      <p>dob: {userData.dob}</p>
      <p>email: {userData.email}</p>
      <p>password: {userData.password}</p>
      <p>profilePicture: <img src={userData.profilePicture} /></p>
      <br/><br/>

      <h1>Friend list:</h1>
      <ol>
        {friendData.map((val, index) => {
          return <li key={index}>{val.fullName}</li>;
        })}
      </ol>
      <br/><br/>
      
      <p>{(userId === userData._id)? "Same": "Different"}</p>
      <button style={{display: (userId === userData._id)? "none": ""}} onClick={() => sendFriendRequest()}>Add friend</button>
    </div>
  );
}
