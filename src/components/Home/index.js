import React, { Component } from "react";
import Home from './Home';
import QuestionDetail from '../QuestionDetail/index.js';
import QuestionAsk from '../QuestionAsk/index.js';
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator(
  {
    Home: { screen: Home },
    QuestionDetail: { screen: QuestionDetail },
    QuestionAsk: { screen: QuestionAsk }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
));
