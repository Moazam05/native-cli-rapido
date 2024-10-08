import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  Button,
  Linking,
  Platform,
  Text,
  View,
} from 'react-native';
import GetLocation from 'react-native-get-location';

const LocationService = () => {
  const [locationEnabled, setLocationEnabled] = useState(false); // Whether location services are enabled
  const [appState, setAppState] = useState(AppState.currentState); // App state to detect when returning from GPS settings
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      console.log('Location:', location);
      if (location) {
        setLocationEnabled(true);
        setLoading(false);

        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    } catch (error) {
      setLoading(false);
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text>
            Location services are{' '}
            {locationEnabled ? 'enabled' : 'disabled. Please enable GPS.'}
          </Text>
          {!locationEnabled && (
            <Button
              title="Enable Location Services"
              onPress={openGPSSettings}
            />
          )}
        </>
      )}
    </View>
  );
};

export default LocationService;
