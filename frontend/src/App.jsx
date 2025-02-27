import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./userProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
