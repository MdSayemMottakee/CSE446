async function queryProperty(queryData) {
    let gateway; // Declare gateway here

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
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to the peer node
        gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network
        const contractName = 'propertyTracker'; // Adjust contract name
        const contract = network.getContract(contractName);

        // Check if queryData has a key property
        if (queryData.key) {
            try {
                // Query a specific property by key
                const queryResult = await contract.evaluateTransaction('queryProperty', queryData.key);
                console.log(`QUERY Transaction for key ${queryData.key} has been evaluated, result is: ${queryResult.toString()}`);
                return queryResult;
            } catch (error) {
                console.error(`Failed to query property with key ${queryData.key}: ${error.message || error}`);
                throw error; // Rethrow the error to be handled by the calling function
            }
        }

        // If no key in queryData, perform a query for all properties
        try {
            const result = await contract.evaluateTransaction('queryAllProperties');
            console.log(`Transaction to query all properties has been evaluated, result is: ${result.toString()}`);
            return result;
        } catch (error) {
            console.error(`Failed to query all properties: ${error.message || error}`);
            throw error; // Rethrow the error to be handled by the calling function
        }

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error.message || error}`);
        process.exit(1);
    } finally {
        if (gateway) {
            // Disconnect from the gateway
            await gateway.disconnect();
        }
    }
}

module.exports = { queryProperty };
