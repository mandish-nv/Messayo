import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useState } from "react";
import axios from 'axios'
import { PiMessengerLogo } from "react-icons/pi";

export default function Chat({ user, msg, setMsg, userData }) {
    const [text,setText]=useState('')
    let filterMsg=[]
    if(user){
        filterMsg=msg.filter((val)=>((val.senderId==userData._id&&val.receiverId==user._id)||(val.receiverId==userData._id&&val.senderId==user._id)))
    }
    const[newMsg,setNewMsg]=useState({senderId:'',receiverId:'',status:'sent',msgType:'text'})

    const sendMsg = async () => {
        if (text.trim() !== '') {
          
          const updatedMsg = { ...newMsg, message: text,senderId:userData._id,receiverId:user._id };
      
          console.log("Sending message:", updatedMsg);
      
          try {
            const response = await axios.post('http://localhost:5000/message', updatedMsg);
            setMsg((prevMsg) => [...prevMsg, response.data]);
      
            setText('');
            setNewMsg({
              senderId: '',
              receiverId: '',
              status: "sent",
              msgType: "text",
            });
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
      };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp); // Parse the timestamp
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour format; change to `true` for 12-hour format
        });
      };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMsg()
        }
    };

    const updateText=(event)=>{
        setText(event.target.value)
    }

    return (
        <>
        <div className="chat-box" style={{display:user?'':'none'}}>
            <div className="chat-head">
                <div className="person">
                    <div className="circle">
                        <img src={user.profilePicture}/>
                    </div>
                    <div>
                        <div>{user.fullName}</div>
                        <div style={{ color: 'darkgreen' }}>Online</div>
                    </div>
                </div>
                <div className="info">
                    <CiCircleInfo />

                </div>
            </div>

            <div className="msg-display">
                {
                    filterMsg.map((val, index) => {
                        if (true) {
                            return (
                                <div key={index} className="msg-bar" style={{ justifyContent: val.senderId == userData._id ? 'right' : 'left' }}>
                                    <div className="circle2" style={{display:val.senderId!=userData._id?'':'none'}}>
                                        <img src={user.profilePicture} style={{objectFit:'contain'}}/>
                                    </div>
                                    <div className="text" style={{backgroundColor:val.senderId==userData._id?'#FCBB15':''}}>
                                        {val.message}
                                                
                                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px'}}> 
                                        <div style={{fontSize:'0.8rem',color:'grey'}}>{formatTime(val.createdAt)}</div>                               
                                        <RiCheckDoubleLine style={{display:val.senderId===userData._id? 'flex':'none',color:'green'}}/>
                                        </div>
                                    </div>
                                </div>);
                        }
                    }
                    )
                }
            </div>

            <div className="message">
                <GoPaperclip style={{ fontSize: '1.5rem' }} />
                <div className="msg-box">
                    <input type='text' placeholder="Enter Message" className="msg-text" value={text} onKeyDown={(event) => handleKeyPress(event)} onChange={(event)=>updateText(event)}/>
                    <button style={{ color: 'green' }} onClick={() => { sendMsg() }}>Send</button>
                </div>
            </div>
        </div>
        <div className="default-chat" style={{display:user?'none':''}}>
            <div>
                <PiMessengerLogo style={{marginLeft:'50px',fontSize:'5rem',color:'grey'}}/>
                <div style={{fontSize:'1.5rem',color:'grey'}}>Start Messaging</div>
            </div>
        </div>
        </>
    )
}