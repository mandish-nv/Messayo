import '../index.css'
import { RiCheckDoubleLine } from "react-icons/ri";
import { Link} from "react-router";


export default function Message({ user,setUser, msg, userName }) {
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
                {userName.map((val, index) =>{
                    const userMessages = msg.filter(message => message.user !== val);
                    const latestMessage = userMessages[userMessages.length - 1]?.message|| "Tap to chat";
                    const getLatestMessageTime = (messages) => {
                        if (!messages || messages.length === 0) return 'error';
                        const latestMessage = messages[messages.length - 1];
                        return formatTime(latestMessage?.createdAt) || '';
                      };
                      
                      const latestMessageTime = getLatestMessageTime(userMessages);
                    return(
                    <Link key={index} to={`/message/${val}`}>
                    <div className='users' onClick={() => setUser(val) }>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="circle"></div>
                            <div style={{ display: 'grid', gap: '5px' }}>
                                <div style={{ fontSize: '1.2rem' }}>{val}</div>
                                <div style={{ fontSize: '0.9rem', color: 'grey',width:"280px",height:'20px',overflow:'hidden' }}>
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