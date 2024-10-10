import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/routes/AppNavigator';
import ToastComponent from './src/components/ToastComponent';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
        <ToastComponent />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
