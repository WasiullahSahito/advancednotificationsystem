# Notification System API - Complete Documentation

## Overview

A comprehensive MERN stack notification system that supports email and SMS notifications with scheduling capabilities, template system, and batch notifications.

## Features

- ✅ Email notifications via Gmail SMTP
- ✅ SMS notifications via Twilio API
- ✅ Scheduled notifications
- ✅ Template system for common notification types
- ✅ Batch notifications to multiple recipients
- ✅ Notification history with filtering
- ✅ Responsive React frontend
- ✅ Input validation and error handling
- ✅ MongoDB logging of all notifications

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Vite
- **Email Service**: Nodemailer with Gmail SMTP
- **SMS Service**: Twilio API
- **Authentication**: JWT (optional)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Gmail account (for email notifications)
- Twilio account (for SMS notifications)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/WasiullahSahito/advancednotificationsystem.git
cd notification-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notification_system
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
JWT_SECRET=your_jwt_secret_here_change_this_in_production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Initialization

Start MongoDB and run the initialization script:

```bash
mongosh localhost:27017/notification_system scripts/init-mongo.js
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints require authentication. Use the following credentials for basic auth:
- Username: `admin`
- Password: `password`

### 1. Send Email Notification

**Endpoint**: `POST /notify/email`

**Headers**:
```
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

**Body**:
```json
{
  "recipient": "user@example.com",
  "subject": "Welcome Email",
  "message": "Hello user, welcome to our service!",
  "template": "welcome",
  "variables": {
    "name": "John Doe",
    "username": "johndoe"
  },
  "scheduledAt": "2023-10-15T14:30:00Z"
}
```

### 2. Send SMS Notification

**Endpoint**: `POST /notify/sms`

**Headers**:
```
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

**Body**:
```json
{
  "recipient": "+1234567890",
  "message": "Your verification code is 123456",
  "template": "verification",
  "variables": {
    "code": "123456"
  },
  "scheduledAt": "2023-10-15T14:30:00Z"
}
```

### 3. Send Batch Notifications

**Endpoint**: `POST /notify/batch`

**Headers**:
```
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

**Body**:
```json
{
  "type": "email",
  "recipients": ["user1@example.com", "user2@example.com"],
  "subject": "Batch Notification",
  "message": "This is a batch notification",
  "template": "welcome",
  "variables": {
    "name": "User",
    "username": "user123"
  }
}
```

### 4. Get Notification History

**Endpoint**: `GET /notify/history?page=1&limit=10&type=email&status=sent`

**Headers**:
```
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

### 5. Get Available Templates

**Endpoint**: `GET /notify/templates`

**Headers**:
```
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

### 6. Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "OK",
  "message": "Notification system API is running"
}
```

Example Requests
Using cURL
Send Email:

bash
curl -X POST http://localhost:5000/api/notify/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
  -d '{
    "recipient": "test@example.com",
    "subject": "Welcome Email",
    "message": "Hello user, welcome to our service!"
  }'
Send SMS:

bash
curl -X POST http://localhost:5000/api/notify/sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
  -d '{
    "recipient": "+1234567890",
    "message": "Your verification code is 123456"
  }'
Get History:

bash
curl -X GET "http://localhost:5000/api/notify/history?page=1&limit=10&type=email" \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ="

### Import Instructions

1. Open Postman
2. Click on "Import" in the top-left corner
3. Select "Raw Text" and paste the above JSON
4. Click "Continue" and then "Import"
5. Set up the environment variables:
   - Create a new environment called "Notification System"
   - Add variables `baseUrl` with value `http://localhost:5000/api`
   - Add variable `auth` with value `Basic YWRtaW46cGFzc3dvcmQ=`
   - Select this environment from the dropdown in the top-right corner


## Configuration

### Email Service (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Use the app password in the `EMAIL_PASS` environment variable

### SMS Service (Twilio)

1. Create a Twilio account
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number for sending SMS
4. Use these details in the respective environment variables

