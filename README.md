# Web Application for Surveys with Emotional Response Recognition

This project is a web application designed to analyze consumer facial emotional responses in real-time as they complete surveys. By leveraging deep learning models, it provides businesses with actionable insights into customer reactions to advertisements, trailers, and other video content.

## Key Features

- **Survey Completion**: Complete business surveys and earn points for participation.
- **Real-Time Emotion Analysis**: Detects and records emotional responses during survey completion.
- **Timestamped Emotional Insights**: Records precise timestamps of emotional responses during videos shown in surveys.
- **Seamless Integration**: Helps businesses gather authentic and valuable feedback on their content.
- **Redeem Rewards**: Enables users to redeem rewards by collecting points through multiple survey completions.

## Technologies Used

### Backend

- **Node.js**: For server-side processing and API integration.
- **Python**: For executing the deep learning model.

### Frontend

- **HTML, CSS, JavaScript**: To create an interactive and responsive user interface.

### Pre-trained Model

- **EMO-AffectNetModel**: A pre-trained model for emotion recognition, available under the MIT License.
  - Repository: [EMO-AffectNetModel](https://github.com/ElenaRyumina/EMO-AffectNetModel?tab=MIT-1-ov-file)
  - **Note**: 
    - Download the SAVEE dataset from [this link](https://drive.google.com/drive/folders/1rEO8Kwujtu-08RnuCej7k6YA0n309RyO).  
    - Download the model weights from [this link](https://drive.google.com/drive/u/2/folders/1wELaPME_WXvtgcWQyTvO3R8xXxg4NO8s).  
    - Place the files in the `backend/app/api/model/models_EmoAffectnet` folder. The model will not work without these files.

## Installation and Usage

### Prerequisites

- Ensure Python, Node.js, and npm are installed on your system.
- Verify that all required Python packages are installed, or install them using:

  ```bash
  pip install -r requirements.txt
  ```

- Confirm that `@mediapipe` and `react-youtube` are installed, or install them with:

  ```bash
  npm install @mediapipe/face_detection
  npm install @mediapipe/camera_utils
  npm install react-youtube
  ```

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
   - Open a new terminal and navigate to the frontend directory:

     ```bash
     cd frontend
     ```

   - Start the frontend server:

     ```bash
     npm start
     ```

### How It Works

- When a survey participant watches a video, their facial expressions are analyzed in real-time by the deep learning model.
- Emotional responses are timestamped and stored, allowing businesses to review insights and reactions for specific moments in the video.

## License

This project uses the EMO-AffectNetModel, licensed under the MIT License. For more details, visit the [repository](https://github.com/ElenaRyumina/EMO-AffectNetModel?tab=MIT-1-ov-file).

---

Start analyzing emotional responses today and unlock deeper insights into customer behavior!
