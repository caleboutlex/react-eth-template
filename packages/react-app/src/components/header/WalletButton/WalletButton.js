import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography"
import WalletIcon from "@material-ui/icons/AccountBalanceWallet"
import { makeStyles } from "@material-ui/core/styles"


const WalletButton = ({ provider, loadWeb3Modal, logoutOfWeb3Modal }) => {
    return (
        <div>
            <Button
                size="large"
                variant="contained" 
                color="secondary"
                onClick={() => {
                    if (!provider) {
                    loadWeb3Modal();
                    } else {
                    logoutOfWeb3Modal();
                    }
                }}
                >
                <WalletIcon color='primary' style={{marginRight: '10px'}} />
                {!provider ? 
                    <Typography variant="button" noWrap>
                        Connect Wallet
                    </Typography>
                : 
                    <Typography variant="button" noWrap>
                        Disconnect Wallet
                    </Typography>
                }
            </Button>
        </div>
    )
};

export default WalletButton;
