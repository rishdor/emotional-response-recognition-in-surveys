import argparse
import numpy as np
import pandas as pd
import os
import time
from scipy import stats
from .functions import sequences
from .functions import get_face_areas
from .functions.get_models import load_weights_EE, load_weights_LSTM

from datetime import datetime
import base64
from io import BytesIO
from PIL import Image
import cv2
import mediapipe as mp
import tensorflow as tf

import warnings
warnings.filterwarnings('ignore', category = FutureWarning)

# change for your paths
path_LSTM_model = os.path.join('backend', 'app', 'api', 'model', 'models_EmoAffectnet', 'SAVEE_with_config.h5')
path_FE_model = os.path.join('backend', 'app', 'api', 'model', 'models_EmoAffectnet', 'weights_0_66_49_wo_gl.h5')
#path_LSTM_model = 'C:\\Users\\no.2\\Desktop\\schools_are_for_fools\\studies\\ue\\sem5\\proj_zesp\\emotional-response-recognition-in-surveys\\backend\\app\\api\\model\\models_EmoAffectnet\\SAVEE_with_config.h5'
#path_FE_model = 'C:\\Users\\no.2\\Desktop\\schools_are_for_fools\\studies\\ue\\sem5\\proj_zesp\\emotional-response-recognition-in-surveys\\backend\\app\\api\\model\\models_EmoAffectnet\\weights_0_66_49_wo_gl.h5'

def detect_faces_mediapipe(img_array):
    """
    Wykrywanie twarzy za pomocą MediaPipe.
    :param img_array: Obraz w formacie NumPy (BGR).
    :return: Lista współrzędnych wykrytych twarzy.
    """
    mp_face_detection = mp.solutions.face_detection
    mp_drawing = mp.solutions.drawing_utils

    with mp_face_detection.FaceDetection(min_detection_confidence=0.5) as face_detection:
        results = face_detection.process(img_array)

        face_areas = []
        if results.detections:
            for detection in results.detections:
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, _ = img_array.shape
                x, y, w, h = (
                    int(bboxC.xmin * iw),
                    int(bboxC.ymin * ih),
                    int(bboxC.width * iw),
                    int(bboxC.height * ih),
                )
                face_areas.append((x, y, x + w, y + h))
        print("Face areas in detect_faces_mediapipe shape : ", face_areas)
        return face_areas
    
def tf_processing(fp):
    def preprocess_input(x):
        x_temp = np.copy(x)
        x_temp = x_temp[..., ::-1]
        x_temp[..., 0] -= 91.4953
        x_temp[..., 1] -= 103.8827
        x_temp[..., 2] -= 131.0912
        return x_temp

    def get_img_tf(img):
        img = cv2.resize(img, (224,224), interpolation=cv2.INTER_NEAREST)
        img = tf.keras.utils.img_to_array(img)
        img = preprocess_input(img)
        img = np.array([img])
        return img

    return get_img_tf(fp)

def pred_single_frame(img_array) -> dict:
    """
    Analizuje emocje z pojedynczej klatki obrazu.
    :param img_array: Obraz w formacie NumPy (BGR).
    :return: Słownik z przewidywaną emocją i prawdopodobieństwem.
    """
    start_time = time.time()
    label_model = ['Neutral', 'Happiness', 'Sadness', 'Surprise', 'Fear', 'Disgust', 'Anger']

    # cv2.imshow("Processed Image", img_array)
    # cv2.waitKey(0)  
    # cv2.destroyAllWindows()  

    # Wykrywanie twarzy za pomocą MediaPipe
    faces = detect_faces_mediapipe(img_array)
    if len(faces) == 0:
        return {"error": "No face detected in the frame"}

    # Wycinanie obszarów twarzy i przetwarzanie z tf_processing
    face_areas = [img_array[y1:y2, x1:x2] for (x1, y1, x2, y2) in faces]
    face_areas_processed = [tf_processing(face) for face in face_areas]
    face_areas_processed = np.vstack(face_areas_processed)  # Łączenie w tablicę NumPy

    print("Face areas processed shape:", face_areas_processed.shape)

    # Wczytanie modeli
    EE_model = load_weights_EE(path_FE_model)
    LSTM_model = load_weights_LSTM(path_LSTM_model)

    # Ekstrakcja cech
    features = EE_model(face_areas_processed)

    # Przygotowanie danych do LSTM (sekwencje)
    sequence_length = 10
    formatted_features = np.tile(features, (1, sequence_length, 1))

    # Predykcja emocji
    pred = LSTM_model(formatted_features).numpy()  # Przewidywane emocje dla każdej klatki
    print("Predictions: ", pred)
    pred_emotion_idx = np.argmax(pred, axis=1)[0]
    main_emotion = label_model[pred_emotion_idx]
    confidence = pred[0][pred_emotion_idx]  # Pewność predykcji dla wybranej emocji

    end_time = datetime.utcnow() 

    print(f'Predicted emotion: {main_emotion}')
    print(f'Confidence: {round(confidence*100, 2)}%')
    print(f'Lead time: {end_time}')

    return {
        "predicted_emotion": main_emotion,
        "confidence": float(round(confidence*100, 2)),
        "lead_time_s": end_time,
    }
