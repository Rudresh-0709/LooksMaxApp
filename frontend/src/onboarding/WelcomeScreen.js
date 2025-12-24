import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Activity, ClipboardCheck, Trophy } from 'lucide-react-native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <View style={styles.featureCard}>
        <View style={styles.iconContainer}>
            <Icon size={20} color="#6366F1" />
        </View>
        <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDesc}>{desc}</Text>
        </View>
    </View>
);

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Top Image Section - slightly smaller to save space */}
            <View style={styles.imageSection}>
                <ImageBackground
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwXFI8evcBqf76LAK0wbXmbr6mEj4oSj0JDxh2lh1EYrKVTFZWKjMr6bk9Nc1adlC-9H5tQFcHJPcDtGnxU_Xek44BrLupGFMIFPAiYpybp6oBDzJjxLY2MaNnG8P0JlRwAxFbIHQymRWo781dLtIUybfmQSmC2l334lschm7NwnPc3mLWdhchVj2IoxEFleEnvSmdr_SshbjiLNhKyYi5dLuUvwRlLVaiJO0JGXqkn4-r4MEvyQioeX36JUBuN0uagj7iRLXRKxo_' }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(2, 6, 23, 0.4)', '#020617']}
                        style={styles.gradientOverlay}
                    />
                </ImageBackground>
            </View>

            {/* Content Section - Use flex to fill space without scrolling */}
            <View style={styles.contentSection}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Fitness <Text style={styles.primaryText}>Reimagined</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Track workouts and reach your peak performance.
                    </Text>
                </View>

                {/* Features - Compact list */}
                <View style={styles.featuresContainer}>
                    <FeatureCard
                        icon={Activity}
                        title="Advanced Analytics"
                        desc="Real-time performance tracking"
                    />
                    <FeatureCard
                        icon={ClipboardCheck}
                        title="Personalized Plans"
                        desc="AI-crafted routines for you"
                    />
                    <FeatureCard
                        icon={Trophy}
                        title="Community Challenges"
                        desc="Compete and stay motivated"
                    />
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Name')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLink}>
                        <Text style={styles.loginText}>
                            Already have an account? <Text style={styles.primaryTextSmall}>Log in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    imageSection: {
        width: '100%',
        height: height * 0.35, // Reduced from 0.45 to 0.35
        padding: 16,
        paddingTop: 40,
    },
    backgroundImage: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    contentSection: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between', // Ensures even distribution
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: -10,
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 46,
    },
    primaryText: {
        color: '#6366F1',
    },
    subtitle: {
        fontSize: 15,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    featuresContainer: {
        gap: 8, // Reduced gap
        marginVertical: 10,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 12,
        padding: 12, // Reduced padding
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    featureDesc: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 1,
    },
    bottomSection: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#6366F1',
        height: 58, // Slightly smaller button
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    loginLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    primaryTextSmall: {
        color: '#6366F1',
        fontWeight: '700',
    },
});
