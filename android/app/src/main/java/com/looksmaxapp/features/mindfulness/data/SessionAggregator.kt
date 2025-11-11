package com.looksmaxapp.features.mindfulness.data

import kotlin.math.abs
import kotlin.math.pow
import kotlin.math.sqrt

/**
 * Aggregates raw gesture events into ML features
 */
class SessionAggregator {
    
    companion object {
        private const val WINDOW_DURATION_MS = 30_000L // 30 seconds
    }
    
    /**
     * Calculate features from a list of gesture events
     */
    fun calculateFeatures(events: List<GestureEvent>): ScrollWindowFeatures? {
        if (events.isEmpty()) return null
        
        // Calculate time window
        val startTime = events.first().timestamp
        val endTime = events.last().timestamp
        val windowDuration = endTime - startTime
        
        if (windowDuration <= 0) return null
        
        // 1. Average scroll velocity
        val avgVelocity = events.map { it.velocity }.average().toFloat()
        
        // 2. Scroll frequency (swipes per minute)
        val frequency = (events.size.toFloat() / windowDuration) * 60_000f
        
        // 3. Direction changes (how many times user switched scroll direction)
        val directionChanges = countDirectionChanges(events)
        
        // 4. Average inter-scroll delay (ms between scrolls)
        val interScrollDelays = mutableListOf<Long>()
        for (i in 1 until events.size) {
            val delay = events[i].timestamp - events[i - 1].timestamp
            interScrollDelays.add(delay)
        }
        val avgDelay = if (interScrollDelays.isNotEmpty()) {
            interScrollDelays.average().toFloat()
        } else {
            0f
        }
        
        // 5. Average scroll distance (absolute pixels)
        val avgDistance = events.map { abs(it.scrollDeltaY).toFloat() }.average().toFloat()
        
        // 6. Scroll variance (measure of consistency)
        val variance = calculateVariance(events.map { abs(it.scrollDeltaY).toFloat() })
        
        return ScrollWindowFeatures(
            avgScrollVelocity = avgVelocity,
            scrollFrequency = frequency,
            directionChanges = directionChanges,
            avgInterScrollDelay = avgDelay,
            avgScrollDistance = avgDistance,
            scrollVariance = variance,
            totalScrolls = events.size,
            windowDurationSeconds = windowDuration / 1000f
        )
    }
    
    /**
     * Count how many times scroll direction changed (up -> down or down -> up)
     */
    private fun countDirectionChanges(events: List<GestureEvent>): Int {
        if (events.size < 2) return 0
        
        var changes = 0
        var lastDirection = if (events[0].scrollDeltaY > 0) 1 else -1
        
        for (i in 1 until events.size) {
            val currentDirection = if (events[i].scrollDeltaY > 0) 1 else -1
            if (currentDirection != lastDirection) {
                changes++
                lastDirection = currentDirection
            }
        }
        
        return changes
    }
    
    /**
     * Calculate variance of a list of values
     */
    private fun calculateVariance(values: List<Float>): Float {
        if (values.isEmpty()) return 0f
        
        val mean = values.average().toFloat()
        val squaredDiffs = values.map { (it - mean).pow(2) }
        return sqrt(squaredDiffs.average().toFloat())
    }
    
    /**
     * Get events within the current time window
     */
    suspend fun getWindowEvents(
        dao: GestureEventDao,
        windowDurationMs: Long = WINDOW_DURATION_MS
    ): List<GestureEvent> {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - windowDurationMs
        return dao.getEventsBetween(startTime, endTime)
    }
    
    /**
     * Export events to CSV format for training
     */
    fun exportToCSV(features: ScrollWindowFeatures, label: Int? = null): String {
        return buildString {
            append("${features.avgScrollVelocity},")
            append("${features.scrollFrequency},")
            append("${features.directionChanges},")
            append("${features.avgInterScrollDelay},")
            append("${features.avgScrollDistance},")
            append("${features.scrollVariance},")
            append("${features.totalScrolls},")
            append("${features.windowDurationSeconds}")
            if (label != null) {
                append(",$label")
            }
            append("\n")
        }
    }
    
    /**
     * Get CSV header for export
     */
    fun getCSVHeader(includeLabel: Boolean = false): String {
        return buildString {
            append("avg_scroll_velocity,")
            append("scroll_frequency,")
            append("direction_changes,")
            append("avg_inter_scroll_delay,")
            append("avg_scroll_distance,")
            append("scroll_variance,")
            append("total_scrolls,")
            append("window_duration_seconds")
            if (includeLabel) {
                append(",label")
            }
            append("\n")
        }
    }
}