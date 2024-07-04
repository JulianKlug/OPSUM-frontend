import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import CurrentPrediction from "./CurrentPrediction";
import tombstone from "../static/tomb.png";
import walking_man from "../static/walking_man.png";
import CurrentFactors from "./CurrentFactors";
import PredictionOverTime from "./PredictionOverTime";
import MetaInput from "./MetaInput";

const useStyles = makeStyles((theme) => ({
    arcChart: {
        width: '25vw',
    },
    arcContainer: {
        display: 'flex',
        alignItems: 'flex-end', // Align items at the bottom
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '5vh',
        marginBottom: '10vh',
    },
    image: {
        width: '4vw',
        height: 'auto',
        margin: '0 1vw',
        opacity: '0.5',
    },
    explanatoryGraphContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
    },
}));


const MainPredictionArea = ({ }) => {
    const classes = useStyles();

    // Use effect to monitor changes in height, weight, age, sex, and update drugInfo
    useEffect(() => {
    }, []);

    const [age, setAge] = useState(70);
    const [sex, setSex] = useState('Male');
    const [patientId, setPatientId] = useState('Patient 1');

    return (
        <div>
            <div>
                <MetaInput age={age} sex={sex} patientId={patientId}
                           setAge={setAge} setSex={setSex}
                           />
            </div>
            <div className={classes.arcContainer}>
                <img src={walking_man} alt="Left"
                     className={classes.image}/>
                <div className={classes.arcChart}>
                    <CurrentPrediction/>
                </div>
                <img src={tombstone} alt="Left"
                     className={classes.image}/>
            </div>
            <div className={classes.explanatoryGraphContainer}>
                <CurrentFactors/>
                <PredictionOverTime/>
            </div>
        </div>
    )
}

export default MainPredictionArea;