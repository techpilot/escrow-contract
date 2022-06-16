import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib/constants";
import { useRouter } from "next/router";
import axios from "axios";
import { walletAccount } from "../config/config";

export const TransactionContext = React.createContext();

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

// interaction with smart contract
const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });
  const [walletBalance, setWalletBalance] = useState();

  const router = useRouter();

  let acctBalance;

  useEffect(() => {
    checkIfWalletIsConnected();
    (async () => {
      const wallet = await getWalletBalance();
      setWalletBalance(wallet);
    })();
  }, []);

  // connect to ethereum wallet functionality
  const connectWallet = async (metamask = eth) => {
    try {
      if (!window.ethereum) return alert("Please install an ethereum wallet");
      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      const balance = await metamask.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      acctBalance = ethers.utils.formatEther(balance);

      setCurrentAccount(accounts[0]);
      setWalletBalance(acctBalance);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum Object.");
    }
  };

  // checks if there is any connected wallet
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install an ethereum wallet");

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  const getWalletBalance = async (metamask = eth) => {
    try {
      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts.length) {
        const balance = await metamask.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });

        return ethers.utils.formatEther(balance);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  // saves transaction to sanity DB

  // sends eth to address
  const sendTransaction = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install an ethereum wallet");
      const { addressTo, amount } = formData;
      const transactionContract = await getEthereumContract();

      // https://api.etherscan.io/api?module=stats&action=ethprice&apikey=3HV1Z675CS735VU75IIFV5D6K1JYHK2VKE
      const etherUsd = await axios
        .get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        )
        .then((res) => res.data.ethereum.usd);

      const etherPrice = (amount / etherUsd).toString();

      const etherAmount = ethers.utils.parseEther(etherPrice, "ether");

      let ownerAddress = walletAccount;

      const transactionHash = await transactionContract.transact(
        addressTo,
        ownerAddress,
        {
          gasLimit: "3000000",
          value: etherAmount,
        }
      );

      setIsLoading(true);

      await transactionHash.wait();

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // Trigger loading modal
  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`);
    } else {
      router.push(`/`);
    }
  }, [isLoading]);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
        isLoading,
        walletBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
