import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useContext";

function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default ProfilePage;
