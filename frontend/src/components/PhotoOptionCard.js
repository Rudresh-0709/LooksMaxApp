import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

/**
 * PhotoOptionCard - Selection card with photo on right side
 * Used for body type, goals, hair loss, beard selection
 * 
 * @param {string} title - Main title text
 * @param {string} subtitle - Optional subtitle/description
 * @param {string} imageSource - Image require() or uri object
 * @param {boolean} selected - Whether this option is selected
 * @param {function} onPress - Selection handler
 * @param {string} variant - 'horizontal' (default) or 'vertical'
 */
export const PhotoOptionCard = ({
    title,
    subtitle,
    imageSource,
    selected = false,
    onPress,
    variant = 'horizontal',
}) => {
    const isHorizontal = variant === 'horizontal';

    const renderPlaceholder = () => (
        <LinearGradient
            colors={[theme.colors.backgroundCard, theme.colors.backgroundElevated]}
            style={isHorizontal ? styles.imagePlaceholderH : styles.imagePlaceholderV}
        >
            <Text style={styles.placeholderText}>📷</Text>
        </LinearGradient>
    );

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isHorizontal ? styles.containerHorizontal : styles.containerVertical,
                selected && styles.containerSelected,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Text content */}
            <View style={isHorizontal ? styles.textContainerH : styles.textContainerV}>
                <Text style={[styles.title, selected && styles.titleSelected]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                )}
            </View>

            {/* Image */}
            <View style={isHorizontal ? styles.imageContainerH : styles.imageContainerV}>
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={isHorizontal ? styles.imageH : styles.imageV}
                        resizeMode="cover"
                    />
                ) : (
                    renderPlaceholder()
                )}
            </View>

            {/* Selection indicator */}
            {selected && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
        marginBottom: 12,
    },
    containerHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 100,
    },
    containerVertical: {
        width: '48%',
        aspectRatio: 0.8,
    },
    containerSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryMuted,
        ...theme.shadows.glow,
    },
    textContainerH: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    textContainerV: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    titleSelected: {
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    imageContainerH: {
        width: 120,
        height: '100%',
    },
    imageContainerV: {
        flex: 1,
    },
    imageH: {
        width: '100%',
        height: '100%',
    },
    imageV: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholderH: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePlaceholderV: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 32,
        opacity: 0.3,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PhotoOptionCard;
