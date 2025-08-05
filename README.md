# InterVue - Job Portal Application

## Project Overview
InterVue is a comprehensive job portal application that connects job seekers with employers. The platform allows companies to post job listings and manage applications, while job seekers can browse jobs, apply, and track their application status.

## Project Structure

### Backend
- **Technologies**: Node.js, Express, MongoDB
- **Key Directories**:
  - `/config`: Database and email configuration
  - `/controllers`: Business logic for API endpoints
  - `/middleware`: Authentication and session management
  - `/models`: MongoDB schema definitions
  - `/routes`: API route definitions

### Frontend
- **Technologies**: React, Tailwind CSS
- **Key Directories**:
  - `/src/components/auth`: Authentication-related components
  - `/src/components/common`: Reusable UI components
  - `/src/components/company`: Company dashboard components
  - `/src/components/user`: User dashboard components

### Documentation
- `/docs`: Contains detailed documentation on various aspects of the application

## Key Features

### Authentication
- Email-based registration with OTP verification
- Secure login with session management
- Password reset functionality

### User Features
- Profile creation and management
- Job search with filters
- Application tracking
- Dashboard with application statistics

### Company Features
- Company profile management
- Job posting and management
- Candidate review and management
- Application statistics

## Models

### User
- Handles both job seekers and company accounts
- Stores profile information, authentication details
- Tracks profile completion status

### Company
- Stores company details like name, industry, size
- Linked to a user account

### Job
- Contains job listing details
- Linked to a company
- Tracks application count

### Candidate
- Represents a job application
- Links a user to a job
- Tracks application status

## API Routes

### Authentication
- `/api/auth/register`: User registration
- `/api/auth/verify`: OTP verification
- `/api/auth/login`: User login
- `/api/auth/logout`: User logout

### Profile
- `/api/profile/setup-status`: Check profile setup status
- `/api/profile/setup/user`: Set up user profile
- `/api/profile/setup/company`: Set up company profile
- `/api/profile/user`: Get/update user profile
- `/api/profile/company`: Get/update company profile

### Jobs
- `/api/jobs`: CRUD operations for job listings
- `/api/jobs/company/:companyId`: Get jobs by company

### Candidates
- `/api/candidates`: CRUD operations for job applications
- `/api/candidates/job/:jobId`: Get applications by job

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install backend dependencies
```bash
cd Backend
npm install
```

3. Install frontend dependencies
```bash
cd ../Frontend
npm install
```

4. Set up environment variables
   - Create a `.env` file in the Backend directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/intervue
     SESSION_SECRET=your_session_secret
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     FRONTEND_URL=http://localhost:5173
     ```

5. Start the backend server
```bash
cd Backend
npm start
```

6. Start the frontend development server
```bash
cd Frontend
npm run dev
```

## Contributing
Please read the contribution guidelines before submitting pull requests.

## License
This project is licensed under the MIT License.