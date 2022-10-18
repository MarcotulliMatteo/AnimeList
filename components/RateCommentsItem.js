import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import RatingStar from './RatingStar';

import { Divider } from 'react-native-elements';


const RateCommentsItem = props => {

    const createdTime = props.date != undefined ? String(props.date.getHours()) + ":" + String(props.date.getMinutes()) : ""


    return (
        <View style={{width:props.screenWidth*0.9, borderWidth:1, borderColor:'#696969', borderRadius:20,
         padding:15}}>
            <View style={{flexDirection:'row', paddingLeft:10, paddingBottom:10, alignItems:'center'}}>
                <Image source={{uri: props.imgURL}}
                resizeMode='cover' style={{height: props.screenHeight*0.06, width: props.screenHeight*0.06,
                borderRadius: 200/2, borderWidth:1, borderColor:'white'}}/>
                <View style={{paddingLeft:15}}>
                    <Text style={{fontSize: 13, color:'white', height:15}}>{props.displayName}</Text>
                    <RatingStar editable={false} defRating={props.defRatig}
                    updateRating={() => {}} size={15}/>
                    <Text style={{fontSize: 11, color:'#DCDCDC', height:13}}>{createdTime}</Text>
                </View>
            </View>
            <View style={{justifyContent:'center', alignItems:'center'}}>
                <Divider style={{width:'90%', borderColor: '#696969'}} />
            </View>
            <Text style={{fontSize: 15, color:'white', padding:10, textAlign:'center'}}>{props.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default RateCommentsItem;