import React, {useEffect, useState} from 'react';
import {AppState, Button, Linking, Platform, Text, View} from 'react-native';
import GetLocation from 'react-native-get-location';

const LocationService = () => {
  const [locationEnabled, setLocationEnabled] = useState(false); // Whether location services are enabled
  const [appState, setAppState] = useState(AppState.currentState); // App state to detect when returning from GPS settings
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  console.log('locationEnabled', locationEnabled);

  // Check location services when app starts
  useEffect(() => {
    checkLocationServices();
  }, []);

  // Listen to app state changes (foreground/background)
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('App state:', nextAppState);
        setAppState(nextAppState);
        if (nextAppState === 'active') {
          checkLocationServices(); // Recheck location services when the app comes to the foreground
        }
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  // Function to check if location services are enabled
  const checkLocationServices = async () => {
    console.log('Checking location services...');

    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      console.log('Location:', location);
      if (location) {
        setLocationEnabled(true);

        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    } catch (error) {
      //   console.error('Error getting location:', error);
    }
  };

  // Open GPS settings (Android-specific)
  const openGPSSettings = async () => {
    if (Platform.OS === 'android') {
      const url = 'android.settings.LOCATION_SOURCE_SETTINGS';
      await Linking.sendIntent(url);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* Show appropriate message based on location services status */}
      <Text>
        {locationEnabled
          ? 'Location services are enabled.'
          : 'Location services are disabled. Please enable GPS.'}
      </Text>

      {/* Show button if location services are disabled */}
      {!locationEnabled && (
        <Button title="Enable Location Services" onPress={openGPSSettings} />
      )}
    </View>
  );
};

export default LocationService;
