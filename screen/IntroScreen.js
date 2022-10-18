import React from 'react';
import {View, Text, Dimensions, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import AppIntroSlider from 'react-native-app-intro-slider';
import BusyIndicator from '../components/BusyIndicator';

import GoogleLogin from 'react-native-vector-icons/Ionicons';
import FacebookLogin from 'react-native-vector-icons/MaterialCommunityIcons';

import AnimeItem from '../components/AnimeItem';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default class IntroScreen extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore();
    };
    
    state = {
        heightDimension:  screenHeight - screenHeight * 0.87 - getStatusBarHeight(),
        animeToRender: 60,
        genresColorList:{
            "azione":false,
            "avventura":false,
            "horror":false,
            "shojo":false,
            "fantascienza":false,
            "sportivo":false,
            "slice of life":false,
            "dramma":false,
            "commedia":false,
            "psicologico":false,
            "umoristico":false,
            "thriller":false,
            "harem":false,
            "isekai":false,
            "scolastico":false,
            "giochi":false,
            "magia":false,
            "apocalittico":false,
            "fantasy":false,
            "soprannaturale":false,
            "arti marziali":false
        },
        promiseArr: [],
        selectedAnime: [],
        userData: null,
        globalCount: 0,
        aAnimeToRander: [],
        aAnime: [],
        loginDone: false,
        arrGen: [],
        selectedAnimeID: [],
        showBusy: true
    }

    slides = [
        {
          key: 'screen1',
          title: 'Benvenuto in Anime List !',
          text: 'Trova anime da vedere e parlane con altri utenti.\n Scopri gli anime piu seguiti dalla community.',
        },
        {
          key: 'scree2',
          title: 'Registrati !',
          text: 'Effettua la registrazione con Facebook o Google',
          loginIcon: true,
        },
        {
          key: 'screen3',
          title: 'Aggiungi anime alla lista',
          text: 'Aggiungi alcuni anime che hai visto alla tua lista,\ncosi ti possiamo aiutare a scoprire nuovi anime e persone con i tuoi stessi intressi.',
          renderAnime: true,
        },
        {
          key: 'screen4',
          title: 'Grazie e buon diverimento !',
        }
    ];

    static navigationOptions = {
        headerShown: false
    };

    componentDidMount = () => {
        this.getCurrentUser();
        this.fetchAnime();
    }

    isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        isSignedIn ? this.props.navigation.navigate('Home') : this.props.navigation.navigate('Auth');
    };

    getCurrentUser = async () => {
        const isSignedInGoogle = await GoogleSignin.isSignedIn();
        const isSignedInFacebook = await AccessToken.getCurrentAccessToken();
        if(isSignedInGoogle){
            const currentUser = firebase.auth().currentUser;
            if(currentUser){
                const userUID = currentUser._user.uid;
                this.ref.collection('users').where("userUID", "==", userUID).get().then( async(aUsers) => {
                    if(aUsers._docs.length > 0){
                        try {
                            const value = await AsyncStorage.getItem('@storage_userData' + aUsers._docs.uid);
                            if (value == null){
                                this._storeLocalUserData(aUsers._docs)
                            }
                            this.props.navigation.navigate('Home', aUsers._docs);
                        } catch (error) {
                            // Error retrieving data
                            console.log(error)
                        }
                    }
                });
            }
        } else if (isSignedInFacebook) {
            const currentUser = firebase.auth().currentUser;
            if(currentUser){
                const userUID = currentUser._user.uid;
                this.ref.collection('users').where("userUID", "==", userUID).get().then(async(aUsers) => {
                    if(aUsers._docs.length > 0){
                        try {
                            const value = await AsyncStorage.getItem('@storage_userData' + aUsers._docs.uid);
                            if (value == null){
                                this._storeLocalUserData(aUsers._docs)
                            }
                            this.props.navigation.navigate('Home', aUsers._docs);
                        } catch (error) {
                            // Error retrieving data
                            console.log(error)
                        }
                    }
                });
            }
        } else {
            this.setState({showBusy: false})
        }
    };

    doLoginFacebook = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email'])
         .then((result) => {
            AccessToken.getCurrentAccessToken().then(data => {
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                firebase.auth().signInWithCredential(credential).then(user => {
                    var userData = {
                        userUID : user.user._user.uid,
                        userEmail : user.user._user.email,
                        imgURL : user.user._user.photoURL,
                        displayName : user.user._user.displayName,
                        checkedList : [],
                        toBeCheckedList : [],
                        preferedGenres : []
                    }
                    this.state.userData = userData;
                    this.ref.collection('users').where("userUID", "==", userData.userUID).get().then((aUsers) => {
                        if(aUsers._docs.length > 0){
                            this.props.navigation.navigate('Home', userData)
                        }else{
                            if(this.state.aAnimeToRander.length == 0){
                                this.setState({showBusy: true})
                                this.fetchAnime();
                            }
                            this.ref.collection('users').doc(userData.userUID).set(userData)
                            this._storeLocalUserData(userData)
                            this._nextPressed(2)
                            this.state.loginDone = true
                            
                        }
                    });
                })
            }).catch(err => {
                console.log('Something went wrong obtaining access token: ' + err );
            })
         }).catch(error => {
            if (error.isCancelled) {
                console.log('User cancelled the login process');
            }
         })
    }

    doLoginGoogle = () => {
        GoogleSignin.signIn()
          .then((data) => {
    
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
            return firebase.auth().signInWithCredential(credential);
          })
          .then((user) => {
            
            user.user.getIdToken().then(sToken =>{
              var userData = {
                userUID : user.user._user.uid,
                userEmail : user.user._user.email,
                imgURL : user.user._user.photoURL,
                displayName : user.user._user.displayName,
                checkedList : [],
                toBeCheckedList : [],
                preferedGenres : []
              }
              this.state.userData = userData;
              this.ref.collection('users').where("userUID", "==", userData.userUID).get().then((aUsers) => {
                if(aUsers._docs.length > 0){
                    this.props.navigation.navigate('Home', userData)
                }else{
                    if(this.state.aAnimeToRander.length == 0){
                        this.setState({showBusy: true})
                        this.fetchAnime();
                    }
                    this.ref.collection('users').doc(userData.userUID).set(userData)
                    this._storeLocalUserData(userData)
                    this._nextPressed(2)
                }
              });
              
            });
          })
          .catch((error) => {
            const { code, message } = error;
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          });
    };

    _storeLocalUserData = async (data) => {
        try {
            var userID = data.userUID
            data = JSON.stringify(data)
            await AsyncStorage.setItem('@storage_userData' + userID, data);
        } catch (error) {
            console.log("Store data Failed: " + error)
        }
    };

    fetchAnime = () => {
        this.ref.collection("anime").orderBy("date", "desc").limit(this.state.animeToRender).get().then(oAnime => {
            var totAnimeList = []
            var oAnimeList = null
            oAnime.docs.map(oAnimeItem => {
                if(oAnimeItem.data().imgUri != "https:"
                     && oAnimeItem.data().imgUri != "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Folder_Hexagonal_Icon.svg/16px-Folder_Hexagonal_Icon.svg.png"
                     && oAnimeItem.data().imgUri !="https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/50px-Question_book-new.svg.png"
                     && oAnimeItem.data().imgUri != "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Ambox_important.svg/40px-Ambox_important.svg.png")
                    {
                        oAnimeList = {
                            "id": oAnimeItem.id,
                            "data": oAnimeItem.data()
                        }
                        totAnimeList.push(oAnimeList)
                }
                this.renderAnimeView(totAnimeList)
            })
        })
    }

    _onDone = async() => {
        var preferedGenres = this.countGenOccurrency()

        this.ref.collection('users').doc(this.state.userData.userUID).update({checkedList: this.state.selectedAnime, preferedGenres: preferedGenres});
        const currentUser = firebase.auth().currentUser;
        if(currentUser){
            const userUID = currentUser._user.uid;
            const sLocalUserData = await AsyncStorage.getItem('@storage_userData' + userUID);
            oLocalUserData = JSON.parse(sLocalUserData)
            if(oLocalUserData != null || oLocalUserData.preferedGenres.length == 0){
                oLocalUserData.checkedList = this.state.selectedAnime;
                oLocalUserData.preferedGenres = preferedGenres;
                this._storeLocalUserData(oLocalUserData);
            }
        }
        this.props.navigation.navigate("Home");
    }

    countGenOccurrency = () => {
        var preferedGenres = []
        this.state.selectedAnime.map(anime => {
            if (anime.animeData.genres.length > 0 && anime.animeData.genres[0] != ""){
                preferedGenres = [...preferedGenres, ...anime.animeData.genres]
            }
        });
        var s = preferedGenres.reduce(function(m,v){
            m[v] = (m[v]||0)+1; return m;
          }, {});
        var a = [];
        for (k in s) a.push({k:k,n:s[k]});
        a.sort(function(a,b){ return b.n-a.n });
        a = a.map(function(a) { return a.k });
        return a;
    }

    onSlideChange = (index, previousIndex) => {
        if(index == 2 && previousIndex == 1){
            if(!this.state.loginDone){
                this._nextPressed(1)
            } else {
                this.fetchAnime()
            }
        } else if(index == 1 && previousIndex == 2){
            this.state.aAnimeToRander = []
        }
    }

    selectAnime = (sAnimeId, oAnime) => {
        if(!this.state.selectedAnimeID.includes(sAnimeId)){
            //this.setState({selectedAnime: [...this.state.selectedAnime,sAnimeId]})
            this.state.selectedAnimeID = [...this.state.selectedAnimeID, sAnimeId]
            this.state.selectedAnime = [...this.state.selectedAnime, {"animeID": sAnimeId,"animeData": oAnime}]
        } else {
            var rem = this.state.selectedAnimeID.filter(ele => {
                return ele != sAnimeId
            })
            this.state.selectedAnimeID = rem
        }
    }
    
    renderAnimeView = (aAnime) => {
        var animeToRender = []
        for (var i=0; i < aAnime.length; i++){
            if(aAnime[i+1] != null){     
                animeToRender.push(
                    <View style={{flexDirection:'row', paddingBottom:10}}>
                        <AnimeItem data={aAnime[i].data} docId={aAnime[i].id} onPress={this.selectAnime}/>
                        <AnimeItem data={aAnime[i+1].data} docId={aAnime[i+1].id} onPress={this.selectAnime}/>
                    </View>
                )
                i += 1
            } else {
                animeToRender.push(
                    <View style={{paddingBottom:10}}>
                        <AnimeItem data={aAnime[i].data} docId={aAnime[i].id} onPress={this.selectAnime}/>
                    </View>
                )
            }
        }
        this.setState({aAnimeToRander: animeToRender, showBusy: false})
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{alignItems:'center', justifyContent:'center', flex:1, paddingBottom:100, paddingTop:20}}>
                <View style={{alignItems:'center', justifyContent:'center', paddingBottom: item.text != null ? 40 : 0}}>
                    <Text style={{fontFamily: "Wintersoul",fontSize: 40, color: 'white'}}>{item.title}</Text>
                </View>
            
                <View style={{alignItems:'center', justifyContent:'center', paddingBottom:20}}>
                    <Text style={{fontFamily: "Wintersoul", fontSize: 30, textAlign:'center', color: '#DCDCDC'}}>{item.text}</Text>
                </View>

                {item.loginIcon ? 
                    <View style={{flexDirection:'row', paddingTop:40}}>
                        <View style={{paddingRight: 30}}>
                            <View style={{borderWidth:2, borderRadius: 100/2, borderColor: 'white', paddingLeft: 5, paddingRight: 5}}>
                                <GoogleLogin name="logo-google" size={40} onPress={this.doLoginGoogle.bind(this)} color="white" style={{padding:7}}/>  
                            </View>
                        </View>
                        <View style={{borderWidth:2, borderRadius:200/2, borderColor:'white'}}>
                            <FacebookLogin name="facebook" size={40} onPress={this.doLoginFacebook.bind(this)} color="white" style={{padding:7}}/>
                        </View>
                    </View>
                : null}

                {item.renderAnime ? 
                    <ScrollView style={{width:'100%', padding: 15}}>
                        <View style={{justifyContent:'center', alignItems:'center', paddingBottom: 20}}>
                            {this.state.aAnimeToRander}
                        </View>
                    </ScrollView>
                : null}
            </View>
        );
    }

    _nextPressed = (index) => {
        this.AppIntroSlider.goToSlide(index)
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={{flex:1, backgroundColor:'#212121', paddingTop: getStatusBarHeight()}}>
                <StatusBar backgroundColor='#212121' barStyle="light-content" translucent
                style={styles.headerStyle}/>
                <AppIntroSlider  ref={ref => this.AppIntroSlider = ref} extraData={this.state.aAnimeToRander}
                 renderItem={this._renderItem} onSlideChange={this.onSlideChange} 
                 slides={this.slides} onDone={this._onDone} bottomButton/>

                {this.state.showBusy ? <BusyIndicator/> : null}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: getStatusBarHeight()
    }
});