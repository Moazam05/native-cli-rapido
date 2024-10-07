import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {themeColors} from '../../constants/colors';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const Home = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.WHITE,
      }}>
      <MapView
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
