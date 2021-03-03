import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { injected } from "./connectors"
import { useWeb3React } from "@web3-react/core";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "INVALID_INFURA_KEY";

const NETWORK_NAME = "mainnet";

function useWeb3Modal(config = {}) {
  const [provider, setProvider] = useState();
  const { autoLoad = false, infuraId = INFURA_ID, NETWORK = NETWORK_NAME } = config;
  const { activate } = useWeb3React();

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    },
  });

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
    activate(injected);
  }, [web3Modal, activate]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If user has loaded a wallet before, load it automatically.
  useEffect(() => {
    if (autoLoad && web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [autoLoad, loadWeb3Modal, web3Modal.cachedProvider]);

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
