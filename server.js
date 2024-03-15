// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://Sravani:67331@cluster0.o26nd8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Schema for Sensor Data
const sensorDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  temperature: Number,
  heartbeat: Number,
  spo2: Number,
  fallDetected: Boolean,
  severityLevel: String,
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// API Endpoint to Save Sensor Data
app.post('/sensor-data', async (req, res) => {
  try {
    const { userId, temperature, heartbeat, spo2, fallDetected, severityLevel } = req.body;
    const sensorData = new SensorData({
      userId,
      temperature,
      heartbeat,
      spo2,
      fallDetected,
      severityLevel,
    });
    await sensorData.save();
    res.status(201).send('Sensor data saved successfully');
  } catch (error) {
    console.error('Error saving sensor data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/sensor-data/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const sensorData = await SensorData.find({ userId });
      res.json(sensorData);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
