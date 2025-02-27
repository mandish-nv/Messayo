import { useParams } from 'react-router';
import ChatPage from './chatPage';

export default function ChatPageWrapper() {
    const { user } = useParams(); // Extract the :user parameter
    // console.log(user);
    return <ChatPage parameter={user} />; // Pass it as a prop to ChatPage
}