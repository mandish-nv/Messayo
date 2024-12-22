import { CiSearch } from "react-icons/ci";
import Message from "./message";
import Chat from "./chat";
import { useState } from "react";

export default function Users() {
    let temp=['Manish', 'Pandey', 'Waiwai', 'Current', 'Swikriti', 'Bharad', 'Arul', 'Puku', 'Aakash', 'Radip', 'Amar', 'Crocodile', 'Chwolup', 'Kale', 'Bison', 'Kalu Pandey', 'Yunika','Nisala']
    const [user,setUser]=useState('')
    const [userName,setUserName] = useState([...temp])
    const [msg,setMsg]=useState([{user:'Manish',status:'sent',mess:'Hello'},{user:'Manish', status:'received',mess:'Hello'},{user:'Waiwai',status:'received',mess:'Baibhav'},{user:'Nisala',status:'received',mess:'I am short'}])
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
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Messages</div>
                <div className="search-user">
                    <CiSearch />
                    <input type='text' style={{ border: 'none'}} placeholder='Search' onChange={(event)=>searchUser(event)} onKeyDown={(event)=>handleBackspace(event)}/>
                </div>
                <Message setUser={setUser} msg={msg} userName={userName}/>
            </div>
            <Chat user={user} msg={msg} setMsg={setMsg} />
        </div>
    )
}