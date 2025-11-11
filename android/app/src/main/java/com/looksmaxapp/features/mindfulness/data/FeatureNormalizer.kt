package com.looksmaxapp.features.mindfulness.data

import android.content.Context
import com.looksmaxapp.features.mindfulness.data.ScrollWindowFeatures
import org.json.JSONObject
import java.io.IOException

/**
 * Normalizes features using StandardScaler parameters (mean and std)
 * Parameters are loaded from scaler_params.json
 */
class FeatureNormalizer(private val context: Context) {
    
    private var means: FloatArray = floatArrayOf()
    private var stds: FloatArray = floatArrayOf()
    private var isLoaded = false
    
    companion object {
        private const val SCALER_PARAMS_FILE = "scaler_params.json"
    }
    
    /**
     * Load scaler parameters from assets
     */
    fun loadScalerParams(): Boolean {
        try {
            val json = context.assets.open(SCALER_PARAMS_FILE)
                .bufferedReader()
                .use { it.readText() }
            
            val jsonObject = JSONObject(json)
            val meansArray = jsonObject.getJSONArray("means")
            val stdsArray = jsonObject.getJSONArray("stds")
            
            means = FloatArray(meansArray.length()) { i ->
                meansArray.getDouble(i).toFloat()
            }
            
            stds = FloatArray(stdsArray.length()) { i ->
                stdsArray.getDouble(i).toFloat()
            }
            
            isLoaded = true
            return true
        } catch (e: IOException) {
            e.printStackTrace()
            return false
        }
    }
    
    /**
     * Normalize features using StandardScaler formula: (x - mean) / std
     */
    fun normalize(features: ScrollWindowFeatures): FloatArray {
        if (!isLoaded) {
            throw IllegalStateException("Scaler parameters not loaded. Call loadScalerParams() first.")
        }
        
        val rawFeatures = floatArrayOf(
            features.avgScrollVelocity,
            features.scrollFrequency,
            features.directionChanges.toFloat(),
            features.avgInterScrollDelay,
            features.avgScrollDistance,
            features.scrollVariance,
            features.totalScrolls.toFloat(),
            features.windowDurationSeconds
        )
        
        if (rawFeatures.size != means.size) {
            throw IllegalArgumentException("Feature count mismatch: ${rawFeatures.size} vs ${means.size}")
        }
        
        return FloatArray(rawFeatures.size) { i ->
            if (stds[i] != 0f) {
                (rawFeatures[i] - means[i]) / stds[i]
            } else {
                rawFeatures[i] - means[i]
            }
        }
    }
    
    /**
     * Convert features to array without normalization (for initial training data collection)
     */
    fun toArray(features: ScrollWindowFeatures): FloatArray {
        return floatArrayOf(
            features.avgScrollVelocity,
            features.scrollFrequency,
            features.directionChanges.toFloat(),
            features.avgInterScrollDelay,
            features.avgScrollDistance,
            features.scrollVariance,
            features.totalScrolls.toFloat(),
            features.windowDurationSeconds
        )
    }
}