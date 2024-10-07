import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {themeColors} from '../../constants/colors';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Home = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.WHITE,
      }}>
      <View
        style={{
          flex: 0.7,
        }}>
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

        <View
          style={{
            position: 'absolute',
            top: 30,
            right: 20,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
          }}>
          <View
            style={{
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
            }}>
            <Ionicons name="menu" size={25} color={themeColors.GRAY} />
          </View>

          <View
            style={{
              backgroundColor: themeColors.WHITE,
              flex: 1,
              borderRadius: 30,
              paddingHorizontal: 15,
            }}>
            <TextInput value="" placeholder="Current Location" />
          </View>
        </View>
      </View>

      <View style={{flex: 0.3}}></View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
