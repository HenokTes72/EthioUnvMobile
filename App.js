import React, { Component } from "react";
import Expo from "expo";
import MainScreen from "./src/App";

export default class AwesomeApp extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      showRealApp: false,
    };
    this._onDone = this._onDone.bind(this);
  }

  _onDone() {
    this.setState({ showRealApp: true });
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_thin: require("native-base/Fonts/roboto.thin.ttf"),
      Roboto_light: require("native-base/Fonts/roboto.light.ttf"),
      Roboto_light_italic: require("native-base/Fonts/roboto.light-italic.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Roboto_regular: require("native-base/Fonts/roboto.regular.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf"),
      Entypo: require("native-base/Fonts/Entypo.ttf")
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    return <MainScreen />
  }
}