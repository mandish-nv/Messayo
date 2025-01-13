import { CiSearch } from "react-icons/ci";
import Message from "./message";
import Chat from "./chat";
import { useState,useEffect } from "react";
import axios from 'axios'
import { Link } from "react-router";
import { BiSolidYinYang } from "react-icons/bi";

export default function Users({parameter}) {
    const [user,setUser]=useState(false)
    const userData=JSON.parse(localStorage.getItem('login'))||JSON.parse(sessionStorage.getItem('login'))||false    
    const friend=userData.friends
    const[msg,setMsg]=useState([])
    const [friendData,setFriendData]=useState([])
 
    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const friendDataPromises = friend.map(val =>
                    axios.post('http://localhost:5000/retrieveOne', val)
                );
    
                const responses = await Promise.all(friendDataPromises);
                const data = responses.map(response => response.data);
    
                setFriendData(data); 
            } catch (error) {
                console.error("Error fetching friend data:", error);
            }
        };
    
        if (friend.length > 0) {
            fetchFriendData();
        }
    }, [friend]);
    
    useEffect(()=>{
        const fetchMsg=async ()=>{
            try{
            const response=await axios.post('http://localhost:5000/findMessage',userData)
            setMsg(response.data)
            }
            catch(error){
                console.log('Error')
            }
        }
        if(userData){
            fetchMsg()
        }
    },[])
     

    // console.log(msg )    
    
    // console.log(msg)
    // console.log(user)
    // let filterName=[...userName]
    // const handleBackspace=(event)=>{
    //     if(event.key==='Backspace'){
    //         setUserName([...temp])
    //     }
    // }
    // const searchUser=(event)=>{
    //     let value=event.target.value
    //     filterName=userName.filter((val)=>val.toLowerCase().startsWith(value.toLowerCase()))
    //     setUserName(filterName)
    // }
    return (
        <div style={{display:'grid',gridTemplateColumns:'30% 70%'}}>
            <div className="user-display">
                <Link to={'/message'} style={{ fontSize: '2rem', fontWeight: 'bold' }}>Messages</Link>
                <div className="search-user">
                    <CiSearch />
                    <input type='text' style={{ border: 'none'}} placeholder='Search' onChange={(event)=>searchUser(event)} onKeyDown={(event)=>handleBackspace(event)}/>
                </div>
                <Message user={user} setUser={setUser} msg={msg} friendData={friendData}/>
            </div>
            <Chat user={user} msg={msg} setMsg={setMsg} userData={userData}/>
        </div>
    )
}