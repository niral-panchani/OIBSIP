# Login Authentication System

## About
A client-side authentication demonstration built using HTML, CSS, and vanilla JavaScript. It includes registration, login validation, and a dashboard protected by a browser session.

## Features
- User registration with username and email
- Password validation: minimum 8 characters and at least one number
- Duplicate email checking
- SHA-256 password hashing demonstration
- Login validation with a generic incorrect-credentials message
- Protected dashboard with session expiration
- Logout functionality
- Responsive layout

## Technologies Used
- HTML5
- CSS3
- JavaScript
- localStorage
- sessionStorage
- Web Crypto API

## How to Run
1. Open the project folder in VS Code.
2. Run `index.html` using Live Server.
3. Register an account.
4. Log in and explore the dashboard.
5. Test logout and direct dashboard access.

## Storage
Demo user records are saved in browser localStorage, while the login session is stored in sessionStorage. Data is local to the browser and is not shared across devices.

## Security Note
This is an educational front-end demonstration, not production-ready authentication. SHA-256 alone is not a suitable password-storage scheme for real applications. Production systems should use a backend, server-side password hashing such as Argon2id or bcrypt, and server-enforced authentication and authorization.

## Author
Completed as part of the OIBSIP Web Development and Designing internship tasks.
