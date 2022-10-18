import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import { TabView, SceneMap, TabBar, TabViewAnimated } from 'react-native-tab-view';

import PlotDetails from '../components/PlotDetails';
import InfoDetails from '../components/InfoDetails';
import RateCommentsDetails from '../components/RateCommentsDetails';

const TabLayout = props => {

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'info', title: 'Info' },
        { key: 'plot', title: 'Trama' },
        { key: 'rate', title: 'Recensioni' },
    ]);

    const Information = () => (
        <InfoDetails oAnime={props.oAnime}/>
    );
      
    const Plot = () => (
        <PlotDetails oAnime={props.oAnime}/>
    );

    const RateComments = () => (
        <RateCommentsDetails oAnime={props.oAnime} screenWidth={props.screenWidth}
         animeId={props.animeId} screenHeight={props.screenHeight} loadRatings={props.loadRatings}
         insertRatingsComment={props.insertRatingsComment} ratingsComments={props.ratingsComments}/>
    )
    
    const initialLayout = { width: Dimensions.get('window').width};
      
    const renderScene = SceneMap({
        info: Information,
        plot: Plot,
        rate: RateComments,
    });

    const renderTabBar = props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#696969' }}
          style={{ backgroundColor: '#212121' }}
        />
    );
    
    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    );
};

const styles = StyleSheet.create({
    
});

export default TabLayout;