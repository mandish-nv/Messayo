import '../index.css'
import { RiCheckDoubleLine } from "react-icons/ri";
import { Link} from "react-router";
import { IoImageOutline } from "react-icons/io5";



export default function Message({ user,setUser, msg, friendData,setMsg}) {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp); 
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, 
        });
    };
    
    return (
        <div className='user-scroll'>
            <div className='user-block'>
                {friendData.map((val, index) =>{
                    const userMessages = msg.filter(message => (message.receiverId === val._id||message.senderId===val._id));
                    let latestMessage = userMessages[userMessages.length - 1]?.message|| "Tap to chat";
                    if(latestMessage!=='Tap to chat' && userMessages[userMessages.length-1].msgType==='photo'){
                
                        latestMessage='Photo Message'
            
                    }

                    const getLatestMessageTime = (messages) => {
                        if (!messages || messages.length === 0) return 'error';
                        const latestMessage = messages[messages.length - 1];
                        return formatTime(latestMessage?.createdAt) || '';
                      };
                      
                      const latestMessageTime = getLatestMessageTime(userMessages);
                    return(
                    <Link key={index} to={`/message/${val._id}`}>
                    <div className='users' onClick={() => {setUser(val);} }>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="circle">
                                <img src={val.profilePicture} style={{objectFit:'cover',height:'100%',width:'100%'}}/>
                            </div>
                            <div style={{ display: 'grid', gap: '5px' }}>
                                <div style={{ fontSize: '1.2rem' }}>{val.fullName}</div>
                                <div style={{ fontSize: '0.9rem', color: 'grey',width:"280px",height:'20px',overflow:'hidden',display:'flex',gap:'5px' }}>
                                <IoImageOutline style={{display:latestMessage==='Photo Message'?'':'none'}}/>
                                {latestMessage}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gap: '5px' }}>
                            <div style={{opacity:latestMessageTime==='error'?'0':'1'}}>{latestMessageTime}</div>
                            <div style={{display:'flex',justifyContent:'right', color: 'green' }}><RiCheckDoubleLine  />
                            </div>
                        </div>
                    </div>
                        </Link>
                    )})}
            </div>
        </div>
        
    )
}