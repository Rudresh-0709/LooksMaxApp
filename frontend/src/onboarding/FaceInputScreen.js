import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import { BlueprintButton } from '../components/BlueprintButton';
import { saveUserData, getUserData } from '../services/userDataService';

const PhotoSlot = ({ label, onPress }) => (
    <TouchableOpacity style={styles.slot} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
            colors={theme.gradients.card}
            style={styles.slotGradient}
        />
        <View style={styles.slotInner}>
            <Camera size={32} color={theme.colors.primary} />
            <Text style={styles.slotLabel}>{label}</Text>
        </View>
    </TouchableOpacity>
);

export default function FaceInputScreen({ navigation }) {
    const [photos, setPhotos] = useState({
        front: null,
        left: null,
        right: null,
    });

    const handleNext = async () => {
        await saveUserData({ facePhotos: photos });
        navigation.navigate('HairLoss');
    };

    const handleSkip = () => {
        navigation.navigate('HairLoss');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: '53%' }]}
                        />
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Add your photos</Text>
                <Text style={styles.subtitle}>
                    Optional: We'll use AI to analyze your facial features
                </Text>

                <View style={styles.slotsContainer}>
                    <PhotoSlot label="Front" onPress={() => { }} />
                    <PhotoSlot label="Left" onPress={() => { }} />
                    <PhotoSlot label="Right" onPress={() => { }} />
                </View>

                <View style={styles.tips}>
                    <Text style={styles.tipsTitle}>📸 Tips for best results</Text>
                    <Text style={styles.tipItem}>• Good lighting, no shadows</Text>
                    <Text style={styles.tipItem}>• Neutral expression</Text>
                    <Text style={styles.tipItem}>• Hair pulled back</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <BlueprintButton title="CONTINUE" onPress={handleNext} />
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip for now</Text>
                    <ChevronRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        paddingTop: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 32,
        lineHeight: 24,
    },
    slotsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    slot: {
        flex: 1,
        aspectRatio: 0.75,
        borderRadius: theme.borders.radius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    slotGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    slotInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotLabel: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    tips: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
    },
    tipItem: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 6,
    },
    footer: {
        padding: 24,
        paddingBottom: 32,
    },
    skipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    skipText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
