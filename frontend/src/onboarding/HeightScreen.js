import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { BlueprintButton } from '../components/BlueprintButton';
import { saveUserData, getUserData } from '../services/userDataService';

export default function HeightScreen({ navigation }) {
    const [height, setHeight] = useState(170);
    const [unit, setUnit] = useState('cm'); // 'cm' or 'ft'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.height) setHeight(data.height);
    };

    const handleNext = async () => {
        await saveUserData({ height });
        navigation.navigate('Weight');
    };

    // Convert cm to ft-in
    const cmToFtIn = (cm) => {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return { feet, inches };
    };

    const displayValue = () => {
        if (unit === 'cm') {
            return `${height} cm`;
        }
        const { feet, inches } = cmToFtIn(height);
        return `${feet}'${inches}"`;
    };

    return (
        <OnboardingLayout
            title="What's your height?"
            step={4}
            onBack={() => navigation.goBack()}
            footer={
                <BlueprintButton title="CONTINUE" onPress={handleNext} />
            }
        >
            {/* Unit toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleBtn, unit === 'cm' && styles.toggleActive]}
                    onPress={() => setUnit('cm')}
                >
                    <Text style={[styles.toggleText, unit === 'cm' && styles.toggleTextActive]}>cm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, unit === 'ft' && styles.toggleActive]}
                    onPress={() => setUnit('ft')}
                >
                    <Text style={[styles.toggleText, unit === 'ft' && styles.toggleTextActive]}>ft</Text>
                </TouchableOpacity>
            </View>

            {/* Value display */}
            <View style={styles.valueContainer}>
                <Text style={styles.valueText}>{displayValue()}</Text>
            </View>

            {/* Slider */}
            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    value={height}
                    onValueChange={(val) => setHeight(Math.round(val))}
                    minimumValue={120}
                    maximumValue={220}
                    step={1}
                    minimumTrackTintColor={theme.colors.primary}
                    maximumTrackTintColor={theme.colors.borderMuted}
                    thumbTintColor={theme.colors.primary}
                />
                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>120 cm</Text>
                    <Text style={styles.sliderLabel}>220 cm</Text>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.full,
        padding: 4,
        marginBottom: 40,
    },
    toggleBtn: {
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: theme.borders.radius.full,
    },
    toggleActive: {
        backgroundColor: theme.colors.primary,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    toggleTextActive: {
        color: '#FFF',
    },
    valueContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    valueText: {
        fontSize: 72,
        fontWeight: '700',
        color: theme.colors.text,
    },
    sliderContainer: {
        paddingHorizontal: 8,
    },
    slider: {
        width: '100%',
        height: 50,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sliderLabel: {
        fontSize: 12,
        color: theme.colors.textDim,
    },
});
