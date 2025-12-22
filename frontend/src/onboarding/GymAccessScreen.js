import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const OptionCard = ({ label, emoji, selected, onPress }) => (
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
                end={{ x: 1, y: 1 }}
            />
        )}
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
);

export default function GymAccessScreen({ navigation }) {
    const [hasGym, setHasGym] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.gymAccess !== null) setHasGym(data.gymAccess);
    };

    const handleSelect = async (value) => {
        setHasGym(value);
        await saveUserData({ gymAccess: value });

        setTimeout(() => {
            navigation.navigate('FaceInput');
        }, 200);
    };

    return (
        <OnboardingLayout
            title="Do you have gym access?"
            step={8}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.container}>
                <OptionCard
                    label="Yes, I have a gym"
                    emoji="🏋️"
                    selected={hasGym === true}
                    onPress={() => handleSelect(true)}
                />
                <OptionCard
                    label="No, home workouts"
                    emoji="🏠"
                    selected={hasGym === false}
                    onPress={() => handleSelect(false)}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 40,
    },
    card: {
        flex: 1,
        aspectRatio: 0.9,
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.xl,
        borderWidth: 2,
        borderColor: theme.colors.borderMuted,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    cardSelected: {
        borderColor: theme.colors.primary,
    },
    cardGradient: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.15,
    },
    emoji: {
        fontSize: 56,
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 12,
    },
    labelSelected: {
        color: theme.colors.text,
    },
});
