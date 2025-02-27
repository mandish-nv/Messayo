import './login.css'
import { useState } from 'react'
import axios from 'axios'
import { Link,Navigate, useNavigate } from 'react-router'

export default function Login({value}){
    const navigate=useNavigate()
    const [loginInfo,setLoginInfo]=useState({userName:'',password:''})
    const [regInfo,setRegInfo]=useState({fullName:'',userName:'',gender:'',dob:'',email:'',password:'',profilePicture:''})
    const [error,setError]=useState(0)
    const [val,setVal]=useState(value)
    const [check,setCheck]=useState(false)
    const register=async()=>{
        const res=await axios.post('https://messayo-backend.onrender.com/register',regInfo)
        setError(res.data)
        setRegInfo({fullName:'',userName:'',gender:'',dob:'',email:'',password:'',profilePicture:''})
        if(res.data=='6'){
            setVal(3)
        }
    }

    const handleChange=(event,name)=>{
        setLoginInfo({...loginInfo,[name]:event.target.value})
    }
    
    const handleChangeReg=(event,name)=>{
        setRegInfo({...regInfo,[name]:event.target.value})
    }

    const login=async()=>{
        const res=await axios.post('https://messayo-backend.onrender.com/login',loginInfo)
        setError(res.data)
        if(res.data=='7'){
            setVal(3)
            const res1=await axios.post('https://messayo-backend.onrender.com/find',loginInfo)
            const info=res1.data
            if(check){
                localStorage.setItem('login',JSON.stringify(info))
            }
            else{
                sessionStorage.setItem('login',JSON.stringify(info))
            }
            
            setTimeout(()=>navigate('/message'),2000)
        }
    }

    const handleFile = (event) => {
        const file = event.target.files[0];
        if (file) {
          console.log("Selected file:", file);
    
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              console.log("Base64 string:", reader.result); // Debugging
              setRegInfo({...regInfo,profilePicture:reader.result})
            } else {
              console.error("FileReader result is empty");
            }
          };
    
          reader.onerror = (error) => {
            console.error("Error reading file:", error);
          };
    
          reader.readAsDataURL(file);
        } else {
          console.warn("No file selected");
        }
      };


    const handleCheck=(event)=>{
        console.log(event.target.value)
        setCheck(event.target.value)
    }
    return(
        <div className="login">
            <div className={`dokoto ${val === 2 ? 'move-right' : val===3?'center':''}`}>
                <div>Dokoto</div> 
                <div style={{display:error=='6'?'grid':'none'}}>
                    <div className='register-successful'>Registered Successfully</div>
                    <div>
                    <Link to={'/login'} className='login-button' onClick={()=>{setVal(1);setError(0)}}>Login</Link>
                    </div>
                </div>  
                <div style={{display:error=='7'?'grid':'none'}}>
                    <div className='register-successful'>Login Successfully</div>
                </div>  

            </div>
            <div className={`form-signup ${val === 1||val===3 ? 'disapper' : ''}`}>
                <div className='welcome'>Sign Up</div>
                <div className='login-text'>Full Name:</div><input type='text' name='fullName' className='info-input' onChange={(event)=>handleChangeReg(event,'fullName')}></input>
                <div></div>
                <br /><br/>

                <div className='login-text'>Username:</div><input type='text' name='userName' className='info-input' onChange={(event)=>handleChangeReg(event,'userName')}></input>
                <div className='error-message' style={{opacity:error==3||error==4?'1':'0'}}>Username already exists</div>
                <br />

                <div className='login-text'>Gender:</div><input type='radio' name='gender' value='Male' onClick={(event)=>handleChangeReg(event,'gender')}/>Male   <input type='radio' name='gender' value='Female' onClick={(event)=>handleChangeReg(event,'gender')}/>Female
                <div></div>
                <br /><br/>

                <div className='login-text'>Date of Birth:</div><input type='date' name='dob' className='info-input' onChange={(event)=>handleChangeReg(event,'dob')}></input>
                <div></div>
                <br /><br/>

                <div className='login-text'>Email:</div><input type='email' name='email' className='info-input' onChange={(event)=>handleChangeReg(event,'email')}></input>
                <div className='error-message' style={{opacity:error==3||error==5?'1':'0'}}>Email already taken</div>
                <br />

                <div className='login-text'>Password:</div><input type='password' name='password' className='info-input' onChange={(event)=>handleChangeReg(event,'password')}></input>
                <div></div>
                <br /><br/>

                <div className='login-text'>Profile Picture:</div><input type='file' name="image" accept="image/*" onChange={(event)=>handleFile(event)}></input>
                <div></div>
                <br/><br/>

                <button type='submit' className='submit-button' onClick={()=>register()}>Submit</button>
                <div></div> 
                <br/><br/>


                Already have an account? <Link to={'/login'} onClick={()=>setVal(1)}>Login</Link>
            </div>
            
            <div className={`form ${val === 2||val===3 ? 'disapper' : ''}`}>
                <div className='welcome'>Welcome</div>
                <div className='login-text' >Username:</div><br/><input type='text' name='username' value={loginInfo.userName} className='info-input' placeholder='Enter Username' onChange={(event)=>handleChange(event,'userName')}></input>
                <div className='error-message' style={{display:error=='1'?'flex':'none'}}>Username does not exists</div>
                <br/><br/>

                <div className='login-text' >Password:</div><br/><input type='password' name='password' value={loginInfo.password} className='info-input' placeholder='Enter Password' onChange={(event)=>handleChange(event,'password')}></input>
                <div className='error-message' style={{display:error=='2'?'flex':'none'}}>Incorrect Password</div>
                <br/><br/>
                <div className='flex'>
                <input type='checkbox' name='remember' checked={check} onChange={()=>setCheck(!check)}></input><div className='login-text'>Remember Me</div>
                </div><br/>

                <button type='submit' className='submit-button' onClick={()=>login()}>Submit</button><br/><br />
                Don't have an account <Link to={'/register'} onClick={()=>setVal(2)}>Sign up</Link>
            </div>
        </div>
    )
}