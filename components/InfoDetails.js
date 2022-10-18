import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { Divider } from 'react-native-elements';

const InfoDetails = props => {

    return (
        <View style={{flex:1, padding:15}}>
            <Text style={{color:'white', fontSize:16, paddingBottom: 10}}>{"Anno di inizio: " + props.oAnime.date}</Text>
            <Text style={{color:'white', fontSize:16, paddingBottom: 10}}>{"Studio di produzione: " + ""}</Text>
            <Text style={{color:'white', fontSize:16, paddingBottom: 20}}>{"Autori: " + ""}</Text>
            <View style={{justifyContent:'center', alignItems:'center', paddingBottom: 15}}>
                <Divider style={{width:'100%', borderColor: '#696969'}} />
            </View>
            <Text style={{color:'white', fontSize:18, paddingBottom: 10, textAlign:'center'}}>Informazioni</Text>
            <Text style={{color:'white', fontSize:16, paddingBottom: 20}}>{props.oAnime.desc}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default InfoDetails;