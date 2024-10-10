import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, AppState} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {themeColors} from '../../constants/colors';
import DefaultMap from './components/DefaultMap';

const HomeNew = () => {
  const [locationPermission, setLocationPermission] = useState(null);

  console.log('locationPermission', locationPermission);

  useEffect(() => {
    const handlePermission = async () => {
      const fineLocationStatus = await check(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      const coarseLocationStatus = await check(
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      );

      if (
        fineLocationStatus === 'undetermined' ||
        coarseLocationStatus === 'undetermined'
      ) {
        const requestedPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        setLocationPermission(requestedPermission);
      } else {
        setLocationPermission(
          fineLocationStatus === 'granted' || coarseLocationStatus === 'granted'
            ? 'granted'
            : fineLocationStatus,
        );
      }
    };

    handlePermission();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async state => {
      if (state === 'active') {
        const fineLocationStatus = await check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        const coarseLocationStatus = await check(
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        );

        setLocationPermission(
          fineLocationStatus === 'granted' || coarseLocationStatus === 'granted'
            ? 'granted'
            : fineLocationStatus,
        );
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (locationPermission === 'denied') {
      const timeoutId = setTimeout(async () => {
        const requestedPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        setLocationPermission(requestedPermission);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [locationPermission]);

  return (
    <View style={styles.container}>
      {locationPermission === 'granted' ? (
        <Text>Location Permission Granted</Text>
      ) : (
        <DefaultMap />
      )}
    </View>
  );
};

export default HomeNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.WHITE,
  },
});
