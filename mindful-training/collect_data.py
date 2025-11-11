"""
Data Collection Script for Mindful Scroll Detection

This script helps you collect and label training data from your Android app.
Run this while using the app and label your behavior.
"""

import subprocess
import time
import csv
from datetime import datetime
from pathlib import Path

# Configuration
DATASET_DIR = Path("dataset")
RAW_LOGS_FILE = DATASET_DIR / "raw_logs.csv"
LABELS_FILE = DATASET_DIR / "labels.csv"

# Create dataset directory
DATASET_DIR.mkdir(exist_ok=True)

def init_csv_files():
    """Initialize CSV files with headers"""
    if not RAW_LOGS_FILE.exists():
        with open(RAW_LOGS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'timestamp',
                'scroll_delta_y',
                'scroll_delta_x',
                'package_name',
                'duration',
                'velocity'
            ])
    
    if not LABELS_FILE.exists():
        with open(LABELS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'start_timestamp',
                'end_timestamp',
                'label',
                'notes'
            ])

def pull_data_from_device():
    """Pull gesture event data from Android device"""
    print("Pulling data from device...")
    
    # Pull the database file from device
    # Adjust the path based on your app's package name
    db_path = "/data/data/com.looksmaxapp/databases/mindful_database"
    local_path = DATASET_DIR / "mindful_database"
    
    try:
        subprocess.run([
            "adb", "pull", db_path, str(local_path)
        ], check=True)
        print(f"✓ Database pulled successfully to {local_path}")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to pull database. Make sure:")
        print("  1. Device is connected via ADB")
        print("  2. App is installed and has run")
        print("  3. App has stored some data")
        return False

def export_data_from_db():
    """Export data from SQLite database to CSV"""
    import sqlite3
    
    db_path = DATASET_DIR / "mindful_database"
    if not db_path.exists():
        print("Database file not found!")
        return
    
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    # Get all gesture events
    cursor.execute("""
        SELECT timestamp, scrollDeltaY, scrollDeltaX, packageName, duration, velocity
        FROM gesture_events
        ORDER BY timestamp
    """)
    
    rows = cursor.fetchall()
    
    # Append to raw logs
    with open(RAW_LOGS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    
    conn.close()
    print(f"✓ Exported {len(rows)} events to {RAW_LOGS_FILE}")

def label_session():
    """Interactive session labeling"""
    print("\n" + "="*50)
    print("SESSION LABELING")
    print("="*50)
    print("\nAfter using your phone, label your behavior:")
    print("  0 = Normal browsing (reading, casual scrolling)")
    print("  1 = Addictive pattern (shorts/reels, mindless scrolling)")
    print()
    
    start_time = input("Start timestamp (or press Enter to use 5 min ago): ").strip()
    if not start_time:
        start_time = int((datetime.now().timestamp() - 300) * 1000)  # 5 min ago
    else:
        start_time = int(start_time)
    
    end_time = input("End timestamp (or press Enter to use now): ").strip()
    if not end_time:
        end_time = int(datetime.now().timestamp() * 1000)
    else:
        end_time = int(end_time)
    
    label = input("Label (0=normal, 1=addictive): ").strip()
    while label not in ['0', '1']:
        print("Invalid! Enter 0 or 1")
        label = input("Label (0=normal, 1=addictive): ").strip()
    
    notes = input("Notes (optional): ").strip()
    
    # Save label
    with open(LABELS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([start_time, end_time, label, notes])
    
    print(f"✓ Labeled session: {start_time} to {end_time} as {label}")

def show_menu():
    """Show main menu"""
    print("\n" + "="*50)
    print("MINDFUL SCROLL - DATA COLLECTION")
    print("="*50)
    print("\n1. Pull data from device")
    print("2. Label a session")
    print("3. View statistics")
    print("4. Exit")
    print()

def show_statistics():
    """Show current dataset statistics"""
    try:
        # Count raw logs
        with open(RAW_LOGS_FILE, 'r') as f:
            raw_count = sum(1 for _ in f) - 1  # Exclude header
        
        # Count labels
        with open(LABELS_FILE, 'r') as f:
            labels = list(csv.DictReader(f))
            label_count = len(labels)
            normal_count = sum(1 for l in labels if l['label'] == '0')
            addictive_count = sum(1 for l in labels if l['label'] == '1')
        
        print("\n" + "="*50)
        print("DATASET STATISTICS")
        print("="*50)
        print(f"Raw scroll events: {raw_count}")
        print(f"Labeled sessions: {label_count}")
        print(f"  - Normal: {normal_count}")
        print(f"  - Addictive: {addictive_count}")
        print()
        
        if label_count > 0:
            balance = min(normal_count, addictive_count) / max(normal_count, addictive_count)
            print(f"Class balance: {balance:.2%}")
            if balance < 0.5:
                print("⚠ Warning: Classes are imbalanced. Try to collect more of the minority class.")
    
    except FileNotFoundError:
        print("No data collected yet!")

def main():
    """Main collection loop"""
    print("Mindful Scroll Pattern - Data Collection Tool")
    print("Make sure your Android device is connected via ADB")
    
    init_csv_files()
    
    while True:
        show_menu()
        choice = input("Choose an option: ").strip()
        
        if choice == '1':
            if pull_data_from_device():
                export_data_from_db()
        elif choice == '2':
            label_session()
        elif choice == '3':
            show_statistics()
        elif choice == '4':
            print("Goodbye!")
            break
        else:
            print("Invalid choice!")

if __name__ == "__main__":
    main()