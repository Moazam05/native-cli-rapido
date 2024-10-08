import React, {useEffect, useState} from 'react';
import {StyleSheet, View, AppState} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {themeColors} from '../../constants/colors';
import DefaultMap from './components/DefaultMap';
import Home from './Home';

const PreHome = () => {
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

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // Use the remove method on the subscription
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
      {locationPermission === 'granted' ? <Home /> : <DefaultMap />}
    </View>
  );
};

export default PreHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.WHITE,
  },
});
