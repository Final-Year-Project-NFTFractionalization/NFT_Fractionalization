import express from 'express';
import cors from 'cors';

const router = express.Router();

// Middleware to handle CORS
router.use(cors());

// POST /api/authenticate
router.post('/authenticate', (req, res) => {
    const { address } = req.body;

    // Validate the Ethereum address format
    if (!isValidAddress(address)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // If the Ethereum address is valid, return it as the authenticated user
    return res.status(200).json({ user: address });
});

// Function to validate Ethereum address format
function isValidAddress(address) {
// Basic validation which checks the format of the Ethereum address verifing it's correctness
  return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address);
}

export default router;
