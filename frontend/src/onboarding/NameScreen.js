import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, StatusBar, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ArrowRight, Edit3 } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { saveUserData, getUserData } from '../services/userDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NameScreen({ navigation }) {
    const [name, setName] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        loadData();
        startShimmer();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.name) setName(data.name);
    };

    const startShimmer = () => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    };

    const handleNext = async () => {
        if (!name.trim()) return;
        await saveUserData({ name: name.trim() });
        navigation.navigate('BirthYear');
    };

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    // Step 1 of 17
    const progress = (1 / 17) * 100;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.stepInfo}>
                        <Text style={styles.stepText}>STEP 1 OF 17</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {/* Progress Bar Container */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarTrack}>
                        <LinearGradient
                            colors={['#6366F1', '#4F46E5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.content}>
                    <Text style={styles.title}>Let's get to{'\n'}know you.</Text>
                    <Text style={styles.subtitle}>
                        This is how we'll address you during your workouts and daily summaries.
                    </Text>

                    {/* Input Section */}
                    <View style={styles.inputWrapper}>
                        <View style={[
                            styles.inputContainer,
                            isFocused && styles.inputContainerFocused
                        ]}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Your Name"
                                placeholderTextColor="rgba(148, 163, 184, 0.5)"
                                autoFocus
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                returnKeyType="next"
                                onSubmitEditing={handleNext}
                            />
                            {isFocused && (
                                <View style={styles.editIconContainer}>
                                    <Edit3 size={20} color="#6366F1" />
                                </View>
                            )}
                        </View>
                        <Text style={styles.hintText}>Just your first name is fine.</Text>
                    </View>

                    <View style={{ flex: 1 }} />

                    {/* Footer / Button Area */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                !name.trim() && styles.continueButtonDisabled
                            ]}
                            onPress={handleNext}
                            disabled={!name.trim()}
                            activeOpacity={0.8}
                        >
                            <Animated.View
                                style={[
                                    styles.shimmer,
                                    { transform: [{ translateX: shimmerTranslate }] }
                                ]}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </Animated.View>
                            <Text style={styles.continueText}>Continue</Text>
                            <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1120',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        height: 64,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30, 41, 59, 1)',
    },
    stepInfo: {
        alignItems: 'center',
    },
    stepText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1.2,
    },
    progressBarContainer: {
        paddingHorizontal: 20,
        marginTop: 8,
        marginBottom: 24,
    },
    progressBarTrack: {
        height: 4,
        backgroundColor: '#1E293B',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 42,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#CBD5E1',
        lineHeight: 28,
        marginBottom: 40,
    },
    inputWrapper: {
        flexDirection: 'column',
        gap: 8,
    },
    inputContainer: {
        height: 64,
        backgroundColor: '#1E293B',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        transition: 'all 0.2s ease-out',
    },
    inputContainerFocused: {
        borderColor: '#6366F1',
        backgroundColor: '#0B1120',
    },
    input: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        height: '100%',
    },
    editIconContainer: {
        marginLeft: 12,
    },
    hintText: {
        fontSize: 14,
        color: '#94A3B8',
        paddingHorizontal: 8,
        opacity: 0.8,
    },
    footer: {
        paddingBottom: 24,
    },
    continueButton: {
        height: 56,
        backgroundColor: '#6366F1',
        borderRadius: 28, // Fully rounded
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    continueButtonDisabled: {
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        shadowOpacity: 0,
        elevation: 0,
    },
    continueText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        width: SCREEN_WIDTH,
    },
});
