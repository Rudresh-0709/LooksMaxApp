import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Droplets, Sun, RefreshCcw, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const SKIN_TYPES = [
    { id: 'oily', title: 'Oily', desc: 'Shiny T-zone, enlarged pores', Icon: Droplets },
    { id: 'dry', title: 'Dry', desc: 'Tight, flaky patches', Icon: Sun },
    { id: 'combination', title: 'Combination', desc: 'Oily T-zone, dry cheeks', Icon: RefreshCcw },
    { id: 'normal', title: 'Normal', desc: 'Balanced, few issues', Icon: Sparkles },
];

const Card = ({ item, selected, onPress }) => {
    const { Icon } = item;
    return (
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
            <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
                <Icon size={24} color={selected ? '#FFF' : theme.colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, selected && styles.titleSelected]}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function SkinTypeScreenNew({ navigation }) {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.skinType) setSelected(data.skinType);
    };

    const handleSelect = async (id) => {
        setSelected(id);
        await saveUserData({ skinType: id });
        setTimeout(() => navigation.navigate('Sleep'), 200);
    };

    return (
        <OnboardingLayout
            title="What's your skin type?"
            step={12}
            onBack={() => navigation.goBack()}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {SKIN_TYPES.map((item) => (
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
        padding: 16,
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
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primaryMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconCircleSelected: {
        backgroundColor: theme.colors.primary,
    },
    textContainer: {
        flex: 1,
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
    desc: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
