import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import {makeStyles} from "@material-ui/core/styles";
import * as React from 'react';
import {FormControl, InputAdornment, MenuItem, TextField} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    currentPatientInfo: {
        alignItems: 'center',
        display: 'inline-flex',
        gap: '2vw',
        marginTop: '2vh',
        marginLeft: '2vw',
    },
}));

export default function MetaInput({patientId, age, setPatientId}) {
  const classes = useStyles();
  return (
    <div className={classes.currentPatientInfo}>
       <SensorOccupiedIcon size="inherit"/>
            {/*Patient ID*/}
                    <TextField
                      id="standard-select-patient"
                      select
                      defaultValue={patientId}
                      label={"ID"}
                        onChange={(event) => {
                                        setPatientId(event.target.value);
                                        }
                        }
                    >
                  {['Patient 1', 'Patient 2', 'Patient 3', 'Patient 4'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

            {/*Age:*/}
            <FormControl sx={{ width: '3ch' }}>
                <TextField style={{width: "3ch"}} id="standard-basic" label={"Age"} variant="standard"
                           value={age} disabled
                // onChange={(event) => {
                //           setAge(event.target.value);
                //         }}
                />
            </FormControl>

            {/*Sex:  */}
            {/*<TextField*/}
            {/*          id="standard-select-sex"*/}
            {/*          select*/}
            {/*          defaultValue={sex}*/}
            {/*          label={"Sex"}*/}
            {/*            onChange={(event) => {*/}
            {/*                            setSex(event.target.value);*/}
            {/*                            }*/}
            {/*            }*/}
            {/*        >*/}
            {/*      {['Male', 'Female'].map((option) => (*/}
            {/*        <MenuItem key={option} value={option}>*/}
            {/*          {option}*/}
            {/*        </MenuItem>*/}
            {/*      ))}*/}
            {/*    </TextField>*/}
    </div>
  );
}