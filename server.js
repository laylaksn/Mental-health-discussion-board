const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Your Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration here
};

// Firebase setup
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com',
});

// API endpoint to save discussions
app.post('/api/discussions', async (req, res) => {
  try {
    const discussionsRef = admin.database().ref('discussions');
    await discussionsRef.push(req.body);
    res.status(201).json({ message: 'Discussion saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to retrieve discussions
app.get('/api/discussions', async (req, res) => {
  try {
    const discussionsSnapshot = await admin.database().ref('discussions').once('value');
    const discussions = discussionsSnapshot.val();
    res.status(200).json(discussions || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
