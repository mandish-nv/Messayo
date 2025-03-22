import { useState } from "react";
import Particles from "./assets/Particles";
import {Link} from "react-router"


export default function LandingPage() {
    const [welcome,setWelcome]=useState(false)
    const [start,setStart]=useState(false)
    const [login,setLogin]=useState(false)
    const [signup,setSignup]=useState(false)
    const userData =
    JSON.parse(localStorage.getItem("login")) ||
    JSON.parse(sessionStorage.getItem("login")) ||
    false;

    window.onload=()=>{
    setTimeout(() => {
        setWelcome(true)
    }, 1000);
    setTimeout(() => {
        setStart(true)
    }, 1200);
}

    const appear=()=>{
        setStart(false)
        setTimeout(() => {
            setLogin(true)
        }, 500);
        setTimeout(() => {
            setSignup(true)
        }, 1000);
    }   
    return (
        <div className="land">
            <div style={{position:'absolute',left:'22%',top:'10%',color:'white',fontSize:'5rem',fontWeight:'bold',transition:'all 0.5s ease-in-out',opacity:welcome?'1':'0'}}>
                Welcome To Messayo
            </div>
            <div style={{position:'absolute',left:'45%',top:'50%',transition:'all 0.5s ease-in-out',opacity:start?'1':'0',zIndex:'10'}} onClick={()=>appear()}>
                <div className="login-signup" style={{cursor:'pointer'}}>Get Started</div>
            </div>
            <div style={{position:'absolute',left:'45%',top:'70%',display:'flex',zIndex:'10',transition:'all 0.5s ease-in-out',opacity:login&&userData?'1':'0'}}>
                <Link to={'/message'}><div className="login-signup">Goto Messages</div></Link>
                
            </div>
            <div style={{position:'absolute',left:'30%',top:'70%',display:'flex',zIndex:'10',transition:'all 0.5s ease-in-out',opacity:login&&!userData?'1':'0'}}>
                <Link to={'/login'}><div className="login-signup">Log In</div></Link>
                
            </div>
            <div style={{position:'absolute',left:'60%',top:'70%',display:'flex',zIndex:'10',transition:'all 0.5s ease-in-out',opacity:signup&&!userData?'1':'0'}}>
                <Link to={'/register'}><div className="login-signup">Sign Up</div></Link>
                
            </div>

            <div style={{ position: 'absolute', top: '0', left: '0', height: '90vh', width: '99vw' }}>
                <Particles particleColors={['#ffffff', '#FCBB15']}
                    particleCount={500}
                    particleSpread={10}
                    speed={0.2}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false} />
            </div>
        </div>
    )
}