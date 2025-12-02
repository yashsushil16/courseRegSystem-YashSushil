// Create sample data
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');

// Indian faculty names
const facultyNames = [
  'Dr. Rajesh Kumar',
  'Dr. Priya Sharma',
  'Dr. Amit Patel',
  'Dr. Sneha Reddy',
  'Dr. Vikram Singh',
  'Dr. Anjali Desai',
  'Dr. Ravi Menon',
  'Dr. Kavita Nair',
  'Dr. Sanjay Iyer',
  'Dr. Meera Joshi',
  'Dr. Arjun Malhotra',
  'Dr. Divya Rao'
];

const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const slots = ['A', 'B', 'C', 'D', 'E', 'F'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', 
               '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'];

const courseData = [
  { code: 'CS101', name: 'Introduction to Programming', credits: 3, semesters: [1, 2] },
  { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, semesters: [3, 4] },
  { code: 'CS301', name: 'Database Management Systems', credits: 4, semesters: [5, 6] },
  { code: 'CS401', name: 'Machine Learning', credits: 4, semesters: [7, 8] },
  { code: 'CS302', name: 'Computer Networks', credits: 3, semesters: [5, 6] },
  { code: 'CS402', name: 'Software Engineering', credits: 4, semesters: [7, 8] },
  { code: 'EE101', name: 'Basic Electronics', credits: 3, semesters: [1, 2] },
  { code: 'EE201', name: 'Digital Electronics', credits: 4, semesters: [3, 4] },
  { code: 'ME101', name: 'Engineering Mechanics', credits: 3, semesters: [1, 2] },
  { code: 'ME201', name: 'Thermodynamics', credits: 4, semesters: [3, 4] },
  { code: 'CE101', name: 'Engineering Drawing', credits: 2, semesters: [1, 2] },
  { code: 'CE201', name: 'Structural Analysis', credits: 4, semesters: [3, 4] },
];

async function seedDatabase() {
  try {
    console.log('Creating sample data...\n');

    // Clear existing data
    const StudentStore = require('./dataStore').Student;
    const FacultyStore = require('./dataStore').Faculty;
    const CourseStore = require('./dataStore').Course;
    
    const allStudents = await Student.find();
    const allFaculty = await Faculty.find();
    const allCourses = await Course.find();
    
    for (const student of allStudents) {
      await StudentStore.delete(student._id);
    }
    for (const faculty of allFaculty) {
      await FacultyStore.delete(faculty._id);
    }
    for (const course of allCourses) {
      await CourseStore.delete(course._id);
    }

    // Create faculty
    const facultyList = [];
    for (let i = 0; i < facultyNames.length; i++) {
      const hashedPassword = await bcrypt.hash('faculty123', 10);
      const faculty = new Faculty({
        facultyId: `FAC${2024000 + i + 1}`,
        name: facultyNames[i],
        email: `faculty${i + 1}@yituniversity.edu`,
        password: hashedPassword,
        department: departments[i % departments.length],
        designation: i % 3 === 0 ? 'Professor' : i % 3 === 1 ? 'Associate Professor' : 'Assistant Professor',
        phone: `+91 ${9 + Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 100000000)}`,
        courses: []
      });
      await faculty.save();
      facultyList.push(faculty);
    }

    // Create sample students
    const studentNames = [
      'Rahul Verma', 'Sneha Gupta', 'Arjun Mehta', 'Priya Shah',
      'Vikram Agarwal', 'Ananya Reddy', 'Karan Malhotra', 'Isha Patel'
    ];

    for (let i = 0; i < studentNames.length; i++) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      const student = new Student({
        studentId: `YIT${2024000 + i + 1}`,
        name: studentNames[i],
        email: `student${i + 1}@yituniversity.edu`,
        password: hashedPassword,
        department: departments[i % departments.length],
        semester: (i % 8) + 1,
        phone: `+91 ${9 + Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 100000000)}`,
        registeredCourses: []
      });
      await student.save();
    }

    // Create courses
    let courseIndex = 0;
    for (const courseInfo of courseData) {
      const dept = courseInfo.code.startsWith('CS') ? 'Computer Science' :
                   courseInfo.code.startsWith('EE') ? 'Electronics' :
                   courseInfo.code.startsWith('ME') ? 'Mechanical' :
                   courseInfo.code.startsWith('CE') ? 'Civil' : 'Electrical';

      const facultyForDept = facultyList.filter(f => f.department === dept);
      if (facultyForDept.length === 0) continue;

      for (const semester of courseInfo.semesters) {
        const faculty = facultyForDept[Math.floor(Math.random() * facultyForDept.length)];
        const slot = slots[Math.floor(Math.random() * slots.length)];
        const scheduleDays = [days[Math.floor(Math.random() * days.length)]];
        if (Math.random() > 0.5) {
          scheduleDays.push(days[Math.floor(Math.random() * days.length)]);
        }
        const time = times[Math.floor(Math.random() * times.length)];

        const totalSeats = 30 + Math.floor(Math.random() * 20);
        const course = new Course({
          courseCode: `${courseInfo.code}-S${semester}`,
          courseName: courseInfo.name,
          department: dept,
          credits: courseInfo.credits,
          semester: semester,
          faculty: faculty._id,
          facultyName: faculty.name,
          totalSeats: totalSeats,
          availableSeats: totalSeats,
          slot: slot,
          schedule: {
            days: scheduleDays,
            time: time
          },
          description: `This course covers fundamental concepts of ${courseInfo.name.toLowerCase()}.`
        });

        await course.save();
        
        // Update faculty courses array
        if (!faculty.courses) faculty.courses = [];
        faculty.courses.push(course._id);
        await faculty.save();
        
        courseIndex++;
      }
    }

    console.log('\nDone! Sample data created.');
    console.log('\nLogin:');
    console.log('Student: student1@yituniversity.edu / student123');
    console.log('Faculty: faculty1@yituniversity.edu / faculty123\n');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDatabase().then(() => {
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
