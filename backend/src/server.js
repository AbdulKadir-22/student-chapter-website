const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const connectDB = require('./shared/config/db');
const createApp = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
