import React, {useEffect, useState} from 'react';
import {AppState, View} from 'react-native';
import GetLocation from 'react-native-get-location';
import GPSModal from './components/GPSModal';

const LocationService = () => {
  const [locationEnabled, setLocationEnabled] = useState(false); // Whether location services are enabled
  const [appState, setAppState] = useState(AppState.currentState); // App state to detect when returning from GPS settings
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (locationEnabled) {
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  }, [locationEnabled]);

  // todo: Check location services
  useEffect(() => {
    checkLocationServices();
  }, []);

  // todo: Listen to app state changes (foreground/background)
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('App state:', nextAppState);
        setAppState(nextAppState);
        if (nextAppState === 'active') {
          checkLocationServices(); // todo
        }
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  // todo: Get Location Coordinates
  const checkLocationServices = async () => {
    setLoading(true);

    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      if (location) {
        setLocationEnabled(true);
        setLoading(false);
        setModalVisible(false);

        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Modal */}
      <GPSModal visible={modalVisible} loading={loading} />
    </View>
  );
};

export default LocationService;
