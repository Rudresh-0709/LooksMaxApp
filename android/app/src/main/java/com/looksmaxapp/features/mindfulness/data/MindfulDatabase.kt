package com.looksmaxapp.features.mindfulness.data

import android.content.Context
import androidx.room.*
import androidx.room.Database

@Database(
    entities = [GestureEvent::class],
    version = 1,
    exportSchema = false
)
abstract class MindfulDatabase : RoomDatabase() {
    abstract fun gestureEventDao(): GestureEventDao
    
    companion object {
        @Volatile
        private var INSTANCE: MindfulDatabase? = null
        
        fun getDatabase(context: Context): MindfulDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MindfulDatabase::class.java,
                    "mindful_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

@Dao
interface GestureEventDao {
    @Insert
    suspend fun insert(event: GestureEvent)
    
    @Query("SELECT * FROM gesture_events WHERE timestamp >= :startTime ORDER BY timestamp ASC")
    suspend fun getEventsAfter(startTime: Long): List<GestureEvent>
    
    @Query("SELECT * FROM gesture_events WHERE timestamp BETWEEN :startTime AND :endTime ORDER BY timestamp ASC")
    suspend fun getEventsBetween(startTime: Long, endTime: Long): List<GestureEvent>
    
    @Query("DELETE FROM gesture_events WHERE timestamp < :cutoffTime")
    suspend fun deleteOldEvents(cutoffTime: Long)
    
    @Query("SELECT COUNT(*) FROM gesture_events")
    suspend fun getEventCount(): Int
    
    @Query("DELETE FROM gesture_events")
    suspend fun deleteAll()
    
    @Query("SELECT * FROM gesture_events ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecentEvents(limit: Int): List<GestureEvent>
}