import express from 'express';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import bodyParser from 'body-parser';
import ethUtil from 'ethereumjs-util'; 
import fs from 'fs';
import crypto from 'crypto';
import xlsx from 'xlsx';
import { ethers } from 'ethers'; // Import ethers for Ethereum interactions
//crypto = require('crypto');
//const xlsx = require('xlsx');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
  next();
});
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

//addition of verification of file of a property


// Endpoint to add data to IPFS and run smart contract function
app.post('/addDataToIPFS', upload.single('image'), async (req, res) => {
  try {
    const formData = req.body; // Retrieve form data from request body

    // Read the image file content
    //const imageBuffer = req.file.buffer;

    // Add the image buffer to IPFS
    //const imageCID = await ipfs.add(imageBuffer);

    // Prepare the JSON object with the desired structure, including the image CID
    // const propertyData = {
    //   name: formData.name,
    //   address: formData.address,
    //   description: formData.description,
    //   imageCID: imageCID.path, // Store the CID of the image on IPFS
    //   attributes: {
    //     bath: formData.bath,
    //     beds: formData.beds,
    //     price: formData.price,
    //     sqft: formData.sqft,
    //   },
    // };
    const propertyData = {
      name: "Munir Abbasi",
      address: '30 Q-Street Karachi',
      description: 'this is a plot',
      imageCID: 'njsnjnjssanjsnjnjdsanjsanj', // Store the CID of the image on IPFS
      attributes: {
        bath: '2',
        beds: '4',
        price: '5',
        sqft: '1000',
      },
    };
    console.log("assigned add obj");
    const filePath="C:/Software Codes/FYP/NFT_Fractionalization/Sample.xlsx";
    
function generateHashFromAddress(address) {
  console.log("generatehashfx");
  // Split the address string into components
  const [houseNumber, street, area] = address.split(' ');
  // Concatenate the components (you may adjust this based on your requirement)
  const concatenatedString = `${houseNumber}${street}${area}`;
  // Generate a hash from the concatenated string
  const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
  return hash;
}
function extractHashesFromExcel(filePath) {
  console.log("extractfromexcelfx");
    // Load workbook from file
  const workbook = xlsx.readFile(filePath);
    // Get the first worksheet
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Extract addresses from the first column (assuming addresses are in column A)
  const addresses = [];
  for (let i = 1; ; i++) {
    const cell = worksheet[`A${i}`];
    if (!cell || !cell.v) break; // Stop if the cell is empty
    addresses.push(cell.v);
  }
  // Extract hashes from addresses
  //const hashes = addresses.map(address => generateHashFromAddress(address));
  return addresses;
}function checkHashInExcel(address, filePath) {
  console.log("checkhashinexcel");

  const hashToCheck = generateHashFromAddress(address);
  console.log(hashToCheck);
    const hashesInExcel = extractHashesFromExcel(filePath);
  if(hashesInExcel.includes(hashToCheck))
    {
        console.log(hashToCheck);
        console.log("hash found");
        return true;
    }
  else {
    console.log(hashToCheck);
    console.log("hash not found");
    return false;}
}
    async function verifyproperty(address) {
      console.log("inverifyproperty ");

      if(propertyData.address)
      {
        const resadress= generateHashFromAddress(address);
        const result = checkHashInExcel(resadress, filePath);
        if(result)
        {
          console.log("Property is verified");
          return true;
        }
        else{
          console.log("Property is not verified");
          return false;
        }
      }
      return resultofverification;
  }
    // Convert the property data to a JSON string
    const data = JSON.stringify(propertyData);
    console.log("called the api of verify property");

    const resultofverification= verifyproperty(propertyData.address);
    console.log("called the api of verify property successfuly");

    /*
    console.log("assigned add obj");
    const filePath="C:\Software Codes\FYP\NFT_Fractionalization";
    //munir added files
    function generateHashFromAddress(address) {
      console.log("generatehashfx");
      // Split the address string into components
      const [houseNumber, street, area] = address.split(' ');
      // Concatenate the components (you may adjust this based on your requirement)
      const concatenatedString = `${houseNumber}${street}${area}`;
      // Generate a hash from the concatenated string
      const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.aoa_to_sheet(hashes.map(hash => [hash])); // Convert hashes array to array of arrays for Excel format
      xlsx.utils.book_append_sheet(workbook, worksheet, "Hashes"); // Add worksheet to workbook
      xlsx.writeFile(workbook, filePath); // Write workbook to file
      return hash;
  }
  function extractHashesFromExcel(filePath) {
    console.log("extractfromexcelfx");

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming data is in the first sheet
    const addresses = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Assuming addresses are in column A
    // Extract hashes from addresses
    const hashes = addresses.map(address => generateHashFromAddress(address));
    return hashes;
}


function checkHashInExcel(address, filePath) {
  console.log("checkhashinexcel");

  const hashToCheck = generateHashFromAddress(address);
  const hashesInExcel = extractHashesFromExcel(filePath);
  if(hashesInExcel.includes(hashToCheck)) return true;
  else return false;
}
    async function verifyproperty(address) {
      console.log("inverifyproperty ");

      if(propertyData.address)
      {
        const resadress= generateHashFromAddress(address);
        const result = checkHashInExcel(resadress, filePath);
        if(result)
        {
          console.log("Property is verified");
          return true;
        }
        else{
          console.log("Property is not verified");
          return false;
        }
      }
      return resultofverification;
  }
    // Convert the property data to a JSON string
    const data = JSON.stringify(propertyData);
    console.log("called the api of verify property");

    const resultofverification= await verifyproperty(address);
    console.log("called the api of verify property successfuly");
*/
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