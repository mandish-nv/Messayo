import '../index.css'
import { CiGlobe } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { CiVideoOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import logo from './logo.jpeg'


import { useState } from 'react';

export default function Control({value}) {
    const userInfo=JSON.parse(localStorage.getItem('login'))||JSON.parse(sessionStorage.getItem('login'))||'not-logged-in'
    // console.log(userInfo)
    const [val, setVal] = useState(value)

    const exit=()=>{
        setVal(6)
        localStorage.removeItem('login')||sessionStorage.removeItem('login')
        
    }

    return (
        <div className="side-bar">
            <div style={{ display: 'grid', gap: '1.5rem', justifyContent: 'center', textAlign: 'center',paddingTop:'1rem' }}>
            <img src={logo} className='logo'></img>
                <div className="circle" style={{display:userInfo==='not-logged-in'?'none':''}}>
                    <img src={userInfo==='not-logged-in'?'':userInfo.profilePicture}></img>
                </div>

                <div
                    className={`icon ${val === 1 ? 'active' : ''}`}
                    onClick={() => setVal(1)}
                >
                    <CiGlobe />
                </div>
                <div
                    className={`icon ${val === 2 ? 'active' : ''}`}
                    onClick={() => setVal(2)}
                >
                    <FiMessageCircle />
                </div>
                <div
                    className={`icon ${val === 3 ? 'active' : ''}`}
                    onClick={() => setVal(3)}
                >
                    <CiVideoOn />
                </div>
                <div
                    className={`icon ${val === 4 ? 'active' : ''}`}
                    onClick={() => setVal(4)}
                >
                    <CiCalendar />
                </div>
            </div>

            <div style={{ display: 'grid', justifyContent: 'center', textAlign: 'center' }}>
                <div
                    className={`icon ${val === 5 ? 'active' : ''}`}
                    onClick={() => setVal(5)}
                >
                    <IoSettingsOutline />
                </div>
                <div
                    className={`icon ${val === 6 ? 'active' : ''}`}
                    onClick={() => exit()}
                >
                    <IoExitOutline />
                </div>
            </div>
        </div>
    )
}