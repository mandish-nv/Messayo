import { Link } from "react-router"

export default function ErrorMsg(){
    return(
        <div>
            <h1>404 Error</h1>
            <Link to='/'>Home Page</Link>
        </div>
    )
}