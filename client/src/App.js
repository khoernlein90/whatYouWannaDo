import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Saved from "./pages//Saved/Saved";
import Detail from "./pages/Detail/Detail";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/saved" component={Saved} />
        <Route exact path="/activity/:id/:type" component={Detail} />
      </Switch>
    </div>
  </Router>
);

export default App;
