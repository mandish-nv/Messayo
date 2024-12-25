import './login.css'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router'

export default function Login({value}){
    const [loginInfo,setLoginInfo]=useState({})
    const [error,setError]=useState(0)
    const [val,setVal]=useState(value)
    const register=async()=>{
        const res=await axios.post('http://localhost:5000/register',loginInfo)
        setError(res.data)
        setLoginInfo({})
    }

//     const handleChange=(event,name)=>{
//         setRegData({...regData,[name]:event.target.value})
//     }

    const handleChange=(event,name)=>{
        setLoginInfo({...loginInfo,[name]:event.target.value})
    }

    const login=async()=>{
        const res=await axios.post('http://localhost:5000/login',loginInfo)
        setError(res.data)
        setLoginInfo({})
    }
    return(
        <div className="login">
            <div className={`dokoto ${val === 2 ? 'move-right' : ''}`}>
                <div>Dokoto</div>   
            </div>
            <div className={`form-signup ${val === 1 ? 'disapper' : ''}`}>
                <div className='welcome'>Sign Up</div>
                <div className='login-text'>Full Name:</div><input type='text' name='fullName' className='info-input' onChange={(event)=>handleChange(event,'fullName')}></input>
                <div></div>
                <br /><br/>

                <div className='login-text'>Username:</div><input type='text' name='userName' className='info-input' onChange={(event)=>handleChange(event,'userName')}></input>
                <div className='error-message' style={{opacity:error==3||error==4?'1':'0'}}>Username already exists</div>
                <br />

                <div className='login-text'>Gender:</div><input type='radio' name='gender' value='Male' onClick={(event)=>handleChange(event,'gender')}/>Male   <input type='radio' name='gender' value='Female' onClick={(event)=>handleChange(event,'gender')}/>Female
                <div></div>
                <br /><br/>

                <div className='login-text'>Date of Birth:</div><input type='date' name='dob' className='info-input' onChange={(event)=>handleChange(event,'dob')}></input>
                <div></div>
                <br /><br/>

                <div className='login-text'>Email:</div><input type='email' name='email' className='info-input' onChange={(event)=>handleChange(event,'email')}></input>
                <div className='error-message' style={{opacity:error==3||error==5?'1':'0'}}>Email already taken</div>
                <br />

                <div className='login-text'>Password:</div><input type='password' name='password' className='info-input' onChange={(event)=>handleChange(event,'password')}></input>
                <div></div>
                <br /><br/>

                <div className='login-text'>Profile Picture:</div><input type='text' name='profilePicture' className='info-input' onChange={(event)=>handleChange(event,'profilePicture')}/>
                <div></div>
                <br /><br/>

                <button type='submit' className='submit-button' onClick={()=>register()}>Submit</button>
                <div></div> 
                <br/><br/>

                Already have an account? <Link to={'/login'} onClick={()=>setVal(1)}>Login</Link>
            </div>
            
            <div className={`form ${val === 2 ? 'disapper' : ''}`}>
                <div className='welcome'>Welcome</div>
                <div className='login-text' >Username:</div><br/><input type='text' name='username' value={loginInfo.userName} className='info-input' placeholder='Enter Username' onChange={(event)=>handleChange(event,'userName')}></input>
                <div className='error-message' style={{display:error=='1'?'flex':'none'}}>Username does not exists</div>
                <br/><br/>

                <div className='login-text' >Password:</div><br/><input type='password' name='password' value={loginInfo.password} className='info-input' placeholder='Enter Password' onChange={(event)=>handleChange(event,'password')}></input>
                <div className='error-message' style={{display:error=='2'?'flex':'none'}}>Incorrect Password</div>
                <br/><br/>

                <button type='submit' className='submit-button' onClick={()=>login()}>Submit</button><br/><br />
                Don't have an account <Link to={'/register'} onClick={()=>setVal(2)}>Sign up</Link>
            </div>
        </div>
    )
}