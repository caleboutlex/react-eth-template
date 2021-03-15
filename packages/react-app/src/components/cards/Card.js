import React from 'react'

import MaterialCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        margin: '30px',
        borderRadius: '28px !important',
        position: 'relative', 
        minWidth: '20vw',
        minHeight: '30vh'
    },
    paper: {
        position: 'absolute',
        opacity: '100%',
        borderRadius: '30px',
        padding: '30px',
        backgroundColor: theme.palette.background.paper,
    },  
    content: {
        
    },
    button: {
        display:'flex',
        flexWrap:'nowrap',
        minWidth:'5vw'
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    media: {
        display: 'flex', 
        flexWrap: 'nowrap',
        flexDirection: 'column', 
        alignContent: 'center',
        justifyContent: 'space-between',
    }
  }));

const Card = ({
        titleText, 
        subheaderText, 
        avatar, 
        alt, 
        contentText, 
        buttonText, 
        modalBody, 
        content, 
        info

        }) => {
    const classes = useStyles();
    
    return (
        <MaterialCard className={classes.card}>
            <CardHeader
                classes={{content: classes.header}}
                title={titleText}
            />
            <CardMedia className={classes.media}>
                <Typography variant="caption" color="textSecondary" component="p">
                    {contentText}
                </Typography>
                <CardContent className={classes.content}>
                    {content}
                </CardContent>
            </CardMedia>
        </MaterialCard>
    )
}

export default Card;


