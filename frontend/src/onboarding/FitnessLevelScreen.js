import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const LEVELS = [
    { id: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', emoji: '💪', desc: 'Some experience' },
    { id: 'advanced', label: 'Advanced', emoji: '🔥', desc: 'Highly trained' },
];

const LevelCard = ({ item, selected, onPress }) => (
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
        <View style={styles.textContainer}>
            <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
        </View>
    </TouchableOpacity>
);

export default function FitnessLevelScreen({ navigation }) {
    const [level, setLevel] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.fitnessLevel) setLevel(data.fitnessLevel);
    };

    const handleSelect = async (id) => {
        setLevel(id);
        await saveUserData({ fitnessLevel: id });

        setTimeout(() => {
            navigation.navigate('GymAccess');
        }, 200);
    };

    return (
        <OnboardingLayout
            title="What's your fitness level?"
            step={7}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.container}>
                {LEVELS.map((item) => (
                    <LevelCard
                        key={item.id}
                        item={item}
                        selected={level === item.id}
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
        fontSize: 36,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    labelSelected: {
        color: theme.colors.primary,
    },
    desc: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
