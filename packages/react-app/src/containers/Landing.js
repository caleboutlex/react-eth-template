import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { Button, ButtonGroup, Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    
      
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex:'1'
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    bud: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '20px'
  },
}));



function Landing() {


    const classes = useStyles();
 
    const [message, setMessage] = React.useState();
    const [loading, setLoading] = React.useState(false);      

    return (
        
      <Grid container className={classes.container} >
        <Grid item>
          
        </Grid>
        <Grid container className={classes.root}>
            <Grid item>
            
            </Grid>
        </Grid>
        
      </Grid>

    )
}

export default Landing
