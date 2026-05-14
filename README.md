# Skill Bridge

A modern platform that helps students connect with the perfect tutors easily and efficiently.

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Live Demo](#live-demo)
- [Contact](#contact)

---

## About The Project

Skill Bridge is a full-stack tutoring platform designed to connect students with qualified tutors in a simple and user-friendly way. The platform includes secure authentication, role-based dashboards, tutor discovery, payment integration, and a modern responsive UI for a smooth learning experience.

---

## Features

- Role-based dashboards for Admin, Student, and Tutor
- Tutor search and discovery system
- Secure authentication with Better Auth & Google OAuth
- Responsive modern UI with dark/light mode
- Form handling and validation using React Hook Form & Zod
- Secure payment integration
- Protected routes using middleware

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

### UI & Libraries
- Shadcn UI
- Radix UI
- Lucide React

### Authentication & Validation
- Better Auth
- Google OAuth
- React Hook Form
- Zod

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/your-username/skill-bridge-frontend.git
```

### Navigate to the project folder

```bash
cd skill-bridge-frontend
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Create a `.env.local` file in the root directory and add the following:

```env
# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"

# Backend API
NEXT_PUBLIC_API="http://localhost:5000"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### Run the development server

```bash
npm run dev
```

---

## Environment Variables

| Variable Name      | Description                     |
| ------------------ | ------------------------------- |
| DATABASE_URL       | PostgreSQL database connection  |
| NEXT_PUBLIC_API    | Backend API base URL            |
| FRONTEND_URL       | Frontend application URL        |

---

## Folder Structure

```plaintext
skill-bridge-frontend/
│
├── src/
│   ├── app/
│   │   ├── (commonLayout)/
│   │   ├── (dashboardLayout)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── components/
│   │   ├── pages/
│   │   ├── providers/
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── middleware.ts
│
├── public/
├── package.json
└── next.config.js
```

---

## Dependencies

```json
"dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@react-oauth/google": "^0.13.5",
    "better-auth": "^1.5.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.576.0",
    "next": "16.1.6",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "zod": "^4.3.6"
  },
```

---

## Live Demo

🔗 Live Site: https://skill-bridge-full-stack-frontend.vercel.app/

---

## Contact

- Portfolio: https://portfolio-kappa-weld-92.vercel.app/
- Email: baishnabsamir26@gmail.com
