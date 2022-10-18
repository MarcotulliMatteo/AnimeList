import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';

const AnimeItem = props => {

    const [selected,setSelected] = useState(false)

    _selectAnime = (docId, oAnime) => {
        props.onPress.bind(this, docId, oAnime)()
        setSelected(!selected)
    }

    return (
        <View style={{}}>
            <View style={{paddingLeft: 10, opacity: selected ? 0.2 : 1}}>
                <TouchableOpacity onPress={props.place == "Home" ? props.onPress.bind(this, props.data, props.docId) : _selectAnime.bind(this, props.docId, props.data)}>
                    <Image style={{height:140, width: 130,
                    borderRadius: 5, borderWidth: 1}}
                    source={props.data.imgUri != "https:" ? {uri: props.data.imgUri} : require('../icon/noPhoto.png')}
                    resizeMode='cover'/>
                </TouchableOpacity>
                <Text style={{color:'white', width:100, paddingTop: 4, fontSize: 13}}>{props.data.name}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default AnimeItem;