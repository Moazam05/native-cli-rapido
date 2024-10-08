import {View, Text} from 'react-native';
import React, {useState} from 'react';
import GPSModal from './components/GPSModal';

const HomeThree = () => {
  const [visible, setVisible] = useState(true);

  return (
    <View>
      <Text>HomeThree</Text>

      {/* Modal */}
      <GPSModal visible={visible} setVisible={setVisible} />
    </View>
  );
};

export default HomeThree;
