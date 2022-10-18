import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

const Footer = props => {

    return (
        <View style={{flexDirection: 'row', justifyContent: 'center',
         zIndex: 1, height:props.heightDimension , width:'100%',
         elevation: 5, backgroundColor:'#282828', justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize: 18, color:'white', fontWeight:'bold'}}>Footer</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default Footer;