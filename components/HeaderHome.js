import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

const HeaderHome = props => {

    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', height: props.heightDimension,
         width:'100%', marginTop: props.marginTop, zIndex: 1, backgroundColor:'#282828', elevation: 5}}>
            <TouchableOpacity style={{alignItems:'center', flex:1, justifyContent:'center'}}>
                <Text style={{fontSize: 18, color:'white', fontWeight:'bold'}}>
                    Anime
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default HeaderHome;