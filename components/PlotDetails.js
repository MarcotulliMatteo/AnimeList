import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

const PlotDetails = props => {

    return (
        <View style={{flex:1, padding:15}}>
            <Text style={{color:'white', fontSize:18, paddingBottom: 10, textAlign:'center'}}>{"Trama"}</Text>
            <Text style={{color:'white', fontSize:16, paddingBottom: 20}}>{props.oAnime.plot}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default PlotDetails;