# Code Camp Application

---

The **Code Camp Application** simplifies the registration process for users eager to participate in globalsoft's Code Camp workshops. Designed for effortless management of workshops, applications, and user interactions, it offers a user-friendly interface accessible to all stakeholders. Developed as part of company's internship program, it delivers robust features ensuring smooth coordination.

---

&nbsp;

## Team Members

- Antonio Šego - Backend Developer
- Franjo Lovrić - Frontend Developer

---

&nbsp;

## Table of Contents

1. [Technologies](#technologies)
   - [Backend Technologies](#backend-technologies)
   - [Frontend Technologies](#frontend-technologies)
   - [Dependencies](#dependencies)
2. [Features](#features)
   - [Unauthenticated Users](#unauthenticated-users)
   - [Authenticated Users](#authenticated-users)
   - [Administrators](#administrators)
   - [Professors](#professors)
3. [Installation](#installation)
4. [Demo](#demo)

---

&nbsp;

## Technologies

### Backend Technologies

<div style="display: flex; justify-content: space-around;">
  <a href="https://nodejs.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/200px-Node.js_logo.svg.png" style="width: auto; height: 80px;"></a>
  <a href="https://expressjs.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" style="width: auto; height: 80px;"></a>
  <a href="https://www.mongodb.com/"><img src="https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png" style="width: auto; height: 80px;"></a>
</div>  

&nbsp;

### Frontend Technologies

<div style="display: flex; justify-content: space-around;">
  <a href="https://nextjs.org/"><img src="https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png" style="width: auto; height: 80px;"></a>
  <a href="https://tailwindcss.com/"><img src="https://refactoringui.nyc3.digitaloceanspaces.com/tailwind-logo.svg" style="width: auto; height: 80px;"></a>
</div>

&nbsp;

### Dependencies

| Backend                 | Frontend                   |
|-------------------------|----------------------------|
| bcrypt@^5.1.1           | @hookform/resolvers@^3.3.4 |
| body-parser@^1.20.2     | @mui/material@^5.15.13     |
| cookie-parser@^1.4.6    | @nextui-org/react@^2.2.10  |
| cors@^2.8.5             | axios@^1.6.8               |
| dotenv@^16.4.5          | cookie-cutter@^0.2.0       |
| ejs@^3.1.9              | jwt-decode@^4.0.0          |
| express@^4.18.3         | next@14.1.1                |
| express-flash@^0.0.2    | react@^18                  |
| express-session@^1.18.0 | react-cookie@^7.1.0        |
| jsonwebtoken@^9.0.2     | react-dom@^18              |
| mongoose@^8.2.1         | react-hook-form@^7.51.0    |
| multer@^1.4.5-lts.1     | react-hot-toast@^2.4.1     |
| nodemailer@^6.9.13      | react-icons@^5.0.1         |
| passport@^0.7.0         | react-router-dom@^6.22.3   |
| passport-local@^1.0.0   | yup@^1.4.0                 |
| upload@^1.3.2           |                            |

---

&nbsp;

## Features

### Unauthenticated Users

- **Company Information**: Provides short information about the company and the Code Camp program.
- **Frequently Asked Questions (FAQ)**: Offers answers to common questions about the program.
- **Registration**: Allows users to sign up for the application by providing basic information.

&nbsp;

### Authenticated Users

- **Login**: Enables users to log in to the application.
- **Workshop Viewing**: Users can browse available workshops and view detailed information about them.
- **Enrollment**: Enables users to enroll in workshops of interest.
- **Application Tracking**: Provides users with the ability to track the status of their workshop applications.
- **Test Submission**: Users can submit their workshop test in the form of a zip file.
- **Profile Management**: Allows users to update their personal information.
- **Password Reset**: Users can reset forgotten passwords.
- **Logout**: Allows users to log out from the application.

&nbsp;

### Administrators

In addition to user functionalities, administrators have access to:
- **User Management**: Allows administrators to manage users, update their data, and delete user accounts.
- **User Search**: Provides administrators with the ability to search for users by name, email, etc.

&nbsp;

### Professors

In addition to user functionalities, professors have access to:
- **Workshop Management**: Enables professors to create, view, edit, and delete workshops.
- **Application Management**: Allows professors to view, edit, and delete workshop applications.
- **Test Management**: Provides professors with the ability to view, download, and delete workshop tests submitted by users.
- **Application Search**: Allows professors to search for applications by user name, email, etc.
- **Test Search**: Provides professors with the ability to search for tests by user name.

---

&nbsp;

## Installation

### Getting Started

1. Clone the repository to your local machine: 
    ```
    git clone https://github.com/Franjo7/Code-Camp-App.git
    ```
2. Using the editor such as Visual Studio Code, open the project folder.

&nbsp;

### Backend

1. Navigate to the backend directory: `cd backend`
2. Create a `.env` file in the backend directory and add the following configuration variables:
   ```
   PORT=5001
   DATABASE_URL=mongodb+srv://your_username:your_password@your_cluster_url/your_database
   JWT_SECRET=your_secret_key
   ```
3. Install dependencies: `npm install`
4. Start the application: `npm run dev`

&nbsp;

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Create a `.env.local` file in the frontend directory and add the following configuration variables:
   ```
   NEXT_PUBLIC_URL_USER=http://localhost:5001/api
   ```
3. Install dependencies: `npm install`
4. Start the application: `npm run dev`

---

&nbsp;

## Demo

![Home](/frontend/public/Images/1-Home.png)<br><br>
![FAQ](/frontend/public/Images/2-FAQ.png)<br><br>
![Register](/frontend/public/Images/3-Register.png)<br><br>
![Login](/frontend/public/Images/4-Login.png)<br><br>
![Home](/frontend/public/Images/5-Home.png)<br><br>
![Profile](/frontend/public/Images/6-Profile.png)<br><br>
![MyWorkshops](/frontend/public/Images/7-MyWorkshops.png)<br><br>
![Users](/frontend/public/Images/8-Users.png)<br><br>
![Workshops](/frontend/public/Images/9-Workshops.png)<br><br>
![Applications](/frontend/public/Images/10-Applications.png)<br><br>
![Tests](/frontend/public/Images/11-Tests.png)<br><br>

---

&nbsp;