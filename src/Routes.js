import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "./components/AsyncComponent";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

const AsyncHome = asyncComponent(() => import("./containers/Home"));
const AsyncNotFound = asyncComponent(() => import("./containers/NotFound"));
const AsyncLogin = asyncComponent(() => import("./containers/Login"));
const AsyncSignup = asyncComponent(() => import("./containers/Signup"));
const AsyncNewNote = asyncComponent(() => import("./containers/NewNote"));
const AsyncNotes = asyncComponent(() => import("./containers/Notes"));
const AsyncGeoCamera = asyncComponent(() => import("./containers/GeoCamera"));


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={AsyncLogin} props={childProps} />
	<UnauthenticatedRoute path="/signup" exact component={AsyncSignup} props={childProps} />
	<UnauthenticatedRoute path="/camera" exact component={AsyncGeoCamera} props={childProps} />
	<AuthenticatedRoute path="/notes/new" exact component={AsyncNewNote} props={childProps} />
    <AuthenticatedRoute path="/notes/:id" exact component={AsyncNotes} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={AsyncNotFound} />
  </Switch>;
