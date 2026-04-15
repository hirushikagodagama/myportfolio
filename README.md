# Personal Portfolio Platform

Modern portfolio website with a secure admin dashboard.

## Stack

- React + Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Local image uploads

## Structure

- `client/` React frontend for the public site and admin panel
- `server/` Express REST API and MongoDB models

## Getting Started

1. Copy `server/.env.example` to `server/.env`
2. Copy `client/.env.example` to `client/.env`
3. Install dependencies with `npm install`
4. Run `npm run dev`

## Default Admin

- Email: value of `ADMIN_EMAIL` in `server/.env`
- Password: value of `ADMIN_PASSWORD` in `server/.env`

The server seeds the admin account and starter content on boot if they do not exist.

## Suggested Git Setup

```powershell
git init
git remote add origin https://github.com/hirushikagodagama/myportfolio.git
git checkout -b develop
```
