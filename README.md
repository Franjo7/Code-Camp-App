# Code Camp Application

The **Code Camp Application** streamlines the registration process for users eager to participate in globalsoft's Code Camp workshops. Crafted with a modern and user-friendly design, it ensures a seamless experience for users, administrators, and professors. Developed as part of an internship program at [globalsoft](https://www.globalsoft.co/), the application will also serve as a project for a Master's thesis of the authors.

&nbsp;

## Team Members

- Antonio Šego - Backend Developer
- Franjo Lovrić - Frontend Developer

&nbsp;

## Table of Contents

1. [Technologies](#technologies)
   - [Backend Technologies](#backend-technologies)
   - [Frontend Technologies](#frontend-technologies)
2. [Features](#features)
   - [Unauthenticated Users](#unauthenticated-users)
   - [Authenticated Users](#authenticated-users)
   - [Administrators](#administrators)
   - [Professors](#professors)
3. [Installation](#installation)
4. [Demo of the Application](#demo-of-the-application)

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
4. Start the application: `npm start`

&nbsp;

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Create a `.env.local` file in the frontend directory and add the following configuration variable:
   ```
   NEXT_PUBLIC_URL_USER=http://localhost:5001/api/
   ```
3. Install dependencies: `npm install`
4. Start the application: `npm run dev`

&nbsp;

## Demo of the Application

![Image-1](frontend/public/Images/Image-1.png)
![Image-2](frontend/public/Images/Image-2.png)
![Image-3](frontend/public/Images/Image-3.png)
![Image-4](frontend/public/Images/Image-4.png)
![Image-5](frontend/public/Images/Image-5.png)
![Image-6](frontend/public/Images/Image-6.png)
![Image-7](frontend/public/Images/Image-7.png)
![Image-8](frontend/public/Images/Image-8.png)
![Image-9](frontend/public/Images/Image-9.png)
![Image-10](frontend/public/Images/Image-10.png)
![Image-11](frontend/public/Images/Image-11.png)
![Image-12](frontend/public/Images/Image-12.png)
![Image-13](frontend/public/Images/Image-13.png)
![Image-14](frontend/public/Images/Image-14.png)
![Image-15](frontend/public/Images/Image-15.png)
![Image-16](frontend/public/Images/Image-16.png)
![Image-17](frontend/public/Images/Image-17.png)
![Image-18](frontend/public/Images/Image-18.png)
![Image-19](frontend/public/Images/Image-19.png)
![Image-20](frontend/public/Images/Image-20.png)
![Image-21](frontend/public/Images/Image-21.png)
![Image-22](frontend/public/Images/Image-22.png)
![Image-23](frontend/public/Images/Image-23.png)
![Image-24](frontend/public/Images/Image-24.png)
![Image-25](frontend/public/Images/Image-25.png)

&nbsp;