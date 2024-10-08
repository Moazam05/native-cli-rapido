// import {View, Text, Platform, Linking} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import GPSModal from './components/GPSModal';
// import GetLocation from 'react-native-get-location';
// import {check, PERMISSIONS, request} from 'react-native-permissions';
// import {Alert, Button, AppState} from 'react-native';

// const HomeThree = () => {
//   const [visible, setVisible] = useState(true);
//   const [locationPermission, setLocationPermission] = useState(null);
//   const [locationEnabled, setLocationEnabled] = useState(false);
//   const [appState, setAppState] = useState(AppState.currentState);

//   // Handle when the app goes to the background or returns to the foreground
//   useEffect(() => {
//     console.log('App state:', appState);
//     const appStateListener = AppState.addEventListener(
//       'change',
//       nextAppState => {
//         setAppState(nextAppState);
//         if (nextAppState === 'active') {
//           checkLocationServices(); // Check location services when the app comes back to the foreground
//         }
//       },
//     );

//     return () => {
//       appStateListener.remove();
//     };
//   }, []);

//   const checkPermission = async () => {
//     console.log('Checking location permission...');
//     const fineLocation = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//     const coarseLocation = await check(
//       PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
//     );

//     if (fineLocation === 'granted' || coarseLocation === 'granted') {
//       setLocationPermission(true);
//       checkLocationServices(); // Check if location service is enabled after permission is granted
//     } else {
//       setLocationPermission(false);
//     }
//   };

//   const checkLocationServices = () => {
//     console.log('Checking location services...');
//     GetLocation.getCurrentPosition(
//       position => {
//         setLocationEnabled(true); // Location services are enabled
//         console.log(position);
//       },
//       error => {
//         console.log(error.code, error.message);
//         if (error.code === 2) {
//           setLocationEnabled(false); // Location services are disabled
//           Alert.alert(
//             'Location Services Disabled',
//             'Please enable location services to use this feature.',
//             [{text: 'OK', onPress: () => openGPSSettings()}],
//             {cancelable: false},
//           );
//         }
//       },
//     );
//   };

//   const openGPSSettings = async () => {
//     console.log('Opening GPS settings...');
//     if (Platform.OS === 'android') {
//       console.log('Opening andriod GPS settings...');
//       const url = 'android.settings.LOCATION_SOURCE_SETTINGS';
//       await Linking.sendIntent(url);
//     } else if (Platform.OS === 'ios') {
//       Linking.openURL('app-settings:'); // Opens iOS app settings (this will only work if you request permissions before)
//     }
//   };

//   const requestPermission = async () => {
//     console.log('Requesting location permission...');
//     const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//     console.log(permission);
//     if (permission === 'granted') {
//       checkLocationServices(); // If granted, check if location services are enabled
//     } else {
//       setLocationPermission(false);
//     }
//   };

//   useEffect(() => {
//     checkPermission(); // Check the permission on initial load
//   }, []);

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>
//         {locationPermission === null
//           ? 'Checking location permission...'
//           : locationPermission
//           ? locationEnabled
//             ? 'Location services are enabled.'
//             : 'Location services are disabled. Please enable GPS.'
//           : 'Location permission is denied.'}
//       </Text>
//       <Button title="Grant Permission" onPress={openGPSSettings} />
//     </View>
//   );
// };

// export default HomeThree;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  AppState,
  Linking,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import {check, PERMISSIONS, request} from 'react-native-permissions';

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
