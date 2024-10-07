import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {themeColors} from '../../../constants/colors';
import {GOOGLE_MAPS_API_KEY} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../../../constants/fonts';

const Destination = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color={themeColors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Destination</Text>
      </View>

      <View style={styles.googlePlacesContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            // console.log('Google Places Data', data, details);
            navigation.navigate('Home', {details});
          }}
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
