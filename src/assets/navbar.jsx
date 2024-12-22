
import '../index.css'
import { CiSearch } from "react-icons/ci";

export default function NavBar(){
    return(
        <div className='nav-bar'>
            <div className='search-bar'>
                <CiSearch />
                <input type='text' style={{border:'none',width:'30rem'}} placeholder='Search'/>
            </div>
        </div>
    )
}