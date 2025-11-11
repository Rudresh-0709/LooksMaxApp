package com.looksmaxapp.features.mindfulness.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Represents a single scroll/swipe gesture event
 */
@Entity(tableName = "gesture_events")
data class GestureEvent(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    val timestamp: Long,           // When the gesture occurred
    val scrollDeltaY: Int,          // Pixels scrolled (negative = up, positive = down)
    val scrollDeltaX: Int,          // Horizontal scroll
    val packageName: String,        // Which app
    val duration: Long,             // How long the gesture took (ms)
    val velocity: Float             // Calculated velocity (pixels/second)
)

/**
 * Aggregated features for a time window (used for ML inference)
 */
data class ScrollWindowFeatures(
    val avgScrollVelocity: Float,       // Average pixels/second
    val scrollFrequency: Float,          // Swipes per minute
    val directionChanges: Int,           // How many times direction switched
    val avgInterScrollDelay: Float,      // Average ms between scrolls
    val avgScrollDistance: Float,        // Average pixels per scroll
    val scrollVariance: Float,           // Variance in scroll distances
    val totalScrolls: Int,               // Total number of scrolls in window
    val windowDurationSeconds: Float     // Length of analysis window
)

/**
 * Result from ML model inference
 */
data class ScrollPatternResult(
    val isAddictivePattern: Boolean,     // Classification result
    val confidence: Float,               // Model confidence (0-1)
    val timestamp: Long,                 // When inference was made
    val features: ScrollWindowFeatures   // Features used for inference
)