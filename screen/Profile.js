import React from 'react';
import {View, Text, Dimensions, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Divider } from 'react-native-elements';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore();
    };

    state = {
    }

    static navigationOptions = {
        headerShown: false
    };

    componentDidMount = () => {
    }

    onComponentMountAgain = () => {
    }
    
    componentWillUnmount = () => {
    }

    render() {
      return (
        <SafeAreaView style={{flex:1, backgroundColor:'#212121'}}>
            <StatusBar backgroundColor='#212121' barStyle="light-content" translucent
            style={styles.headerStyle}/>
            <Text>Profile</Text>
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: getStatusBarHeight()
    }
});