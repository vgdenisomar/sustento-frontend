import React from "react";
import { Image,View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {Ionicons,Entypo,AntDesign,Feather} from '@expo/vector-icons';


import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Forgot from "../screens/Forgot";
import Explore from "../screens/Explore";
import Browse from "../screens/Browse";
import Product from "../screens/Product";
import Settings from "../screens/Settings";
import { Animated, Easing, Platform } from 'react-native';

import { theme } from "../constants";


export function fromRight(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initWidth, 0, 0],
      });

      const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

      return { opacity, transform: [{ translateX }] };
    },
  };
}
const screens = createStackNavigator(
  {
    Welcome,
    Login,
    SignUp,
    Forgot,
    Explore,
    Browse:{
      screen:Browse,
      navigationOptions:({ navigation  })=>({
        title: 'Sustento App',
        headerTitleStyle: { 
          fontSize: 24, 
          color:'white',
          fontWeight:'bold'
      }, 
        headerLeft: null,
        headerRight:(
            
          <View style={{padding:5}}>
          <AntDesign onPress={() => navigation.navigate('Settings')} name='shoppingcart' size={35} style={{paddingRight:theme.sizes.base * 1.5 }}></AntDesign>
          </View>
  
        ),
        headerStyle: {
          paddingStart: theme.sizes.base * 0.5,
          backgroundColor: '#c0e359',
      },
    })
    },
    Product,
    Settings
  },
  {
    transitionConfig: () => fromRight()
  }
);

export default createAppContainer(screens);
