import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { Web3Provider, Web3Toolbar } from "@dapperlabs/react-web3";

import CreatePage from "../pages/CreatePage";
import LoadPage from "../pages/LoadPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => (
  <Router>
    <Switch>
      <Web3Provider>
        {/* <Web3Toolbar /> */}
        <Route path="/" component={CreatePage} exact={true} />
        <Route path="/load/:address" component={LoadPage} />
      </Web3Provider>

      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default AppRouter;
