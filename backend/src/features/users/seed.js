const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const User = require('./user.model');
const Event = require('../events/event.model');
const Attendance = require('../attendance/attendance.model');
const seedUsers = require('./seed.data');
const { formatISTDateString } = require('../../shared/utils/time');

const runSeed = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: Seed cannot be run in production environment (NODE_ENV=production)!');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (!args.includes('--yes')) {
    console.error('ERROR: Missing required flag "--yes". Run with: npm run seed -- --yes');
    process.exit(1);
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/acm_amtics';
    console.log(`Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // 1. Drop existing collections
    console.log('Dropping existing collections...');
    for (const model of [User, Event, Attendance]) {
      try {
        await model.collection.drop();
      } catch (dropErr) {
        // collection does not exist
      }
    }
    console.log('Collections dropped successfully.');

    // 2. Sync indexes
    console.log('Syncing database indexes...');
    await User.syncIndexes();
    await Event.syncIndexes();
    await Attendance.syncIndexes();

    // 3. Seed Users
    console.log(`Seeding ${seedUsers.length} users with bcrypt-hashed passwords...`);
    const tableData = [];
    const createdUsers = [];

    for (const item of seedUsers) {
      const tempPassword = item.email.split('@')[0];

      const user = new User({
        ...item,
        password: tempPassword,
      });

      await user.save();
      createdUsers.push(user);

      tableData.push({
        Name: item.name,
        Email: item.email,
        Phone: item.phone,
        Enrollment: item.enrollmentNumber,
        Password: tempPassword,
        Role: item.role,
        Position: item.position || '-',
        Year: item.year,
        Dept: item.department.includes('Information') ? 'IT' : 'CSE',
      });
    }

    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const coord1 = createdUsers.find((u) => u.email === 'neha.t@amtics.ac.in'); // Prof. Neha Trivedi
    const coord2 = createdUsers.find((u) => u.email === 'kriti.s@amtics.ac.in'); // Kriti Singh (second coordinator-eligible)
    const ayesha = createdUsers.find((u) => u.email === 'ayesha.k@amtics.ac.in');
    const rohan = createdUsers.find((u) => u.email === 'rohan.m@amtics.ac.in');
    const zara = createdUsers.find((u) => u.email === 'zara.s@amtics.ac.in');
    const arman = createdUsers.find((u) => u.email === 'arman.s@amtics.ac.in');
    const adnan = createdUsers.find((u) => u.email === 'adnan.s@amtics.ac.in');
    const devansh = createdUsers.find((u) => u.email === 'devansh.j@amtics.ac.in');
    const riya = createdUsers.find((u) => u.email === 'riya.s@amtics.ac.in');
    const harsh = createdUsers.find((u) => u.email === 'harsh.p@amtics.ac.in');
    const tanvi = createdUsers.find((u) => u.email === 'tanvi.d@amtics.ac.in');

    // 4. Seed 8 Events
    console.log('Seeding 8 events spread around seed time...');
    const todayISTStr = formatISTDateString(new Date());

    // Today's event start/end times inside the scan window
    // Now is within scan window (scan opens 3 hours before startsAt until endsAt)
    const now = new Date();
    // Starts 1 hour from now, ends 4 hours from now -> scan is OPEN right now!
    const todayStartsAt = new Date(now.getTime() + 60 * 60 * 1000);
    const todayEndsAt = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const eventTemplates = [
      // 1. Today's live/scan-ready event assigned to coord1 (Prof. Neha) and coord2 (Kriti)
      {
        name: 'Web Development Workshop',
        category: 'Workshop',
        startsAt: todayStartsAt,
        endsAt: todayEndsAt,
        venue: 'Seminar Hall, AMTICS',
        coordinators: [coord1._id, coord2._id],
        createdBy: adminUser._id,
      },
      // 2. Event assigned to coord1 (Prof. Neha)
      {
        name: 'Introduction to AI/ML',
        category: 'Seminar',
        startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days upcoming
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        venue: 'Lab 304, AMTICS',
        coordinators: [coord1._id],
        createdBy: adminUser._id,
      },
      // 3. Past Event 1 (Competition)
      {
        name: 'ACM Hackathon 2024',
        category: 'Competition',
        startsAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        venue: 'Auditorium, AMTICS',
        coordinators: [coord2._id],
        createdBy: adminUser._id,
      },
      // 4. Past Event 2 (Talk)
      {
        name: 'Open Source and GSoC Session',
        category: 'Talk',
        startsAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        venue: 'Room 201, AMTICS',
        coordinators: [coord1._id],
        createdBy: adminUser._id,
      },
      // 5. Past Event 3 (Workshop)
      {
        name: 'Flutter Development Workshop',
        category: 'Workshop',
        startsAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        venue: 'Computer Lab 2, AMTICS',
        coordinators: [coord2._id],
        createdBy: adminUser._id,
      },
      // 6. Past Event 4 (Seminar)
      {
        name: 'Career Guidance Session',
        category: 'Seminar',
        startsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        venue: 'Seminar Hall, AMTICS',
        coordinators: [coord1._id],
        createdBy: adminUser._id,
      },
      // 7. Past Event 5 (Workshop)
      {
        name: 'UI/UX Design Workshop',
        category: 'Workshop',
        startsAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        venue: 'Design Studio, AMTICS',
        coordinators: [coord2._id],
        createdBy: adminUser._id,
      },
      // 8. Upcoming Event (Talk)
      {
        name: 'Tech for Social Good',
        category: 'Talk',
        startsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        venue: 'Conference Hall, AMTICS',
        coordinators: [coord1._id],
        createdBy: adminUser._id,
      },
    ];

    const createdEvents = await Event.insertMany(eventTemplates);
    console.log(`Created ${createdEvents.length} events.`);

    // 5. Seed Attendance records so that two members (Ayesha and Rohan) have 5+ attended events
    // Past events are indices: 2, 3, 4, 5, 6 (5 events)
    const pastEvents = [createdEvents[2], createdEvents[3], createdEvents[4], createdEvents[5], createdEvents[6]];

    const attendanceRecords = [];

    // Ayesha attended all 5 past events -> 5 events attended (Active Member badge earned!)
    pastEvents.forEach((ev) => {
      attendanceRecords.push({
        event: ev._id,
        user: ayesha._id,
        checkedInAt: new Date(ev.startsAt.getTime() + 10 * 60 * 1000),
        scannedBy: coord1._id,
      });
    });

    // Rohan attended all 5 past events -> 5 events attended (Active Member badge earned!)
    pastEvents.forEach((ev) => {
      attendanceRecords.push({
        event: ev._id,
        user: rohan._id,
        checkedInAt: new Date(ev.startsAt.getTime() + 15 * 60 * 1000),
        scannedBy: coord1._id,
      });
    });

    // Others attended some past events
    [zara, arman, devansh].forEach((u) => {
      attendanceRecords.push({
        event: pastEvents[0]._id,
        user: u._id,
        checkedInAt: new Date(pastEvents[0].startsAt.getTime() + 20 * 60 * 1000),
        scannedBy: coord2._id,
      });
      attendanceRecords.push({
        event: pastEvents[1]._id,
        user: u._id,
        checkedInAt: new Date(pastEvents[1].startsAt.getTime() + 25 * 60 * 1000),
        scannedBy: coord1._id,
      });
    });

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records.`);

    console.log('\nDatabase seeded successfully!');
    console.log('\n--- SEEDED USERS & TEMPORARY CREDENTIALS ---');
    console.table(tableData);

    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeed();
