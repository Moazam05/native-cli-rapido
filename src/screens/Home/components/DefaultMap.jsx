import React, {useRef} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {themeColors} from '../../../constants/colors';

const DefaultMap = () => {
  const mapRef = useRef();

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
          />
        </MapView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Linking.openSettings();
          }}>
          <Text style={styles.buttonText}>Enable GPS APP Permission</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DefaultMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.WHITE,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
    position: 'relative',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: themeColors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    left: 20,
  },
  buttonText: {
    color: themeColors.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
