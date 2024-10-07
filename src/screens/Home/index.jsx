import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {themeColors} from '../../constants/colors';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

        <View style={styles.searchBarContainer}>
          <View style={styles.menuButton}>
            <Ionicons name="menu" size={25} color={themeColors.GRAY} />
          </View>

          <View style={styles.searchBar}>
            <TextInput value="" placeholder="Current Location" />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    top: 30,
    right: 20,
    left: 20,
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
  },
  bottomContainer: {
    flex: 0.3,
  },
});
