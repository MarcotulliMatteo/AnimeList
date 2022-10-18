import React from 'react';
import {StyleSheet, View, Button} from 'react-native';

import dataAnime from '../data/insert/compleatAnimeList.json';
import escape from '../data/insert/escape.json';
import genListFile from '../data/insert/genresTran.json';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const LoadData = props => {

    insertData = () => {
        ref = firebase.firestore();

        var aAnimeName = []
        var oAnimeItem = null
        var aAnimeMapped = []
        aGenListTot = []
        dataAnime.data.map( oAnime => {
            var desc = ""
            var plot = ""
            var name = ""
            var genres = []
            desc = this.escapeUtf8(oAnime.desc)
            plot = this.escapeUtf8(oAnime.plot)
            name = this.escapeUtf8(oAnime.name)
            genres= this.formatGenres(oAnime.genres)
            aGenListTot = [...aGenListTot, ...genres]

            oAnimeItem = {
                "name": name,
                "desc": desc,
                "plot": plot,
                "episodes": oAnime.episodes,
                "complete": oAnime.complete,
                "genres": genres,
                "href": oAnime.href,
                "lang": oAnime.lang,
                "date": parseInt(oAnime.date),
                "imgUri": oAnime.imgUri,
                "totalRating": 0,
                "ratingComments":[]
            }
            aAnimeMapped.push(oAnimeItem)
        })
        aAnimeMapped.map(elem => {
            if(!aAnimeName.includes(elem.name)){
                aAnimeName.push(elem.name)
                ref.collection('anime').add({
                    name: elem.name,
                    desc: elem.desc,
                    plot: elem.plot,
                    episodes: elem.episodes,
                    complete: elem.complete,
                    genres: elem.genres,
                    href: elem.href,
                    lang: elem.lang,
                    date: elem.date,
                    imgUri: elem.imgUri,
                    totalRating: elem.totalRating,
                    ratingComments: elem.ratingComments,
                }).then(function(docRef) {
                    console.log("Anime written with ID: ", docRef.id);
                    ref.collection('ratings').doc(docRef.id).set({
                        "ratingComments": [],
                    }).then(function(ratRef){
                        console.log("Rating written with ID: ", ratRef.id);
                    }).catch(function(errorRat) {
                        console.error("Error adding document: ", errorRat);
                    });
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }
        })
        console.log(aAnimeMapped)
        console.log(aGenListTot)
    }

    formatGenres = (data) => {
        var dataFinal = []
        data.map(gen => {
            gen = gen.toLocaleLowerCase().trim().split('-').join(' ')
            if(genListFile[gen] != undefined){
                if(Array.isArray(genListFile[gen.toLocaleLowerCase()])){
                    dataFinal.push(...dataFinal,...genListFile[gen])
                } else {
                    dataFinal.push(...dataFinal,genListFile[gen])
                }
            }else{
                dataFinal.push(gen)
            }
        })
        return dataFinal
    }

    escapeUtf8 = (data) => {
        Object.keys(escape).forEach( key => {
            data = data.split(key).join(escape[key])
        })
        return data
    }

    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Button onPress={this.insertData} title="Load Data"></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    
});

export default LoadData;