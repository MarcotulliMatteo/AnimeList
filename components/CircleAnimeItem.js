import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image, BackHandler} from 'react-native';

const CircleAnimeItem = props => {

    return (
        <View style={{}}>
            <View style={{paddingLeft: 10, paddingRight:5}}>
                <TouchableOpacity onPress={props.onPress.bind(this, props.data, props.docId)}>
                    <Image style={{height:120, width: 120,
                    borderRadius: 200/2, borderWidth: 1}}
                    source={props.data.imgUri != "https:" ? {uri: props.data.imgUri} : require('../icon/noPhoto.png')}
                    resizeMode='cover'/>
                </TouchableOpacity>
                <Text style={{color:'white', width:120, paddingTop: 4, fontSize: 13, textAlign: 'center'}}>{props.data.name}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default CircleAnimeItem;