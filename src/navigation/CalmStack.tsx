import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Step1EmotionScreen } from '../screens/calm/Step1EmotionScreen';
import { Step23TriggerScreen } from '../screens/calm/Step23TriggerScreen';
import { Step45InterpSensScreen } from '../screens/calm/Step45InterpSensScreen';
import { Step67UrgesScreen } from '../screens/calm/Step67UrgesScreen';
import { Step8RepercScreen } from '../screens/calm/Step8RepercScreen';

export type CalmStackParams = {
  Step1: undefined;
  Step23: undefined;
  Step45: undefined;
  Step67: undefined;
  Step8: undefined;
};

const Stack = createStackNavigator<CalmStackParams>();

export function CalmStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Step1" component={Step1EmotionScreen} />
      <Stack.Screen name="Step23" component={Step23TriggerScreen} />
      <Stack.Screen name="Step45" component={Step45InterpSensScreen} />
      <Stack.Screen name="Step67" component={Step67UrgesScreen} />
      <Stack.Screen name="Step8" component={Step8RepercScreen} />
    </Stack.Navigator>
  );
}
