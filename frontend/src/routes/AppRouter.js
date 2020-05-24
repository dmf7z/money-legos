import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { Web3Provider, Web3Toolbar } from "@dapperlabs/react-web3";

import CreatePage from "../pages/CreatePage";
import LandingPage from "../pages/LandingPage";
import LoadPage from "../pages/LoadPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/" component={LandingPage} exact={true} />
      <Web3Provider>
        {/* <Web3Toolbar /> */}
        <Route path="/new" component={CreatePage} exact={true} />
        <Route path="/load/:address" component={LoadPage} />
      </Web3Provider>
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default AppRouter;
