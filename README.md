# Skill Bridge

A modern platform that helps students connect with the perfect tutors easily and efficiently.

---

## About The Project

Skill Bridge is a full-stack tutoring platform designed to make learning more accessible by connecting students with qualified tutors. The platform includes role-based dashboards, secure authentication, tutor discovery, payment integration, and a modern responsive UI for a smooth user experience.

---

## Features

- Role-based dashboards for Admin, Student, and Tutor
- Tutor search and discovery system
- Secure authentication with Better Auth & Google OAuth
- Responsive modern UI with dark/light mode
- Form handling and validation using React Hook Form & Zod
- Secure payment integration
- Protected routes with middleware support

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

### Run the development server

```bash
npm run dev
```

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
{
  "next": "16.1.6",
  "react": "19.2.3",
  "tailwindcss": "^4.0.0",
  "better-auth": "^1.5.1",
  "@react-oauth/google": "^0.13.5",
  "react-hook-form": "^7.71.2",
  "zod": "^4.3.6",
  "sonner": "^2.0.7",
  "lucide-react": "^0.576.0"
}
```

---

## Live Demo

🔗 Live Site: https://yourdomain.com

---

## Contact

- Portfolio: https://yourportfolio.com
- Email: your-email@example.com

---

## License

This project is licensed under the MIT License.
