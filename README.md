# Bassey Publisher's Library Hub

A Node.js/Express web application for managing and accessing a publisher's library, deployed on AWS EC2 with PostgreSQL (AWS RDS) and Google OAuth authentication.

---

## Features

- User authentication with Google OAuth 2.0
- RESTful API for managing books and users
- Swagger API documentation
- PostgreSQL database (AWS RDS)
- Responsive UI with EJS templates
- Production-ready deployment on AWS EC2
- Process management with PM2

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- Git
- AWS EC2 instance (Amazon Linux recommended)
- AWS RDS PostgreSQL database

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/Publisher-s-Library-Hub.git
   cd Publisher-s-Library-Hub/backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with the following content:

   ```properties
   PORT=3000

   GOOGLE_CALLBACK_URL=http://<your-ec2-public-dns>:3000/auth/google/callback
   GOOGLE_REDIRECT_URI=http://<your-ec2-public-dns>:3000/api-docs/oauth2-redirect.html

   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   DATABASE_URI=postgresql://<db-username>:<db-password>@<rds-endpoint>:5432/<db-name>
   NODE_ENV=production
   DB_SSL=true

   SESSION_SECRET=your_session_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ```

4. **Start the application:**
   ```sh
   npm run start
   ```
   Or use PM2 for production:
   ```sh
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

---

## Deployment

- **EC2 Public URL:**  
  `http://ec2-16-170-203-248.eu-north-1.compute.amazonaws.com:3000`
- **Swagger API Docs:**  
  `http://ec2-16-170-203-248.eu-north-1.compute.amazonaws.com:3000/api-docs`

**Make sure your EC2 security group allows inbound traffic on port 3000.**

---

## Usage

- Access the main app at your EC2 public DNS or IP.
- Use Google OAuth to log in.
- Explore API endpoints via Swagger documentation.

---

## License

MIT

---

## Author

Bassey Publisher's Library
