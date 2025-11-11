"""
Model Training Script

Trains a binary classifier to detect addictive scroll patterns
and converts it to TensorFlow Lite for Android deployment
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import tensorflow as tf

# Configuration
DATASET_DIR = Path("dataset")
PROCESSED_FILE = DATASET_DIR / "processed_features.csv"
MODEL_OUTPUT_DIR = Path("../app/src/main/assets")
TFLITE_MODEL_FILE = MODEL_OUTPUT_DIR / "swipe_model.tflite"
SCALER_PARAMS_FILE = MODEL_OUTPUT_DIR / "scaler_params.json"

# Create output directory
MODEL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def load_data():
    """Load processed features"""
    print("Loading processed features...")
    df = pd.read_csv(PROCESSED_FILE)
    
    # Separate features and labels
    X = df.drop('label', axis=1)
    y = df['label']
    
    print(f"✓ Loaded {len(X)} samples with {len(X.columns)} features")
    print(f"  Class 0 (Normal): {sum(y == 0)}")
    print(f"  Class 1 (Addictive): {sum(y == 1)}")
    
    return X, y

def train_sklearn_model(X_train, y_train, X_test, y_test):
    """Train and evaluate multiple sklearn models"""
    print("\n" + "="*60)
    print("TRAINING SKLEARN MODELS")
    print("="*60)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]
        
        # Metrics
        accuracy = model.score(X_test, y_test)
        auc = roc_auc_score(y_test, y_proba)
        
        print(f"✓ {name} Accuracy: {accuracy:.4f}")
        print(f"✓ {name} AUC-ROC: {auc:.4f}")
        
        print(f"\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['Normal', 'Addictive']))
        
        print(f"\nConfusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
        
        results[name] = {
            'model': model,
            'accuracy': accuracy,
            'auc': auc
        }
    
    # Return best model
    best_name = max(results, key=lambda k: results[k]['auc'])
    print(f"\n✓ Best model: {best_name} (AUC: {results[best_name]['auc']:.4f})")
    
    return results[best_name]['model']

def build_neural_network(input_dim):
    """Build a simple neural network for classification"""
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(8, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.AUC()]
    )
    
    return model

def train_neural_network(X_train, y_train, X_test, y_test):
    """Train TensorFlow neural network"""
    print("\n" + "="*60)
    print("TRAINING NEURAL NETWORK")
    print("="*60)
    
    model = build_neural_network(X_train.shape[1])
    
    print("\nModel architecture:")
    model.summary()
    
    # Train
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=50,
        batch_size=32,
        verbose=1,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            )
        ]
    )
    
    # Evaluate
    test_loss, test_acc, test_auc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\n✓ Test Accuracy: {test_acc:.4f}")
    print(f"✓ Test AUC: {test_auc:.4f}")
    
    # Predictions
    y_pred_proba = model.predict(X_test)
    y_pred = (y_pred_proba > 0.5).astype(int).flatten()
    
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Normal', 'Addictive']))
    
    print(f"\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    return model

def convert_to_tflite(model, X_test):
    """Convert TensorFlow model to TFLite"""
    print("\n" + "="*60)
    print("CONVERTING TO TENSORFLOW LITE")
    print("="*60)
    
    # Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Provide representative dataset for quantization
    def representative_dataset():
        for i in range(min(100, len(X_test))):
            yield [X_test[i:i+1].astype(np.float32)]
    
    converter.representative_dataset = representative_dataset
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS]
    
    tflite_model = converter.convert()
    
    # Save model
    with open(TFLITE_MODEL_FILE, 'wb') as f:
        f.write(tflite_model)
    
    print(f"✓ TFLite model saved to {TFLITE_MODEL_FILE}")
    print(f"  Model size: {len(tflite_model) / 1024:.2f} KB")
    
    # Test TFLite model
    test_tflite_model(tflite_model, X_test[:10])
    
    return tflite_model

def test_tflite_model(tflite_model, sample_data):
    """Test TFLite model inference"""
    print("\nTesting TFLite model...")
    
    interpreter = tf.lite.Interpreter(model_content=tflite_model)
    interpreter.allocate_tensors()
    
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Test inference on sample
    for i in range(len(sample_data)):
        interpreter.set_tensor(
            input_details[0]['index'],
            sample_data[i:i+1].astype(np.float32)
        )
        interpreter.invoke()
        output = interpreter.get_tensor(output_details[0]['index'])
        print(f"  Sample {i+1}: {output[0][0]:.4f}")
    
    print("✓ TFLite model working correctly")

def save_scaler_params(scaler):
    """Save StandardScaler parameters as JSON"""
    print("\nSaving scaler parameters...")
    
    params = {
        'means': scaler.mean_.tolist(),
        'stds': scaler.scale_.tolist()
    }
    
    with open(SCALER_PARAMS_FILE, 'w') as f:
        json.dump(params, f, indent=2)
    
    print(f"✓ Scaler parameters saved to {SCALER_PARAMS_FILE}")

def main():
    """Main training pipeline"""
    print("="*60)
    print("MINDFUL SCROLL - MODEL TRAINING")
    print("="*60)
    
    # Load data
    X, y = load_data()
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nTrain set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Normalize features
    print("\nNormalizing features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save scaler parameters
    save_scaler_params(scaler)
    
    # Train sklearn models for comparison
    best_sklearn_model = train_sklearn_model(
        X_train_scaled, y_train,
        X_test_scaled, y_test
    )
    
    # Train neural network
    nn_model = train_neural_network(
        X_train_scaled, y_train,
        X_test_scaled, y_test
    )
    
    # Convert to TFLite
    convert_to_tflite(nn_model, X_test_scaled)
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print(f"\n✓ Model saved: {TFLITE_MODEL_FILE}")
    print(f"✓ Scaler params saved: {SCALER_PARAMS_FILE}")
    print("\nNext steps:")
    print("1. Copy the model files to your Android app's assets folder")
    print("2. Build and install the app")
    print("3. Enable accessibility service")
    print("4. The app will now detect addictive scroll patterns!")

if __name__ == "__main__":
    main()