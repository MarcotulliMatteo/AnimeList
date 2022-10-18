import React from 'react';
import {StyleSheet, View} from 'react-native';

import Image from 'react-native-remote-svg';

const BusyIndicator = props => {
    
    return (
        <View style={{alignItems:'center', justifyContent:'center', position:'absolute', top:0, right:0, left:0, bottom:0, backgroundColor:'#212121'}}>
            <Image source={require('../icon/busy.svg')} style={{ width: 150, height: 150 }}/>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default BusyIndicator;