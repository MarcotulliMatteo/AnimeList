import React from 'react';
import {View, Text, Dimensions, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AutoScrolling from "react-native-auto-scrolling";
import Modal, {SlideAnimation, ModalContent, ModalFooter, BottomModal, ModalTitle } from 'react-native-modals';
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/AntDesign';
import Add from 'react-native-vector-icons/MaterialIcons';
import Message from 'react-native-vector-icons/Ionicons';
import Added from 'react-native-vector-icons/Feather';
import Send from 'react-native-vector-icons/Ionicons';

import TabLayout from '../components/TabLayout';
import CommentsItem from '../components/CommentsItem';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import RatingStar from '../components/RatingStar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default class AnimeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore();
    };

    state = {
        animeDetails: null,
        heightDimension: screenHeight - screenHeight * 0.87 - getStatusBarHeight(),
        iconSeen: false,
        iconToBeSeen: false,
        visibleModal: false,
        oMappedComments: null,
        commentText: "",
        animeDetailsID: null,
        defRating: null,
        ratingsComments: [],
        oIconState: null
    }

    static navigationOptions = {
        headerShown: false
    };

    componentDidMount = () => {
        this.setState({"iconSeen": this.state.oIconState.inCheckedList});
        this.setState({"iconToBeSeen": this.state.oIconState.inToBeCheckedList});
        this.loadRatings()
    }

    onComponentMountAgain = () => {
        
    }
    
    componentWillUnmount = () => {
        this.setState({visibleModal: false})
    }

    loadRatings = async() => {
        if(this.state.ratingsComments != []){
            var aRatings = []
            this.ref.collection('ratings').doc(this.state.animeDetailsID).get().then(async(oRatings) => {
                oRatings = oRatings.data()
                await oRatings.ratingComments.map(async(oRatingsItem, oRatingsItemIndex) => {
                    var id = oRatingsItem.userId == '423234' ? "RnOz3FQR26V5b4Hpb20NKjWoExF3": oRatingsItem.userId
                    await this.ref.collection('users').doc(id).get().then(userInfo => {
                        aRatings.push({
                            "text":oRatingsItem.text,
                            "date":oRatingsItem.date.toDate(),
                            "userId":oRatingsItem.userId,
                            "rating":oRatingsItem.rating,
                            "imgURL": userInfo.data().imgURL,
                            "displayName": userInfo.data().displayName
                        })
                    })
                    if(oRatings.ratingComments.length - 1 == oRatingsItemIndex){
                        this.setState({ratingsComments: aRatings})
                    }
                })
            })
        }
    }
    

    insertRatingsComment = (defRating, textRating) => {
        if(defRating == 0 && textRating == "") {return}
        var user = firebase.auth().currentUser;
        
        this.ref.collection('users').doc(user._user.uid).get().then(userInfo => {
            var insertedRating = {
                "text": textRating,
                "date": new Date(),
                "userId": user._user.uid,
                "rating": defRating
            }
            var toBeInserted = [...this.state.ratingsComments, insertedRating]
            this.ref.collection('ratings').doc(this.state.animeDetailsID).update({ratingComments: toBeInserted})

            var realTimeInsert = {
                "text": insertedRating.text,
                "date": insertedRating.date,
                "userId": insertedRating.userId,
                "rating": insertedRating.rating,
                "imgURL": userInfo.data().imgURL,
                "displayName": userInfo.data().displayName
            }
            this.setState({ratingsComments: [...this.state.ratingsComments, realTimeInsert]})
            var totRating = 0
            toBeInserted.map(comment => {
                totRating += comment.rating
            })
            totRating = totRating/toBeInserted.length
            this.ref.collection('anime').doc(this.state.animeDetailsID).update({
                totalRating:totRating
            }).then(function() {
                console.log("Document successfully updated!");
            }).catch(function(error) {
                console.error("Error updating document: ", error);
            });
        })
    }

    episodeFormater = () => {
        var sCompleat = this.state.animeDetails.complete == "true" ? "(completo)" : "";
        var episodes = this.state.animeDetails.episodes === "unico " || this.state.animeDetails.episodes === "1" ? "episodio" : "episodi"
        return String(this.state.animeDetails.episodes + " " + episodes + " " + sCompleat);
    }

    loadComments = () => {
        var aComments = []
        this.ref.collection('comments').where("animeId", "==", this.state.animeDetailsID).get().then( oComments => {
            aComments = oComments.docs
            aCommentsItem = aComments.map(oCommentsItem => {
                return ({
                    "animeId": oCommentsItem._data.animeId,
                    "text": oCommentsItem._data.text,
                    "user": oCommentsItem._data.user,
                    "date": oCommentsItem._data.date.toDate()
                })
            })
            this.setState({oMappedComments:aCommentsItem})
        })
    }

    sendComment = () => {
        console.log(this.state.commentText)
        var data = new Date()
        var user = firebase.auth().currentUser;
        var toBeInserted = {
            "animeId": this.state.animeDetailsID,
            "text": this.state.commentText,
            "user": user._user.uid,
            "date": data
        }
        this.ref.collection('comments').add(toBeInserted)
        this.state.oMappedComments.push(toBeInserted)
        this.setState({commentText: ""})
    }

    addRemoveSeen = async() => {
        this.setState({iconSeen: !this.state.iconSeen})
        const currentUser = firebase.auth().currentUser;
        if(currentUser){
            const userUID = currentUser._user.uid;
            const sUserData = await AsyncStorage.getItem('@storage_userData' + userUID);
            const oUserData = JSON.parse(sUserData);
            var checkList = oUserData.checkedList;
            var exist = false;
            var newCheckList = []
            checkList.map(oAnimeItem => {
                if(oAnimeItem.animeID != this.state.animeDetailsID){
                    newCheckList.push(oAnimeItem) 
                } else {
                    exist = true;
                }
            })
            if(!exist){
                newCheckList.push({
                    "animeData": this.state.animeDetails,
                    "animeID": this.state.animeDetailsID
                })
            }
            if(newCheckList == undefined){
                newCheckList = []
            }
            this.ref.collection('users').doc(userUID).update({
                "checkedList": newCheckList
            })
            var newUserData = oUserData
            newUserData.checkedList = newCheckList
            this._storeLocalUserData(newUserData)
        }
    }

    addRemoveToBeSeen = async() => {
        this.setState({iconToBeSeen: !this.state.iconToBeSeen})
        const currentUser = firebase.auth().currentUser;
        if(currentUser){
            const userUID = currentUser._user.uid;
            const sUserData = await AsyncStorage.getItem('@storage_userData' + userUID);
            const oUserData = JSON.parse(sUserData);
            var toBeCheckedList = oUserData.toBeCheckedList;
            var exist = false;
            var newToBeCheckedList = []
            toBeCheckedList.map(oAnimeItem => {
                if(oAnimeItem.animeID != this.state.animeDetailsID){
                    newToBeCheckedList.push(oAnimeItem) 
                } else {
                    exist = true;
                }
            })
            if(!exist){
                newToBeCheckedList.push({
                    "animeData": this.state.animeDetails,
                    "animeID": this.state.animeDetailsID
                })
            }
            this.ref.collection('users').doc(userUID).update({
                "toBeCheckedList": newToBeCheckedList
            })
            var newUserData = oUserData
            newUserData.toBeCheckedList = newToBeCheckedList;
            this._storeLocalUserData(newUserData)
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


    render() {
        const { navigation } = this.props;
        this.state.animeDetails = navigation.getParam('oAnime', 'NO-ID');
        this.state.animeDetailsID = navigation.getParam('sAnimeID', 'NO-ID');
        this.state.oIconState = navigation.getParam('oIconState', 'NO-ID');


      return (
        <SafeAreaView style={{flex:1, backgroundColor:'#212121'}}>
            <StatusBar backgroundColor='#212121' barStyle="light-content" translucent
             style={styles.headerStyle}/>
            <View style={{flexDirection: 'row', justifyContent: 'center', height: this.state.heightDimension,
                width:'100%', marginTop: getStatusBarHeight(), zIndex: 1, backgroundColor:'#282828', elevation: 5}}>
                    <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',
                     width:'100%', paddingLeft:15}}>
                        <Icon name="arrowleft" size={25} color="white" style={{justifyContent:'flex-start', paddingRight: 10, paddingLeft: 10}}
                         onPress={this.props.navigation.goBack.bind(this, null)}/>
                        <Image source={this.state.animeDetails.imgUri != "https:" ? {uri: this.state.animeDetails.imgUri} : require('../icon/noPhoto.png')}
                         resizeMode='cover' style={{height: screenWidth * 0.1, width: screenWidth * 0.1,
                         borderRadius: 200/2, borderWidth:1, borderColor:'white'}}/>
                        {this.state.animeDetails.name.length > 17 ?
                            <AutoScrolling style={{justifyContent:'center', alignItems:'center', paddingTop:15, paddingLeft: 15}} endPadding={70}
                            duration={10000}>
                                <Text style={{textAlign:'center', color:'white', fontSize:18}}>
                                    {this.state.animeDetails.name}
                                </Text>
                            </AutoScrolling> :
                            <Text style={{textAlign:'center', color:'white', paddingLeft:15, fontSize:18}}>
                                {this.state.animeDetails.name}
                            </Text>
                        }
                    </View>
            </View>

            <ScrollView>
                <View style={{width:'100%', height: screenHeight * 0.25, flexDirection:'row', paddingLeft: 15, paddingRight:10}}>
                    <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
                        <Image source={this.state.animeDetails.imgUri != "https:" ? {uri: this.state.animeDetails.imgUri} : require('../icon/noPhoto.png')}
                        resizeMode='contain' style={{height: screenWidth * 0.4, width: screenWidth * 0.4}}/>
                    </View>
                    <View style={{flex:1.8, justifyContent:'center', paddingLeft:20}}>
                        <Text style={{color:'white', fontSize:17, paddingBottom: 4}}>{this.state.animeDetails.name}</Text>
                        <RatingStar editable={false} defRating={this.state.animeDetails.totalRating}
                         updateRating={() => {}}/>
                        <Text style={{color:'#DCDCDC',  fontSize:16, paddingTop:5}}>{this.episodeFormater()}</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', alignItems:'center', paddingBottom:10, paddingTop: 10}}>
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        {this.state.iconSeen ? 
                            <Add name="playlist-add-check" size={30} color="#00BFA5" onPress={this.addRemoveSeen}/>
                            :
                            <Add name="playlist-add" size={30} color="white" onPress={this.addRemoveSeen}/>
                        }
                        <Text style={{fontSize:11, color:'white', paddingTop:4}}>Lista anime visti</Text>
                    </View>
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        {this.state.iconToBeSeen ? 
                            <Added name="check" size={30} color="#00BFA5" onPress={this.addRemoveToBeSeen}/>                            
                            :
                            <Add name="add" size={30} color="white" onPress={this.addRemoveToBeSeen}/>
                        }
                        <Text style={{fontSize:11, color:'white', paddingTop:4}}>Lista anime da vedere</Text>
                    </View>
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        <Message name="ios-chatbubbles" size={30} color="white" onPress={()=>{this.setState({visibleModal: true})}}/>
                        <Text style={{fontSize:11, color:'white', paddingTop:4}}>Parlane</Text>
                    </View>
                </View>

                <TabLayout oAnime={this.state.animeDetails}
                 animeId={this.state.animeDetailsID} screenHeight={screenHeight} screenWidth={screenWidth}
                 loadRatings={this.loadRatings} insertRatingsComment={this.insertRatingsComment}
                 ratingsComments={this.state.ratingsComments}
                 textRatingUpdate={this.textRatingUpdate} textRating={this.state.textRating}/>
            </ScrollView>

            <BottomModal
                visible={this.state.visibleModal}
                modalAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onTouchOutside={() => {this.setState({visibleModal: false})}}
                onSwipeOut={() => this.setState({ visibleModal: false })}
                avoidKeyboard={true}
                modalAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                height={0.88}
                width={1}
                onShow={this.loadComments.bind(this)}
                modalTitle={
                <Text style={{backgroundColor:'#282828', color:'white', textAlign:'center', fontSize:20, padding:13,
                 elevation: 6}}>Chat</Text>}
            >
                <ModalContent style={{backgroundColor:'#212121', paddingTop: 20}}>
                    <View style={{height:'83%'}}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={this.state.oMappedComments}
                            keyExtractor={item => item.animeId}
                            removeClippedSubviews={true}
                            initialNumToRender={10}
                            maxToRenderPerBatch={10}
                            onScrollEndDrag={() => {}}
                            renderItem={({ item }) => 
                            <CommentsItem screenHeight={screenHeight} text={item.text} 
                             docId={item.animeId} userId={item.user} date={item.date}/>
                            }
                        />
                    </View>
                    
                    <Divider style={{width:'100%', borderColor: '#696969'}} />
                    <View style={{width:'100%', paddingTop:10}}>
                        <View style={{flexDirection:'row', borderRadius:20, borderWidth:1, borderColor:'#696969', width:'100%'}}>
                            <TextInput style={{backgroundColor:'trasparent', flex:4, paddingLeft: 10, color:'white'}}
                                onChangeText={(text) => (this.setState({commentText: text}))}
                                value={this.state.commentText} placeholder="Scrivi un messaggio..." placeholderTextColor={'white'}/>
                            <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center', zIndex:1}} onPress={() => this.sendComment()}>
                                <Send name={"ios-send"} size={25} color={"white"}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: getStatusBarHeight()
    }
});