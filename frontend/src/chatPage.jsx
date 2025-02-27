import Control from "./assets/controlbar"
import Users from "./assets/users"  

export default function ChatPage({parameter}){
    return(
    <div style={{display:'grid',gridTemplateColumns:'5% 95%'}}>
      <Control value={2}/>
      <Users parameter={parameter}/>
   </div>
    )
}