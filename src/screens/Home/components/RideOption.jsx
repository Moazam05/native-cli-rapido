import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../../../constants/fonts';
import {themeColors} from '../../../constants/colors';
import {findClosestCaptain} from '../../../utils';

const RideOption = ({
  iconName,
  label,
  distance,
  setRiderDetails,
  captainData,
  userLocation,
}) => {
  const handleRider = () => {
    const closestCaptain = findClosestCaptain(userLocation, captainData);
    setRiderDetails(closestCaptain);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleRider}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={30} color={themeColors.PRIMARY} />
        </View>

        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(246, 195, 30, 0.15)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    width: 90,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: themeColors.BLACK,
  },
});

export default RideOption;
