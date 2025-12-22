import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const GenderCard = ({ label, emoji, selected, onPress }) => (
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

export default function GenderScreen({ navigation }) {
    const [gender, setGender] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.gender) setGender(data.gender);
    };

    const handleSelect = async (value) => {
        setGender(value);
        await saveUserData({ gender: value });

        // Auto-advance
        setTimeout(() => {
            navigation.navigate('Height');
        }, 200);
    };

    return (
        <OnboardingLayout
            title="What's your gender?"
            subtitle="This helps personalize your recommendations"
            step={3}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.cardsContainer}>
                <GenderCard
                    label="Male"
                    emoji="👨"
                    selected={gender === 'male'}
                    onPress={() => handleSelect('male')}
                />
                <GenderCard
                    label="Female"
                    emoji="👩"
                    selected={gender === 'female'}
                    onPress={() => handleSelect('female')}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    cardsContainer: {
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
        fontSize: 64,
        marginBottom: 16,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    labelSelected: {
        color: theme.colors.text,
    },
});
