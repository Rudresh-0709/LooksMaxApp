package com.looksmaxapp.features.mindfulness.accessibility

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.looksmaxapp.features.mindfulness.MindfulManager
import com.looksmaxapp.features.mindfulness.data.MindfulDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * Accessibility service that tracks scroll events for mindful usage detection
 */
class MindfulAccessibilityService : AccessibilityService() {
    
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private lateinit var database: MindfulDatabase
    private lateinit var eventParser: AccessibilityEventParser
    private lateinit var mindfulManager: MindfulManager
    
    companion object {
        private const val TAG = "MindfulAccessibility"
        var isServiceRunning = false
            private set
    }
    
    override fun onServiceConnected() {
        super.onServiceConnected()
        
        // Configure the service
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_VIEW_SCROLLED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS
            notificationTimeout = 100
        }
        serviceInfo = info
        
        // Initialize components
        database = MindfulDatabase.getDatabase(applicationContext)
        eventParser = AccessibilityEventParser()
        mindfulManager = MindfulManager.getInstance(applicationContext)
        
        isServiceRunning = true
        Log.d(TAG, "Mindful Accessibility Service connected")
    }
    
    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        // Only process scroll events
        if (event.eventType != AccessibilityEvent.TYPE_VIEW_SCROLLED) {
            return
        }
        
        // Parse the event
        val gestureEvent = eventParser.parseScrollEvent(event) ?: return
        
        // Filter out insignificant scrolls
        if (!eventParser.isSignificantScroll(gestureEvent)) {
            return
        }
        
        // Store in database
        serviceScope.launch {
            try {
                database.gestureEventDao().insert(gestureEvent)
                
                // Notify manager about new scroll event
                mindfulManager.onScrollEvent(gestureEvent)
                
                Log.d(TAG, "Logged scroll: ${gestureEvent.scrollDeltaY}px at ${gestureEvent.velocity}px/s in ${gestureEvent.packageName}")
            } catch (e: Exception) {
                Log.e(TAG, "Error saving gesture event", e)
            }
        }
    }
    
    override fun onInterrupt() {
        Log.d(TAG, "Service interrupted")
    }
    
    override fun onDestroy() {
        super.onDestroy()
        isServiceRunning = false
        eventParser.reset()
        Log.d(TAG, "Service destroyed")
    }
}