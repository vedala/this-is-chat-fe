import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Signup from './Signup';

function NavBar() {

  const { isAuthenticated, user } = useAuth0();

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
          <span className="logged-in-user">
            Logged in user: <span className="username">{user?.sub}</span>
          </span>
          <LogoutButton />
        </>
      )}
    </div>
  );
}

export default NavBar;
