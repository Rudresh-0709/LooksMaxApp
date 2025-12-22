import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const GOALS = [
    { id: 'fat-loss', title: 'Lose Fat', subtitle: 'Burn fat, get lean' },
    { id: 'better-face', title: 'Better Face', subtitle: 'Facial aesthetics' },
    { id: 'muscle-gain', title: 'Build Muscle', subtitle: 'Gain strength' },
    { id: 'glow-up', title: 'Glow-Up', subtitle: 'Complete makeover' },
];

const IMAGES = {
    'fat-loss': require('../assets/goals/fat-loss.png'),
    'better-face': require('../assets/goals/better-face.png'),
    'muscle-gain': require('../assets/goals/muscle-gain.png'),
    'glow-up': require('../assets/goals/glow-up.png'),
};

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
                end={{ x: 1, y: 1 }}
            />
        )}
        <Image source={IMAGES[item.id]} style={styles.image} resizeMode="cover" />
        <View style={styles.cardContent}>
            <Text style={[styles.title, selected && styles.titleSelected]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
    </TouchableOpacity>
);

export default function GoalScreen({ navigation }) {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.primaryGoal) setSelected(data.primaryGoal);
    };

    const handleSelect = async (id) => {
        setSelected(id);
        await saveUserData({ primaryGoal: id });
        setTimeout(() => navigation.navigate('TimeCommitment'), 200);
    };

    return (
        <OnboardingLayout
            title="What's your main goal?"
            step={16}
            onBack={() => navigation.goBack()}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {GOALS.map((item) => (
                        <Card
                            key={item.id}
                            item={item}
                            selected={selected === item.id}
                            onPress={() => handleSelect(item.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        width: '48%',
        aspectRatio: 0.8,
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.lg,
        borderWidth: 2,
        borderColor: theme.colors.borderMuted,
        overflow: 'hidden',
    },
    cardSelected: {
        borderColor: theme.colors.primary,
    },
    cardGradient: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    image: {
        width: '100%',
        height: '65%',
    },
    cardContent: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    titleSelected: {
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});
