import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { Button, ButtonGroup, Typography } from '@material-ui/core';
import Card from '../components/cards/Card'
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';

var fs = require('fs');


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 15%'
      
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
    columnwrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    spacebetweener: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    textfield: {
      minWidth: '100%',
      margin: '10px 0 10px 0'
    },
    file: {
      
    }
}));

const Details = () => {
  const classes = useStyles();
  const [acceptBids, setAcceptBids] = React.useState(false)
  const [instantSale, setInstantSale] = React.useState(false)

  return (
    <>
    <Grid item >
      <TextField
          id="name"
          label='Name'
          variant='filled'
          InputLabelProps={{
              shrink: true,
          }}
          className={classes.textfield}
      />
    </Grid>
    <Grid item >
      <TextField
        id="name"
        label='Description '
        variant='filled'
        InputLabelProps={{
            shrink: true,
        }}
        className={classes.textfield}
      />
    </Grid>
    <Grid item>
      <Typography variant='h6' color='textPrimary'>
          Put on sale
      </Typography>
    </Grid>
    <Grid item className={classes.spacebetweener}>
      <Typography variant='caption' color='textSecondary'>
        Other users will be able to bid on this piece
      </Typography>
      <Switch
        checked={acceptBids} 
        onChange={()=>setAcceptBids(!acceptBids)}
      />
    </Grid>
    <Grid item >
      <Typography variant='h6' color='textPrimary'>
          Instant Sale Price
      </Typography>
    </Grid>
    <Grid item className={classes.spacebetweener}>
      <Typography variant='caption' color='textSecondary'>
        Enter the price for which the item will be instantly sold
      </Typography>
      <Switch
        checked={instantSale} 
        onChange={()=>setInstantSale(!instantSale)}
      />
    </Grid>
    <Grid item >
    { instantSale == true ? 
        <TextField
          id="outlined-number"
          label="Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        :
        <></>
      }
    </Grid>
    <Grid item className={classes.spacebetweener}>
      <Typography variant='h6' color='textPrimary'>
        Royalties
      </Typography>
      <ButtonGroup variant='text'>
        <Button> 10% </Button>
        <Button> 20% </Button>
        <Button> 30% </Button>
      </ButtonGroup>
    </Grid>
    </>
  )
}

const FileUploader = () => {
  const classes = useStyles();
  const hiddenFileInput = React.useRef(null);
  const [file, setFile] = React.useState();

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setFile(URL.createObjectURL(fileUploaded));
    handleFile(fileUploaded);
  };

  const handleFile = (file) => {
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      const buffer =  Buffer(reader.result)
      console.log('buffer', buffer)
    }
  };

  return (
    <>
      {file ? 
        <Grid item className={classes.columnwrapper}>
          <img src={file} width='350px'/>
          <Button onClick={handleClick}>
            Upload a new file
          </Button>
          <input type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{display:'none'}} 
          />
        </Grid>
        
      : 
        <Grid item className={classes.columnwrapper}>
          <Button variant='contained' color='primary' onClick={handleClick}>
              Upload a file
          </Button>
          <input type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{display:'none'}} 
          />
        </Grid>
      }
       
    </>
  );
};


function Make() {
    const classes = useStyles();
    
    const [message, setMessage] = React.useState();
    const [loading, setLoading] = React.useState(false); 

    
    return (
        
      <Grid container className={classes.container} >
        <Grid container className={classes.root}>
            <Grid item>
              <Card
                titleText='IMG CARD'
                content={
                 <FileUploader/>
                }
              />
            </Grid>
            <Grid item>
              <Card
                titleText='DETAILS CARD'
                content={
                  <Details />
                }
              />
            </Grid>
        </Grid>
      </Grid>

    )
}

export default Make
