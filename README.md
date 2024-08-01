# Email OTP REST API
Demo Live API : https://email-otp-rest-api.onrender.com
## Overview

This project provides a REST API for generating and verifying One-Time Passwords (OTPs) via email. The API offers two main endpoints: one for generating OTPs and another for verifying them.

## Endpoints

### 1. Generate OTP

**Endpoint:** `/api/generate`

**Method:** `POST`

**Description:** Generates an OTP and sends it to the specified email address.

**Request Body:**

```json
{
  "email": "user@example.com",                
  "type": "numeric | alpha | alpha-numeric",  
  "subject": "Your OTP Code",                 
  "organisation": "My Organization",          
  "size": 6                                   
}

```
The email address to which the OTP will be sent --- mandatory field
Type of OTP. Default is "numeric".
Subject of the email to be sent. Default is "Your OTP Code".
Name of the organization sending the email. Default is "My Organization".
Size of the OTP. Default is 6.

### 2. Verify OTP
  
  **Endpoint:** `/api/verify`
  
  **Method:** `POST`
  
  **Description:** Generates an OTP and sends it to the specified email address.
  
  **Request Body:**
  
  ```json
  {
    "email": "user@example.com",
    "otp": "1234"
  }
  ```

The email address to which the OTP will be sent. --- mandatory field
The otp sent to email address. --- mandatory field


## Overview

To use this api in your project:

### 1. Clone the repo
### 2. Install Packages

```node
npm i
```
### 3. Set Values in .env file
```env
PORT = 5001
MONGODB_URI = link to mongodb database

OTP_VALIDITY_PERIOD_MINUTES = 2
OTP_ATTEMPTS = 3

CRON_SCHEDULE = */5 * * * * (refer to cron documents on npm site)

GMAIL_USER = set you mail id
GMAIL_PASS = generate 16 character long app paassword for your google account by visiting your account settings and search in the search bar "App Password"
```

### 4. Start the Project
```node
npm start
```

