import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography"
import WalletIcon from "@material-ui/icons/AccountBalanceWallet"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: theme.palette.secondary.light,
        color: '#FFF',
        '&:hover': {
            backgroundColor:  theme.palette.secondary.dark,
            color: '#FFF'
        }
    }
}));
  

const WalletButton = ({ provider, loadWeb3Modal, logoutOfWeb3Modal }) => {
    const classes = useStyles()
    return (
        <div>
            <Button
                className={classes.button}
                size="large"
                variant="contained" 
                color="primary"
                onClick={() => {
                    if (!provider) {
                    loadWeb3Modal();
                    } else {
                    logoutOfWeb3Modal();
                    }
                }}
                >
                <WalletIcon color='secondary' style={{marginRight: '10px'}} />
                {!provider ? 
                    <Typography>
                    Connect Wallet
                    </Typography>
                : 
                    <Typography>
                    Disconnect Wallet
                    </Typography>
                }
            </Button>
        </div>
    )
};

export default WalletButton;
