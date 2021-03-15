import React from 'react'

import MaterialCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Styled from 'styled-components'
import { makeStyles } from "@material-ui/core/styles"
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles((theme) => ({
    root: {
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        margin:'10px',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    buttongroup :{
       
    }
  }));

const SimpleModal = () => {
    const classes = useStyles();
    const [withdraw, setWithdraw] = React.useState(false);

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <Wrapper>
                <Typography variant='caption' color='textPrimary'>
                    Deposit
                </Typography>
                <Switch
                    checked={withdraw} 
                    onChange={()=>setWithdraw(!withdraw)}
                />
                <Typography variant='caption' color='textPrimary'>
                    Withdraw
                </Typography>
            </Wrapper>
            {withdraw ? 
                 <div>
                 <Wrapper>
                     <TextField
                         id="standard-number"
                         type="number"
                         InputLabelProps={{
                             shrink: true,
                         }}
                         helperText={`Deposited: ${0.0001}`}
                     />
                     <Button variant='text' size='small'>
                         max
                     </Button>
                 </Wrapper>
                 <Wrapper>
                     <div className={classes.root}>
                        <div className={classes.root}>
                            <Typography variant='caption' color='textPrimary' >
                                You currently have '?'' Buds sitting in the Research Lab
                            </Typography>
                        </div>
                        <div className={classes.root}>
                            <Typography variant='button' color='textPrimary'>
                                Bud ID: '?'
                            </Typography>
                        </div>
                     </div>
                 </Wrapper>
                 <Wrapper>
                     <ButtonGroup className={classes.buttongroup }variant='contained' size='medium'>
                         <Button color='primary' className={classes.button} size='large'>
                             Withdraw
                         </Button>
                     </ButtonGroup>
                 </Wrapper>
                 </div>
            :
                <div>
                <Wrapper>
                    <TextField
                        id="standard-number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        helperText={`Balance: ${0.0001}`}
                    />
                    <Button variant='text' size='small'>
                        max
                    </Button>
                </Wrapper>
                <Wrapper>
                    <TextField
                        id="standard-number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        helperText={`THC: ${23} - CBD: ${43}`}
                    />
                    <Button variant='text' size='small'>
                        rndm
                    </Button>
                </Wrapper>
                <div className={classes.root}>
                    <ButtonGroup className={classes.buttongroup} variant='contained' size='medium'>
                        <Button color='secondary' className={classes.button} size='large'>
                            Approve
                        </Button>
                        <Button color='primary' className={classes.button} size='large'>
                            Deposit
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
            }
        </form>
    )
}

export default SimpleModal;

const Wrapper = Styled.div`
    display: flex;
    justify-content: center;
    align-items: baseline;
    width: 100%;
`

