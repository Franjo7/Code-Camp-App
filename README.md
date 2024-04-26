# Code Camp Application

The **Code Camp Application** streamlines the process for users to register and enroll in globalsoft's Code Camp workshops. This application is designed to facilitate the management of workshops, applications, and users. It provides a user-friendly interface for users, administrators, and professors to interact with the system. It was developed as a part of company's internship program.

## Authors
- Antonio Šego - Backend Developer
- Franjo Lovrić - Frontend Developer

## Table of Contents
1. [Installation](#installation)
2. [Backend Technologies](#backend-technologies)
3. [Frontend Technologies](#frontend-technologies)
4. [Features](#features)
   - [Users](#users)
   - [Administrators](#administrators)
   - [Professors](#professors)

---

## Installation

### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the application: `npm start`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

---

## Backend Technologies
- **Node.js**: JavaScript runtime environment. Enables server-side development.
- **Express.js**: Web framework for Node.js. Facilitates building web applications and APIs.
- **MongoDB**: NoSQL database. Stores application data.

### Dependencies
- **bcrypt**: Password hashing.
- **body-parser**: Middleware for parsing request bodies.
- **cookie-parser**: Parsing cookies in requests.
- **cors**: Middleware for enabling CORS requests.
- **dotenv**: Loading environment variables from .env file.
- **ejs**: Template engine for generating HTML.
- **express-flash**: Flash messages for Express.js.
- **express-session**: Middleware for managing sessions in Express.js.
- **jsonwebtoken**: Implementation of JSON Web Token (JWT) authentication.
- **mongoose**: MongoDB library for Node.js.
- **nodemailer**: Library for sending email messages.
- **passport**: Middleware for user authentication.
- **passport-local**: Passport strategy for local authentication.

---

## Frontend Technologies
- **Next.js**: Framework for React. Offers server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework. Provides a flexible and customizable styling solution.

### Dependencies
- **@hookform/resolvers**: Library for form validation.
- **@mui/material**: Material design components for React.
- **@nextui-org/react**: React UI components.
- **axios**: HTTP client for making requests.
- **cookie-cutter**: Cookie manipulation in the browser.
- **jwt-decode**: JSON Web Token (JWT) decoding library.
- **next**: Framework for React.
- **react**: Library for building user interfaces.
- **react-cookie**: Handling cookies in React.
- **react-dom**: DOM manipulation in React.
- **react-hook-form**: Library for managing forms in React.
- **react-hot-toast**: Toast notifications in React.
- **react-icons**: Icon library for React applications.
- **react-router-dom**: React navigation components.
- **yup**: Library for data validation.

---

## Features

### Users
- **Registration**: Sign up for the application with basic information.
- **Workshop Viewing**: View available workshops with details.
- **Enrollment**: Enroll in workshops of interest.
- **Application Tracking**: Track workshop applications and statuses.
- **Profile Management**: Update personal information.
- **Password Reset**: Reset forgotten passwords.
- **Logout**: Log out from the application.

### Administrators
In addition to user functionalities, administrators have access to:
- **User Management**: Manage users, update data, and delete users.
- **User Search**: Search for users by name, email, etc.

### Professors
In addition to user functionalities, professors have access to:
- **Workshop Management**: View, edit, and delete workshops.
- **Application Management**: View, edit, and delete workshop applications.
- **Application Search**: Search through workshop applications.

---