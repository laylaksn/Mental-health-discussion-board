const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Firebase setup
const admin = require('firebase-admin');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mental-health-discussions.firebaseapp.com",
  projectId: "mental-health-discussions",
  storageBucket: "mental-health-discussions.appspot.com",
  messagingSenderId: "346523184946",
  appId: "1:346523184946:web:7f13bf9a7d3c5736f5f12b",
  measurementId: "G-J1ZG3VR8RE"
};

// Initialize Firebase
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: 'https://mental-health-discussions.firebaseio.com/', // Update with your database URL
});

// API endpoint to save discussions
app.post('/api/discussions', async (req, res) => {
  try {
    const discussionsRef = firebaseApp.database().ref('discussions');
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
    const discussionsSnapshot = await firebaseApp.database().ref('discussions').once('value');
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
