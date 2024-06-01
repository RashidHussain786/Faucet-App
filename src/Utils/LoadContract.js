
export const loadContract = async (name, web3) => {
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  const networkId = await web3.eth.net.getId();
  const contractAddress = Artifact.networks[networkId]?.address;

  if (!contractAddress) {
    console.error("Contract not found on this network");
    return null;
  }

  const contract = new web3.eth.Contract(Artifact.abi, contractAddress);
  return contract;
};
