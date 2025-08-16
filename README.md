# ReviveFitness

ReviveFitness is a **full-stack fitness and membership management platform**.  
It provides a frontend built with **React + Vite**, styled with **CSS Modules / Tailwind**, and a backend powered by **Spring Boot + MySQL**.

---

## 🚀 Features
- 🔐 **Authentication**: Member login & personalized membership page  
- 📊 **Admin Dashboard**: Manage members, programs, trainers, and attendance  
- 📅 **Program & Challenges**: Enroll members into challenges and training programs  
- 🎟 **Attendance Tracking**: QR-based attendance (planned/optional)  
- 🎨 **Responsive UI**: Modern and clean design matching ReviveFitness branding  

---

## 🛠 Tech Stack
**Frontend**
- React + Vite
- React Router
- CSS Modules / TailwindCSS

**Backend**
- Spring Boot 3.x (Java 21+)
- Spring Data JPA
- MySQL 8
- Lombok (for boilerplate reduction)

**Dev Tools**
- Node.js (18+ recommended)
- Maven
- MySQL Workbench (optional for DB management)

---

## 📂 Project Structure
```
repo-root/
├─ revivefitness-backend/       # Spring Boot backend
│  ├─ src/main/java/com/revivefitness
│  ├─ src/main/resources/
│  │   └─ application.properties
│  └─ pom.xml
├─ revivefitness-frontend/      # React + Vite frontend
│  ├─ src/
│  ├─ public/
│  └─ package.json
└─ README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Prerequisites
- [Java 21+](https://adoptium.net/)  
- [Maven](https://maven.apache.org/)  
- [Node.js 18+](https://nodejs.org/)  
- [MySQL 8](https://dev.mysql.com/downloads/mysql/)  

### 2️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 3️⃣ Database Setup
Login to MySQL and create DB + user:
```sql
CREATE DATABASE revivefitness;
CREATE USER 'revive_user'@'%' IDENTIFIED BY 'revive_password';
GRANT ALL PRIVILEGES ON revivefitness.* TO 'revive_user'@'%';
FLUSH PRIVILEGES;
```

### 4️⃣ Backend Setup
Edit `revivefitness-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/revivefitness?useSSL=false&serverTimezone=UTC
spring.datasource.username=revive_user
spring.datasource.password=revive_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run backend:
```bash
cd revivefitness-backend
mvn spring-boot:run
```
Backend runs on **http://localhost:8080**

### 5️⃣ Frontend Setup
Create `revivefitness-frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

Install & start:
```bash
cd revivefitness-frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## 🌐 API Endpoints (sample)

**Auth**
- `POST /api/auth/login` → Login with `{ email, password }`

**Members**
- `GET /api/members` → List all members (admin)  
- `POST /api/members` → Add new member  
- `PUT /api/members/{id}` → Update member info  
- `DELETE /api/members/{id}` → Delete member  

**Programs**
- `GET /api/programs` → List all programs  
- `POST /api/programs` → Add program (admin)  
- `PUT /api/programs/{id}` → Update program (admin)  
- `DELETE /api/programs/{id}` → Remove program  

---

## 🐞 Troubleshooting

- **500 Error on `/api/...`** → Check DB credentials & backend logs  
- **CORS Error** → Make sure `http://localhost:5173` is allowed in backend  
- **Password shows `null`** → Ensure DTO mapping or entity getter is correct  
- **Port Conflicts** → Change ports in `application.properties` or Vite config  

---

## 📦 Build for Production

### Frontend
```bash
cd revivefitness-frontend
npm run build
```
Build output is in `dist/`.

### Backend
```bash
cd revivefitness-backend
mvn clean package
java -jar target/revivefitness-backend-0.0.1-SNAPSHOT.jar
```

---

## 🤝 Contributing
1. Fork the repo  
2. Create your branch: `git checkout -b feature/your-feature`  
3. Commit changes: `git commit -m "Add feature"`  
4. Push: `git push origin feature/your-feature`  
5. Open Pull Request  

---

Feel free to use and modify as needed.
