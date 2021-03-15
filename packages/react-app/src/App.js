import React from "react";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid"
import MaterialSwitch from '@material-ui/core/Switch';
import { purple, green, blue, orange } from '@material-ui/core/colors';


import { useWeb3React } from "@web3-react/core";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { addresses, abis } from "@project/contracts";

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import Header from './components/header/Header'
import Landing from './containers/Landing'
import Make from './containers/Make'
import Gallery from './containers/Gallery'

function App() {
  const [ provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [ darkMode, setDarkmode ] = React.useState(true)
  const { account, library } = useWeb3React();
  
  const neonBackground = require('./assets/backgrounds/neon-dark-place.jpg')
  const wojakwatching = require('./assets/backgrounds/wojakwatching.png')
  const greenPriceBackground = require('./assets/backgrounds/greenbackground4K.png');
  const redPriceBackground = require('./assets/backgrounds/redbackground4K.png');
  const interactive = 'https://cdn.soft8soft.com/AROAJSY2GOEHMOFUVPIOE:8eda00a7b9/applications/nft-wall/nft-wall.html'
  
  var theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        // Purple and green play nicely together.
        main: "#450EFF",
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#E200F7',
      },
      background: {
        default: '#1c1c1c',
        dark: '#1c1c1c',
        paper: '#42284899'
      },
      text: {
        primary: '#fafafa',
        secondary: '#ff008d'
      },
      
    },
  });
  
  theme = responsiveFontSizes(theme);

  const useStyles = makeStyles((theme) => ({
    
    body: {
      display:'flex',
      flexDirection:'column',
      width: '100vw',
      height: '100vh',
      backgroundColor: darkMode ? '#1c1c1c' : '#1c1c1c',
    },
    container: {
      display:'flex',
      flexDirection:'column',
      // width: "100vw",
      minHeight: '90vh',
    },
    banner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      
    },
    header: {
     
      minHeight: '8vh'
    },
    background : {
      width: '100vw',
      height: '100vh',
      backgroundImage: darkMode ? `url(${greenPriceBackground})` : `url(${redPriceBackground})`,
      backgroundSize: 'cover',
      position:'absolute',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      zIndex: '0'
    },
    
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}> 
      <Router>
        <Grid  className={classes.background} >
        </Grid>
        <Grid container className={classes.body}>
          <Grid item className={classes.header}>
            <Header 
              className={classes.header}
              title='NFT-WALL'
              nav1='gallery'
              nav2='PLACE'
              nav3='Make'
              nav4='ABOUT'
              provider={provider} 
              loadWeb3Modal={loadWeb3Modal} 
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              darkMode={darkMode}
          
            />
          <Grid item className={classes.banner}>
            <Typography variant='caption' color='textPrimary'>Addres: </Typography>
            <Typography variant='caption' color='textPrimary'>{account}</Typography>
            <div>
              {/* {darkMode ? 'DAY' : 'NIGHT'} */}
              <MaterialSwitch
                  checked={darkMode} onChange={()=>setDarkmode(!darkMode)}
              />
            </div>
          </Grid>
          <Grid container className={classes.container}>
              <Switch>
                <Route path="/" exact component={Landing}/>
                <Route path="/gallery"  component={Gallery}/>
                <Route path="/place"  component={''}/>
                <Route path="/make"  component={Make}/>
                <Route path="/about"  component={''}/>
              </Switch>
          </Grid>
        </Grid> 
      </Grid> 
    </Router>
  </ThemeProvider>
  );
}

export default App;
