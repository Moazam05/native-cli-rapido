import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import {themeColors} from '../../constants/colors';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const HomeNew = () => {
  const mapRef = useRef();
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
    if (locationPermission === 'denied') {
      const timeoutId = setTimeout(async () => {
        const requestedPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        setLocationPermission(requestedPermission);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [locationPermission]);

  return (
    <View style={styles.container}>
      {locationPermission === 'granted' ? (
        <Text>Permission granted</Text>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
          />
        </MapView>
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
  map: {
    flex: 1,
  },
});
