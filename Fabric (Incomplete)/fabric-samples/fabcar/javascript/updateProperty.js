'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main(params) {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if the user identity exists in the wallet
        const identity = await wallet.get('appUser');
        if (!identity) {
            throw new Error('An identity for the user "appUser" does not exist in the wallet. Run the registerUser.js application before retrying.');
        }

        // Create a new gateway for connecting to the peer node
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network
        const contract = network.getContract('fabcar');

        // Gather payload data
        const { key, owner } = params;

        // Validate required parameters
        if (typeof key !== 'string' || typeof owner !== 'string') {
            throw new Error('Invalid parameters. Ensure key and owner are strings.');
        }

        // Submit the specified transaction
        // changeCarOwner transaction - requires 2 arguments, e.g., ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction('changeCarOwner', key, owner);
        console.log(`Change Owner Transaction for key ${key} has been submitted successfully`);

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to change owner transaction: ${error.message || error}`);
        throw error; // Rethrow the error to be handled by the calling function or application
    }
}

module.exports = { main };
