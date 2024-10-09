import {GOOGLE_MAPS_API_KEY} from '@env';
import {getDistance} from 'geolib';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themeColors} from '../../../constants/colors';
import {Fonts} from '../../../constants/fonts';

const Destination = ({navigation, route}) => {
  const userLocation = route?.params?.userLocation || {};

  const handlePlaceClick = (data, details = null) => {
    const geometry = details?.geometry;
    if (!geometry) {
      return;
    }

    const {lat, lng} = geometry.location;
    const destination = {latitude: lat, longitude: lng};
    const distanceInKm = getDistance(userLocation, destination) / 1000;

    if (distanceInKm >= 50) {
      Toast.show({
        type: 'error',
        text1: 'Destination is too far',
        position: 'bottom',
      });
    } else {
      navigation.navigate('Home', {details, distanceInKm});
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color={themeColors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.title}>Enter Route</Text>
      </View> */}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color={themeColors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.title}>Enter Route</Text>
        <Text style={styles.h}>Hide</Text>
      </View>

      <View style={styles.googlePlacesContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          //   onPress={(data, details = null) => {
          // console.log('Google Places Data', data, details);
          //     navigation.navigate('Home', {details});
          //   }}
          onPress={handlePlaceClick}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
          }}
          styles={styles.googlePlaces}
          onFail={error => console.error('Google Places Error:', error)}
          fetchDetails
        />
      </View>
    </View>
  );
};

export default Destination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  googlePlacesContainer: {
    flex: 1,
    marginTop: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontFamily: Fonts.SEMIBOLD,
    color: themeColors.BLACK,
  },
  h: {
    opacity: 0,
  },

  googlePlaces: {
    container: {
      backgroundColor: themeColors.WHITE,
      borderColor: '#d3d3d3',
      borderRadius: 5,
    },
    textInputContainer: {
      backgroundColor: themeColors.WHITE,
      borderRadius: 5,
      paddingBottom: 10,
    },
    textInput: {
      height: 40,
      margin: 0,
      padding: 0,
      backgroundColor: themeColors.WHITE,
      borderColor: '#d3d3d3',
      borderWidth: 1,
      borderRadius: 5,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: Fonts.SEMIBOLD,
    color: themeColors.BLACK,
    textAlign: 'center',
    flex: 1,
  },
});
