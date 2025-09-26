Backend for this project - https://github.com/PriyanshuPandey92/Xeno-CRM-Render
# 🚀 CRM Platform – Xeno SDE Internship Assignment 2025

An intelligent CRM system developed as part of the Xeno SDE Internship challenge. The platform empowers dynamic customer segmentation, campaign management, and AI-driven personalization.

---

## 📌 Project Summary

- **Objective:** Build a fully functional CRM with support for rule-based segmentation, Google OAuth authentication, and Gemini-powered AI messaging.
- **Core Capabilities:** Data ingestion, campaign creation, segmentation, secure access, and personalized suggestions.
- **Bonus:** AI integration using Google Gemini to enhance campaign messages.

---

## 📚 Table of Contents

1. [Live Demo](#live-demo)  
2. [Demo Video](#demo-video)  
3. [Key Features](#key-features)  
4. [Tech Stack](#tech-stack)  
5. [Known Limitations & Assumptions](#known-limitations--assumptions)  
6. [Future Scope](#future-scope)

---

## 🔗 Live Demo

- **Frontend:** [https://xeno-crm-ivory-ten.vercel.app](https://xeno-crm-ivory-ten.vercel.app)  
- **Backend:** [https://xeno-crm-render.onrender.com](https://xeno-crm-render.onrender.com)

---

## 🎥 Demo Video

📽️ [Demo Video Link](https://drive.google.com/file/d/1w-WiTPa2gKfR15nORWmXhPBbJHn8ggZ1/view)

---

## ✅ Key Features

### 📊 Data Ingestion

- Upload customer and order CSVs.
- REST APIs with file upload and backend validation.
- Swagger UI for API testing.

### 🎯 Segmentation & Campaigns

- Rule builder (e.g., `spend > 5000 AND visits < 3`).
- AND/OR logic for complex segments.
- Campaigns linked to segments and selected users.

### 🧠 AI Message Suggestions

- Powered by Google Gemini API.
- Suggests personalized campaign content.
- Triggered during campaign creation.

### 🔐 Authentication

- Google OAuth 2.0 login.
- Protects audience and campaign routes.

### 📋 Core CRM Functionalities

- Customer data listing.
- Segment management.
- Campaign management UI.

---

## 🛠️ Tech Stack

### 🖥️ Frontend

- Next.js 15+ with App Router  
- React 19+ and TypeScript  
- Tailwind CSS + Ant Design  
- Zustand for state management  

### 🛠️ Backend

- Node.js + Express  
- TypeScript  
- MongoDB + Mongoose  

### 🧩 Others

- Google OAuth 2.0  
- JWT for token validation  
- Google Gemini API (via OpenAI client)    
- Git, GitHub, VS Code  

---

**Flow:**

- **Frontend:** Handles routing, auth, API calls, and Gemini integration.
- **Backend:** Manages auth, validation, and DB interactions.
- **MongoDB:** Stores users, customers, rules, campaigns.
- **Gemini API:** AI message generation.

---

## ⚠️ Known Limitations & Assumptions

- **Pub-Sub for Data Ingestion:** The system doesn't implement a pub-sub model (e.g., Kafka, RabbitMQ). All data is ingested synchronously.
- **Audience Size Preview:** There's no feature to preview how many users fall into a segment before saving it.
- **Campaign History Page:** A dedicated history dashboard with delivery stats (e.g., sent, failed, audience size) is not fully developed.
- **Campaign Delivery Flow:** The backend lacks complete simulation of sending messages, receiving vendor callbacks, and logging delivery.
- **AI Functionality Scope:** Current AI use is limited to message suggestions. Features like NLP-to-rule translation and performance summaries are not included.
- **Error Handling:** Error messages are minimal; system-wide logging and user feedback could be more detailed.
- **Automated Testing:** There are no unit tests, integration tests, or end-to-end tests included yet.
- **User Experience Enhancements:** No drag-and-drop rule builder; the UI uses simple forms.

---

## 🔮 Future Scope

- ✅ Complete the full campaign delivery and vendor callback lifecycle.
- ✅ Add real-time audience size estimation during segment creation.
- ✅ Build a comprehensive campaign history dashboard with filtering and delivery stats.
- ✅ Integrate Kafka or RabbitMQ for asynchronous and scalable data ingestion.
- ✅ Extend AI capabilities to support natural language-to-segment translation and campaign performance insights.
- ✅ Improve UI/UX with interactive rule builders and better component feedback.
- ✅ Add robust unit and integration testing with tools like Jest or Vitest.
- ✅ Enhance backend logging, error tracking, and exception monitoring tools.


