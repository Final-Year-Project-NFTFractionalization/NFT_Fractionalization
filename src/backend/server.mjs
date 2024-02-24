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

    // Convert the image file to a buffer
    // const imageBuffer = Buffer.from(await formData.image.arrayBuffer());

    // Add the image buffer to IPFS
    // const imageCID = await ipfs.add(imageBuffer);
    // console.log(imageCID)

    // Prepare the JSON object with the desired structure, including the image CID
    const propertyData = {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      // imageCID: imageCID.path, // Store the CID of the image on IPFS
      attributes: {
        bath: formData.bath,
        beds: formData.beds,
        price: formData.price,
        sqft: formData.sqft,
      },
    };

    // Convert the property data to a JSON string
    const data = JSON.stringify(propertyData);

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
