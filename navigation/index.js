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
import Map from "../screens/map";
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
    Login:{
      screen:Login,
      navigationOptions:({ navigation  })=>({
        title:'Inicio de sesion',
        headerTintColor: 'white',
        headerTitleStyle: { 
          fontSize: 22, 
          color:'white',
          fontWeight:'bold'
      }, 
        headerStyle: {
          backgroundColor:'#c0e359'
      },
    })
    },
    SignUp:{
      screen:SignUp,
      navigationOptions:({ navigation  })=>({
        title:'Registrarse',
        headerTintColor: 'white',
        headerTitleStyle: { 
          fontSize: 22, 
          color:'white',
          fontWeight:'bold'
      }, 
        headerStyle: {
          backgroundColor:'#c0e359'
      },
    })
    },
    Forgot,
    Explore:{
      screen:Explore,
      navigationOptions:({ navigation  })=>({
        headerTintColor: 'white',
        headerTitleStyle: { 
          fontSize: 22, 
          color:'white',
          fontWeight:'bold'
      }, 
        headerStyle: {
          backgroundColor:'#c0e359'
      },
    })
    },
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
    Settings:{
      screen:Settings,
      navigationOptions:({ navigation  })=>({
        title:'Perfil',
        headerTintColor: 'white',
        headerTitleStyle: { 
          fontSize: 22, 
          color:'white',
          fontWeight:'bold'
      }, 
        headerStyle: {
          backgroundColor:'#c0e359'
      },
    })
    },
    Map:{
      screen:Map,
      navigationOptions:({ navigation  })=>({
        title: 'Ubicación',
        headerTintColor: 'white',
        headerTitleStyle: { 
          fontSize: 22, 
          color:'white',
          fontWeight:'bold'
      }, 
        headerStyle: {
          backgroundColor: '#c0e359',
      },
    })
    }
  },
  {
    transitionConfig: () => fromRight()
  }
);

export default createAppContainer(screens);
