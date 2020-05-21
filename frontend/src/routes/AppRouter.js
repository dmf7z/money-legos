import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Web3Provider } from "@dapperlabs/react-web3";

// import FundsPage from 'pages/Funds';
import CreatePage from "../pages/CreatePage";
// import PortfoliosPage from 'pages/Portfolio';
// import PortfolioDetailsPage from 'pages/PortfolioDetails';
// import TransactionsPage from 'pages/Transactions';
import NotFoundPage from "../pages/NotFoundPage";
// import Web3ReactManager from "../Web3ReactManager";

const AppRouter = () => (
  <Router>
    <Switch>
      <Web3Provider>
        <Route path="/" component={CreatePage} exact={true} />
      </Web3Provider>
      {/* <Route path="/create" component={CreatePage} /> */}

      {/* <InvitedZone>
        <Web3ReactManager>
          <Route path="/connect" component={LoginPage} />
          <Route
            path="/fund/:id"
            render={({ match }) => <FundDetailsPage match={match} />}
          />

          <Web3Route path="/home">
            <MainPage />
          </Web3Route>
        </Web3ReactManager>
      </InvitedZone> */}

      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

// // A wrapper for <Route> that redirects to the login
// // screen if you're not yet authenticated.
// function Web3Route({ children, ...rest }) {
//   const { account } = useWeb3React();

//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         account ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/connect",
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }

// function InvitedZone({ children, ...rest }) {

//   console.log("invited");
//   const {userFirebase, claims} = useContext(UserContext);
//   // const { userStore } = useStores()
//   // console.log('appRoute has user? ', userFirebase.uid)
//   // console.log('appRoute is invited? ', claims.isInvited)
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//       userFirebase.uid
//       && claims.isInvited
//         // true
//       ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/access",
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }

export default AppRouter;
