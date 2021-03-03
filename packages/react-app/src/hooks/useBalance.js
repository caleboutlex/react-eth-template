  
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

const useBalance = () => {
    const { account, library, chainId } = useWeb3React()
    const [balance, setBalance] = useState()

    useEffect(() => {
      if (!!account && !!library) {
        let stale = false
  
        library.eth
          .getBalance(account)
          .then((balance) => {
            if (!stale) {
              setBalance(library.utils.fromWei(balance, 'ether'))
            }
          })
          .catch(() => {
            if (!stale) {
              setBalance(null)
            }
          })
  
        return () => {
          stale = true
          setBalance(undefined)
        }
      }
    }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds
    
    return balance;
}

export default useBalance