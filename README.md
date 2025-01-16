# Web Application for Surveys with Emotional Response Recognition

This project is a web application designed to analyze consumer facial emotional responses in real-time while they complete surveys. By leveraging deep learning models, it provides businesses with actionable insights into customer reactions to advertisements, trailers, and other video content.

## Key Features
- **Completing Surveys**: Completing bussiness surveys, while earning points doing that.
- **Real-Time Emotion Analysis**: The application detects and records emotional responses during survey completion.
- **Timestamped Emotional Insights**: For videos shown during surveys, the app saves data on the exact moment specific emotional responses occur.
- **Seamless Integration**: Allows businesses to gather more authentic and valuable feedback on their content.
- **Redeem rewards**: Allows customers to redeem awards with points collection by completing a lot of surveys.

## Technologies Used
### Backend
- **Node.js**: Server-side processing and API integration.
- **Python**: For running the deep learning model.

### Frontend
- **HTML, CSS, JavaScript**: For creating an interactive and responsive user interface.

### Pre-trained Model
- **EMO-AffectNetModel**: A pre-trained model for emotion recognition, available under the MIT License.
  - Repository: [EMO-AffectNetModel](https://github.com/ElenaRyumina/EMO-AffectNetModel?tab=MIT-1-ov-file)
  - Note: You need to download SAVEE file from this [link](https://drive.google.com/drive/folders/1rEO8Kwujtu-08RnuCej7k6YA0n309RyO) and weights from this [link](https://drive.google.com/drive/u/2/folders/1wELaPME_WXvtgcWQyTvO3R8xXxg4NO8s) and put it info backend/app/api/model/models_EmoAffectnet folder. Without it model will not work.

## Installation and Usage

### Prerequisites
- Ensure you have Python, Node.js, and npm installed on your system. 
- Check for requirements 
- Check for @mediapipe for npm. For downloading @mediapipie, use
```
npm install @mediapipe/face_detection
```
and
```
npm install @mediapipe/camera_utils
```
- You should change your path in new_model.py file.

### Steps to Run
1. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend/app
     ```
   - Start the backend server:
     ```bash
     python main.py
     ```

2. **Frontend Setup**:
   - Open new terminal and navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

### How It Works
- When a survey participant watches a video, their facial expressions are analyzed in real-time by the deep learning model.
- Emotional responses are timestamped and stored, allowing businesses to review insights and reactions for each moment of the video.

## License
This project utilizes the EMO-AffectNetModel, licensed under the MIT License. For more details, visit the [repository](https://github.com/ElenaRyumina/EMO-AffectNetModel?tab=MIT-1-ov-file).

---
Start analyzing emotional responses and uncovering deeper insights into customer behavior today!