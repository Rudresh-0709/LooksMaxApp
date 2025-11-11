package com.looksmaxapp.features.mindfulness.worker

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.looksmaxapp.features.mindfulness.data.MindfulDatabase

/**
 * Background worker to clean up old gesture event data
 */
class DataCleanupWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    
    companion object {
        private const val TAG = "DataCleanupWorker"
        private const val RETENTION_DAYS = 7 // Keep data for 7 days
    }
    
    override suspend fun doWork(): Result {
        return try {
            Log.d(TAG, "Starting data cleanup")
            
            val database = MindfulDatabase.getDatabase(applicationContext)
            val dao = database.gestureEventDao()
            
            // Calculate cutoff time (7 days ago)
            val cutoffTime = System.currentTimeMillis() - (RETENTION_DAYS * 24 * 60 * 60 * 1000L)
            
            // Delete old events
            dao.deleteOldEvents(cutoffTime)
            
            // Get remaining count
            val remainingCount = dao.getEventCount()
            
            Log.d(TAG, "Cleanup complete. Remaining events: $remainingCount")
            
            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Error during cleanup", e)
            Result.retry()
        }
    }
}