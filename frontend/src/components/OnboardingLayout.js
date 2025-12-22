import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

/**
 * OnboardingLayout - Standard layout for single-input onboarding screens
 * 
 * @param {string} title - Main question/title
 * @param {string} subtitle - Optional helper text
 * @param {number} step - Current step number
 * @param {number} totalSteps - Total steps (default 17)
 * @param {function} onBack - Back button handler
 * @param {React.ReactNode} children - Input content
 * @param {React.ReactNode} footer - Optional footer (for sliders with NEXT button)
 */
export const OnboardingLayout = ({
    title,
    subtitle,
    step,
    totalSteps = 17,
    onBack,
    children,
    footer,
}) => {
    const progress = (step / totalSteps) * 100;

    return (
        <SafeAreaView style={styles.container}>
            {/* Gradient background */}
            <LinearGradient
                colors={['rgba(102, 126, 234, 0.1)', 'transparent']}
                style={styles.gradientBg}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
            />

            {/* Header */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ChevronLeft size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                )}

                {/* Progress bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

                <View style={styles.inputContainer}>
                    {children}
                </View>
            </View>

            {/* Footer */}
            {footer && <View style={styles.footer}>{footer}</View>}
        </SafeAreaView>
    );
};

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.glass,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    progressContainer: {
        flex: 1,
    },
    progressTrack: {
        height: 4,
        backgroundColor: theme.colors.borderMuted,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 40,
        lineHeight: 24,
    },
    inputContainer: {
        flex: 1,
    },
    footer: {
        padding: 24,
        paddingBottom: 32,
    },
});

export default OnboardingLayout;
