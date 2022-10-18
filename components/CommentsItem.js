import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';

const CommentsItem = props => {

    const createdTime = props.date != undefined ? String(props.date.getHours()) + ":" + String(props.date.getMinutes()) : ""

    return (
        <View style={{flexDirection: 'row', paddingBottom:7}}>
            <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                <TouchableOpacity style={{position:'absolute', right:10, bottom:0}}  onPress={() => {}}>
                    <Image source={require('../icon/utente.png')} style={{width: props.screenHeight*0.06, height: props.screenHeight*0.06, 
                            borderRadius: 200/ 2, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white'}}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:4, paddingRight: props.screenHeight*0.06}}>
                <View style={{backgroundColor: 'transparent', padding:10, borderTopLeftRadius: 20, borderBottomRightRadius: 20,
                 borderTopRightRadius: 20, borderWidth:1, borderColor:'#696969'}}>
                    <Text style={{fontSize: 15, paddingLeft: 20, color:'white'}}>{props.text}</Text>
                    <View style={{justifyContent:'center', flexDirection:'row'}}>
                        <Text style={{flex: 1, textAlign:'right', fontSize:12, paddingRight:10, color:'white'}}>{createdTime}</Text>
                    </View>
                </View>
            </View>
        </View>
        
    );
};

const styles = StyleSheet.create({
    
});

export default CommentsItem;