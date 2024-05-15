import express from 'express';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import bodyParser from 'body-parser';
import ethUtil from 'ethereumjs-util'; 
import fs from 'fs';
import crypto from 'crypto';
import xlsx from 'xlsx';
import { ethers } from 'ethers'; // Import ethers for Ethereum interactions
<<<<<<< HEAD
import path from 'path';
// import IERC721 from '../../artifacts/contracts/Escrow.sol/IERC721.json';
var sellingtokenidtemp;
// import utilities from 'utilities';
const app = express();
let fileCount = 5;
// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit

=======
//crypto = require('crypto');
//const xlsx = require('xlsx');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
>>>>>>> fc0da639a9273b7b3021dcc5ad88cefd5c0de990
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
  next();
});
<<<<<<< HEAD


=======
>>>>>>> fc0da639a9273b7b3021dcc5ad88cefd5c0de990
// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize IPFS client
const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' });

// Initialize Ethereum provider and signer
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Update with your Ethereum node URL
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Update with your private key provided by local hardhat
const wallet = new ethers.Wallet(privateKey, provider);

// Instantiate RealEstate contract
const realEstateContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 
const realEstateContractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
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
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
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
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]; 
const realEstateContract = new ethers.Contract(realEstateContractAddress, realEstateContractABI, wallet);

