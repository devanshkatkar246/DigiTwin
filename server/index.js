
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Main simulation logic
app.post('/api/simulate', (req, res) => {
  const { studyHours, sleepHours, attendance, stressLevel, revisionFrequency, screenTime } = req.body;
  
  if (!studyHours || !sleepHours || !attendance) {
    return res.status(400).json({ error: "Missing required metrics" });
  }

  const revisionFactor = revisionFrequency === 'Daily' ? 1 : 0.5;

  // Formula provided: 
  // score = (0.30*study) + (0.20*sleep) + (0.20*attendance) + (0.15*revisionFactor) - (0.10*stress) - (0.05*screen)
  // Normalizing attendance to match scale
  const normalizedAttendance = attendance / 10;
  
  const scoreRaw = (0.30 * studyHours) + 
                   (0.20 * sleepHours) + 
                   (0.20 * normalizedAttendance) + 
                   (0.15 * revisionFactor * 10) - 
                   (0.10 * stressLevel) - 
                   (0.05 * screenTime);

  const score = parseFloat(Math.max(0, Math.min(10, scoreRaw)).toFixed(2));
  const future7 = parseFloat((score * 1.04).toFixed(2));
  const future30 = parseFloat((score * 1.12).toFixed(2));

  res.json({
    score,
    future7,
    future30,
    timestamp: Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
