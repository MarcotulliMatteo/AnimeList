import React from 'react';
import { View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {GoogleSignin} from '@react-native-community/google-signin';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconSearchProfile from 'react-native-vector-icons/MaterialIcons';

import Home from './screen/Home.js';
import AnimeDetails from './screen/AnimeDetails.js';
import IntroScreen from './screen/IntroScreen.js';
import Profile from './screen/Profile.js';
import SearchAnime from './screen/SearchAnime';

GoogleSignin.configure({
  webClientId: '639511331258-3lck13qaraap8sc04lefhk7rg0rv12t6.apps.googleusercontent.com', 
  offlineAccess: true, 
  hostedDomain: '', 
  loginHint: '', 
  forceConsentPrompt: true, 
  accountName: '',
});

const TabNavigator = createMaterialBottomTabNavigator(  
    {  
      Home: {
        screen: Home,
        navigationOptions:{
          labeled: false,
          tabBarIcon: ({tintColor, focused}) => (
              <View style = {{}}>  
                  <Icon style={[{color: tintColor}]} size={focused ? 28 : 27} name={focused ? 'home' : 'home-outline'}/>  
              </View>
          )
        }
      },
      SearchAnime: {
        screen: SearchAnime,
        navigationOptions: {
          labeled: false,
          tabBarIcon: ({tintColor, focused}) => (
            <View style = {{}}>  
                  <IconSearchProfile style={[{color: tintColor}]} size={focused ? 28 : 27} name={'search'}/>  
              </View>
          )
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          labeled: false,
          tabBarIcon: ({tintColor, focused}) => (
            <View style = {{}}>  
                  <IconSearchProfile style={[{color: tintColor}]} size={focused ? 28 : 27} name={focused ? 'person' : 'person-outline'}/>  
              </View>
          )
        }
      }
    },  
    {  
      initialRouteName: "Home",
      activeColor: 'white',
      inactiveColor: '#9E9E9E',
      barStyle: { backgroundColor: '#282828' },
    },  
);  

const MainNavigator = createStackNavigator(
  {
    AnimeDetails: {screen: AnimeDetails},
    TabNavigator: TabNavigator
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'TabNavigator',
    headerLayoutPreset: "center"
  }
);

const AuthStack = createStackNavigator(
  {
    IntroScreen: {screen: IntroScreen},
  },
  {
    initialRouteName: 'IntroScreen',
    headerLayoutPreset: "center"
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      IntroScreen: AuthStack,
      App: MainNavigator,
      TabNavigator: TabNavigator
    },
    {
      initialRouteName: 'IntroScreen',
    }
  )
);