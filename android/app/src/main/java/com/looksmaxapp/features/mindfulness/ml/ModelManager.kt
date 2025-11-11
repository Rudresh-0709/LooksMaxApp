package com.looksmaxapp.features.mindfulness.ml

import android.content.Context
import android.util.Log
import com.looksmaxapp.features.mindfulness.data.FeatureNormalizer
import com.looksmaxapp.features.mindfulness.data.ScrollPatternResult
import com.looksmaxapp.features.mindfulness.data.ScrollWindowFeatures

/**
 * Manages the ML model lifecycle and inference pipeline
 */
class ModelManager(private val context: Context) {
    
    private val model = ScrollPatternModel(context)
    private val normalizer = FeatureNormalizer(context)
    private var isInitialized = false
    
    companion object {
        private const val TAG = "ModelManager"
        private const val DEFAULT_THRESHOLD = 0.6f // Confidence threshold for classification
        
        @Volatile
        private var instance: ModelManager? = null
        
        fun getInstance(context: Context): ModelManager {
            return instance ?: synchronized(this) {
                instance ?: ModelManager(context.applicationContext).also { instance = it }
            }
        }
    }
    
    /**
     * Initialize the model and normalizer
     */
    fun initialize(): Boolean {
        if (isInitialized) {
            Log.d(TAG, "Already initialized")
            return true
        }
        
        val modelLoaded = model.loadModel()
        val scalerLoaded = normalizer.loadScalerParams()
        
        isInitialized = modelLoaded && scalerLoaded
        
        if (isInitialized) {
            Log.d(TAG, "Model and normalizer initialized successfully")
        } else {
            Log.e(TAG, "Failed to initialize: model=$modelLoaded, scaler=$scalerLoaded")
        }
        
        return isInitialized
    }
    
    /**
     * Run inference on scroll window features
     */
    fun analyze(features: ScrollWindowFeatures): ScrollPatternResult? {
        if (!isInitialized) {
            Log.e(TAG, "Model not initialized. Call initialize() first.")
            return null
        }
        
        try {
            // Normalize features
            val normalizedFeatures = normalizer.normalize(features)
            
            // Run prediction
            val (isAddictive, confidence) = model.predictWithConfidence(
                normalizedFeatures,
                DEFAULT_THRESHOLD
            )
            
            return ScrollPatternResult(
                isAddictivePattern = isAddictive,
                confidence = confidence,
                timestamp = System.currentTimeMillis(),
                features = features
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error during analysis", e)
            return null
        }
    }
    
    /**
     * Batch analyze multiple feature sets
     */
    fun analyzeBatch(featuresList: List<ScrollWindowFeatures>): List<ScrollPatternResult> {
        return featuresList.mapNotNull { analyze(it) }
    }
    
    /**
     * Check if current behavior is addictive with custom threshold
     */
    fun isAddictiveBehavior(
        features: ScrollWindowFeatures,
        threshold: Float = DEFAULT_THRESHOLD
    ): Boolean {
        if (!isInitialized) return false
        
        return try {
            val normalizedFeatures = normalizer.normalize(features)
            model.classify(normalizedFeatures, threshold)
        } catch (e: Exception) {
            Log.e(TAG, "Error checking addictive behavior", e)
            false
        }
    }
    
    /**
     * Get raw prediction probability
     */
    fun getPredictionProbability(features: ScrollWindowFeatures): Float? {
        if (!isInitialized) return null
        
        return try {
            val normalizedFeatures = normalizer.normalize(features)
            model.predict(normalizedFeatures)
        } catch (e: Exception) {
            Log.e(TAG, "Error getting prediction probability", e)
            null
        }
    }
    
    /**
     * Clean up resources
     */
    fun cleanup() {
        model.close()
        isInitialized = false
        Log.d(TAG, "Model manager cleaned up")
    }
}