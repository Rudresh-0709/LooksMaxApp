import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '../theme/theme';

/**
 * ProgressHeader - Top navigation with back button, step indicator, and progress bar
 * 
 * @param {number} currentStep - Current step number (1-7)
 * @param {number} totalSteps - Total number of steps
 * @param {string} sectionName - Name of current section
 * @param {function} onBack - Back button handler (optional)
 */
export const ProgressHeader = ({
    currentStep,
    totalSteps = 7,
    sectionName,
    onBack
}) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ChevronLeft size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.backPlaceholder} />
                )}

                <View style={styles.stepInfo}>
                    <Text style={styles.stepNumber}>
                        {String(currentStep).padStart(2, '0')}
                    </Text>
                    <Text style={styles.sectionName}>{sectionName}</Text>
                </View>

                <View style={styles.backPlaceholder} />
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: 16,
        backgroundColor: theme.colors.background,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borders.radius.md,
        backgroundColor: theme.colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backPlaceholder: {
        width: 40,
    },
    stepInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
        marginRight: 8,
    },
    sectionName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    progressContainer: {
        paddingHorizontal: 16,
    },
    progressTrack: {
        height: 3,
        backgroundColor: theme.colors.borderMuted,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 2,
    },
});

export default ProgressHeader;
