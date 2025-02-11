import UserProfile from "./userProfile";
import Control from './assets/controlbar'

export default function ProfileView(){
  return(
    <div style={{display:'grid',gridTemplateColumns:'6% 94%'}}>
          <Control/>
          <UserProfile/>
    </div>
  )
}