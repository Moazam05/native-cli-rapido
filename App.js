import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/routes/AppNavigator';
import ToastComponent from './src/components/ToastComponent';
import {persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <NavigationContainer>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
      <ToastComponent />
    </NavigationContainer>
  );
};

export default App;
