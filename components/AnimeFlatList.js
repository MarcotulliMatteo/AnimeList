import React, {useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import AnimeItem from '../components/AnimeItem';

const AnimeFlatList = props => {
    
    const [animeList, setAnimeList] = useState(null);

    loadAsyncImages = async() =>{
        if(props.pAnime !== "" && typeof props.pAnime.then === "function" && props.pAnime._55 === null){
            var totAnimeList = []
            var aAnime = null
            var oAnimeList = null
            props.pAnime.then(oAnime => {
                aAnime = oAnime.docs;
                aAnime.map((oAnimeItem, oAnimeIndex) => {
                    if(oAnimeItem.data().imgUri != "https:" 
                    && oAnimeItem.data().imgUri != "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Folder_Hexagonal_Icon.svg/16px-Folder_Hexagonal_Icon.svg.png"
                    && oAnimeItem.data().imgUri != "https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/50px-Question_book-new.svg.png"
                    && oAnimeItem.data().imgUri != "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Ambox_important.svg/40px-Ambox_important.svg.png"){
                        oAnimeList = {
                            "id": oAnimeItem.id,
                            "data": oAnimeItem.data()
                        }
                        totAnimeList.push(oAnimeList)
                    }
                })
                totAnimeList = this.shuffleArray(totAnimeList, totAnimeList.length)
                setAnimeList(totAnimeList)
            }).catch(err=>{
                console.log(err)
            });
        }else if(props.image === "" && image !== "NONE"){
            console.log("It's not a promise!")
        }
    }

    shuffleArray = (array, length) => {
        for (var i = length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }

    capitalize = () => {
        if(props.sGenres){
            return props.sGenres.charAt(0).toUpperCase() + props.sGenres.slice(1)
        } else {
            return ""
        }
    }
    
    return (
        <View style={{flex:1}}>
            <NavigationEvents onDidFocus={loadAsyncImages()}></NavigationEvents>
            <Text style={{color: '#DCDCDC', fontSize: 17, paddingRight: 15, paddingBottom: 15, paddingTop: 10, paddingLeft: 15}}>
                {this.capitalize()}
            </Text>
            <View style = {{}}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={animeList}
                    keyExtractor={item => item.id}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    horizontal={true}
                    onScrollEndDrag={() => {
                    }}
                    renderItem={({ item }) => <AnimeItem data={item.data} docId={item.id} onPress={props.onPress} place={"Home"}/>}
                />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default AnimeFlatList;