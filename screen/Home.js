import React from 'react';
import {View, Text, Dimensions, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';

import HeaderHome from '../components/HeaderHome';
import LoadData from '../components/LoadData';
import AnimeFlatList from '../components/AnimeFlatList';
import UserAnimeFlatList from '../components/UserAnimeFlatList';
import BusyIndicator from '../components/BusyIndicator';

import oGenres from '../data/genres.json';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore();
    };
    
    state = {
        indexAnime: 0,
        indexLimitationAnime: 30,
        aMappedAnime: null,
        string: "",
        genToRenderCount: 7,
        animeToRender: 30,
        aMappedAnime: [],
        promiseArr: [],
        heightDimension:  screenHeight - screenHeight * 0.87 - getStatusBarHeight(),
        genToRender: [],
        checkedList: [],
        toBeCheckedList: [],
        showBusy: true,
        refreshing: false,
        usersAnime: null
    }

    static navigationOptions = {
         
    };

    componentDidMount = () => {
        this.fetchAnimeForGenres()
        this.fetchAnimeUser()
        this.fetchKnownUser()
    }

    onComponentMountAgain = () => {

    }
    
    //controllare se prende sempre i stessi utenti
    fetchKnownUser = async() => {
        const currentUser = firebase.auth().currentUser;
        if(currentUser){
            const userUID = currentUser._user.uid;
            const sUserData = await AsyncStorage.getItem('@storage_userData' + userUID);
            const oUserData = JSON.parse(sUserData);
            var firstGen;
            var secGen;

            if (oUserData.preferedGenres.length > 0){
                if(oUserData.preferedGenres.length > 1){
                    firstGen = oUserData.preferedGenres[0];
                    secGen = oUserData.preferedGenres[1];
                    this.ref.collection("users").where("preferedGenres", "array-contains-any", [firstGen,secGen]).limit(2).get().then( aUSer => {
                        if(aUSer._docs[0]._data.userUID != userUID){
                            this.setState({"usersAnime": aUSer._docs[0]._data})
                        } else {
                            this.setState({"usersAnime": aUSer._docs[1]._data})
                        }
                        
                    });
                }else {
                    firstGen = oUserData.preferedGenres[0];
                    this.ref.collection("users").where("preferedGenres", "array-contains", firstGen).limit(2).get().then( aUSer => {
                        if(aUSer._docs[0]._data.userUID != userUID){
                            this.setState({"usersAnime": aUSer._docs[0]._data})
                        } else {
                            this.setState({"usersAnime": aUSer._docs[1]._data})
                        }
                    });
                }
            }
        }
    }

    fetchAnimeUser = async() => {
        const currentUser = firebase.auth().currentUser;
        if(currentUser){
            const userUID = currentUser._user.uid;
            const sUserData = await AsyncStorage.getItem('@storage_userData' + userUID);
            const oUserData = JSON.parse(sUserData);
            var toBeCheckedList = [];
            var checkedList = [];

            if(oUserData == null){
                this.ref.collection('users').where("userUID", "==", userUID).get().then((aUsers) => {
                    this._storeLocalUserData(aUsers._docs[0]._data);
                    oUserData = aUsers._docs[0]._data;
                    
                    if(oUserData.checkedList.length != 0){
                        checkedList.push(oUserData); 
                    }
                    if(oUserData.toBeCheckedList.length != 0){
                        toBeCheckedList.push(oUserData)
                    }
                    
                    this.setState({"checkedList": checkedList, "toBeCheckedList": toBeCheckedList, refreshing: false})
                });
            } else {
                if(oUserData.checkedList.length != 0){
                    checkedList.push(oUserData); 
                }
                if(oUserData.toBeCheckedList.length != 0){
                    toBeCheckedList.push(oUserData)
                }
                this.setState({"checkedList": checkedList, "toBeCheckedList": toBeCheckedList, showBusy: false})
            }

            
        }
    }

    _storeLocalUserData = async (data) => {
        try {
            var userID = data.userUID
            data = JSON.stringify(data)
            await AsyncStorage.setItem('@storage_userData' + userID, data);
        } catch (error) {
            console.log("Store data Failed: " + error)
        }
    };

    fetchAnimeForGenres = () => {
        var genNumber = oGenres.genres.length
        var aGenres = this.shuffleArray(oGenres.genres, genNumber)
        this.state.genToRender = aGenres.slice(0,this.state.genToRenderCount)
        var promiseArr = []
        this.state.genToRender.map(gen => {
            var pAnime = this.ref.collection("anime").where("genres", "array-contains", gen).limit(this.state.animeToRender).get()
            promiseArr.push(pAnime)
        })
        this.setState({"promiseArr": promiseArr, showBusy: false, refreshing: false})
    }

    openAnimeDetails = async(oAnime, sAnimeID) => {
        var oIconState = {
            inCheckedList: false,
            inToBeCheckedList: false
        }
        const currentUser = firebase.auth().currentUser;
        if(currentUser){
            const userUID = currentUser._user.uid;
            const sUserData = await AsyncStorage.getItem('@storage_userData' + userUID);
            const oUserData = JSON.parse(sUserData);
            oUserData.checkedList.map(anime => {
                if(anime.animeID == sAnimeID){
                    oIconState.inCheckedList = true
                }
            })
            oUserData.toBeCheckedList.map(anime => {
                if(anime.animeID == sAnimeID){
                    oIconState.inToBeCheckedList = true
                }
            })
            this.props.navigation.navigate('AnimeDetails', {oAnime: oAnime, sAnimeID: sAnimeID, oIconState: oIconState})
        }
    }
    
    /*
    createUserAnimeView = () => {
        var compView = []
        if(this.state.checkedList.length > 0){
            compView.push(<UserAnimeFlatList oAnime={this.state.checkedList[0].checkedList}
                sGenres="Lista anime visti"
                onPress={this.openAnimeDetails}/>)
        }
        if(this.state.toBeCheckedList.length > 0){
            compView.push(<UserAnimeFlatList oAnime={this.state.toBeCheckedList[0].toBeCheckedList}
                sGenres="Lista anime da vedere"
                onPress={this.openAnimeDetails}/>)
        }
        return compView
    }

    createAnimeView = () => {
        var compView = this.state.promiseArr.map((pAnime, pAnimeIndex) => {
            return <AnimeFlatList pAnime={pAnime} sGenres={this.state.genToRender[pAnimeIndex]}
            onPress={this.openAnimeDetails}/>
        })
        return compView
    }
    */

    shuffleArray = (array, length) => {
        for (var i = length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }

    createUserAnimeKnown = () => {
        if(this.state.usersAnime != null && this.state.usersAnime.checkedList.length > 0){
            var anime = this.state.usersAnime.checkedList
            var username = this.state.usersAnime.displayName;
            var animeToRender = []
            for (var i = 0; i < anime.length; i ++){
                if(i % 4 == 2){break}
                if (anime[i+3] != null){
                    animeToRender.push(
                        <View style={{flexDirection:'row', width:'100%', backgroundColor:'violet', backgroundColor:'#000',  opacity: .5}}>
                                <Image source={{uri: anime[i].animeData.imgUri}} style={{width:screenWidth * 0.25, height:screenWidth * 0.25}}/>
                                <Image source={{uri: anime[i+1].animeData.imgUri}} style={{width:screenWidth * 0.25, height:screenWidth * 0.25}}/>
                                <Image source={{uri: anime[i+2].animeData.imgUri}} style={{width:screenWidth * 0.25, height:screenWidth * 0.25}}/>
                                <Image source={{uri: anime[i+3].animeData.imgUri}} style={{width:screenWidth * 0.25, height:screenWidth * 0.25}}/>
                        </View>
                    )
                    i += 2
                }
            }
            return (<TouchableOpacity style={{paddingTop: 10, paddingBottom:20}}>
                        {animeToRender}
                        <View style={{position:'absolute', bottom:20, top:10, right:0, left:0, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{fontFamily: "Wintersoul", fontSize: 35, color:'white', textAlign: 'center'}}>{"Scopri gli anime visti da \n" + username}</Text>
                        </View>
                    </TouchableOpacity>)

            
        } else {
            return null
        }
    }

    createHomeView = () => {
        var compView = []
        var animeUserToKnow;
        if(this.state.checkedList.length > 0){
            compView.push(<UserAnimeFlatList oAnime={this.state.checkedList[0].checkedList}
                sGenres="Lista anime visti"
                onPress={this.openAnimeDetails}/>)
        }
        if(this.state.promiseArr.length > 0){
            compView.push(<AnimeFlatList pAnime={this.state.promiseArr[0]} sGenres={this.state.genToRender[0]}
                    onPress={this.openAnimeDetails}/>)
        }
        
        if(this.state.toBeCheckedList.length > 0){
            compView.push(<UserAnimeFlatList oAnime={this.state.toBeCheckedList[0].toBeCheckedList}
                sGenres="Lista anime da vedere"
                onPress={this.openAnimeDetails}/>)
        }
        
        if(this.state.promiseArr.length > 1){
            compView.push(<AnimeFlatList pAnime={this.state.promiseArr[1]} sGenres={this.state.genToRender[1]}
                    onPress={this.openAnimeDetails}/>)
        }
        if(this.state.usersAnime != null && this.state.usersAnime.checkedList.length > 0){
            animeUserToKnow = this.createUserAnimeKnown()
            compView.push(animeUserToKnow)
        }
        if(this.state.promiseArr.length > 2){
            this.state.promiseArr.map((pAnime, pAnimeIndex) => {
                if(pAnimeIndex > 1){
                    compView.push(<AnimeFlatList pAnime={pAnime} sGenres={this.state.genToRender[pAnimeIndex]}
                    onPress={this.openAnimeDetails}/>)
                }
            })
        }
        return compView
    }

    onRefresh = () => {
        this.setState({refreshing: true, showBusy: true});
        this.fetchAnimeForGenres()
        this.fetchAnimeUser()
    };

    render() {
        return (
        <SafeAreaView style={{flex:1, backgroundColor:'#212121'}}>
            <StatusBar backgroundColor='#212121' barStyle="light-content" translucent
            style={styles.headerStyle}/>
            <HeaderHome heightDimension={this.state.heightDimension} marginTop={getStatusBarHeight()}/>
            
            <ScrollView style={{flex:1}}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}>
                {this.state.showBusy ? <BusyIndicator/> : null}
                <View>
                    {this.createHomeView()}
                </View>
            </ScrollView>
        </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: getStatusBarHeight()
    }
});