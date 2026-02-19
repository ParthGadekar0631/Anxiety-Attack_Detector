# 🌍 Aad – Intelligent Travel & Booking Platform (In Progress)

> A full-stack travel and booking platform inspired by modern systems like Expedia — designed with scalability, modular architecture, and AI-driven enhancements in mind.

---

## 🚧 Project Status

**Current Phase:** Active Development  
**Stage:** Frontend foundation + Authentication APIs  
**Backend:** MongoDB (recently migrated)

This project is under continuous development. Features, architecture, and documentation will evolve as the system grows.

---

## 🧠 Project Vision

Aad aims to become a scalable travel booking platform that supports:

- Hotel search and booking
- User authentication & profile management
- Smart filtering & sorting
- Dynamic pricing display
- AI-powered travel recommendations (future phase)
- Secure payment integration
- Admin management dashboard

The system is designed using production-level backend structuring and modular frontend architecture.

---

## 🏗️ Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS
- Axios
- Context API (Redux upgrade planned if needed)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- bcrypt for password hashing

### DevOps (Planned)
- Docker
- GitHub Actions (CI/CD)
- AWS / Vercel deployment

---

## 📁 Folder Structure

aad/
│
├── client/                  # Frontend (Next.js)
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── context/
│   └── utils/
│
├── server/                  # Backend (Node + Express)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── .env
├── package.json
└── README.md

Structure will expand as new features are introduced.

---

## 🔐 Authentication (Current Focus)

### Implemented / In Progress
- User Signup API
- User Login API
- Password hashing with bcrypt
- JWT-based authentication
- Basic frontend login/signup pages

### Upcoming Enhancements
- Email verification
- Password reset
- Role-based access (Admin / User)
- OAuth (Google login)

---

## 🏨 Core Features Roadmap

### Phase 1 – Foundation
- [x] Project setup
- [x] MongoDB integration
- [x] User schema
- [x] Auth APIs
- [ ] Frontend authentication UI polish
- [ ] Protected routes

### Phase 2 – Travel Listings
- [ ] Hotel schema
- [ ] Search API
- [ ] Filter by price, rating, location
- [ ] Pagination
- [ ] Expedia-style homepage UI

### Phase 3 – Booking System
- [ ] Booking model
- [ ] Availability management
- [ ] Secure checkout
- [ ] Payment gateway integration

### Phase 4 – AI Enhancements
- [ ] Personalized recommendations
- [ ] Travel suggestion engine
- [ ] Smart sorting logic
- [ ] Predictive pricing (future scope)

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/aad.git
cd aad
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside `/server`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:3000
```

Backend runs at:
```
http://localhost:5000
```

---

## 🔄 API Endpoints (Current)

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST   | /api/auth/signup | Register new user |
| POST   | /api/auth/login  | Login existing user |
| GET    | /api/auth/profile | Get user profile (Protected) |

More APIs will be added as development progresses.

---

## 🧪 Testing Strategy (Planned)

- Unit testing with Jest
- API testing with Postman
- Integration tests
- Load testing (later phase)

---

## 🧱 Architecture Philosophy

- MVC pattern (backend)
- Clean separation of concerns
- Scalable database modeling
- Token-based authentication
- Reusable frontend components
- Future-ready architecture for scaling

---

## 🎯 Design Inspiration

The homepage and booking flow are inspired by leading travel platforms. Focus areas include:

- Clean search interface
- Fast filtering
- Clear pricing
- Smooth booking funnel
- Strong UX hierarchy

This is not a clone but a structured, production-oriented implementation.

---

## 🔮 Future Enhancements

- Admin dashboard
- Analytics tracking
- AI chatbot for trip planning
- Multi-city itinerary builder
- Review & rating system
- Wishlist feature
- Push notifications
- Mobile app version (React Native)

---

## 👨‍💻 Developer

Parth Gadekar  
Master’s in Computer Science  
Full-Stack Developer | Backend-Focused

---

## 📌 Contribution

Currently under active development.  
Collaboration may open in later phases.

---

## 📝 Notes

This README will be updated as:

- Features are completed
- Architecture evolves
- Deployment pipeline is integrated
- AI modules are introduced

The project is being built with production standards in mind.
