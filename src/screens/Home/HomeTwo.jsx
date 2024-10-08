import React, {useEffect, useState} from 'react';
import {View, Text, Button, Platform, Alert} from 'react-native';
import GetLocation from 'react-native-get-location';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const HomeTwo = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      handlePermission(granted);
    }
  };

  const handlePermission = granted => {
    if (granted === RESULTS.GRANTED) {
      getLocation();
    } else {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to access your location.',
      );
    }
  };

  const getLocation = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setLocation(location);
      })
      .catch(error => {
        const {code, message} = error;
        handleLocationError(code, message);
      });
  };

  const handleLocationError = (code, message) => {
    if (code === 'UNAVAILABLE') {
      Alert.alert(
        'Location Error',
        'Location service is disabled or unavailable.',
      );
    } else if (code === 'TIMEOUT') {
      Alert.alert('Location Timeout', 'The request timed out. Try again.');
    } else if (code === 'UNAUTHORIZED') {
      Alert.alert('Permission Error', 'Location permission is not granted.');
    } else {
      Alert.alert('Error', message);
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
      <Button title="Get Location" onPress={getLocation} />
    </View>
  );
};

export default HomeTwo;
