import {GOOGLE_MAPS_API_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {RapidoIcon, SplashLogo} from '../../assets/images';
import {themeColors} from '../../constants/colors';
import {Fonts} from '../../constants/fonts';
import useTypedSelector from '../../hooks/useTypedSelector';
import {selectedAddress, setAddress} from '../../redux/address/addressSlice';
import {
  findClosestCaptain,
  generateCaptainData,
  thousandSeparator,
} from '../../utils';
import GPSModal from './components/GPSModal';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef();
  const dispatch = useDispatch();
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
  const [modalVisible, setModalVisible] = useState(true);
  const [currentAddress, setCurrentAddress] = useState('');
  const [riderDetails, setRiderDetails] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('1');
  // const [captainData, setCaptainData] = useState([]);
  const [cabType, setCabType] = useState('Bike');

  const getCurrentAddress = useTypedSelector(selectedAddress);

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

  function calculateFare(dis, vehicle) {
    const fareRates = {
      Bike: 30,
      Auto: 50,
      Car: 70,
    };

    const fare = dis * fareRates[vehicle];
    return fare.toFixed(0);
  }

  useEffect(() => {
    if (getCurrentAddress?.latitude) {
      setUserLocation(getCurrentAddress);
    }
  }, [getCurrentAddress]);

  // todo: Check location services
  useEffect(() => {
    if (!getCurrentAddress?.latitude) {
      checkLocationServices();
    }
  }, []);

  // todo: Listen to app state changes (foreground/background) ***IMPORTANT***
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active' && !locationEnabled) {
          checkLocationServices();
        }
      },
    );

    return () => appStateListener.remove();
  }, [locationEnabled]);

  // todo: Get Location Coordinates
  const checkLocationServices = useCallback(async () => {
    setLoading(true);

    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      if (location) {
        const newUserLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
        };

        setLocationEnabled(true);
        setLoading(false);
        setModalVisible(false);

        setUserLocation(newUserLocation);
        dispatch(setAddress(newUserLocation));
        AsyncStorage.setItem('userLocation', JSON.stringify(newUserLocation));

        const captains = generateCaptainData(newUserLocation);
        // console.log('Captains generated:', captains);
        // setCaptainData(captains);

        if (mapRef.current && captains.length > 0) {
          const coordinates = [
            newUserLocation,
            ...captains.map(captain => ({
              latitude: captain.lat,
              longitude: captain.long,
            })),
          ];

          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            animated: true,
          });
        }
      }
    } catch (error) {
      setLoading(false);
    }
  }, []);

  // todo: Get Address from Coordinates
  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
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
    if (lat && lng && mapRef.current) {
      const coordinates = [
        {latitude: userLocation?.latitude, longitude: userLocation?.longitude},
        {latitude: lat, longitude: lng},
      ];
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 150, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [lat, lng, userLocation]);

  // todo: Finding nearby riders (captains)
  const captainData = generateCaptainData(userLocation);

  useEffect(() => {
    if (selectedVehicle) {
      const closestCaptain = findClosestCaptain(userLocation, captainData);
      setRiderDetails(closestCaptain);
    }
  }, [selectedVehicle]);

  const handleRider = useCallback(
    item => {
      setSelectedVehicle(item.id);
      setCabType(item.label);
      const closestCaptain = findClosestCaptain(userLocation, captainData);
      setRiderDetails(closestCaptain);
    },
    [userLocation, captainData],
  );

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
          // showsUserLocation={false}
          // showsMyLocationButton={false}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}>
          <Marker coordinate={userLocation} />

          {/* Captain Markers */}
          {captainData.map(captain => (
            <Marker
              key={captain.id}
              icon={RapidoIcon}
              coordinate={{
                latitude: captain.lat,
                longitude: captain.long,
              }}
            />
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
            <MapViewDirections
              origin={userLocation}
              destination={{latitude: lat, longitude: lng}}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor={themeColors.PRIMARY}
            />
          )}
        </MapView>

        {/* Menu icon */}
        <View style={styles.searchBarContainer}>
          <View style={styles.menuButton}>
            <Ionicons name="menu" size={22} color={themeColors.GRAY} />
          </View>
        </View>

        {/* current location */}
        <View style={styles.currentLocation}>
          <FontAwesome6
            name="location-arrow"
            size={22}
            color={themeColors.PRIMARY}
            onPress={() => {
              mapRef.current.animateToRegion(
                {
                  ...userLocation,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.015,
                },
                1000,
              );
            }}
          />
        </View>
      </View>

      <View
        style={[
          styles.bottomContainer,
          destination && styles.bottomContainerTwo,
        ]}>
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
                <View style={styles.vehicleCard}>
                  <Ionicons
                    name={item?.iconName}
                    size={30}
                    color={themeColors.PRIMARY}
                  />

                  <Text style={styles.label}>{item?.label}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Current Location */}
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
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          {/* Destination */}
          <TouchableOpacity
            style={[styles.searchBar, styles.bottomSearchBar]}
            onPress={() => navigation.navigate('Destination', {userLocation})}>
            <Ionicons name="search" size={17} color={themeColors.BLACK} />

            <TextInput
              value={formatAddress}
              placeholder="Where are you going ?"
              editable={false}
              selectTextOnFocus={false}
              onFocus={() => navigation.navigate('Destination', {userLocation})}
              style={styles.whereto}
            />
          </TouchableOpacity>

          {destination?.lat && (
            <View style={styles.captainCard}>
              <Text style={styles.cardTitle}>Captain Details</Text>
              <View style={styles.cardContent}>
                <Image
                  source={{
                    uri:
                      riderDetails?.image ||
                      'https://avatars.githubusercontent.com/u/37184529',
                  }}
                  style={styles.captionIcon}
                />
                <View style={styles.cardInfo}>
                  <View style={styles.cardWrap}>
                    <View>
                      <Text style={styles.cardName}>{riderDetails?.name}</Text>
                      <Text style={styles.cardPhone}>
                        {riderDetails?.phone}
                      </Text>
                    </View>
                    <View style={styles.priceWrap}>
                      <Text
                        style={
                          (styles.priceTitle,
                          {
                            fontSize: 15,
                            fontFamily: Fonts.REGULAR,
                          })
                        }>
                        Price
                      </Text>
                      <Text style={styles.priceTitle}>
                        Rs.{' '}
                        {thousandSeparator(
                          calculateFare(distanceInKm, cabType),
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Modal */}
      {!getCurrentAddress?.latitude && (
        <GPSModal visible={modalVisible} loading={loading} />
      )}
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
    flex: 0.55,
  },
  bottomContainer: {
    flex: 0.45,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  bottomContainerTwo: {
    flex: 0.5,
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
  vehicleCard: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  whereto: {
    color: themeColors.BLACK,
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
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  bottomSearchBar: {
    backgroundColor: themeColors.PRIMARY_BG,
    paddingHorizontal: 15,
  },
  inputStyle: {
    flex: 1,
    fontSize: 14,
    overflow: 'hidden',
    color: themeColors.BLACK,
  },

  splash: {
    width: '100%',
    height: 150,
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
  currentLocation: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.WHITE,
    padding: 10,
    borderRadius: 10,
    shadowColor: themeColors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: themeColors.BLACK,
  },
  cardWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceWrap: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceTitle: {
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 16,
    color: themeColors.BLACK,
  },
  captainCard: {
    backgroundColor: themeColors.WHITE,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.SEMIBOLD,
    color: themeColors.BLACK,
    marginBottom: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    color: themeColors.BLACK,
    marginBottom: 5,
  },
  cardPhone: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: themeColors.GRAY,
  },
});
