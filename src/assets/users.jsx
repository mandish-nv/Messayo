import { CiSearch } from "react-icons/ci";
import Message from "./message";
import Chat from "./chat";
import { useState,useEffect } from "react";
import axios from 'axios'
import { Link } from "react-router";

export default function Users({parameter}) {
    const [user,setUser]=useState(parameter)

    let temp=['Manish', 'Pandey', 'Waiwai', 'Current', 'Swikriti', 'Bharad', 'Arul', 'Puku', 'Aakash', 'Radip', 'Amar', 'Crocodile', 'Chwolup', 'Kale', 'Bison', 'Kalu Pandey', 'Yunika']
    const [userName,setUserName] = useState([...temp])
    const[msg,setMsg]=useState([])


    useEffect(()=>{
        axios.get('http://localhost:5000/message')
            .then((response)=>{
                setMsg(response.data)
            },[])
            .catch((error)=>{
                console.log(error)
            })
    },[])
   
    let filterName=[...userName]
    const handleBackspace=(event)=>{
        if(event.key==='Backspace'){
            setUserName([...temp])
        }
    }
    const searchUser=(event)=>{
        let value=event.target.value
        filterName=userName.filter((val)=>val.toLowerCase().startsWith(value.toLowerCase()))
        setUserName(filterName)
    }
    return (
        <div style={{display:'grid',gridTemplateColumns:'30% 70%'}}>
            <div className="user-display">
                <Link to={'/message'} style={{ fontSize: '2rem', fontWeight: 'bold' }}>Messages</Link>
                <div className="search-user">
                    <CiSearch />
                    <input type='text' style={{ border: 'none'}} placeholder='Search' onChange={(event)=>searchUser(event)} onKeyDown={(event)=>handleBackspace(event)}/>
                </div>
                <Message user={user} setUser={setUser} msg={msg} userName={userName}/>
            </div>
            <Chat user={user} msg={msg} setMsg={setMsg} />
        </div>
    )
}