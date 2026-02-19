<!-- ===================================================== -->
<!-- BADGES -->
<!-- ===================================================== -->

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-orange" />
  <img src="https://img.shields.io/badge/AI-ML%20Model-purple" />
  <img src="https://img.shields.io/badge/Backend-Node.js-brightgreen" />
  <img src="https://img.shields.io/badge/Database-MongoDB-green" />
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" />
</p>

<h1 align="center">🧠 Anxiety Attack Detector</h1>

<p align="center">
  An intelligent early-warning system that detects anxiety attack patterns using behavioral, physiological, and contextual signals.
</p>

<p align="center">
  🚀 AI-powered • 📊 Real-time monitoring • 🛡️ Preventive intervention
</p>

---

# 🌍 Vision

Anxiety attacks often escalate rapidly, leaving individuals with little time to react.  
This project aims to **predict early signs of anxiety escalation** and provide timely intervention support.

The long-term goal is to build a **preventive AI companion** — not just a tracker, but a proactive mental health assistant.

---

# ⚠️ Problem Statement

Millions of individuals experience anxiety attacks triggered by:

- Elevated heart rate  
- Irregular breathing  
- Stress patterns  
- Environmental triggers  
- Behavioral shifts  

Most tools are reactive.  
This system is designed to be **predictive**.

---

# 🏗️ System Architecture

```
User Input / Sensor Data
        │
        ▼
Preprocessing Layer
        │
        ▼
ML Prediction Engine
        │
        ▼
Risk Score Generator
        │
        ▼
Intervention Module
(Alerts • Breathing Guidance • Logging)
```

Architecture follows a modular AI pipeline for scalability and future wearable integration.

---

# 🧠 Core Features

## 📊 Real-Time Risk Scoring
- Calculates anxiety risk probability
- Generates dynamic confidence score
- Detects early warning signals

---

## 🤖 Machine Learning Engine
- Supervised classification model
- Feature-based prediction
- Supports model retraining
- Designed for future LSTM/Time-series upgrade

---

## 📈 Behavioral Pattern Tracking
- Logs stress inputs
- Tracks triggers
- Identifies recurring escalation cycles

---

## 🚨 Smart Intervention System
When elevated risk is detected:
- Sends alert notification
- Activates guided breathing module
- Suggests grounding exercises
- Logs the episode for analytics

---

## 📂 Historical Insights Dashboard
- View anxiety trends over time
- Identify triggers
- Track frequency & severity

---

# 🛠️ Technology Stack

| Layer | Technologies |
|--------|-------------|
| **Frontend** | React / Next.js |
| **Backend** | Node.js, Express |
| **Database** | MongoDB |
| **AI / ML** | Python (Scikit-learn / TensorFlow - Planned Upgrade) |
| **Data Processing** | NumPy, Pandas |
| **Authentication** | JWT |
| **Deployment (Planned)** | Docker, AWS |

---

# 🧪 ML Model Overview

### Input Features (Current Prototype)
- Self-reported stress level
- Heart rate (manual input / wearable-ready)
- Sleep quality
- Breathing irregularity indicator
- Trigger event flag

### Output
- Anxiety risk score (0–100%)
- Confidence level
- Escalation probability

### Model Type
- Logistic Regression (Initial Prototype)
- Random Forest (Testing Phase)
- LSTM (Future Roadmap)

---

# 📂 Project Structure

```
Anxiety-Attack-Detector/
│
├── client/                     # Frontend UI
│   ├── components/
│   ├── pages/
│   └── dashboard/
│
├── server/                     # Backend API
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── ml-engine/                  # AI prediction module
│   ├── model.py
│   ├── train.py
│   ├── dataset/
│   └── utils/
│
├── .env
├── package.json
└── README.md
```

Structure will evolve as model complexity increases.

---

# ⚙️ Installation Guide

## 🔧 Prerequisites
- Node.js v16+
- Python 3.9+
- MongoDB Atlas

---

## 🚀 Backend Setup

```bash
git clone https://github.com/yourusername/anxiety-attack-detector.git
cd server
npm install
npm start
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🧠 ML Engine Setup

```bash
cd ml-engine
pip install -r requirements.txt
python train.py
```

---

## 💻 Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|------------|
| `/api/auth/register` | POST | Register user |
| `/api/auth/login` | POST | Login user |
| `/api/predict` | POST | Get anxiety risk score |
| `/api/history` | GET | Fetch historical data |
| `/api/log` | POST | Log anxiety event |

---

# 📊 Current Development Status

### ✅ Phase 1 – Foundation
- Backend structure setup
- MongoDB integration
- Basic prediction endpoint
- Risk scoring logic

### 🔄 Phase 2 – ML Enhancement (In Progress)
- Feature normalization
- Model accuracy tuning
- Dataset refinement

### ⏳ Phase 3 – Smart Intervention System
- Automated intervention triggers
- Real-time notifications
- Guided breathing UI

---

# 🔮 Future Roadmap

- 📱 Wearable device integration (Apple Watch / Fitbit)
- 🧠 Advanced time-series modeling
- 🎙 Voice pattern stress detection
- 📊 Personalized AI adaptation
- 🛡️ HIPAA-compliant cloud architecture
- 📈 Predictive relapse modeling

---

# ⚠️ Disclaimer

This system is not a medical diagnostic tool.  
It is a predictive support system designed to assist users in monitoring anxiety patterns.

For medical emergencies, consult a licensed healthcare professional.

---

# 👨‍💻 Developer

**Parth Gadekar**  
MS Computer Science  
AI & Full-Stack Developer  

---

# 📄 License

MIT License – Free to use, modify, and distribute.

---

<p align="center">
  Building preventive mental health technology with AI.
</p>
