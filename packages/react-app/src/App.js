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

function App() {
  const [ provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [ darkMode, setDarkmode ] = React.useState(false)
  const { account, library } = useWeb3React();
  
  var theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        // Purple and green play nicely together.
        main: "#63474D",
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#FFA686',
      },
      background: {
        default: '#FEC196' ,
        dark: '#63474D'
      }
    },
  });
  
  theme = responsiveFontSizes(theme);

  const useStyles = makeStyles((theme) => ({
    
    body: {
      display:'flex',
      flexDirection:'column',
    
      backgroundColor: darkMode ? '#141414' : theme.palette.background.default,
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
    }
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}> 
      <Router>
        <Grid container className={classes.body}>
          <Grid item className={classes.header}>
            <Header 
              className={classes.header}
              title='Template'
              nav1='nav'
              nav2='nav'
              nav3='nav'
              nav4='nav'
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
                <Route path="/" exact component={''}/>
                <Route path="/presale"  component={''}/>
                <Route path="/research"  component={''}/>
                <Route path="/strains"  component={''}/>
                <Route path="/generator"  component={''}/>
              </Switch>
          </Grid>
        </Grid> 
      </Grid> 
    </Router>
  </ThemeProvider>
  );
}

export default App;
