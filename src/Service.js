import Web3 from 'web3';
import { loadContract } from './Utils/LoadContract';

export const initializeWeb3 = async (setWeb3Api, setAccount,setNetworkChange) => {
  let provider = null;

  try {
    if (window.ethereum) {
      provider = window.ethereum;
      await provider.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
    }

    const web3 = new Web3(provider);
    const contract = await loadContract("Faucet", web3);
    
    if (provider.on) {
      provider.on("accountsChanged", (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
      provider.on("networkChanged", (networkId) => {
        setNetworkChange(networkId);
      });
    }

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts.length > 0 ? accounts[0] : null);

    setWeb3Api({
      web3,
      provider,
      isLoading: false,
      error: null,
      contract
    });
  } catch (error) {
    setWeb3Api({
      web3: null,
      provider: null,
      isLoading: false,
      error: error.message,
      contract: null
    });
  }
};

export const connectMetaMask = async (web3Api, setAccount) => {
  if (web3Api.provider) {
    try {
      await web3Api.provider.request({ method: "eth_requestAccounts" });
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts.length > 0 ? accounts[0] : null);
    } catch (error) {
      console.error("User denied account access or other error", error);
    }
  }
};
export const handleDonation = async (web3Api, account, setBalance) => {
  const { web3, contract } = web3Api;
  if (web3 && contract && account) {
    try {
      const amountInWei = web3.utils.toWei('1', 'ether');
      await contract.methods.addFunds().send({ from: account, value: amountInWei });
      await getBalance(web3Api, setBalance); // Update balance after donation
    } catch (error) {
      console.error("Donation failed:", error.message);
    }
  }
};

export const handlingWithdraw = async (web3Api, account, setBalance) => {
  const { contract, web3 } = web3Api;
  if (contract && account) {
    try {
      const withdrawAmountInWei = web3.utils.toWei('0.1', 'ether');
      await contract.methods.withdraw(withdrawAmountInWei).send({ from: account });
      await getBalance(web3Api, setBalance); // Update balance after withdrawal
    } catch (error) {
      console.error("Withdrawal failed:", error.message);
    }
  }
};

export const getBalance = async (web3Api, setBalance) => {
  const { web3, contract } = web3Api;
  if (web3 && contract) {
    try {
      const balanceWei = await web3.eth.getBalance(contract._address);
      const balanceEther = web3.utils.fromWei(balanceWei, "ether");
      const formattedBalance = parseFloat(balanceEther).toFixed(4);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
  }
};