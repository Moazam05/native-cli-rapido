import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SplashLogo} from '../../assets/images';
import {themeColors} from '../../constants/colors';
import axios from 'axios';
import {GOOGLE_MAPS_API_KEY} from '@env';
import RideOption from './components/RideOption';

const Home = ({navigation, route}) => {
  const mapRef = useRef();
  const destination = route?.params?.details?.geometry?.location || {};
  const formatAddress = route?.params?.details?.formatted_address || '';
  const distanceInKm = route?.params?.distanceInKm || 0;
  const {lat, lng} = destination;

  const [userLocation, setUserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [locationPermission, setLocationPermission] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');

  console.log('locationPermission:', locationPermission);

  const getLocation = async () => {
    if (locationPermission === 'granted') {
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

        if (mapRef) {
          mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          });
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
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
        // default location
        setUserLocation({
          latitude: 37.78825,
          longitude: -122.4324,
        });
      }

      if (locationPermission === 'granted') {
        getLocation();
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const fetchAddress = async () => {
        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
          const response = await axios.get(url);
          // console.log(response.data.results[0]?.formatted_address);
          if (response) {
            const address = response.data.results[0]?.formatted_address;
            setCurrentAddress(address);
          }
        } catch (error) {
          console.error('Error getting address:', error);
        }
      };

      fetchAddress();
    }
  }, [userLocation]);

  useEffect(() => {
    if ((lat, lng)) {
      const coordinates = [
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        {
          latitude: lat,
          longitude: lng,
        },
      ];
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 150, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [lat, lng, currentAddress]);

  console.log('userLocation:', userLocation);

  // todo: Loading State
  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={SplashLogo} style={styles.splash} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={false}
          showsMyLocationButton={false}
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

          {/* Destination Marker */}
          {lat && lng && (
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              pinColor={themeColors.GREEN}
            />
          )}

          {/* Polyline */}
          {lat && lng && (
            <Polyline
              coordinates={[
                {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
                {
                  latitude: lat,
                  longitude: lng,
                },
              ]}
              strokeColor="#238C23"
              strokeWidth={1.7}
            />
          )}
        </MapView>

        <View style={styles.searchBarContainer}>
          <View style={styles.menuButton}>
            <Ionicons name="menu" size={22} color={themeColors.GRAY} />
          </View>

          <View style={styles.searchBar}>
            <FontAwesome name="circle-o" size={17} color={themeColors.GREEN} />
            <TextInput
              placeholder="Current Location"
              value={currentAddress}
              style={styles.inputStyle}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerInner}>
          <TouchableOpacity
            style={styles.bottomBar}
            onPress={() => navigation.navigate('Destination', {userLocation})}>
            <Ionicons name="search" size={19} color={themeColors.BLACK} />
            <TextInput
              value={formatAddress}
              placeholder="Where are you going ?"
              editable={false}
              style={styles.destinationInput}
            />
          </TouchableOpacity>

          <View style={styles.inputStyle}>
            <RideOption
              iconName="bicycle"
              label="Bike"
              distance={distanceInKm}
            />
            <RideOption
              iconName="car-sport-outline"
              label="Car"
              distance={distanceInKm}
            />
            <RideOption iconName="car" label="Auto" distance={distanceInKm} />
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
  inputStyle: {
    flex: 1,
  },
  destinationInput: {
    backgroundColor: themeColors.WHITE,
    flex: 1,
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
  splash: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
});
