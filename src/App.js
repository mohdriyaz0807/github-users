import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";
import "./App.css"

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact Component={UserList} />
          <Route path="/user/:username" Component={UserDetails} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
