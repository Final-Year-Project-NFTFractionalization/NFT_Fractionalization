import express from 'express';
import { create } from 'ipfs-http-client';

const app = express();
const ipfs = await create({ host: '127.0.0.1', port: 5001, protocol: 'http' });

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Add this line
  next();
});

// Endpoint to add data to IPFS
app.post('/addDataToIPFS', async (req, res) => {
  try {
    const formData = req.body; // Retrieve form data from request body

    // Convert the form data to JSON string
    const data = JSON.stringify(formData);

    // Add the JSON string to IPFS
    const cid = await ipfs.add(data);
    console.log(cid);

    // Send the CID as response
    res.json({ cid: cid.toString() });
  } catch (error) {
    console.error('Error adding data to IPFS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 3002; // Choose any available port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});