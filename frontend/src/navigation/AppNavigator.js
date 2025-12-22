import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isOnboardingComplete } from '../services/userDataService';
import { theme } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Onboarding (17 single-input screens)
import WelcomeScreen from '../onboarding/WelcomeScreen';
import NameScreen from '../onboarding/NameScreen';
import BirthYearScreen from '../onboarding/BirthYearScreen';
import GenderScreen from '../onboarding/GenderScreen';
import HeightScreen from '../onboarding/HeightScreen';
import WeightScreen from '../onboarding/WeightScreen';
import BodyTypeScreen from '../onboarding/BodyTypeScreen';
import FitnessLevelScreen from '../onboarding/FitnessLevelScreen';
import GymAccessScreen from '../onboarding/GymAccessScreen';
import FaceInputScreen from '../onboarding/FaceInputScreen';
import HairLossScreen from '../onboarding/HairLossScreen';
import BeardScreen from '../onboarding/BeardScreen';
import SkinTypeScreen from '../onboarding/SkinTypeScreen';
import SleepScreen from '../onboarding/SleepScreen';
import WaterScreen from '../onboarding/WaterScreen';
import SmokingScreen from '../onboarding/SmokingScreen';
import GoalScreen from '../onboarding/GoalScreen';
import TimeCommitmentScreen from '../onboarding/TimeCommitmentScreen';
import ReviewScreen from '../onboarding/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await isOnboardingComplete();
      setInitialRoute(completed ? 'Home' : 'Welcome');
    } catch (e) {
      console.error('Failed to check onboarding status', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Onboarding Flow */}
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

        {/* Main App */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
