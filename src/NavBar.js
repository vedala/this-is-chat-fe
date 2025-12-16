import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Signup from './Signup';

function NavBar() {

  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  const goToPath = (path) => {
    navigate(path);
  }

  return (
    <div className="navbar">
      { !isAuthenticated && (
        <>
          <LoginButton />
          <Signup />
        </>
      )}
      { isAuthenticated && (
        <>
          <span className="logged-in-user">Logged in user: {user?.sub}</span>
          <LogoutButton />
        </>
      )}
    </div>
  );
}

export default NavBar;
