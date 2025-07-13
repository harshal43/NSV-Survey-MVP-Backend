# NSV Inspection System – Backend

Backend for the NSV Inspection System developed for NHAI Hackathon 2025. It powers the real-time mobile inspection app and the web dashboard, supporting GPS-based distress visualization, video inspection records, and user-role-based access.

## 🛠 Tech Stack

**Server:** Node.js, Express  
**Database:** PostgreSQL + PostGIS (for spatial data handling)


## 📦 Dependencies

- **pino-pretty:** Enhanced logging for debugging
- **ulid:** Generates unique IDs across distributed systems
- **jsonwebtoken:** For signing and verifying JWT tokens
- **bcrypt:** For securely hashing user passwords
- **ws:** To enable web socket protocol
- **pg-pool:** For a connection pool of database

## 🚀 Run Locally

### STEP 1: Clone the Repository

```bash
git clone https://github.com/harshal43/NSV-Survey-MVP-Backend.git
```

### STEP 2: Install Dependencies

```bash
npm install
```

### STEP 3: Create `.env` File

```bash
touch .env
```

Add the following environment variables:

```env
DBUSER=your_database_user
DBHOST=your_database_host
DB=your_database_name
DBPASSWORD=your_database_password
DBPORT=your_db_port
PORT=your_backend_port
JWT_SECRET=your_jwt_secret
WEBSOCKETURL=your_websocket_url
```

### STEP 4: Set up Database Tables

Use the following SQL schema to initialize your PostgreSQL database:

> Full schema includes tables: `users`, `projects`, `piu_master`, `ro_master`, `inspection`, `lanes`, `distress_segments`, `distress_limits`  
> Includes constraints, foreign keys, and PostGIS types (`geography`)  in /scripts/db.sql

### STEP 5: Insert Sample Data *(Optional)*

```bash
# use scripts/db.sql
```

### STEP 6: Start the Backend Server

```bash
npm start
```

---

## 📸 ERD Diagram

![ERD Diagram](https://drive.google.com/file/d/1D-X1__X3k73F4ypw7UJEQ2-dt1zXM1f6/view?usp=drive_link)


## ✨ Key Features

- JWT-based Authentication & Role Authorization (RO, PIU, Admin)
- Secure password hashing using `bcrypt`
- Geo-aware API to fetch distress segments near live GPS coordinates
- WebSocket support for real-time location updates (optional)
- Centralized architecture for integration with mobile and web clients


## 👤 Author

- [Harshal Bharatkar](https://www.linkedin.com/in/harshal-bharatkar/)
- [Ayan Shrivastava](https://www.linkedin.com/in/ayan-shrivastava-248501194?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
