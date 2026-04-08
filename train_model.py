from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models

# Step 1: Load Data
datagen = ImageDataGenerator(
    rescale=1./255,      # normalize images
    validation_split=0.2 # 80% training, 20% validation
)

train_data = datagen.flow_from_directory(
    "MRL_EYE_Dataset/test",
    target_size=(24, 24),
    color_mode="grayscale",
    class_mode="binary",
    subset="training"
)

val_data = datagen.flow_from_directory(
    "MRL_EYE_Dataset/test",
    target_size=(24, 24),
    color_mode="grayscale",
    class_mode="binary",
    subset="validation"
)

# Step 2: Build Model
model = models.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(24,24,1)),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

# Step 3: Compile
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Step 4: Train
model.fit(
    train_data,
    validation_data=val_data,
    epochs=5
)

# Step 5: Save Model
model.save("eye_model.h5")

print("Model trained and saved!")