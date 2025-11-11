package com.looksmaxapp.features.mindfulness

import android.content.Context
import android.content.Intent
import android.util.Log
import com.looksmaxapp.features.mindfulness.data.*
import com.looksmaxapp.features.mindfulness.ml.ModelManager
import com.looksmaxapp.features.mindfulness.ui.MindfulOverlayService
import kotlinx.coroutines.*

/**
 * Main controller for mindful usage detection system
 */
class MindfulManager private constructor(private val context: Context) {
    
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val database = MindfulDatabase.getDatabase(context)
    private val sessionAggregator = SessionAggregator()
    private val modelManager = ModelManager.getInstance(context)
    
    private var analysisJob: Job? = null
    private var consecutiveAddictiveWindows = 0
    private var lastWarningTime = 0L
    
    companion object {
        private const val TAG = "MindfulManager"
        private const val ANALYSIS_INTERVAL_MS = 30_000L // Analyze every 30 seconds
        private const val WARNING_COOLDOWN_MS = 1_800_000L // 30 minutes between warnings
        private const val REQUIRED_CONSECUTIVE_WINDOWS = 3 // Need 3 consecutive addictive windows
        
        @Volatile
        private var instance: MindfulManager? = null
        
        fun getInstance(context: Context): MindfulManager {
            return instance ?: synchronized(this) {
                instance ?: MindfulManager(context.applicationContext).also { instance = it }
            }
        }
    }
    
    /**
     * Initialize the system
     */
    fun initialize() {
        Log.d(TAG, "Initializing MindfulManager")
        
        // Initialize ML model
        scope.launch {
            val initialized = modelManager.initialize()
            if (initialized) {
                Log.d(TAG, "Model initialized successfully")
                startPeriodicAnalysis()
            } else {
                Log.e(TAG, "Failed to initialize model")
            }
        }
    }
    
    /**
     * Start periodic analysis of scroll patterns
     */
    private fun startPeriodicAnalysis() {
        analysisJob?.cancel()
        
        analysisJob = scope.launch {
            while (isActive) {
                try {
                    analyzeCurrentWindow()
                    delay(ANALYSIS_INTERVAL_MS)
                } catch (e: Exception) {
                    Log.e(TAG, "Error in analysis loop", e)
                }
            }
        }
        
        Log.d(TAG, "Started periodic analysis")
    }
    
    /**
     * Analyze the current time window
     */
    private suspend fun analyzeCurrentWindow() {
        // Get recent events
        val events = sessionAggregator.getWindowEvents(database.gestureEventDao())
        
        if (events.isEmpty()) {
            consecutiveAddictiveWindows = 0
            return
        }
        
        // Calculate features
        val features = sessionAggregator.calculateFeatures(events) ?: return
        
        // Run ML inference
        val result = modelManager.analyze(features) ?: return
        
        Log.d(TAG, "Analysis result: addictive=${result.isAddictivePattern}, confidence=${result.confidence}")
        
        // Handle result
        if (result.isAddictivePattern) {
            consecutiveAddictiveWindows++
            Log.d(TAG, "Consecutive addictive windows: $consecutiveAddictiveWindows")
            
            // Check if we should warn the user
            if (shouldWarnUser()) {
                showWarning(result)
            }
        } else {
            consecutiveAddictiveWindows = 0
        }
    }
    
    /**
     * Check if we should warn the user
     */
    private fun shouldWarnUser(): Boolean {
        val timeSinceLastWarning = System.currentTimeMillis() - lastWarningTime
        val hasEnoughConsecutiveWindows = consecutiveAddictiveWindows >= REQUIRED_CONSECUTIVE_WINDOWS
        val cooldownExpired = timeSinceLastWarning >= WARNING_COOLDOWN_MS
        
        return hasEnoughConsecutiveWindows && cooldownExpired
    }
    
    /**
     * Show warning to user
     */
    private fun showWarning(result: ScrollPatternResult) {
        lastWarningTime = System.currentTimeMillis()
        consecutiveAddictiveWindows = 0
        
        Log.d(TAG, "Showing warning to user")
        
        // Start overlay service to show warning
        val intent = Intent(context, MindfulOverlayService::class.java).apply {
            putExtra("confidence", result.confidence)
            putExtra("scroll_frequency", result.features.scrollFrequency)
        }
        context.startService(intent)
    }
    
    /**
     * Called when a new scroll event occurs
     */
    fun onScrollEvent(event: GestureEvent) {
        // Can be used for real-time processing if needed
        // Currently, we process in batches during periodic analysis
    }
    
    /**
     * Get current statistics
     */
    suspend fun getCurrentStats(): ScrollWindowFeatures? {
        val events = sessionAggregator.getWindowEvents(database.gestureEventDao())
        return sessionAggregator.calculateFeatures(events)
    }
    
    /**
     * Export data for training (development only)
     */
    suspend fun exportTrainingData(label: Int): String {
        val events = sessionAggregator.getWindowEvents(database.gestureEventDao())
        val features = sessionAggregator.calculateFeatures(events) ?: return ""
        return sessionAggregator.exportToCSV(features, label)
    }
    
    /**
     * Reset warnings
     */
    fun resetWarnings() {
        consecutiveAddictiveWindows = 0
        lastWarningTime = 0L
    }
    
    /**
     * Stop periodic analysis
     */
    fun stop() {
        analysisJob?.cancel()
        Log.d(TAG, "Stopped periodic analysis")
    }
    
    /**
     * Clean up resources
     */
    fun cleanup() {
        stop()
        modelManager.cleanup()
    }
}