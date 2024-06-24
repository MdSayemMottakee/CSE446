// view-history.js

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function viewHistory(historyData) {
    let result;
    try {
        // Load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if the user identity exists in the wallet
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.error('An identity for the user "appUser" does not exist in the wallet');
            console.error('Run the registerUser.js application before retrying');
            throw new Error('Identity not found in the wallet');
        }

        // Create a new gateway for connecting to the peer node
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network
        const contractName = 'propertyTracker'; // Adjust contract name
        const contract = network.getContract(contractName);

        // Implement logic to fetch and send the history of updates
        // Modify this part based on your backend implementation
        // Example: Fetch history for a specific property ID
        const propertyId = historyData.historyPropertyId;
        result = await contract.evaluateTransaction('getHistoryForKey', propertyId);

    } catch (error) {
        console.error(`Failed to fetch history: ${error.message || error}`);
        throw error; // Rethrow the error to be handled by the calling function
    }

    return result;
}

module.exports = { viewHistory };
