import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatPage from './chatPage'
import { createBrowserRouter, RouterProvider } from 'react-router'  
import ErrorMsg from './errorPage'
import Login from './loginPage'
import ChatPageWrapper from './chatWrapper'
import ProfileView from './ProfileView'

// localStorage.setItem("user", JSON.stringify({ name: "John", age: 30 }));
// const user = JSON.parse(localStorage.getItem("user"));


const router=createBrowserRouter([
  {
    path:'/message/:user',
    element:<ChatPageWrapper/>,  
    errorElement:<ErrorMsg />
  },
  {
    path:'/message',
    element:<ChatPage/>,
    errorElement:<ErrorMsg/>
  },
  
  {
    path:'/login',
    element:<Login value={1}/>,
    errorElement:<ErrorMsg/>
  },
  {
    path:'/register',
    element:<Login value={2}/>,
    errorElement:<ErrorMsg/>
  },
  {
    path:'/userProfile/:userId',
    element:<ProfileView/>,
    errorElement:<ErrorMsg/>
  },{
    path:'/userProfile',
    element:<ProfileView/>,
    errorElement:<ErrorMsg/>
  }
], { debug: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider> 
  </StrictMode>
)