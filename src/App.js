import React, { Component } from "react";
import SideBar from "./components/SideBar/index.js";
import Home from './components/Home/index.js';
import Signup from './components/Signup/index.js';
import Login from './components/Login/index.js';
import UserProfile from './components/UserProfile/index.js';
import { createDrawerNavigator } from 'react-navigation';

const MainRouter = createDrawerNavigator(
    {
        Home: { screen: Home },
        Signup: { screen:  Signup },
        Login: { screen: Login },
        Account: { screen: UserProfile }
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);

export default MainRouter;