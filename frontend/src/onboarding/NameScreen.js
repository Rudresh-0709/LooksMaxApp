import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { BlueprintButton } from '../components/BlueprintButton';
import { saveUserData, getUserData } from '../services/userDataService';

export default function NameScreen({ navigation }) {
    const [name, setName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.name) setName(data.name);
    };

    const handleNext = async () => {
        if (!name.trim()) return;
        await saveUserData({ name: name.trim() });
        navigation.navigate('BirthYear');
    };

    return (
        <OnboardingLayout
            title="What's your name?"
            subtitle="Let's get to know you better"
            step={1}
            onBack={() => navigation.goBack()}
            footer={
                <BlueprintButton
                    title="CONTINUE"
                    onPress={handleNext}
                    disabled={!name.trim()}
                />
            }
        >
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.textDim}
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={handleNext}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 20,
    },
    input: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.colors.text,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 4,
    },
});
