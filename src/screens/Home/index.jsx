import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RapidoIcon, SplashLogo} from '../../assets/images';
import {themeColors} from '../../constants/colors';
import axios from 'axios';
import {GOOGLE_MAPS_API_KEY} from '@env';
import GPSModal from './components/GPSModal';
import {findClosestCaptain, generateCaptainData} from '../../utils';
import {Fonts} from '../../constants/fonts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Home = ({navigation, route}) => {
  const mapRef = useRef();
  const destination = route?.params?.details?.geometry?.location || {};
  const formatAddress = route?.params?.details?.formatted_address || '';
  const distanceInKm = route?.params?.distanceInKm || 0;
  const {lat, lng} = destination;

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [riderDetails, setRiderDetails] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('1');

  console.log('selectedVehicle', selectedVehicle);

  console.log('riderDetails', riderDetails);

  const RidersData = [
    {
      id: '1',
      iconName: 'bicycle',
      label: 'Bike',
      distance: distanceInKm,
    },
    {
      id: '2',
      iconName: 'car-sport-outline',
      label: 'Car',
      distance: distanceInKm,
    },
    {
      id: '3',
      iconName: 'car',
      label: 'Auto',
      distance: distanceInKm,
    },
  ];

  // todo: Finding nearby riders (captains)
  const captainData = generateCaptainData(userLocation);

  // todo: Modal Visibility
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

  // todo: Listen to app state changes (foreground/background) ***IMPORTANT***
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('App state:', nextAppState);
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

      if (mapRef) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // todo: Get Address from Coordinates
  useEffect(() => {
    if (userLocation) {
      const fetchAddress = async () => {
        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
          const response = await axios.get(url);
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
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
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

  // todo: Loading State
  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={SplashLogo} style={styles.splash} />
      </View>
    );
  }

  const handleRider = item => {
    setSelectedVehicle(item.id);
    const closestCaptain = findClosestCaptain(userLocation, captainData);
    setRiderDetails(closestCaptain);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          // showsUserLocation={false}
          // showsMyLocationButton={false}
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

          {/* Nearby Riders */}
          {userLocation &&
            captainData?.map((captain, index) => (
              <Marker
                key={captain.id}
                enableFlatMode={true}
                zIndex={0}
                tracksViewChanges={false}
                coordinate={{
                  latitude: captain?.lat,
                  longitude: captain?.long,
                }}>
                <View>
                  <Image source={RapidoIcon} style={styles.riderIcon} />
                </View>
              </Marker>
            ))}

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
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View>
          <FlatList
            data={RidersData}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  item.id === selectedVehicle && {
                    backgroundColor: themeColors.PRIMARY_LIGHT,
                  },
                ]}
                onPress={() => handleRider(item)}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Ionicons
                      name={item?.iconName}
                      size={30}
                      color={themeColors.PRIMARY}
                    />
                  </View>

                  <Text style={styles.label}>{item?.label}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/*  */}
          <View style={styles.searchBar}>
            <FontAwesome5
              name="dot-circle"
              size={17}
              color={themeColors.GREEN}
            />
            <TextInput
              placeholder="Current Location"
              value={currentAddress}
              style={styles.inputStyle}
              multiline={true}
              // editable={false}
            />
          </View>

          {/* Destination */}
          <TouchableOpacity
            style={[styles.searchBar, styles.bottomSearchBar]}
            onPress={() => navigation.navigate('Destination', {userLocation})}>
            <Ionicons name="search" size={17} color={themeColors.GREEN} />
            <TextInput
              value={formatAddress}
              placeholder="Where are you going ?"
              editable={false}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.bottomContainerInner}>
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
        </View> */}
      </View>

      {/* Modal */}
      <GPSModal visible={modalVisible} loading={loading} />
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
    flex: 0.6,
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
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  bottomSearchBar: {
    backgroundColor: themeColors.PRIMARY_BG,
  },
  inputStyle: {
    flex: 1,
    fontSize: 14,
    overflow: 'hidden',
  },
  bottomContainer: {
    flex: 0.4,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  splash: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  riderIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    width: 90,
    borderWidth: 1,
    borderColor: themeColors.PRIMARY,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: themeColors.BLACK,
  },
});
