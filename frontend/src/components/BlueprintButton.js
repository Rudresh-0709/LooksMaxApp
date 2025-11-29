import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

export const BlueprintButton = ({ title, onPress, variant = 'primary', style }) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            {isPrimary ? (
                <LinearGradient
                    colors={['rgba(0, 240, 255, 0.1)', 'rgba(0, 240, 255, 0.3)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Text style={styles.text}>{title}</Text>
                        <View style={styles.scanline} />
                    </View>
                    <View style={styles.borderGlow} />
                </LinearGradient>
            ) : (
                <View style={styles.secondaryContent}>
                    <Text style={[styles.text, { color: theme.colors.textDim }]}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        marginTop: theme.spacing.m,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secondaryContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: theme.colors.textDim,
        borderWidth: 1,
    },
    text: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 14,
    },
    scanline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    borderGlow: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        opacity: 0.5,
    }
});
