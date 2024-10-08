import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, Platform, Linking} from 'react-native';
import GetLocation from 'react-native-get-location';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const HomeTwo = () => {
  const [location, setLocation] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    checkGPSEnabledStatus();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      handlePermission(granted);
    }
  };

  const handlePermission = granted => {
    if (granted === RESULTS.GRANTED) {
      if (gpsEnabled) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location => {
            setLocation(location);
          })
          .catch(error => {
            handleLocationError(error.code);
          });
      }
    } else {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to access your location.',
      );
    }
  };

  const checkGPSEnabledStatus = async () => {
    GetLocation.getServiceStatus({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(status => {
        setGpsEnabled(status);
        if (status) {
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(location => {
              setLocation(location);
            })
            .catch(error => {
              handleLocationError(error.code);
            });
        }
      })
      .catch(error => {
        handleLocationError(error.code);
      });
  };

  const promptToEnableGPS = () => {
    Alert.alert(
      'GPS Disabled',
      'Your GPS is turned off. Do you want to enable it?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => openGPSSettings(),
        },
      ],
      {cancelable: false},
    );
  };

  const openGPSSettings = async () => {
    if (Platform.OS === 'android') {
      const url = 'android.settings.LOCATION_SOURCE_SETTINGS';
      await Linking.sendIntent(url);
    }
  };

  const handleLocationError = code => {
    if (code === 'TIMEOUT') {
      Alert.alert('Location Timeout', 'The request timed out. Try again.');
    } else if (code === 'UNAUTHORIZED') {
      Alert.alert('Permission Error', 'Location permission is not granted.');
    } else {
      Alert.alert('Error', 'An error occurred while fetching location.');
    }
  };

  return (
    <View>
      <Text>HomeTwo</Text>
      {location ? (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text>Fetching location...</Text>
      )}
      {gpsEnabled ? null : (
        <Button title="Enable GPS" onPress={promptToEnableGPS} />
      )}
      <Button title="Get Location" onPress={checkGPSEnabledStatus} />
    </View>
  );
};

export default HomeTwo;
