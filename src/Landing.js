import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">
      <h1>Welcome to This-is-Chat</h1>
      <Link to="/home">
        <button>Go to Application</button>
      </Link>
    </div>
  );
}

export default Landing;
