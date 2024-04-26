import express from 'express';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import bodyParser from 'body-parser';
import ethUtil from 'ethereumjs-util'; 
import fs from 'fs';
import Counter from './services/countservice.js';
// const fs = require('fs');
let fileCount = 4;
const app = express();
const ipfs = await create({ host: '127.0.0.1', port: 5001, protocol: 'http' });

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit

// Middleware to add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
  next();
});

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to add data to IPFS
app.post('/addDataToIPFS', upload.single('image'), async (req, res) => {
  try {
    const formData = req.body; // Retrieve form data from request body

    // Read the image file content
    const imageBuffer = req.file.buffer;

    // Add the image buffer to IPFS
    const imageCID = await ipfs.add(imageBuffer);
    console.log(imageCID);

    // Prepare the JSON object with the desired structure, including the image CID
    const propertyData = {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      imageCID: imageCID.path, // Store the CID of the image on IPFS
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
    //const fs = require('fs');
    const directory = '../../metadata/';
    //Counter.add();
    //const filename = Counter.count + '.json';
    const filename = fileCount + '.json';
    fileCount++;


    // Construct the full file path
    const filePath = directory + filename;
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('File successfully written to:', filePath);
    });
    // Send the CID as response
    res.json({ cid: cid.toString() });
  } catch (error) {
    console.error('Error adding data to IPFS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to authenticate users
app.post('/authenticate', (req, res) => {
  const { address, signature } = req.body;

  // Validate the Ethereum address format
  if (!isValidAddress(address)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }
  // Verify the signature
  const prefix = '\x19Ethereum Signed Message:\n' + String(signature.length);
  console.log(prefix);
  const prefixedMessage = ethUtil.keccak(Buffer.from(prefix + signature));
  console.log(prefixedMessage);
  const { v, r, s } = ethUtil.fromRpcSig(signature);
  const publicKey = ethUtil.ecrecover(prefixedMessage, v, r, s);
  console.log(publicKey);
  const recoveredAddress = '0x' + ethUtil.pubToAddress(publicKey).toString('hex');

  // Compare the recovered address with the provided Ethereum address
  if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
    // If the Ethereum address matches the recovered address, authentication is successful
    return res.status(200).json({ authenticated: true, user: address });
  } else {
    // If the addresses do not match, authentication fails
    return res.status(401).json({ error: 'Authentication failed' });
  }
});

// Function to validate Ethereum address format
function isValidAddress(address) {
  // Basic validation which checks the format of the Ethereum address verifying its correctness
  return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Start the server
const PORT = 3002; // Choose any available port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
