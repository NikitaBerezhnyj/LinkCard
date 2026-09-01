# LinkCard

LinkCard is a platform for creating template-based digital business card websites. Users can easily generate a personalized web page containing their social links, contact information, and other resources. The project includes both a web application and a mobile-friendly interface.

## Overview

LinkCard aims to provide users with a simple way to showcase their online presence through customizable templates. Each user can create a unique digital business card that is accessible via a personalized URL. The platform is designed to be scalable and easy to deploy using Docker.

## Features

- Template-based digital business cards with customizable layouts.
- QR code generation for easy sharing of your card.
- File upload support (avatars, images) via MinIO.
- API endpoints for fetching user data by username.
- Full-stack setup with Docker Compose for local development.

## Technologies Used

- **Next.js** (TypeScript) – Frontend framework.
- **ASP.NET Core** (C#) – Backend server.
- **PostgreSQL** – Database for storing user profiles and links.
- **MinIO** – Object storage for file uploads.
- **Docker & Docker Compose** – Containerization and local development.

## Getting Started

To get started with LinkCard, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/NikitaBerezhnyj/LinkCard.git
   cd LinkCard
   ```

2. Fill in the .env file with data according to the template from .example.env in the root directory.

3. Start all services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

Once everything is running, you can access the services at the following local URLs:

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:5000](http://localhost:5000)
- MongoDB Express Web: [http://localhost:8081](http://localhost:8081)
- MinIO Web: [http://localhost:9001](http://localhost:9001)

## Usage

Once the project is running, you can:

1. Register a new user account.
2. Log in to your dashboard.
3. Create a new digital business card using available templates.
4. Add, edit, or remove links for your profile.
5. Upload an avatar or other media files.
6. Access your personalized card via the provided URL.

## License & Community Guidelines

- [License](LICENSE) — project license.
- [Code of Conduct](CODE_OF_CONDUCT.md) — expected behavior for contributors.
- [Contributing Guide](CONTRIBUTING.md) — how to help the project.
- [Security Policy](SECURITY.md) — reporting security issues.
