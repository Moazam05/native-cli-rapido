import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SplashLogo} from '../../assets/images';

const Splash = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={SplashLogo}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
