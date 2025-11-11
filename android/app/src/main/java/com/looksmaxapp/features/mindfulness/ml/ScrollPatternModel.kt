package com.looksmaxapp.features.mindfulness.ml

import android.content.Context
import android.util.Log
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

/**
 * TensorFlow Lite model wrapper for scroll pattern classification
 */
class ScrollPatternModel(private val context: Context) {
    
    private var interpreter: Interpreter? = null
    private var isModelLoaded = false
    
    companion object {
        private const val TAG = "ScrollPatternModel"
        private const val MODEL_FILE = "swipe_model.tflite"
        private const val INPUT_SIZE = 8  // Number of features
        private const val OUTPUT_SIZE = 1 // Binary classification
    }
    
    /**
     * Load the TFLite model from assets
     */
    fun loadModel(): Boolean {
        try {
            val modelBuffer = loadModelFile()
            interpreter = Interpreter(modelBuffer)
            isModelLoaded = true
            Log.d(TAG, "Model loaded successfully")
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Error loading model", e)
            return false
        }
    }
    
    /**
     * Load model file from assets
     */
    private fun loadModelFile(): MappedByteBuffer {
        val fileDescriptor = context.assets.openFd(MODEL_FILE)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }
    
    /**
     * Run inference on normalized features
     * @param normalizedFeatures - Array of 8 normalized float values
     * @return Probability of addictive pattern (0.0 to 1.0)
     */
    fun predict(normalizedFeatures: FloatArray): Float {
        if (!isModelLoaded) {
            throw IllegalStateException("Model not loaded. Call loadModel() first.")
        }
        
        if (normalizedFeatures.size != INPUT_SIZE) {
            throw IllegalArgumentException("Expected $INPUT_SIZE features, got ${normalizedFeatures.size}")
        }
        
        // Prepare input (batch size = 1)
        val input = Array(1) { normalizedFeatures }
        
        // Prepare output
        val output = Array(1) { FloatArray(OUTPUT_SIZE) }
        
        // Run inference
        interpreter?.run(input, output)
        
        // Return probability (sigmoid output)
        val probability = output[0][0]
        
        Log.d(TAG, "Prediction: $probability")
        return probability
    }
    
    /**
     * Classify as addictive or normal based on threshold
     */
    fun classify(normalizedFeatures: FloatArray, threshold: Float = 0.5f): Boolean {
        val probability = predict(normalizedFeatures)
        return probability >= threshold
    }
    
    /**
     * Get detailed prediction result
     */
    fun predictWithConfidence(normalizedFeatures: FloatArray, threshold: Float = 0.5f): Pair<Boolean, Float> {
        val probability = predict(normalizedFeatures)
        val isAddictive = probability >= threshold
        return Pair(isAddictive, probability)
    }
    
    /**
     * Clean up resources
     */
    fun close() {
        interpreter?.close()
        interpreter = null
        isModelLoaded = false
        Log.d(TAG, "Model closed")
    }
}