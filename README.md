# Web Application for Surveys with Emotional Response Recognition

This project is a web application designed to analyze consumer facial emotional responses in real-time while they complete surveys. By leveraging deep learning models, it provides businesses with actionable insights into customer reactions to advertisements, trailers, and other video content.

## Key Features
- **Real-Time Emotion Analysis**: The application detects and records emotional responses during survey completion.
- **Timestamped Emotional Insights**: For videos shown during surveys, the app saves data on the exact moment specific emotional responses occur.
- **Seamless Integration**: Allows businesses to gather more authentic and valuable feedback on their content.

## Technologies Used
### Backend
- **Node.js**: Server-side processing and API integration.
- **Python**: For running the deep learning model.

### Frontend
- **HTML, CSS, JavaScript**: For creating an interactive and responsive user interface.

### Pre-trained Model
- **EMO-AffectNetModel**: A pre-trained model for emotion recognition, available under the MIT License.
  - Repository: [EMO-AffectNetModel](https://github.com/ElenaRyumina/EMO-AffectNetModel?tab=MIT-1-ov-file)

## Installation and Usage

### Prerequisites
- Ensure you have Python, Node.js, and npm installed on your system.

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
   - Navigate to the frontend directory:
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