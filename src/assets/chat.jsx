import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { RiCheckDoubleLine } from "react-icons/ri";

export default function Chat({ user, msg, setMsg }) {


    const sendMsg = () => {
        let text = document.querySelector('.msg-text')
        if (text.value != '') {
            setMsg([...msg, { user: user, status: 'sent', mess: text.value }])
            text.value = ''
        }

    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMsg()
        }
    };

    const receiveMsg=()=>{
        let text = document.querySelector('.msg-text')
        if (text.value != '') {
            setMsg([...msg, { user: user, status: 'received', mess: text.value }])
            text.value = ''
        }
    }

    return (
        <div className="chat-box">
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
                        if (val.user === user) {
                            return (
                                <div key={index} className="msg-bar" style={{ justifyContent: val.status == 'sent' ? 'right' : 'left' }}>
                                    <div className="circle2" style={{display:val.status==='received'?'flex':'none'}}></div>
                                    <div className="text" style={{backgroundColor:val.status==='sent'?'#FCBB15':''}}>
                                        {val.mess}
                                                
                                        <div style={{display:val.status==='sent'? 'flex':'none',justifyContent:'right',color:'green'}}>                                
                                        <RiCheckDoubleLine />
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
                    <input type='text' placeholder="Enter Message" className="msg-text" onKeyDown={(event) => handleKeyPress(event)} />
                    <button style={{ color: 'green' }} onClick={() => { sendMsg() }}>Send</button>
                    <button style={{ color: 'green' }} onClick={() => { receiveMsg() }}>Receive</button>
                </div>
            </div>
        </div>
    )
}