import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { BlueprintButton } from '../components/BlueprintButton';

const DataRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.dots} />
        <Text style={styles.value}>{value}</Text>
    </View>
);

export default function ReviewScreen({ navigation }) {
    const [data, setData] = useState({
        name: '',
        age: '',
        country: '',
        height: '',
        weight: '',
        bodyType: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const name = await AsyncStorage.getItem('user_name');
            const age = await AsyncStorage.getItem('user_age');
            const country = await AsyncStorage.getItem('user_country');
            const height = await AsyncStorage.getItem('user_height');
            const weight = await AsyncStorage.getItem('user_weight');
            const bodyType = await AsyncStorage.getItem('user_body_type');

            setData({ name, age, country, height, weight, bodyType });
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    const handleFinish = async () => {
        try {
            await AsyncStorage.setItem('hasOnboarded_v3', 'true');
            // Reset navigation stack to Home
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (e) {
            console.error('Failed to save onboarding status', e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.stepIndicator}>STEP 03 // VERIFICATION</Text>
                    <Text style={styles.title}>FINAL DIAGNOSTIC</Text>
                    <View style={styles.separator} />
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>SUBJECT PROFILE</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <DataRow label="NAME" value={data.name} />
                        <DataRow label="AGE" value={data.age} />
                        <DataRow label="COUNTRY" value={data.country || 'N/A'} />
                    </View>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>BIOMETRIC DATA</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <DataRow label="HEIGHT" value={`${data.height} CM`} />
                        <DataRow label="WEIGHT" value={`${data.weight} KG`} />
                        <DataRow label="BUILD" value={data.bodyType?.toUpperCase()} />
                    </View>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </View>

                <View style={styles.footer}>
                    <BlueprintButton title="INITIALIZE SYSTEM" onPress={handleFinish} />
                    <BlueprintButton
                        title="MODIFY DATA"
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
    },
    header: {
        marginBottom: theme.spacing.xl,
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
    card: {
        marginBottom: theme.spacing.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'rgba(0, 240, 255, 0.02)',
        padding: theme.spacing.m,
        position: 'relative',
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.s,
        marginBottom: theme.spacing.m,
    },
    cardTitle: {
        color: theme.colors.primary,
        fontSize: 14,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    cardBody: {
        gap: theme.spacing.s,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        color: theme.colors.textDim,
        fontSize: 14,
        letterSpacing: 1,
    },
    dots: {
        flex: 1,
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        borderStyle: 'dotted', // React Native doesn't support dotted border perfectly on View, but we can try or use dashes
        marginHorizontal: theme.spacing.s,
        opacity: 0.3,
    },
    value: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    // Corners
    cornerTL: {
        position: 'absolute',
        top: -1,
        left: -1,
        width: 10,
        height: 10,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: theme.colors.primary,
    },
    cornerTR: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 10,
        height: 10,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: theme.colors.primary,
    },
    cornerBL: {
        position: 'absolute',
        bottom: -1,
        left: -1,
        width: 10,
        height: 10,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: theme.colors.primary,
    },
    cornerBR: {
        position: 'absolute',
        bottom: -1,
        right: -1,
        width: 10,
        height: 10,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: theme.colors.primary,
    },
    footer: {
        marginTop: theme.spacing.m,
    },
});
