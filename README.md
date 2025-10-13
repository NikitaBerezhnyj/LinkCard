# LinkCard

Repository has [english :uk:](#linkcard-uk) and [ukrainian :ukraine:](#linkcard-ukraine) localization.

## LinkCard :uk:

LinkCard is a platform for creating template-based digital business card websites. Users can easily generate a personalized web page containing their social links, contact information, and other resources. The project includes both a web application and a mobile-friendly interface.

### Overview

LinkCard aims to provide users with a simple way to showcase their online presence through customizable templates. Each user can create a unique digital business card that is accessible via a personalized URL. The platform is designed to be scalable and easy to deploy using Docker.

### Features

- Template-based digital business cards with customizable layouts.
- QR code generation for easy sharing of your card.
- File upload support (avatars, images) via MinIO.
- API endpoints for fetching user data by username.
- Full-stack setup with Docker Compose for local development.

### Technologies Used

- **Next.js** (TypeScript) – Frontend framework.
- **Node.js** (TypeScript) – Backend server.
- **Express.js** – REST API for user management.
- **MongoDB** – Database for storing user profiles and links.
- **MinIO** – Object storage for file uploads.
- **Docker & Docker Compose** – Containerization and local development.
- **TypeScript** – Type safety across client and server.

### Getting Started

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

### Usage

Once the project is running, you can:

1. Register a new user account.
2. Log in to your dashboard.
3. Create a new digital business card using available templates.
4. Add, edit, or remove links for your profile.
5. Upload an avatar or other media files.
6. Access your personalized card via the provided URL.

### License & Community Guidelines

- [License](LICENSE) — project license.
- [Code of Conduct](CODE_OF_CONDUCT.md) — expected behavior for contributors.
- [Contributing Guide](CONTRIBUTING.md) — how to help the project.
- [Security Policy](SECURITY.md) — reporting security issues.

---

## LinkCard :ukraine:

LinkCard — це платформа для створення шаблонних цифрових бізнес-карток. Користувачі можуть легко згенерувати персоналізовану веб-сторінку з посиланнями на соціальні мережі, контактною інформацією та іншими ресурсами. Проєкт включає як веб-застосунок, так і мобільну версію.

### Огляд

Мета LinkCard — надати користувачам простий спосіб продемонструвати свою онлайн-присутність через налаштовувані шаблони. Кожен користувач може створити унікальну цифрову бізнес-картку, доступну за персоналізованим URL. Платформа спроектована для масштабування та легкого розгортання за допомогою Docker.

### Функціональні можливості

- Цифрові бізнес-картки на основі шаблонів з можливістю налаштування дизайну.
- Генерація QR-кодів для швидкого обміну вашою карткою.
- Підтримка завантаження файлів (аватари, зображення) через MinIO.
- API для отримання даних користувача за username.
- Повний стек з Docker Compose для локальної розробки.

### Використані технології

- **Next.js** (TypeScript) – фронтенд фреймворк.
- **Node.js** (TypeScript) – серверна частина.
- **Express.js** – REST API для управління користувачами.
- **MongoDB** – база даних для зберігання профілів користувачів та посилань.
- **MinIO** – сховище об’єктів для завантажених файлів.
- **Docker & Docker Compose** – контейнеризація та локальна розробка.
- **TypeScript** – типізація на клієнті та сервері.

### Початок роботи

Щоб розпочати роботу з LinkCard, виконайте наступні кроки:

1. Клонуйте репозиторій:

   ```bash
   git clone https://github.com/NikitaBerezhnyj/LinkCard.git
   cd LinkCard
   ```

2. Заповніть файл `.env` даними відповідно до шаблону з `.example.env` у корені проєкту.

3. Запустіть всі сервіси за допомогою Docker Compose:

   ```bash
   docker-compose up --build
   ```

Після запуску всі сервіси будуть доступні за такими локальними URL:

- Клієнт: [http://localhost:3000](http://localhost:3000)
- Сервер: [http://localhost:5000](http://localhost:5000)
- MongoDB Express Web: [http://localhost:8081](http://localhost:8081)
- MinIO Web: [http://localhost:9001](http://localhost:9001)

### Використання

Після запуску проєкту ви можете:

1. Зареєструвати новий обліковий запис користувача.
2. Увійти до своєї панелі керування.
3. Створити нову цифрову бізнес-картку за доступними шаблонами.
4. Додавати, редагувати або видаляти посилання у своєму профілі.
5. Завантажувати аватар або інші медіафайли.
6. Переглядати персоналізовану картку за наданим URL.

### Ліцензія та правила спільноти

- [Ліцензія](LICENSE) — ліцензія проєкту.
- [Кодекс поведінки](CODE_OF_CONDUCT.md) — очікувана поведінка для учасників.
- [Посібник з внеску](CONTRIBUTING.md) — як допомогти проєкту.
- [Політика безпеки](SECURITY.md) — повідомлення про проблеми безпеки.
