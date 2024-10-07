import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {themeColors} from '../../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../../../constants/fonts';

const RideOption = ({iconName, label}) => {
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
            alignItems: 'center',
            gap: 10,
            fontSize: 16,
            fontFamily: Fonts.SEMIBOLD,
          }}>
          <Ionicons name={iconName} size={23} color={themeColors.BLACK} />
          <Text>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RideOption;
