import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { BlueprintInput } from '../components/BlueprintInput';
import { BlueprintButton } from '../components/BlueprintButton';
import { User, Activity, Zap, Shield, Target } from 'lucide-react-native';

const BODY_TYPES = [
    { id: 'skinny', label: 'SKINNY', icon: Activity },
    { id: 'athletic', label: 'ATHLETIC', icon: Zap },
    { id: 'average', label: 'AVERAGE', icon: User },
    { id: 'muscular', label: 'MUSCULAR', icon: Shield },
    { id: 'overweight', label: 'OVERWEIGHT', icon: Target },
];

export default function BodyInfoScreen({ navigation }) {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bodyType, setBodyType] = useState('');

    const handleNext = async () => {
        if (!height || !weight || !bodyType) {
            alert('Please complete all fields');
            return;
        }

        try {
            await AsyncStorage.setItem('user_height', height);
            await AsyncStorage.setItem('user_weight', weight);
            await AsyncStorage.setItem('user_body_type', bodyType);

            navigation.navigate('Review');
        } catch (e) {
            console.error('Failed to save data', e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.stepIndicator}>STEP 02 // BIOMETRICS</Text>
                    <Text style={styles.title}>PHYSICAL CONFIGURATION</Text>
                    <View style={styles.separator} />
                </View>

                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: theme.spacing.m }}>
                            <BlueprintInput
                                label="HEIGHT (CM)"
                                placeholder="000"
                                value={height}
                                onChangeText={setHeight}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <BlueprintInput
                                label="WEIGHT (KG)"
                                placeholder="000"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>BODY ARCHITECTURE CLASS</Text>
                    <View style={styles.grid}>
                        {BODY_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = bodyType === type.id;
                            return (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[styles.card, isSelected && styles.cardSelected]}
                                    onPress={() => setBodyType(type.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <Icon
                                            size={32}
                                            color={isSelected ? theme.colors.background : theme.colors.primary}
                                        />
                                    </View>
                                    <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                                        {type.label}
                                    </Text>
                                    {isSelected && <View style={styles.cornerSelected} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.footer}>
                    <BlueprintButton title="CONFIRM BIOMETRICS" onPress={handleNext} />
                    <BlueprintButton
                        title="BACK"
                        variant="secondary"
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: theme.spacing.s }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.l,
        paddingBottom: theme.spacing.xl,
    },
    header: {
        marginBottom: theme.spacing.l,
    },
    stepIndicator: {
        color: theme.colors.primary,
        fontSize: 12,
        letterSpacing: 2,
        marginBottom: theme.spacing.xs,
        fontFamily: 'monospace',
    },
    title: {
        ...theme.typography.header,
        color: theme.colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.s,
        width: '30%',
    },
    form: {
        marginBottom: theme.spacing.l,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionLabel: {
        ...theme.typography.label,
        color: theme.colors.primary,
        marginTop: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'rgba(0, 240, 255, 0.05)',
        marginBottom: theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.s,
    },
    cardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    iconContainer: {
        marginBottom: theme.spacing.s,
    },
    cardLabel: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    cardLabelSelected: {
        color: theme.colors.background,
    },
    cornerSelected: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderRightColor: 'transparent',
        borderTopColor: theme.colors.background,
        transform: [{ rotate: '90deg' }]
    },
    footer: {
        marginTop: theme.spacing.s,
    },
});
