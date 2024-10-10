import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Splash from '../screens/Splash';
import Destination from '../screens/Home/components/Destination';
import HomeNew from '../screens/Home/HomeNew';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Home" component={HomeNew} />
      <Stack.Screen name="Destination" component={Destination} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
