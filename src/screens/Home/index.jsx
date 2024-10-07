import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect} from 'react';
import {themeColors} from '../../constants/colors';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';

const Home = () => {
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 50000,
      maximumAge: 10000,
    })
      .then(location => {
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }, []);

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
            <Ionicons name="menu" size={22} color={themeColors.GRAY} />
          </View>

          <View style={styles.searchBar}>
            <FontAwesome name="circle-o" size={17} color={themeColors.GREEN} />
            <TextInput value="" placeholder="Current Location" />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerInner}>
          <View style={styles.bottomBar}>
            <Ionicons name="search" size={19} color={themeColors.BLACK} />
            <TextInput value="" placeholder="Where are you going ?" />
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
  mapContainer: {
    flex: 0.7,
  },
  map: {
    flex: 1,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 30,
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
