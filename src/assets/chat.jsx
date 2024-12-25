import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useState } from "react";
import axios from 'axios'
import { PiMessengerLogo } from "react-icons/pi";

export default function Chat({ user, msg, setMsg }) {

    const[newMsg,setNewMsg]=useState({message:'',status:''})
    const sendMsg = async () => {
        const text = document.querySelector('.msg-text');
        if (text.value !== '') {
            const newMessage = { message: text.value,status:'hilu'};
            try {
                const response = await axios.post('http://localhost:5000/message', newMessage);
                setMsg((prevMsg) => [...prevMsg, response.data]);
                setNewMsg({ message: '',status:'' });
            } catch (error) {
                console.error('Error sending message:', error);
            }
            text.value = '';
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



    return (
        <>
        <div className="chat-box" style={{display:user?'':'none'}}>
            <div className="chat-head">
                <div className="person">
                    <div className="circle"></div>
                    <div>
                        <div>{user}</div>
                        <div style={{ color: 'darkgreen' }}>Online</div>
                    </div>
                </div>
                <div className="info">
                    <CiCircleInfo />

                </div>
            </div>

            <div className="msg-display">
                {
                    msg.map((val, index) => {
                        if (true) {
                            return (
                                <div key={index} className="msg-bar" style={{ justifyContent: val.status == 'hilu' ? 'right' : 'left' }}>
                                    <div className="circle2" style={{display:val.status!=='hilu'?'flex':'none'}}></div>
                                    <div className="text" style={{backgroundColor:val.status==='hilu'?'#FCBB15':''}}>
                                        {val.message}
                                                
                                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px'}}> 
                                        <div style={{fontSize:'0.8rem',color:'grey'}}>{formatTime(val.createdAt)}</div>                               
                                        <RiCheckDoubleLine style={{display:val.status==='hilu'? 'flex':'none',color:'green'}}/>
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
                    <input type='text' placeholder="Enter Message" className="msg-text" onKeyDown={(event) => handleKeyPress(event)}/>
                    <button style={{ color: 'green' }} onClick={() => { sendMsg() }}>Send</button>
                    {/* <button style={{ color: 'green' }} onClick={() => { receiveMsg() }}>Receive</button> */}
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