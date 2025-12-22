import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { BlueprintButton } from '../components/BlueprintButton';
import { saveUserData, getUserData } from '../services/userDataService';

export default function WeightScreen({ navigation }) {
    const [weight, setWeight] = useState(70);
    const [unit, setUnit] = useState('kg'); // 'kg' or 'lbs'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.weight) setWeight(data.weight);
    };

    const handleNext = async () => {
        await saveUserData({ weight });
        navigation.navigate('BodyType');
    };

    const kgToLbs = (kg) => Math.round(kg * 2.205);

    const displayValue = () => {
        if (unit === 'kg') {
            return `${weight} kg`;
        }
        return `${kgToLbs(weight)} lbs`;
    };

    return (
        <OnboardingLayout
            title="What's your weight?"
            step={5}
            onBack={() => navigation.goBack()}
            footer={
                <BlueprintButton title="CONTINUE" onPress={handleNext} />
            }
        >
            {/* Unit toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleBtn, unit === 'kg' && styles.toggleActive]}
                    onPress={() => setUnit('kg')}
                >
                    <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, unit === 'lbs' && styles.toggleActive]}
                    onPress={() => setUnit('lbs')}
                >
                    <Text style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>lbs</Text>
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
                    value={weight}
                    onValueChange={(val) => setWeight(Math.round(val))}
                    minimumValue={30}
                    maximumValue={200}
                    step={1}
                    minimumTrackTintColor={theme.colors.primary}
                    maximumTrackTintColor={theme.colors.borderMuted}
                    thumbTintColor={theme.colors.primary}
                />
                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>30 kg</Text>
                    <Text style={styles.sliderLabel}>200 kg</Text>
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
