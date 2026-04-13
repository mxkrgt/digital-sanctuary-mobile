import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SkillsScreen } from '../screens/skills/SkillsScreen';
import { CalmStack } from './CalmStack';
import { CalmProvider } from '../contexts/CalmContext';
import { colors, typography } from '../theme';

export type MainTabsParams = {
  Sanctuary: undefined;
  Journal: undefined;
  Skills: undefined;
  Profile: undefined;
};

export type RootStackParams = {
  Tabs: undefined;
  Calm: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParams>();
const RootStack = createStackNavigator<RootStackParams>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.outlineVariant,
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          ...typography.labelSmall,
          fontFamily: 'Manrope_500Medium',
        },
      }}
    >
      <Tab.Screen
        name="Sanctuary"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"home" as any} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"auto-stories" as any} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Skills"
        component={SkillsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"self-improvement" as any} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  return (
    <CalmProvider>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={Tabs} />
        <RootStack.Screen
          name="Calm"
          component={CalmStack}
          options={{ presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </CalmProvider>
  );
}
