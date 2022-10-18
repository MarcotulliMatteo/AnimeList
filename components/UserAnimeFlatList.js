import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, FlatList} from 'react-native';

import CircleAnimeItem from './CircleAnimeItem';

const UserAnimeFlatList = props => {

    return (
        <View style={{flex:1}}>
            <Text style={{color: '#DCDCDC', fontSize: 17, paddingRight: 15, paddingBottom: 15, paddingTop: 10, paddingLeft: 15}}>
                {props.sGenres}
            </Text>
            <View style = {{}}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={props.oAnime}
                    keyExtractor={item => item.animeID}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    horizontal={true}
                    onScrollEndDrag={() => {
                    }}
                    renderItem={({ item }) => <CircleAnimeItem data={item.animeData} docId={item.animeID} onPress={props.onPress}/>}
                />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default UserAnimeFlatList;