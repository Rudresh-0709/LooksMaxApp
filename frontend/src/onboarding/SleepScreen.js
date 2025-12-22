import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const OPTIONS = [
    { id: '<6', label: 'Less than 6 hours', emoji: '😴' },
    { id: '6-7', label: '6-7 hours', emoji: '😐' },
    { id: '7-8', label: '7-8 hours', emoji: '😊' },
    { id: '8+', label: '8+ hours', emoji: '💪' },
];

const Card = ({ item, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        {selected && (
            <LinearGradient
                colors={theme.gradients.primary}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />
        )}
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
    </TouchableOpacity>
);

export default function SleepScreen({ navigation }) {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.sleepDuration) setSelected(data.sleepDuration);
    };

    const handleSelect = async (id) => {
        setSelected(id);
        await saveUserData({ sleepDuration: id });
        setTimeout(() => navigation.navigate('Water'), 200);
    };

    return (
        <OnboardingLayout
            title="How much do you sleep?"
            subtitle="Average hours per night"
            step={13}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.container}>
                {OPTIONS.map((item) => (
                    <Card
                        key={item.id}
                        item={item}
                        selected={selected === item.id}
                        onPress={() => handleSelect(item.id)}
                    />
                ))}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.lg,
        borderWidth: 2,
        borderColor: theme.colors.borderMuted,
        padding: 20,
        overflow: 'hidden',
    },
    cardSelected: {
        borderColor: theme.colors.primary,
    },
    cardGradient: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    emoji: {
        fontSize: 28,
        marginRight: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    labelSelected: {
        color: theme.colors.primary,
    },
});
