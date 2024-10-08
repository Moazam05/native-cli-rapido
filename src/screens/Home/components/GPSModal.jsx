import {
  View,
  Text,
  Button,
  Platform,
  Linking,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import CustomModal from '../../../components/CustomModal';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {StyleSheet} from 'react-native';

const GPSModal = ({visible, loading}) => {
  // todo: Open GPS settings (Android-specific)
  const openGPSSettings = async () => {
    if (Platform.OS === 'android') {
      const url = 'android.settings.LOCATION_SOURCE_SETTINGS';
      await Linking.sendIntent(url);
    }
  };

  return (
    <CustomModal visible={visible}>
      <View style={styles.container}>
        <FontAwesome6 name="circle-exclamation" size={40} color="#F6C41F" />

        <Text style={styles.title}>GPS PERMISSION</Text>

        <Text style={styles.description}>
          We need your location to show you the best places around you.
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Cancel"
              color=""
              onPress={() => {
                BackHandler.exitApp();
              }}
              disabled={loading}
            />
          </View>

          <View style={styles.button}>
            {loading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="#F6C41F" />
              </View>
            ) : (
              <Button
                title="Enable GPS"
                color="#F6C41F"
                onPress={openGPSSettings}
              />
            )}
          </View>
        </View>
      </View>
    </CustomModal>
  );
};

export default GPSModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    textAlign: 'center',
    marginTop: 30,
    color: '#7C7C7C',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 5,
    gap: 20,
    marginHorizontal: 20,
  },
  button: {
    width: '50%',
  },
  loader: {
    borderWidth: 1,
    borderColor: '#F6C41F',
    borderRadius: 5,
    padding: 5,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
