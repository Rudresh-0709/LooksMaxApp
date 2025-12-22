import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const OPTIONS = [
    { id: 'patchy', title: 'Patchy', subtitle: 'Sparse, uneven growth' },
    { id: 'moderate', title: 'Moderate', subtitle: 'Decent coverage' },
    { id: 'full', title: 'Full', subtitle: 'Dense beard' },
];

const IMAGES = {
    patchy: require('../assets/beard/patchy.png'),
    moderate: require('../assets/beard/moderate.png'),
    full: require('../assets/beard/full.png'),
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
                end={{ x: 1, y: 0 }}
            />
        )}
        <Image source={IMAGES[item.id]} style={styles.image} resizeMode="cover" />
        <View style={styles.textContainer}>
            <Text style={[styles.title, selected && styles.titleSelected]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
    </TouchableOpacity>
);

export default function BeardScreen({ navigation }) {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.beardGrowth) setSelected(data.beardGrowth);
    };

    const handleSelect = async (id) => {
        setSelected(id);
        await saveUserData({ beardGrowth: id });
        setTimeout(() => navigation.navigate('SkinType'), 200);
    };

    return (
        <OnboardingLayout
            title="Beard growth?"
            step={11}
            onBack={() => navigation.goBack()}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {OPTIONS.map((item) => (
                    <Card
                        key={item.id}
                        item={item}
                        selected={selected === item.id}
                        onPress={() => handleSelect(item.id)}
                    />
                ))}
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.lg,
        borderWidth: 2,
        borderColor: theme.colors.borderMuted,
        marginBottom: 12,
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
        width: 80,
        height: 80,
    },
    textContainer: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    titleSelected: {
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
