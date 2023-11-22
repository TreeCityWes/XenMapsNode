// Initialize web3
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Function to sign data
async function signData(data, account) {
    const hash = web3.utils.sha3(data);
    const signature = await web3.eth.sign(hash, account);
    return signature;
}

// Function to verify signature
async function verifySignature(data, signature, account) {
    const hash = web3.utils.sha3(data);
    const signer = await web3.eth.personal.ecRecover(hash, signature);
    return signer.toLowerCase() === account.toLowerCase();
}

// Function to handle the button click
document.getElementById("signAndVerifyButton").addEventListener("click", async () => {
    const data = "Some data to sign";

    try {
        // Check if MetaMask is installed and the user is connected
        if (typeof window.ethereum !== "undefined") {
            // Request access to the user's Ethereum accounts
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Get the user's Ethereum address
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            if (account) {
                // Sign the data
                const signature = await signData(data, account);
                console.log("Signature:", signature);

                // Verify the signature
                const isVerified = await verifySignature(data, signature, account);
                console.log("Signature Verified:", isVerified);
            } else {
                console.error("No Ethereum account is available.");
            }
        } else {
            console.error("MetaMask is not installed or not accessible.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
