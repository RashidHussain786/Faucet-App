import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { initializeWeb3, connectMetaMask,handleDonation, handlingWithdraw, getBalance } from './Service';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    isLoading: true,
    error: null,
    contract: null
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [networkChanged, setNetworkChange] = useState(false);
  const canConnectToContract = account && web3Api.contract

  useEffect(() => {
    initializeWeb3(setWeb3Api, setAccount, setNetworkChange);
  }, [networkChanged]);

  useEffect(() => {
    if (web3Api.web3 && account ) {
      getBalance(web3Api, setBalance);
    }
  }, [web3Api.web3, account, networkChanged]);

  const handleDonate = async () => {
    await handleDonation(web3Api, account, setBalance);
  };

  const handleWithdraw = async () => {
    await handlingWithdraw(web3Api, account, setBalance);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {web3Api.isLoading ? (
        <Typography variant="h5">Please wait... Login the Wallet</Typography>
      ) : web3Api.error ? (
        <Typography variant="h5" color="error">
          {!web3Api.provider ? (
            <>
              {web3Api.error}
              <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">Install MetaMask</a>
            </>
          ) : web3Api.error}
        </Typography>
      ) : (
        <>
        <Typography variant="h5"><strong>Account</strong>: 
          {account ? account :
            <Button variant="contained" sx={{ml:'24px'}} onClick={() => connectMetaMask(web3Api, setAccount)}>
            Connect Wallet
            </Button>
          }
       </Typography>
       <Typography variant="h3" sx={{ mt: '12px' }}>Current Balance: <strong>{account? balance : 0}</strong> ETH</Typography>
          { account && !canConnectToContract &&
            <i className="is-block">
              <strong>Connect to Ganache</strong>
            </i>
          }
       <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', mt: '18px' }}>
          <Button variant="contained" size="large" disabled={!canConnectToContract} onClick={handleDonate}>Donate 1 ETH</Button>
          <Button variant="outlined" size="large" disabled={!canConnectToContract} onClick={handleWithdraw}>Withdraw 0.1 ETH</Button>
        </Box>
        </>
      )}
    </Box>
  );
}

export default App;