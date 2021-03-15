import { addresses, abis } from "@project/contracts";

export const getWallMarket = (library, chainId) => {
    let Contract;
    // MOVE THIS SHIT TO A UTILS FUNCTION 

    if (chainId === 3 ) {
    // Contract = new library.eth.Contract(abis.secretsanta, addresses.ropstenSanta);
        
    } else if (chainId === 42 ) {


    } else if (chainId === 4 ) {
      Contract = new library.eth.Contract(abis.wallmarket, addresses.rinkeby.wallmarket);

    } else if (chainId === 1 ) {
    // Contract = new library.eth.Contract(abis.secretsanta, addresses.mainnetSanta);
    }

    return Contract;
}

export const getWallToken = (library, chainId) => {
    let Contract;
    // MOVE THIS SHIT TO A UTILS FUNCTION 

    if (chainId === 3 ) {
    // Contract = new library.eth.Contract(abis.secretsanta, addresses.ropstenSanta);
        
    } else if (chainId === 42 ) {
      

    } else if (chainId === 4 ) {
      Contract = new library.eth.Contract(abis.walltoken, addresses.rinkeby.walltoken);

    } else if (chainId === 1 ) {
    // Contract = new library.eth.Contract(abis.secretsanta, addresses.mainnetSanta);
    }

    return Contract;
}


export const getERC20 = (library, chainId) => {
    let Contract;
    // MOVE THIS SHIT TO A UTILS FUNCTION 

    if (chainId === 3 ) {
    // Contract = new library.eth.Contract(abis.secretsanta, addresses.ropstenSanta);
        
    } else if (chainId === 42 ) {
    

    } else if (chainId === 4 ) {
      Contract = new library.eth.Contract(abis.erc20, addresses.rinkeby.mockWFTM);

    } else if (chainId === 1 ) {
    // Contract = new library.eth.Contract(abis.secretsanta, addresses.mainnetSanta);
    }

    return Contract;
}


export const convertTimestamp = (timestamp) => {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM	
    time = yyyy + '/' + mm + '/' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
}
