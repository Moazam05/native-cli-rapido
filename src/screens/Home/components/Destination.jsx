import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_API_KEY} from '@env';

const Destination = () => {
  return (
    <View style={styles.googlePlacesContainer}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        styles={styles.googlePlaces}
        onFail={error => console.error('Google Places Error:', error)}
      />
    </View>
  );
};

export default Destination;

const styles = StyleSheet.create({
  googlePlacesContainer: {
    flex: 1,
    padding: 10,
  },
  googlePlaces: {
    container: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#d3d3d3',
      borderRadius: 5,
    },
    textInputContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    textInput: {
      height: 40,
      margin: 0,
      padding: 0,
      backgroundColor: 'white',
      borderColor: '#d3d3d3',
      borderWidth: 1,
      borderRadius: 5,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
});
