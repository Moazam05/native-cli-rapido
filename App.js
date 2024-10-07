import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/routes/AppNavigator';
import ToastComponent from './src/components/ToastComponent';

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
      <ToastComponent />
    </NavigationContainer>
  );
};

export default App;
