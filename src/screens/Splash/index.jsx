import {Image, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {SplashLogo} from '../../assets/images';
import {themeColors} from '../../constants/colors';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('PreHome');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themeColors.WHITE} barStyle="dark-content" />
      <Image source={SplashLogo} style={styles.splash} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splash: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
});
