package com.looksmaxapp.features.mindfulness.ui

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import kotlinx.coroutines.*

/**
 * Service that shows an overlay warning when addictive scroll patterns are detected
 */
class MindfulOverlayService : Service() {
    
    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    
    companion object {
        private const val TAG = "MindfulOverlay"
        private const val AUTO_DISMISS_DELAY = 10_000L // Auto-dismiss after 10 seconds
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
    
    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val confidence = intent?.getFloatExtra("confidence", 0f) ?: 0f
        val scrollFrequency = intent?.getFloatExtra("scroll_frequency", 0f) ?: 0f
        
        showOverlay(confidence, scrollFrequency)
        
        // Auto-dismiss after delay
        scope.launch {
            delay(AUTO_DISMISS_DELAY)
            dismissOverlay()
        }
        
        return START_NOT_STICKY
    }
    
    private fun showOverlay(confidence: Float, scrollFrequency: Float) {
        // Remove existing overlay if present
        dismissOverlay()
        
        // Create overlay view (you'll need to create a proper layout XML)
        overlayView = createOverlayView(confidence, scrollFrequency)
        
        // Set up window parameters
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            } else {
                @Suppress("DEPRECATION")
                WindowManager.LayoutParams.TYPE_PHONE
            },
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.CENTER
        }
        
        // Add view to window
        try {
            windowManager?.addView(overlayView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    private fun createOverlayView(confidence: Float, scrollFrequency: Float): View {
        // This is a simplified version - you should create a proper layout XML
        val view = LayoutInflater.from(this).inflate(
            android.R.layout.simple_list_item_1, // Temporary - create proper layout
            null
        )
        
        // For now, using a simple TextView as placeholder
        // TODO: Create proper warning_overlay.xml layout
        val textView = view.findViewById<TextView>(android.R.id.text1)
        textView.apply {
            text = """
                ⚠️ Mindful Moment
                
                You've been scrolling rapidly for a while.
                This pattern suggests you might be mindlessly consuming content.
                
                Confidence: ${(confidence * 100).toInt()}%
                Scroll Rate: ${scrollFrequency.toInt()} swipes/min
                
                Take a break?
            """.trimIndent()
            textSize = 16f
            setPadding(40, 40, 40, 40)
            setBackgroundColor(0xDD000000.toInt())
            setTextColor(0xFFFFFFFF.toInt())
        }
        
        // Add dismiss button
        view.setOnClickListener {
            dismissOverlay()
        }
        
        return view
    }
    
    private fun dismissOverlay() {
        overlayView?.let { view ->
            try {
                windowManager?.removeView(view)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        overlayView = null
        stopSelf()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        dismissOverlay()
        scope.cancel()
    }
}