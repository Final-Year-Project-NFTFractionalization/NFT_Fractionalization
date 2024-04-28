import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'; // Import axios for making HTTP requests
import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        try {
            // Request Ethereum accounts from MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
    
            // Define the message to be signed
            const message = `\x19Ethereum Signed Message:\n${userAddress.length}${userAddress}`;

            // Prompt user to sign the message
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, userAddress],
            });
    
            // Send the Ethereum address, message, and signature to the backend for verification
            const response = await axios.post('http://localhost:3002/authenticate', { address: userAddress, signature });
            console.log(response.data); // Log successful response
    
            // Check if authentication was successful
            if (response.data.authenticated) {
                // Update the account state with the authenticated Ethereum address
                setAccount(userAddress);
            } else {
                // Handle authentication failure (optional)
                console.error('Authentication failed');
            }
        } catch (error) {
            // Handle errors
            console.error('Error connecting to MetaMask:', error);
        }
    };
    

    return (
        <nav>
            <ul className='nav__links'>
                <li>
                    <Link className="nav_a_tag" to="/" tag="a" action>Home</Link>
                </li>
                <li>
                    <Link className="nav_a_tag" to="/PropertyListingform" tag="a" action>Sell</Link>
                </li>
            </ul>

            <div className='nav__brand'>
                <img src={logo} alt='Logo' />
                <h1>EtherEstates</h1>
            </div>

            {account ? (
                <button
                    type='button'
                    className='nav__connect'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button type='button' className='nav__connect' onClick={connectHandler}>
                    Connect
                </button>
            )}
        </nav>
    );
}

export default Navigation;
