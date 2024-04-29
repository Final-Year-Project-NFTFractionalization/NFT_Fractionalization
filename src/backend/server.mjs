import express from 'express';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import bodyParser from 'body-parser';
import ethUtil from 'ethereumjs-util'; 
import fs from 'fs';
import { ethers } from 'ethers'; // Import ethers for Ethereum interactions

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize IPFS client
const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' });

// Initialize Ethereum provider and signer
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Update with your Ethereum node URL
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Update with your private key
const wallet = new ethers.Wallet(privateKey, provider);

// Load the ABI and address of your smart contract
 const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nftAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_lender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_inspector",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_seller",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "approval",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftID",
        "type": "uint256"
      }
    ],
    "name": "approveSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "buyer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftID",
        "type": "uint256"
      }
    ],
    "name": "depositEarnest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "escrowAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftID",
        "type": "uint256"
      }
    ],
    "name": "finalizeSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "inspectionPassed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "inspector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "isListed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lender",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_purchasePrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_escrowAmount",
        "type": "uint256"
      }
    ],
    "name": "list",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "purchasePrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "seller",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftID",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_passed",
        "type": "bool"
      }
    ],
    "name": "updateInspectionStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]//my contract's abi pasted/////Can do this in a better way but just working on functionality for now
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Update with your contract's address
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Endpoint to add data to IPFS and run smart contract function
app.post('/addDataToIPFS', upload.single('image'), async (req, res) => {
  try {
    const formData = req.body; // Retrieve form data from request body

    // Read the image file content
    const imageBuffer = req.file.buffer;

    // Add the image buffer to IPFS
    const imageCID = await ipfs.add(imageBuffer);

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

    // Run the list function of the smart contract
    const tx = await contract.list(propertyData.name, propertyData.address, propertyData.description, imageCID.path, formData.bath, formData.beds, formData.price, formData.sqft);
    await tx.wait(); // Wait for transaction to be mined

    // Send the CID as response
    res.json({ cid: cid.toString() });
  } catch (error) {
    console.error('Error adding data to IPFS or running smart contract function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 3002; // Choose any available port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
