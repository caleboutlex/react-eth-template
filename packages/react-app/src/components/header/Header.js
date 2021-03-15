import React from 'react'
import { makeStyles, createMuiTheme } from "@material-ui/core/styles"

import AppBar from "@material-ui/core/AppBar"
import ToolBar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import WalletButton from "./WalletButton/WalletButton"

import { Link } from 'react-router-dom'
import Styled from 'styled-components'
import Button from '../buttons/Button'



const Header = ({title, nav1, nav2, nav3, nav4, provider, loadWeb3Modal, logoutOfWeb3Modal, darkMode}) => {
    
    const useStyles = makeStyles((theme) => ({
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            //backgroundColor: darkMode ? theme.palette.background.dark : theme.palette.background.default,
            borderBottom: `5px solid ${theme.palette.secondary.main}`
        },
        title: {
            display: 'none',
            color: darkMode ? theme.palette.text.primary : theme.palette.text.secondary,
            fontVariantCaps: 'all-small-caps',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },},
        
      }));
    
    const classes = useStyles();

    return (
        <div>
            <AppBar position='relative' color='transparent' elevation={0} >
                <ToolBar className={classes.header}>
                    <Wrapper>
                        <Link to='/' style={classes.link}> 
                            <Typography className={classes.title} variant="h3" noWrap>
                                {title}
                            </Typography>
                        </Link>
                    </Wrapper>

                    <NavWrapper>
                        <Link to={`/${nav1}`} style={classes.link}> 
                            <Typography className={classes.title} variant="h5" noWrap>
                                {nav1}
                            </Typography>
                        </Link>
                        <Link to={`/${nav2}`} style={classes.link}> 
                            <Typography className={classes.title} variant="h5" noWrap>
                                {nav2}
                            </Typography>
                        </Link>
                        <Link to={`/${nav3}`} style={classes.link}> 
                            <Typography className={classes.title} variant="h5" noWrap>
                                {nav3}
                            </Typography>
                        </Link>
                        <Link to={`/${nav4}`} style={classes.link}> 
                            <Typography className={classes.title} variant="h5" noWrap>
                                {nav4}
                            </Typography>
                        </Link>
                    </NavWrapper>
                    <Wrapper>
                        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}/>
                    </Wrapper>
                </ToolBar>
            </AppBar>  
        </div>
    )
};

export default Header;

const Wrapper = Styled.div`
    display: flex;
    justify-content: center;
    min-width: 20%;
`

const NavWrapper = Styled.div`
    display: flex;
    justify-content: inherit;
    min-width: 40%;
`
