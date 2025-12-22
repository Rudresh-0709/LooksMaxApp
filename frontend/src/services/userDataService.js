import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'looksmax_user_data';

/**
 * User Data Service
 * Centralized storage for all onboarding and user profile data
 */

// Default empty user data structure
const defaultUserData = {
    // Screen 1: Identity
    name: '',
    birthYear: null,
    gender: 'male',

    // Screen 2: Body & Fitness
    height: null,       // in cm
    weight: null,       // in kg
    bodyType: null,     // skinny | skinny-fat | average | overweight
    fitnessLevel: null, // beginner | intermediate | advanced
    gymAccess: null,    // true | false

    // Screen 3: Face Photos
    facePhotos: {
        front: null,
        leftProfile: null,
        rightProfile: null,
    },

    // Screen 4: Hair & Beard
    hairLoss: null,     // none | mild | moderate | severe
    beardGrowth: null,  // patchy | moderate | full

    // Screen 5: Skin
    skinType: null,     // oily | dry | combination | normal

    // Screen 6: Lifestyle
    sleepDuration: null,  // <6 | 6-7 | 7-8 | 8+
    waterIntake: null,    // <2L | 2-3L | 3L+
    smoking: null,        // true | false

    // Screen 7: Goals
    primaryGoal: null,    // fat-loss | better-face | muscle-gain | glow-up
    dailyTime: null,      // 15 | 30 | 60 (minutes)

    // Meta
    onboardingCompleted: false,
    createdAt: null,
    updatedAt: null,
};

/**
 * Get all user data
 */
export const getUserData = async () => {
    try {
        const jsonData = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonData) {
            return { ...defaultUserData, ...JSON.parse(jsonData) };
        }
        return { ...defaultUserData };
    } catch (error) {
        console.error('Error reading user data:', error);
        return { ...defaultUserData };
    }
};

/**
 * Save/update user data (merges with existing)
 */
export const saveUserData = async (newData) => {
    try {
        const existingData = await getUserData();
        const updatedData = {
            ...existingData,
            ...newData,
            updatedAt: new Date().toISOString(),
            createdAt: existingData.createdAt || new Date().toISOString(),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        return updatedData;
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
};

/**
 * Update a specific section of user data
 */
export const updateSection = async (section, data) => {
    try {
        const existingData = await getUserData();

        // If section is an object key (like 'facePhotos'), merge it
        if (typeof existingData[section] === 'object' && existingData[section] !== null) {
            existingData[section] = { ...existingData[section], ...data };
        } else {
            existingData[section] = data;
        }

        return await saveUserData(existingData);
    } catch (error) {
        console.error('Error updating section:', error);
        throw error;
    }
};

/**
 * Mark onboarding as complete
 */
export const completeOnboarding = async () => {
    return await saveUserData({ onboardingCompleted: true });
};

/**
 * Check if onboarding is complete
 */
export const isOnboardingComplete = async () => {
    const data = await getUserData();
    return data.onboardingCompleted === true;
};

/**
 * Clear all user data (for development/testing)
 */
export const clearUserData = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        // Also clear legacy keys
        await AsyncStorage.multiRemove([
            'hasOnboarded_v3',
            'user_name',
            'user_age',
            'user_country',
            'user_height',
            'user_weight',
            'user_body_type',
        ]);
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
};

/**
 * Calculate age from birth year
 */
export const calculateAge = (birthYear) => {
    if (!birthYear) return null;
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
};

export default {
    getUserData,
    saveUserData,
    updateSection,
    completeOnboarding,
    isOnboardingComplete,
    clearUserData,
    calculateAge,
};
