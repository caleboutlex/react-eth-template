import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { Button, ButtonGroup, Typography } from '@material-ui/core';
import * as v3dAppAPI from '../v3dApp/fantomtest.js';
import '../v3dApp/fantomtest.css';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    
    },
    v3dcontainer: {
      zIndex:'0'
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
    v3dstyle: {
      zIndex:'0' 
    },
}));

function Gallery() {
    const classes = useStyles();
 
    const [message, setMessage] = React.useState();
    const [loading, setLoading] = React.useState(false); 
    const [v3dAPP, setv3dAPP] = React.useState();

    const urls = [
      'https://lh3.googleusercontent.com/FkcRsP5CPiIjNyq7GfmffCNKc6nUz9WWQmlBep5Tic00upu3yxJk1bCY90hVBE-p9DDmsC4e_nmqUvvcIoMKqLby=s0',
      'https://lh3.googleusercontent.com/K7DjNQzW2oP74khFd3sQH0tWweuOV2TrpZV_IepElSX2aN2Cy7NdC094tBuGN_JTHyOBCe4ixQSIVdVocAHzDeXLTcIVIUeQBSU05-k=s0',
      'https://lh3.googleusercontent.com/59FwnDvZg7XefcTeXSS5bS-wpKcYuFHR5I282o-Xc5ZrHJarAxBLzJjy7IKeR305-x3kxgeUjRGxMyNMbsj8SIBBsjICHhAML5pvDgc=s0',
      'https://lh3.googleusercontent.com/XiSYB58ps9rzHYCzTv7OZEPk1dBhdirL3YNk5aoD1C_VTBJHZY_HTcuYl_B2EhIt9CckXgPPjA-jmpbGNPuooqtX3_v9hjdbP4wvkQ=s0',
      'https://lh3.googleusercontent.com/BYesSoxMhcu-UKSZJd90oo_Pw8guxiIXh9vp9SSmC3Z3vQpTDP7TfQXacEPJ_fDfem_dqH6pOPbk0bVdtIGu5bTiaA=s0',
      'https://lh3.googleusercontent.com/v71rWv9zBaJzY1L5U24p8T8UCIVt7gwzHKZKOdeorXXx2o23XTFX3JRoJm8lLAFDlVY3fC6epkSLQ7ZmSo4uOpX1=s0',
      'https://lh3.googleusercontent.com/eDTz5nZhD6HtQGfMdYaN1lwg0RBGtuDhD7jIntxWtj0gdDXO0k_uFrDruR2T94uYPOc_ExSFIBUcppF60DQBIdEx=s0',
      'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
      'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
      'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
      'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
      'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
    ]

    
    React.useEffect(() => {
      
      v3dAppAPI.createApp(urls).then((app) => {
        setv3dAPP(app);
      });


      return () => {
        if (v3dAPP !== null) {
          setv3dAPP(null);
        }
      }
    }, []);



    return (
      <div>
      <Grid container classeName={classes.v3dcontainer} >
        <Grid item id={v3dAppAPI.CONTAINER_ID} >
          <div></div>
        </Grid> 
      </Grid>
      <Grid container className={classes.container}>
        <Grid item >
          <ButtonGroup>
            <Button> Place your NFTS in the Galery </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      </div>
      
        

    )
}

export default Gallery; 
