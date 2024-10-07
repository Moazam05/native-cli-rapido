import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {themeColors} from '../../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../../../constants/fonts';
import {thousandSeparator} from '../../../utils';

const RideOption = ({iconName, label, distance}) => {
  function calculateFare(dis, vehicle) {
    const fareRates = {
      Bike: 30,
      Auto: 50,
      Car: 70,
    };

    const fare = dis * fareRates[vehicle];
    return fare.toFixed(0);
  }

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconTextContainer}>
            <Ionicons name={iconName} size={23} color={themeColors.BLACK} />
            <Text style={styles.label}>{label}</Text>
          </View>
          {distance > 0 && (
            <Text style={styles.fare}>
              Rs. {thousandSeparator(calculateFare(distance, label))}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: themeColors.WHITE,
    borderRadius: 35,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    color: themeColors.BLACK,
  },
  fare: {
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    color: themeColors.BLACK,
  },
});

export default RideOption;
