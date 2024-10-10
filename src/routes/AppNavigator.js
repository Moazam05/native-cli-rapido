import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Destination from '../screens/Home/components/Destination';
import PreHome from '../screens/Home/PreHome';
import Home from '../screens/Home/Home';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="PreHome" component={PreHome} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Destination" component={Destination} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
