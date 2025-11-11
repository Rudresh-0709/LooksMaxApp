package com.looksmaxapp.features.mindfulness.accessibility

import android.view.accessibility.AccessibilityEvent
import com.looksmaxapp.features.mindfulness.data.GestureEvent

/**
 * Parses AccessibilityEvents into GestureEvent objects
 */
class AccessibilityEventParser {
    
    private var lastScrollTimestamp: Long = 0
    private var lastScrollDeltaY: Int = 0
    
    /**
     * Parse a scroll event from AccessibilityEvent
     */
    fun parseScrollEvent(event: AccessibilityEvent): GestureEvent? {
        if (event.eventType != AccessibilityEvent.TYPE_VIEW_SCROLLED) {
            return null
        }
        
        val currentTime = System.currentTimeMillis()
        val scrollDeltaY = event.scrollDeltaY
        val scrollDeltaX = event.scrollDeltaX
        val packageName = event.packageName?.toString() ?: "unknown"
        
        // Calculate duration between scrolls
        val duration = if (lastScrollTimestamp > 0) {
            currentTime - lastScrollTimestamp
        } else {
            0L
        }
        
        // Calculate velocity (pixels per second)
        val velocity = if (duration > 0) {
            (scrollDeltaY.toFloat() / duration) * 1000f
        } else {
            0f
        }
        
        lastScrollTimestamp = currentTime
        lastScrollDeltaY = scrollDeltaY
        
        return GestureEvent(
            timestamp = currentTime,
            scrollDeltaY = scrollDeltaY,
            scrollDeltaX = scrollDeltaX,
            packageName = packageName,
            duration = duration,
            velocity = Math.abs(velocity)
        )
    }
    
    /**
     * Check if the scroll event is significant enough to track
     * (filters out minor scrolls)
     */
    fun isSignificantScroll(event: GestureEvent): Boolean {
        return Math.abs(event.scrollDeltaY) > 50 || Math.abs(event.scrollDeltaX) > 50
    }
    
    fun reset() {
        lastScrollTimestamp = 0
        lastScrollDeltaY = 0
    }
}