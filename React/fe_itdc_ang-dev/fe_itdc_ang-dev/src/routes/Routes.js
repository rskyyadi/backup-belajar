// IMPORT DEPEDENCY
import React, { useEffect, useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "../components";

// IMPORT PAGE DASHBOARD
import Dashboard from "../pages/Dashboard";

// IMPORT PAGE 404
import NotFound from "../pages/404";

// IMPORT PAGE LOGIN
import Login from "../pages/Login";

import { AuthContext } from "../utilities";
import Config from "../config"


const MyRoutes = () => {
  const { state } = useContext(AuthContext);
  const { isAuthenticated, role } = state;
  const {ROUTES} = Config

  useEffect(() => {}, [state]);
  
  const AuthRoutes = ({ setNavbarTitle }) => (
    <Switch>
      {/* DASHBOARD */}
      <Route exact path="/">
        <Dashboard setNavbarTitle={setNavbarTitle} />
      </Route>

      {/* ROUTES */}
      {ROUTES.map((val, index) => 
        val.hak && 
        val.hak.some(hak => role.includes(hak)) && (
        <Route
          key={index}
          exact={val.exact}
          path={val.path}
        >
          <val.page setNavbarTitle={setNavbarTitle} />
        </Route>
      ))}


      {/* LOGIN FORM */}
      <Route path="/login">
        <Redirect to="/" />
      </Route>

      {/* 404-NOT FOUND */}
      <Route path="*">
        <NotFound setNavbarTitle={setNavbarTitle} />
      </Route>
    </Switch>
  );

  const UnAuthRoutes = () => (
    <Switch>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route path="*">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );

  const Routes = () => {
    if (!isAuthenticated) {
      return <UnAuthRoutes />;
    }

    return (
      <Layout>
        <AuthRoutes />
      </Layout>
    )
  };

  return (
    <BrowserRouter basename="/">
      <Routes />
    </BrowserRouter>
  );
};

export default MyRoutes;
