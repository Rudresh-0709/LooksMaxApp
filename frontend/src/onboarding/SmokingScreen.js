import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const Card = ({ label, emoji, selected, onPress }) => (
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

export default function SmokingScreen({ navigation }) {
    const [smokes, setSmokes] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.smoking !== null) setSmokes(data.smoking);
    };

    const handleSelect = async (value) => {
        setSmokes(value);
        await saveUserData({ smoking: value });
        setTimeout(() => navigation.navigate('Goal'), 200);
    };

    return (
        <OnboardingLayout
            title="Do you smoke?"
            step={15}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.container}>
                <Card
                    label="Yes"
                    emoji="🚬"
                    selected={smokes === true}
                    onPress={() => handleSelect(true)}
                />
                <Card
                    label="No"
                    emoji="🚫"
                    selected={smokes === false}
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
        aspectRatio: 1,
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
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    labelSelected: {
        color: theme.colors.text,
    },
});
