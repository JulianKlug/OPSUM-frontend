import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import CurrentPrediction from "./CurrentPrediction";
import tombstone from "../static/tomb.png";
import walking_man from "../static/walking_man.png";
import CurrentFactors from "./CurrentFactors";
import PredictionOverTime from "./PredictionOverTime";
import MetaInput from "./MetaInput";
import example_patient_data from "./example_patient_data";
import {isMobile} from "../utils";

const useStyles = makeStyles((theme) => ({
    arcChart: {
        width: '25vw',
        minWidth: '15em',
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
        minWidth: '2em',
        height: 'auto',
        margin: '0 1vw',
        opacity: '0.5',
    },
    explanatoryGraphContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 'auto',
    },
    mobileExplanatoryGraphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
    },
}));


const MainPredictionArea = ({ }) => {
    const classes = useStyles();

    if (isMobile()) {
        // set flex direction to column in explanatoryGraphContainer
        classes.explanatoryGraphContainer = classes.mobileExplanatoryGraphContainer;
    }

    // Use effect to monitor changes in height, weight, age, sex, and update drugInfo
    useEffect(() => {
    }, []);

    const [patientId, setPatientId] = useState('Patient 1');
    const [patientTimepoint, setPatientTimepoint] = useState(example_patient_data[patientId].timestep);
    const [patientData, setPatientData] = useState(example_patient_data[patientId].data);
    const [patientFunctionalPredictions, setPatientFunctionalPredictions] = useState(example_patient_data[patientId].functional_outcome_predictions);
    const [patientMortalityPredictions, setPatientMortalityPredictions] = useState(example_patient_data[patientId].mortality_predictions);
    const [patientShapValues, setPatientShapValues] = useState(example_patient_data[patientId].shap_values);

    const loadPatientData = (patientId) => {
        setPatientTimepoint(example_patient_data[patientId].timestep);
        setPatientData(example_patient_data[patientId].data);
        setPatientFunctionalPredictions(example_patient_data[patientId].functional_outcome_predictions);
        setPatientMortalityPredictions(example_patient_data[patientId].mortality_predictions);
        setPatientShapValues(example_patient_data[patientId].shap_values);
    }

    // on change of patientId, load the patient's data
    useEffect(() => {
        // Load patient data
        loadPatientData(patientId);
    }, [patientId]);

    return (
        <div>
            <div>
                <MetaInput age={patientData[patientTimepoint - 1].Age} patientId={patientId}
                           setPatientId={setPatientId}
                           />
            </div>
            <div className={classes.arcContainer}>
                <img src={walking_man} alt="Left"
                     className={classes.image}/>
                <div className={classes.arcChart}>
                    <CurrentPrediction
                        functional_prediction={patientFunctionalPredictions[patientTimepoint - 1][0]}
                        mortality_prediction={patientMortalityPredictions[patientTimepoint - 1][0]}
                    />
                </div>
                <img src={tombstone} alt="Left"
                     className={classes.image}/>
            </div>
            <div className={classes.explanatoryGraphContainer}>
                <CurrentFactors
                    currentData={patientData[patientTimepoint - 1]}
                    currentShapValues={patientShapValues[patientTimepoint - 1]}
                />
                <PredictionOverTime predictions={patientFunctionalPredictions} shapValues={patientShapValues}
                                    patientData={patientData} patientTimepoint={patientTimepoint}
                />
            </div>
        </div>
    )
}

export default MainPredictionArea;