import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import BlueprintButton from '../components/BlueprintButton';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();

        // Glow pulse animation
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
        outputRange: [0.3, 0.8],
    });

    return (
        <View style={styles.container}>
            {/* Grid background */}
            <View style={styles.gridOverlay} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeText}>WELCOME TO</Text>
                    <Text style={styles.appName}>LOOKSMAX</Text>
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Your personal system for{'\n'}fitness, grooming & style
                </Text>

                {/* Central glowing logo area */}
                <View style={styles.logoContainer}>
                    <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />

                    {/* Placeholder for logo image - user should place image at: 
              frontend/src/assets/images/welcome-logo.png */}
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>LOGO</Text>
                        <Text style={styles.logoHint}>Place image at:{'\n'}assets/images/welcome-logo.png</Text>
                    </View>
                </View>

                {/* Get Started Button */}
                <View style={styles.buttonContainer}>
                    <BlueprintButton
                        title="GET STARTED"
                        onPress={() => navigation.navigate('BasicDetails')}
                    />
                </View>

                {/* Decorative corner element */}
                <View style={styles.decorativeCorner} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    gridOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.1,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xxl,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xxl,
    },
    welcomeText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
        fontFamily: theme.typography.fontFamily,
        letterSpacing: 4,
        marginBottom: theme.spacing.sm,
    },
    appName: {
        fontSize: 40,
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily,
        letterSpacing: 8,
        fontWeight: '300',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 1,
        opacity: 0.8,
    },
    logoContainer: {
        width: 280,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    glowCircle: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 40,
        elevation: 20,
    },
    logoPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 240, 255, 0.05)',
    },
    logoText: {
        fontSize: 24,
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily,
        letterSpacing: 4,
        marginBottom: theme.spacing.sm,
    },
    logoHint: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        opacity: 0.5,
        marginTop: theme.spacing.sm,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: theme.spacing.xl,
    },
    decorativeCorner: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: theme.colors.primary,
        opacity: 0.3,
    },
});

export default WelcomeScreen;
