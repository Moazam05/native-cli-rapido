import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {themeColors} from '../../constants/colors';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import {SplashLogo} from '../../assets/images';

const Home = () => {
  const [userLocation, setUserLocation] = useState(null); // Initially null to show loading state
  const [locationPermission, setLocationPermission] = useState(null);
  const [searchInput, setSearchInput] = useState(''); // For TextInput value

  useEffect(() => {
    const checkLocationPermission = async () => {
      const fineLocation = await check(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      const coarseLocation = await check(
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      );

      if (
        fineLocation === 'undetermined' ||
        coarseLocation === 'undetermined'
      ) {
        const requestedPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        setLocationPermission(requestedPermission);
      } else if (fineLocation === 'granted' || coarseLocation === 'granted') {
        setLocationPermission('granted');
      } else {
        setLocationPermission(fineLocation);
      }
    };

    checkLocationPermission(); // Moved inside useEffect so it runs once after component mounts
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      if (locationPermission === 'granted') {
        // Only fetch location if permission is granted
        try {
          const location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }
    };

    getLocation();
  }, [locationPermission]);

  if (!userLocation) {
    // Optional: Render loading UI while fetching location
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={SplashLogo}
          styles={{
            width: '100%',
            height: 100,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButtons
          initialRegion={{
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
            }}
          />
        </MapView>

        <View style={styles.searchBarContainer}>
          <View style={styles.menuButton}>
            <Ionicons name="menu" size={22} color={themeColors.GRAY} />
          </View>

          <View style={styles.searchBar}>
            <FontAwesome name="circle-o" size={17} color={themeColors.GREEN} />
            <TextInput
              value={searchInput}
              placeholder="Current Location"
              onChangeText={setSearchInput}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerInner}>
          <View style={styles.bottomBar}>
            <Ionicons name="search" size={19} color={themeColors.BLACK} />
            <TextInput
              value={searchInput}
              placeholder="Where are you going ?"
              onChangeText={setSearchInput}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.WHITE,
  },
  mapContainer: {
    flex: 0.7,
  },
  map: {
    flex: 1,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 25,
    right: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuButton: {
    backgroundColor: themeColors.WHITE,
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: themeColors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBar: {
    backgroundColor: themeColors.WHITE,
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bottomContainer: {
    flex: 0.3,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  bottomContainerInner: {
    backgroundColor: '#E7E7E7',
    height: '100%',
    borderRadius: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.WHITE,
    marginHorizontal: 15,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    gap: 10,
  },
});
