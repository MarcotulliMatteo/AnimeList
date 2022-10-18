import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import Star from 'react-native-vector-icons/AntDesign';

const RatingStar = props => {

    const [maxRating, setMaxRating] = useState(5)

    loadRatingStar = () => {
        var aRatingBar = []
        var size = props.size != undefined ? props.size : 25
        for(i=0; i<maxRating; i++){
            if(i<props.defRating){
                aRatingBar.push(
                    <Star name={"star"} size={size} color={'white'} 
                     onPress={props.updateRating.bind(this, i, props.editable)}/>
                )
            } else {
                aRatingBar.push(
                    <Star name={"staro"} size={size} color={'#D3D3D3'}
                     onPress={props.updateRating.bind(this, i, props.editable)}/>
                )
            }
        }
        return aRatingBar
    }


    return (
        <View style={props.editable ? styles.centered : styles.notCentered}>
            {loadRatingStar()}
        </View>
    );
};

const styles = StyleSheet.create({
    notCentered:{
        width:'100%',
        flexDirection:'row',
        paddingTop:5,
        paddingBottom:5
    },
    centered:{
        width:'100%',
        flexDirection:'row',
        paddingTop:5,
        paddingBottom:5,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default RatingStar;