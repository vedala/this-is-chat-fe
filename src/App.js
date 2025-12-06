import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import Landing from "./Landing";
import Home from "./Home";

function App() {

  return (
    <Router>
      <div className="App">
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
