import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, FlatList, TextInput, Image} from 'react-native';

import { Divider } from 'react-native-elements';

import RateCommentsItem from '../components/RateCommentsItem';
import RatingStar from './RatingStar';

const RateCommentsDetails = props => {

    //const [ratingsComments,setRatingsComments] = useState([])
    const [textRating,setTextRating] = useState("")

    const [defRating, setDefRating] = useState(0)

    updateRating = (key,editable) => {
        if(editable){
            setDefRating(key + 1)
        }
    }

    return (
        <View style={{alignItems:'center', padding:15}}>
            <View style={{width:props.screenWidth*0.9, paddingBottom:20}}>
                <View>
                    <View style={{backgroundColor: 'transparent', padding:10, borderRadius:20, borderWidth:1, borderColor:'#696969'}}>
                        <TextInput style={{fontSize: 15, paddingLeft: 20, color:'white', paddingBottom:20}} multiline
                         onChangeText={text => setTextRating(text)} value={textRating} placeholder="Scrivi una recensione..."
                         placeholderTextColor={'white'}/>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Divider style={{width:'90%', borderColor: '#696969'}} />
                        </View>
                        <View style={{flexDirection:'row', paddingTop:15, paddingBottom: 10}}>
                            <RatingStar editable={true} size={20} defRating={defRating} updateRating={updateRating}/>
                        </View>
                        <TouchableOpacity style={{padding:5, borderWidth: 1,
                         backgroundColor: textRating == "" && defRating == 0 ? '#212121' : '#00BFA5', borderRadius: 10,
                         borderColor: '#00BFA5' }} 
                         onPress={props.insertRatingsComment.bind(this, defRating, textRating)}>
                            <Text style={{color: textRating == "" ? 'white' : 'black', fontSize:16, textAlign:'center'}}>Invia</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Divider style={{width:'100%', borderColor: '#696969'}} />
            <Text style={{color:'white', fontSize:18, padding: 10}}>Recensioni</Text>

            <FlatList
                showsHorizontalScrollIndicator={false}
                data={props.ratingsComments}
                keyExtractor={item => item.animeId}
                removeClippedSubviews={true}
                onScrollEndDrag={() => {}}
                renderItem={({ item }) => 
                    <View style = {{paddingTop: 12}}>
                        <RateCommentsItem screenHeight={props.screenHeight} text={item.text} screenWidth={props.screenWidth}
                        animeId={item.animeId} userId={item.userId} date={item.date}
                        rating={item.rating} defRatig={item.rating} imgURL={item.imgURL} displayName={item.displayName}/>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default RateCommentsDetails;