import {View, Text, TouchableOpacity} from 'react-native';
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
    <TouchableOpacity
      style={{
        flex: 1,
        marginHorizontal: 20,
      }}>
      <View
        style={{
          backgroundColor: themeColors.WHITE,
          borderRadius: 35,
          paddingVertical: 5,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Ionicons name={iconName} size={23} color={themeColors.BLACK} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.REGULAR,
                color: themeColors.BLACK,
              }}>
              {label}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.MEDIUM,
              color: themeColors.BLACK,
            }}>
            Rs. {thousandSeparator(calculateFare(distance, label))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RideOption;
