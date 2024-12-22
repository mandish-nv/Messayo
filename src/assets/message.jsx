import '../index.css'
import { RiCheckDoubleLine } from "react-icons/ri";


export default function Message({ setUser, msg, userName }) {
    
    return (
        <div className='user-scroll'>
            <div className='user-block'>
                {userName.map((val, index) =>{
                    const userMessages = msg.filter(message => message.user === val);
                    const latestMessage = userMessages[userMessages.length - 1]?.mess|| "Tap to chat";
                    return(
                    <div key={index} className='users' onClick={() => setUser(userName[index])}>
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
                            <div>16:45</div>
                            <div style={{display:'flex',justifyContent:'right', color: 'green' }}><RiCheckDoubleLine  />
                            </div>
                        </div>
                    </div>)})}
            </div>
        </div>
    )
}