// Load the ABI and address of your smart contract
 const escrowContractABI = [
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
const escrowContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Update with your contract's address
const escrowContract = new ethers.Contract(escrowContractAddress, escrowContractABI, wallet);

//addition of verification of file of a property


// Endpoint to add data to IPFS and run smart contract function
app.post('/addDataToIPFS', upload.single('image'), async (req, res) => {
  try {
    const formData = req.body; // Retrieve form data from request body

    // Read the image file content
    //const imageBuffer = req.file.buffer;

    // Add the image buffer to IPFS
<<<<<<< HEAD
    const imageCID = await ipfs.add(imageBuffer);
    console.log(imageCID + "is the image cid of the server");
    // Prepare the JSON object with the desired structure, including the image CID
    let propertyData = {
      name: formData.name,
      PropertyCID: null,
      address: formData.address,
      description: formData.description,
      imageCID: imageCID.path, // Store the CID of the image on IPFS
=======
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
>>>>>>> fc0da639a9273b7b3021dcc5ad88cefd5c0de990
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

<<<<<<< HEAD
    // File path to the Excel sheet containing hashes
    const filePathexcel = "../../Sample.xlsx";

    // Function to generate hash from address
    function generateHashFromAddress(address) {
      // Split the address string into components
      const [houseNumber, street, area] = address.split(' ');
      // Concatenate the components (you may adjust this based on your requirement)
      const concatenatedString = `${houseNumber}${street}${area}`;
      // Generate a hash from the concatenated string
      const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
      return hash;
    }

    // Function to extract hashes from Excel sheet
    function extractHashesFromExcel(filePathexcel) {
      // Load workbook from file
      const workbook = xlsx.readFile(filePathexcel);
      // Get the first worksheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Extract addresses from the first column (assuming addresses are in column A)
      const addresses = [];
      for (let i = 1; ; i++) {
        const cell = worksheet[`A${i}`];
        if (!cell || !cell.v) break; // Stop if the cell is empty
        addresses.push(cell.v);
      }
      return addresses;
    }

    // Function to check if hash is present in Excel sheet
    function checkHashInExcel(address, filePathexcel) {
      const hashToCheck = generateHashFromAddress(address);
      const hashesInExcel = extractHashesFromExcel(filePathexcel);
      return hashesInExcel.includes(hashToCheck);
    }

    // Function to verify property against Excel sheet
    async function verifyProperty(address) {
      if (propertyData.address) {
        const resAddress = generateHashFromAddress(address);
        return checkHashInExcel(resAddress, filePathexcel);
      }
      return false;
    }

    // Verify the property against the Excel sheet
    const verified = await verifyProperty(propertyData.address);
    if (!verified) {
      throw new Error("Property is not verified");
    } else {
      console.log("Property is successfully verified");
    }

    // Convert the property data to a JSON string
    let data = JSON.stringify(propertyData);
=======
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
>>>>>>> fc0da639a9273b7b3021dcc5ad88cefd5c0de990

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
<<<<<<< HEAD
    console.log(cid);
    let propertyDataObject = JSON.parse(data);
    propertyDataObject.PropertyCID = cid.path;
    data = JSON.stringify(propertyDataObject);


    const directory = '../../metadata/';
    //Counter.add();
    //const filename = Counter.count + '.json';
    
    //filename and number
    function countFiles(directory) {
      let count = 0;
  
      function traverse(dir) {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
              const filePath = path.join(dir, file);
              const stat = fs.statSync(filePath);
              if (stat.isDirectory()) {
                  traverse(filePath);
              } else {
                  count++;
              }
          });
      }
  
      traverse(directory);
      return count+1;
  }
        let counteroffiles= countFiles(directory);
    

    // Construct the full file path
    const filePath = directory + counteroffiles + '.json';
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('File successfully written to:', filePath);
    }); 

    // Mint a new NFT in the RealEstate contract by the seller
    const mintTx = await realEstateContract.mint(cid.toString());
    const mintReceipt = await mintTx.wait(); // Wait for NFT minting transaction to be mined
    const newItemId = mintReceipt.events[0].args[2].toNumber(); // Assuming the event logs the new item ID as the third argument
    // Retrieve the ID of the minted NFT from the transaction receipt
    const tokenId = mintReceipt.events[0].args.tokenId.toNumber();
    console.log(`Minted NFT with ID maybe: ${tokenId}`);
    //console.log(`Minted NFT with ID maybe: ${mintReceipt.events[0].args.tokenId.toNumber()}`);

    // Check if the conversion of price is successful
    const price = parseInt(formData.price);
    if (isNaN(price)) {
      throw new Error("Invalid price value: formData.price is not a valid number");
    }

    // Call the list function of the Escrow contract only if property verification is successful
      const signer = provider.getSigner();
      const escrowContractWithSigner = escrowContract.connect(signer);

      // Retrieve the user's Metamask address
      const seller = await signer.getAddress(); // This will retrieve the current user's address from Metamask
      let mintcontractevent= parseInt(timestampHash());
 
      // await IERC721(realEstateContract.address).transferFrom(seller, escrowContract.address, newItemId);
      const listTx = await escrowContractWithSigner.list(
        tokenId,
        price,
        price,
        { from: seller, gasLimit: 10000000 } // Pass the Metamask address and specify gas limit
      );
      //console.log(mintcontractevent);
      await listTx.wait(); // Wait for listing transaction to be mined

      //out temp var for api of buy
      sellingtokenidtemp=tokenId;

=======

    // Run the list function of the smart contract
    const tx = await contract.list(propertyData.name, propertyData.address, propertyData.description, imageCID.path, formData.bath, formData.beds, formData.price, formData.sqft);
    await tx.wait(); // Wait for transaction to be mined

>>>>>>> fc0da639a9273b7b3021dcc5ad88cefd5c0de990
    // Send the CID as response
    res.json({ cid: cid.toString() });


  } catch (error) {
    console.error('Error adding data to IPFS or running smart contract function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});


// Endpoint to finalize the sale and transfer ownership
app.post('/finalizeSale', async (req, res) => {
  try {

    const nftID=parseInt(sellingtokenidtemp);
    // Call the finalizeSale function of the Escrow contract
    const signer = provider.getSigner();
    const escrowContractWithSigner = escrowContract.connect(signer);
    const finalizeTx = await escrowContractWithSigner.finalizeSale(nftID);
    await finalizeTx.wait(); // Wait for transaction to be mined

    // Send success response
    res.json({ success: true, message: 'Sale finalized successfully' });
  } catch (error) {
    console.error('Error finalizing sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function timestampHash() {
  let timestamp = Date.now().toString(); // Get current timestamp
  let hash = crypto.createHash('sha256'); // Create SHA-256 hash object
  hash.update(timestamp); // Update hash with timestamp
  return hash.digest('hex'); // Get hexadecimal representation of the hash
}
// Start the server
const PORT = 3002; // Choose any available port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});