import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import {Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey'
        }
      },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      background: '#000000c4',
      display: 'flex',
      flexDirection: 'column'
    },
    description: {
     width: '60%',
     maxHeight: '80vh',
     marginTop: '10vh',
     textAlign: 'left',
     overflowY: 'scroll',
    },
    signature: {
        fontStyle: 'italic',
        marginTop: '5vh',
        marginBottom: '2vh'
    },
  }));

export default function InfoBackdrop({open, handleClose}) {
    const classes = useStyles();
 
    return (
        <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>

            <div className={classes.description}>
                <Typography variant="body1">
                    <Link variant="inherit" color="inherit" href='https://github.com/JulianKlug/OPSUM'>OPSUM</Link> -
                    Real-time dynamic prediction of outcome after acute ischemic stroke
                    <br/><br/><br/>

                    Stroke is the most frequent cause of long-term disability in industrialized countries. To determine
                    the best treatment and allocate the necessary resources, an early and accurate prediction of outcome
                    is essential. Although modern stroke units gather a continuous stream of data, existing prognostic
                    scores are rarely used in clinical practice as they are static and fail to adapt to the evolving
                    condition of the patient.
                    <br/><br/>

                    We developed a novel machine learning approach to provide real-time predictions of mortality and
                    good functional outcome. More specifically, we used a transformer model that was designed to
                    integrate continuously recorded sequential data. During the first 72 hours after admission, our
                    model is able to provide accurate hourly prediction of outcome at three months based on updated
                    clinical, physiological, and biological data.
                    <br/><br/>

                    This page is an example user interface for the <Link variant="inherit" color="inherit"
                                                                   href='https://github.com/JulianKlug/OPSUM'>OPSUM</Link> model. All data displayed here is fictional and no real patient data was used.
                    <br/>

                    <br/><br/>
                    If you wish to contribute to this project, please do not hesitate to contact me.
                </Typography>
            </div>
                <div className={classes.signature}>
                    <Link variant="inherit" color="inherit" href='https://www.julianklug.com'> Julian Klug </Link>
            </div>
        </Backdrop>
    );
}