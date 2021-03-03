import React from 'react'
import MaterialButton from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography"
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
  
  
const Button = ({text, size, color, action }) => {
    const classes = useStyles()
    return (
        <div>
            <MaterialButton
                className={classes.button}
                size={size}
                variant="contained" 
                color={color}
                onClick={action}
            >
                <Typography>
                    {text}
                </Typography>
            </MaterialButton>
        </div>
    )
};

export default Button;
