import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import { BlueprintButton } from '../components/BlueprintButton';
import { getUserData, calculateAge } from '../services/userDataService';

const DataRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
);

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

export default function ReviewScreen({ navigation }) {
    const [data, setData] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const userData = await getUserData();
        setData(userData);
    };

    const handleFinish = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    const fmt = (val) => {
        if (val === null || val === undefined) return '—';
        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
        return String(val).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['rgba(102, 126, 234, 0.1)', 'transparent']}
                style={styles.gradientBg}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Success */}
                <View style={styles.successContainer}>
                    <LinearGradient
                        colors={theme.gradients.primary}
                        style={styles.successIcon}
                    >
                        <Check size={32} color="#FFF" />
                    </LinearGradient>
                    <Text style={styles.successTitle}>You're all set! 🎉</Text>
                    <Text style={styles.successSubtitle}>
                        Here's your profile summary
                    </Text>
                </View>

                <Section title="YOU">
                    <DataRow label="Name" value={data.name} />
                    <DataRow label="Age" value={data.birthYear ? `${calculateAge(data.birthYear)}` : null} />
                    <DataRow label="Gender" value={fmt(data.gender)} />
                </Section>

                <Section title="BODY">
                    <DataRow label="Height" value={data.height ? `${data.height} cm` : null} />
                    <DataRow label="Weight" value={data.weight ? `${data.weight} kg` : null} />
                    <DataRow label="Body Type" value={fmt(data.bodyType)} />
                    <DataRow label="Fitness" value={fmt(data.fitnessLevel)} />
                    <DataRow label="Gym" value={fmt(data.gymAccess)} />
                </Section>

                <Section title="APPEARANCE">
                    <DataRow label="Hair" value={fmt(data.hairLoss)} />
                    <DataRow label="Beard" value={fmt(data.beardGrowth)} />
                    <DataRow label="Skin" value={fmt(data.skinType)} />
                </Section>

                <Section title="LIFESTYLE">
                    <DataRow label="Sleep" value={data.sleepDuration} />
                    <DataRow label="Water" value={data.waterIntake} />
                    <DataRow label="Smoking" value={fmt(data.smoking)} />
                </Section>

                <Section title="GOAL">
                    <DataRow label="Focus" value={fmt(data.primaryGoal)} />
                    <DataRow label="Daily Time" value={data.dailyTime ? `${data.dailyTime} min` : null} />
                </Section>
            </ScrollView>

            <View style={styles.footer}>
                <BlueprintButton
                    title="GET MY PLAN"
                    onPress={handleFinish}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    gradientBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 120,
    },
    successContainer: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 24,
    },
    successIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        ...theme.shadows.glow,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    section: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.lg,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.primary,
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderMuted,
    },
    rowLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    rowValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    footer: {
        padding: 24,
        paddingBottom: 32,
    },
});
