\# 📚 Teachers Notes Portal

\### A Full-Stack Collaborative Learning Platform



A web-based platform designed to make sharing, managing, and accessing educational notes easier. Teachers and students can use the portal to access learning materials, upload documents, and collaborate through a centralized notes management system.



\## 🚀 Project Overview



The \*\*Teachers Notes Portal\*\* provides a centralized platform for educational resources. Users can log in, explore available notes, search for study materials, and download documents. The platform also provides document-upload functionality and teacher information.



\## ✨ Key Features



\- \*\*User Authentication:\*\* Login using username and password.

\- \*\*Notes Management:\*\* Browse and access available educational notes.

\- \*\*Document Upload:\*\* Upload PDF, DOC, DOCX, PPT, PPTX, and TXT files.

\- \*\*Download Materials:\*\* Download uploaded study materials.

\- \*\*Teacher Directory:\*\* Retrieve and view teacher information.

\- \*\*Search Functionality:\*\* Search notes by title, subject, teacher name, and description.

\- \*\*Dashboard Statistics:\*\* Display total notes, teachers, and students.

\- \*\*Delete Notes:\*\* Remove notes and their associated uploaded files through the backend API.

\- \*\*Responsive Interface:\*\* Modern interface designed using React and Tailwind CSS utility classes.



\## 🛠️ Technology Stack



| Category | Technologies |

|---|---|

| Frontend | React.js, JavaScript |

| Styling | Tailwind CSS, CSS |

| Icons | Lucide React |

| Backend | Node.js, Express.js |

| Database | MySQL |

| Database Driver | MySQL2 |

| File Upload | Multer |

| API Communication | REST APIs, Fetch API |

| Middleware | CORS, Express JSON |

| Version Control | Git, GitHub |



\## 📂 Project Structure



```text

TeachersNotesProject/

│

├── backend/

│   ├── .vscode/

│   ├── uploads/

│   ├── package.json

│   ├── package-lock.json

│   └── server.js

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── App.js

│   │   ├── App.css

│   │   ├── index.js

│   │   └── index.css

│   ├── package.json

│   └── tailwind.config.js

│

├── .gitignore

└── README.md

```



\## ⚙️ Installation and Setup



\### 1. Clone the Repository



```bash

git clone https://github.com/ashisA1saha/TeachersNotesProject.git

```



```bash

cd TeachersNotesProject

```



\### 2. Backend Setup



```bash

cd backend

npm install

```



Configure your MySQL database and environment variables before starting the backend.



Create a `.env` file inside the backend folder:



```env

PORT=5000

DB\_HOST=localhost

DB\_USER=root

DB\_PASSWORD=your\_mysql\_password

DB\_NAME=teachers\_notes\_db

```



The backend must be configured to read these environment variables. Do not commit your `.env` file.



Start the backend:



```bash

npm start

```



Backend URL:



```text

http://localhost:5000

```



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

npm start

```



The React development server will start at:



```text

http://localhost:3000

```



\### 4. Database Configuration



Create a MySQL database named:



```sql

CREATE DATABASE teachers\_notes\_db;

```



The application expects the following tables:



\- `users`

\- `teachers`

\- `notes`



Configure the required columns and relationships according to the SQL queries in `backend/server.js`. The database schema must be created separately.



\## 🔗 Backend API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/login` | User login |

| GET | `/api/teachers` | Retrieve teachers |

| GET | `/api/notes` | Retrieve all notes |

| POST | `/api/notes` | Upload a new note |

| GET | `/api/download/:id` | Download a note |

| DELETE | `/api/notes/:id` | Delete a note |

| GET | `/api/stats` | Retrieve dashboard statistics |



\## 📤 File Upload Specifications



\- Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT.

\- Maximum upload size: 10 MB.

\- Uploaded documents are stored in the backend uploads directory.

\- Multer handles file upload processing.



\## 🔒 Security Notes



\- Store database credentials in environment variables.

\- Never upload `.env` files or sensitive credentials to GitHub.

\- Implement secure password hashing and authentication before production deployment.

\- Add authorization checks to protected operations.

\- Configure appropriate CORS policies for deployment.



\## 🔮 Future Improvements



\- Role-based access control for administrators, teachers, and students.

\- Secure authentication using JWT.

\- Password hashing and account management.

\- Cloud-based document storage.

\- Advanced filtering and pagination.

\- Online document preview.

\- Deployment with a cloud-hosted database.



\## 👨‍💻 Developer



\*\*Ashis Saha\*\*



