import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NavBar from './assets/navbar'
import Control from './assets/controlbar'
import Users from './assets/users'
import Chat from './assets/chat'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <NavBar/> */}
    <div style={{display:'grid',gridTemplateColumns:'5% 95%'}}>
      <Control/>
      <div>
        {/* <NavBar/> */}
        
            <Users/>
            {/* <Chat/> */}
      </div>
    </div>
      
  </StrictMode>,
)
