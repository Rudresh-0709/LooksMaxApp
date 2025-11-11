"""
Data Preprocessing and Feature Engineering Script

Converts raw scroll logs into ML-ready features
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

# Configuration
DATASET_DIR = Path("dataset")
RAW_LOGS_FILE = DATASET_DIR / "raw_logs.csv"
LABELS_FILE = DATASET_DIR / "labels.csv"
PROCESSED_FILE = DATASET_DIR / "processed_features.csv"
WINDOW_SIZE_MS = 30000  # 30-second windows

def load_data():
    """Load raw logs and labels"""
    print("Loading data...")
    
    logs = pd.read_csv(RAW_LOGS_FILE)
    labels = pd.read_csv(LABELS_FILE)
    
    print(f"✓ Loaded {len(logs)} scroll events")
    print(f"✓ Loaded {len(labels)} labeled sessions")
    
    return logs, labels

def calculate_window_features(events):
    """
    Calculate features for a window of scroll events
    
    Features:
    1. avg_scroll_velocity - Average pixels/second
    2. scroll_frequency - Swipes per minute
    3. direction_changes - How many times direction switched
    4. avg_inter_scroll_delay - Average ms between scrolls
    5. avg_scroll_distance - Average pixels per scroll
    6. scroll_variance - Variance in scroll distances
    7. total_scrolls - Total number of scrolls
    8. window_duration_seconds - Duration of window
    """
    if len(events) == 0:
        return None
    
    features = {}
    
    # Sort by timestamp
    events = events.sort_values('timestamp')
    
    # 1. Average scroll velocity
    features['avg_scroll_velocity'] = events['velocity'].mean()
    
    # 2. Scroll frequency (swipes per minute)
    time_span_ms = events['timestamp'].max() - events['timestamp'].min()
    if time_span_ms > 0:
        features['scroll_frequency'] = (len(events) / time_span_ms) * 60000
    else:
        features['scroll_frequency'] = 0
    
    # 3. Direction changes
    scroll_deltas = events['scroll_delta_y'].values
    directions = np.sign(scroll_deltas)
    direction_changes = np.sum(directions[1:] != directions[:-1])
    features['direction_changes'] = direction_changes
    
    # 4. Average inter-scroll delay
    timestamps = events['timestamp'].values
    if len(timestamps) > 1:
        delays = np.diff(timestamps)
        features['avg_inter_scroll_delay'] = delays.mean()
    else:
        features['avg_inter_scroll_delay'] = 0
    
    # 5. Average scroll distance
    features['avg_scroll_distance'] = np.abs(events['scroll_delta_y']).mean()
    
    # 6. Scroll variance (standard deviation)
    features['scroll_variance'] = np.abs(events['scroll_delta_y']).std()
    
    # 7. Total scrolls
    features['total_scrolls'] = len(events)
    
    # 8. Window duration
    features['window_duration_seconds'] = time_span_ms / 1000.0
    
    return features

def create_windows(logs, labels):
    """
    Create sliding windows from raw logs with labels
    """
    print("\nCreating windows...")
    
    all_features = []
    
    for _, label_row in labels.iterrows():
        start_time = label_row['start_timestamp']
        end_time = label_row['end_timestamp']
        label = label_row['label']
        
        # Get events in this session
        session_events = logs[
            (logs['timestamp'] >= start_time) & 
            (logs['timestamp'] <= end_time)
        ]
        
        if len(session_events) < 3:  # Need minimum events
            continue
        
        # Create sliding windows within this session
        session_duration = end_time - start_time
        num_windows = max(1, int(session_duration / WINDOW_SIZE_MS))
        
        for i in range(num_windows):
            window_start = start_time + (i * WINDOW_SIZE_MS)
            window_end = window_start + WINDOW_SIZE_MS
            
            window_events = session_events[
                (session_events['timestamp'] >= window_start) &
                (session_events['timestamp'] <= window_end)
            ]
            
            if len(window_events) >= 3:  # Minimum events per window
                features = calculate_window_features(window_events)
                if features:
                    features['label'] = label
                    all_features.append(features)
    
    print(f"✓ Created {len(all_features)} feature windows")
    
    return pd.DataFrame(all_features)

def clean_features(df):
    """Clean and validate features"""
    print("\nCleaning features...")
    
    # Remove NaN values
    initial_count = len(df)
    df = df.dropna()
    print(f"✓ Removed {initial_count - len(df)} rows with NaN values")
    
    # Remove infinite values
    initial_count = len(df)
    df = df.replace([np.inf, -np.inf], np.nan).dropna()
    print(f"✓ Removed {initial_count - len(df)} rows with infinite values")
    
    # Remove outliers (optional - using z-score method)
    feature_cols = [col for col in df.columns if col != 'label']
    z_scores = np.abs((df[feature_cols] - df[feature_cols].mean()) / df[feature_cols].std())
    df = df[(z_scores < 4).all(axis=1)]
    
    return df

def show_feature_stats(df):
    """Display feature statistics"""
    print("\n" + "="*60)
    print("FEATURE STATISTICS")
    print("="*60)
    
    feature_cols = [col for col in df.columns if col != 'label']
    
    print("\nFeature ranges:")
    for col in feature_cols:
        print(f"  {col:30s}: {df[col].min():10.2f} to {df[col].max():10.2f}")
    
    print(f"\nClass distribution:")
    print(df['label'].value_counts())
    
    print(f"\nTotal samples: {len(df)}")

def main():
    """Main preprocessing pipeline"""
    print("="*60)
    print("MINDFUL SCROLL - DATA PREPROCESSING")
    print("="*60)
    
    # Load data
    logs, labels = load_data()
    
    # Create features
    features_df = create_windows(logs, labels)
    
    if len(features_df) == 0:
        print("\n✗ No features created. Check your data!")
        return
    
    # Clean features
    features_df = clean_features(features_df)
    
    # Show statistics
    show_feature_stats(features_df)
    
    # Save processed features
    features_df.to_csv(PROCESSED_FILE, index=False)
    print(f"\n✓ Saved processed features to {PROCESSED_FILE}")
    
    # Check if ready for training
    if len(features_df) < 100:
        print("\n⚠ Warning: You have less than 100 samples.")
        print("   Recommendation: Collect more data for better model performance.")
    
    label_counts = features_df['label'].value_counts()
    if len(label_counts) < 2:
        print("\n✗ Error: You need both normal (0) and addictive (1) samples!")
        return
    
    balance = label_counts.min() / label_counts.max()
    if balance < 0.3:
        print(f"\n⚠ Warning: Classes are imbalanced (ratio: {balance:.2%})")
        print("   Recommendation: Collect more samples of the minority class.")
    
    print("\n✓ Data preprocessing complete!")
    print(f"  Ready for training with {len(features_df)} samples")

if __name__ == "__main__":
    main()