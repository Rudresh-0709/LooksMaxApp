import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlueprintButton } from '../components/BlueprintButton';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0.8],
    });

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={['#1a0a2e', '#0A0A0F', '#0a1628']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />
                    <LinearGradient
                        colors={theme.gradients.primary}
                        style={styles.logoInner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.logoText}>LM</Text>
                    </LinearGradient>
                </View>

                {/* Title */}
                <Text style={styles.appName}>LOOKSMAX</Text>
                <Text style={styles.tagline}>
                    Your personal transformation{'\n'}journey starts here
                </Text>

                {/* Features */}
                <View style={styles.features}>
                    <Text style={styles.featureItem}>✨ AI Face Analysis</Text>
                    <Text style={styles.featureItem}>💪 Personalized Plans</Text>
                    <Text style={styles.featureItem}>📈 Track Progress</Text>
                </View>

                {/* Get Started */}
                <View style={styles.buttonContainer}>
                    <BlueprintButton
                        title="GET STARTED"
                        onPress={() => navigation.navigate('Name')}
                    />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    backgroundGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    glowCircle: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: theme.colors.primary,
        ...theme.shadows.glow,
    },
    logoInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    appName: {
        fontSize: 40,
        fontWeight: '800',
        color: theme.colors.text,
        letterSpacing: 8,
        marginBottom: 16,
    },
    tagline: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
    },
    features: {
        marginBottom: 48,
    },
    featureItem: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 12,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 320,
    },
});
