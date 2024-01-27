// make maps the home page

import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Maps Screen</Text>
      <Button
        title="Go to Photos"
        onPress={() => navigation.navigate('Photos')}
      />
      <Button
        title="Go to Profiles"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}
