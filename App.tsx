import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

// Import all screens
import HomeScreen from './frontend/src/screens/HomeScreen';
import NameScreen from './frontend/src/onboarding/NameScreen';
import BirthYearScreen from './frontend/src/onboarding/BirthYearScreen';
import GenderScreen from './frontend/src/onboarding/GenderScreen';
import HeightScreen from './frontend/src/onboarding/HeightScreen';
import WeightScreen from './frontend/src/onboarding/WeightScreen';
import BodyTypeScreen from './frontend/src/onboarding/BodyTypeScreen';
import FitnessLevelScreen from './frontend/src/onboarding/FitnessLevelScreen';
import GymAccessScreen from './frontend/src/onboarding/GymAccessScreen';
import FaceInputScreen from './frontend/src/onboarding/FaceInputScreen';
import HairLossScreen from './frontend/src/onboarding/HairLossScreen';
import BeardScreen from './frontend/src/onboarding/BeardScreen';
import SkinTypeScreen from './frontend/src/onboarding/SkinTypeScreen';
import SleepScreen from './frontend/src/onboarding/SleepScreen';
import WaterScreen from './frontend/src/onboarding/WaterScreen';
import SmokingScreen from './frontend/src/onboarding/SmokingScreen';
import GoalScreen from './frontend/src/onboarding/GoalScreen';
import TimeCommitmentScreen from './frontend/src/onboarding/TimeCommitmentScreen';
import ReviewScreen from './frontend/src/onboarding/ReviewScreen';
import WelcomeScreen from './frontend/src/onboarding/WelcomeScreen';

// Navigation Stack
const Stack = createNativeStackNavigator();

export default function App() {
  console.log('Full App loaded');

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0A0A0F' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Name" component={NameScreen} />
          <Stack.Screen name="BirthYear" component={BirthYearScreen} />
          <Stack.Screen name="Gender" component={GenderScreen} />
          <Stack.Screen name="Height" component={HeightScreen} />
          <Stack.Screen name="Weight" component={WeightScreen} />
          <Stack.Screen name="BodyType" component={BodyTypeScreen} />
          <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
          <Stack.Screen name="GymAccess" component={GymAccessScreen} />
          <Stack.Screen name="FaceInput" component={FaceInputScreen} />
          <Stack.Screen name="HairLoss" component={HairLossScreen} />
          <Stack.Screen name="Beard" component={BeardScreen} />
          <Stack.Screen name="SkinType" component={SkinTypeScreen} />
          <Stack.Screen name="Sleep" component={SleepScreen} />
          <Stack.Screen name="Water" component={WaterScreen} />
          <Stack.Screen name="Smoking" component={SmokingScreen} />
          <Stack.Screen name="Goal" component={GoalScreen} />
          <Stack.Screen name="TimeCommitment" component={TimeCommitmentScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
