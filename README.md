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

Email Notification Endpoint
URL
text
POST http://localhost:5000/api/notify/email
Headers
text
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
Example JSON Payloads
1. Basic Email Notification
json
{
  "recipient": "user@example.com",
  "subject": "Welcome to Our Service",
  "message": "Hello there! Welcome to our notification service. We're excited to have you on board."
}
2. Email with Template
json
{
  "recipient": "user@example.com",
  "template": "welcome",
  "variables": {
    "name": "John Doe",
    "username": "johndoe123"
  }
}
3. Scheduled Email
json
{
  "recipient": "user@example.com",
  "subject": "Reminder: Meeting Tomorrow",
  "message": "This is a reminder about our meeting scheduled for tomorrow at 10:00 AM.",
  "scheduledAt": "2023-10-15T14:30:00Z"
}
4. Email with All Options
json
{
  "recipient": "user@example.com",
  "subject": "Order Confirmation #12345",
  "message": "Thank you for your order. Your order #12345 has been confirmed and will be shipped soon.",
  "template": "orderUpdate",
  "variables": {
    "name": "Jane Smith",
    "orderId": "12345",
    "status": "confirmed",
    "deliveryDate": "October 20, 2023"
  },
  "scheduledAt": "2023-10-15T09:00:00Z"
}
SMS Notification Endpoint
URL
text
POST http://localhost:5000/api/notify/sms
Headers
text
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
Example JSON Payloads
1. Basic SMS Notification
json
{
  "recipient": "+1234567890",
  "message": "Your verification code is 987654. This code will expire in 10 minutes."
}
2. SMS with Template
json
{
  "recipient": "+1234567890",
  "template": "verification",
  "variables": {
    "code": "123456"
  }
}
3. Scheduled SMS
json
{
  "recipient": "+1234567890",
  "message": "Reminder: Your appointment is tomorrow at 2:00 PM.",
  "scheduledAt": "2023-10-15T08:00:00Z"
}
4. SMS with All Options
json
{
  "recipient": "+1234567890",
  "message": "Hello John, your order #67890 has been shipped. Expected delivery: October 18.",
  "template": "orderUpdate",
  "variables": {
    "name": "John",
    "orderId": "67890",
    "status": "shipped",
    "deliveryDate": "October 18, 2023"
  },
  "scheduledAt": "2023-10-15T10:30:00Z"
}
Batch Notification Endpoint
URL
text
POST http://localhost:5000/api/notify/batch
Headers
text
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
Example JSON Payloads
1. Batch Email Notifications
json
{
  "type": "email",
  "recipients": ["user1@example.com", "user2@example.com", "user3@example.com"],
  "subject": "Important Announcement",
  "message": "We have an important announcement for all our users. Please check your account for details."
}
2. Batch SMS Notifications
json
{
  "type": "sms",
  "recipients": ["+1234567890", "+0987654321", "+1112223333"],
  "message": "Flash sale starting in 1 hour! Use code FLASH20 for 20% off."
}
Other Useful Endpoints
Get Notification History
text
GET http://localhost:5000/api/notify/history?page=1&limit=10
Get Available Templates
text
GET http://localhost:5000/api/notify/templates
Health Check
text
GET http://localhost:5000/api/health
Postman Collection Setup
Create a new collection called "Notification System API"

Add the environment variables:

baseUrl = http://localhost:5000/api

auth = Basic YWRtaW46cGFzc3dvcmQ=

For each request, set the headers:

Content-Type: application/json

Authorization: {{auth}}

Use the JSON payloads above in the request body

Testing Tips
Make sure your backend server is running on port 5000

Verify your email and SMS credentials are correctly set in the environment variables

For email testing, use a real email address you have access to

For SMS testing, use a real phone number (with country code) if you have Twilio set up

Check the server console for any error messages if requests fail

Use the health check endpoint to verify the API is running properly

Expected Responses
Success Response
json
{
  "message": "Email notification processed",
  "notificationId": "650a1b2c3d4e5f6g7h8i9j0k",
  "status": "sent"
}
Error Response
json
{
  "error": "Please provide a valid email address"
}

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

