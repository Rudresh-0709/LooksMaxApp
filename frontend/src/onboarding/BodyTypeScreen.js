import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const BODY_TYPES = [
    { id: 'skinny', title: 'Skinny', subtitle: 'Lean, low body fat' },
    { id: 'skinny-fat', title: 'Skinny Fat', subtitle: 'Thin with belly' },
    { id: 'average', title: 'Average', subtitle: 'Normal build' },
    { id: 'overweight', title: 'Overweight', subtitle: 'Higher body fat' },
];

const BODY_TYPE_IMAGES = {
    skinny: require('../assets/body-types/skinny.png'),
    'skinny-fat': require('../assets/body-types/skinny-fat.png'),
    average: require('../assets/body-types/average.png'),
    overweight: require('../assets/body-types/overweight.png'),
};

const BodyCard = ({ item, selected, onPress }) => (
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
        <Image
            source={BODY_TYPE_IMAGES[item.id]}
            style={styles.image}
            resizeMode="cover"
        />
        <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, selected && styles.cardTitleSelected]}>
                {item.title}
            </Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
    </TouchableOpacity>
);

export default function BodyTypeScreen({ navigation }) {
    const [bodyType, setBodyType] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.bodyType) setBodyType(data.bodyType);
    };

    const handleSelect = async (id) => {
        setBodyType(id);
        await saveUserData({ bodyType: id });

        // Auto-advance
        setTimeout(() => {
            navigation.navigate('FitnessLevel');
        }, 200);
    };

    return (
        <OnboardingLayout
            title="What's your body type?"
            subtitle="Select the one that best describes you"
            step={6}
            onBack={() => navigation.goBack()}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {BODY_TYPES.map((item) => (
                        <BodyCard
                            key={item.id}
                            item={item}
                            selected={bodyType === item.id}
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
        aspectRatio: 0.75,
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    cardTitleSelected: {
        color: theme.colors.primary,
    },
    cardSubtitle: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});
