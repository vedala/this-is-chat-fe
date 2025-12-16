import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import Landing from "./Landing";
import Home from "./Home";
import NavBar from "./NavBar";

function App() {

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={<Landing />}
          />
          <Route
            path="/home"
            element={<Home />}
          />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
