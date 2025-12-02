# YIT University Course Registration System

A modern, full-stack web application for course registration and management at YIT University. Built with React and Node.js, featuring a clean UI and JSON-based data storage (no database installation required).

![Project Status](https://img.shields.io/badge/status-active-success)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React Version](https://img.shields.io/badge/react-18.2.0-blue)

---

## ✨ Features

### For Students
- ✅ **Course Selection** - Browse courses by semester, department, or slot
- ✅ **Seat Availability** - Real-time seat count display
- ✅ **Slot Management** - Automatic slot conflict detection
- ✅ **Course Registration** - Easy register/drop functionality
- ✅ **My Courses** - View all registered courses in one place
- ✅ **Search & Filter** - Find courses quickly with advanced filters
- ✅ **Profile Management** - Update personal information

### For Faculty
- ✅ **Course Management** - Create and manage courses
- ✅ **Schedule Setting** - Set course schedules and slots
- ✅ **Student View** - See registered students for your courses
- ✅ **Profile Management** - Update faculty information

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yit-course-registration.git
   cd yit-course-registration
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm run install-all
   
   # Or install separately:
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start the application**

   **Option 1: Start both servers together**
   ```bash
   npm run dev
   ```

   **Option 2: Start separately**
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Seed Sample Data (Optional)

Create sample courses, students, and faculty:

```bash
cd backend
npm run seed
```

**Default Login Credentials:**
- **Student**: `student1@yituniversity.edu` / `student123`
- **Faculty**: `faculty1@yituniversity.edu` / `faculty123`

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Heroicons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **JSON File Storage** - No database required!

---

## 📁 Project Structure

```
yit-course-registration/
├── backend/
│   ├── data/              # JSON data files (auto-created)
│   │   ├── students.json
│   │   ├── faculty.json
│   │   ├── courses.json
│   │   └── registrations.json
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── students.js
│   │   ├── faculty.js
│   │   └── registrations.js
│   ├── middleware/        # Auth middleware
│   ├── dataStore.js       # JSON file storage handler
│   ├── server.js          # Express server
│   └── seedData.js        # Sample data generator
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/         # Page components
│   │   │   ├── Login.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── FacultyDashboard.js
│   │   │   ├── CourseCatalog.js
│   │   │   ├── MyCourses.js
│   │   │   ├── Profile.js
│   │   │   └── FacultyProfile.js
│   │   ├── context/       # React context
│   │   │   └── AuthContext.js
│   │   └── App.js         # Main app component
│   └── public/
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/faculty` - Faculty registration

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Faculty only)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Registrations
- `POST /api/registrations/register` - Register for course
- `POST /api/registrations/drop` - Drop course
- `GET /api/registrations/my-courses` - Get student's courses

### Students
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile

### Faculty
- `GET /api/faculty/profile` - Get faculty profile
- `PUT /api/faculty/profile` - Update faculty profile

---

## 💾 Data Storage

This project uses **JSON file-based storage** - no database installation required!

- All data is stored in `backend/data/` folder
- Files are automatically created on first run
- Easy to backup (just copy the `data` folder)
- Perfect for development and small projects

**Data Files:**
- `students.json` - Student records
- `faculty.json` - Faculty records
- `courses.json` - Course catalog
- `registrations.json` - Course registrations

---

## 🎯 Key Features Explained

### Course Registration Flow
1. Student logs in
2. Browses course catalog with search and filters
3. Views course details (seats, faculty, schedule, slot)
4. Registers for course (automatic slot conflict check)
5. Views registered courses in "My Courses" tab
6. Can drop courses if needed

### Slot Conflict Detection
- Automatically prevents registering for multiple courses in the same slot
- Shows clear error message if conflict detected
- Helps students manage their schedule effectively

### Seat Availability
- Real-time seat count display
- Prevents registration when course is full
- Updates automatically when students register/drop

---

## 🧪 Testing

### Manual Testing Steps

1. **Login as Student**
   - Use: `student1@yituniversity.edu` / `student123`
   - Navigate to Course Catalog
   - Register for a course
   - Check "My Courses" tab

2. **Login as Faculty**
   - Use: `faculty1@yituniversity.edu` / `faculty123`
   - View courses
   - Create new course (if needed)
   - View profile

---

## 📝 Environment Variables

Create `backend/.env` file (optional):

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- YIT University for the project inspiration
- All contributors and testers

---

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for YIT University**

