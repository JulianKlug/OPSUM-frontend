import * as p1_data from '../static/data/non_norm_subj_df_p1.json';
import * as p2_data from '../static/data/non_norm_subj_df_p2.json';
import * as p3_data from '../static/data/non_norm_subj_df_p3.json';
import * as p4_data from '../static/data/non_norm_subj_df_p4.json';

import * as p1_functional_predictions from '../static/data/subj_functional_pred_over_ts_p1.json';
import * as p2_functional_predictions from '../static/data/subj_functional_pred_over_ts_p2.json';
import * as p3_functional_predictions from '../static/data/subj_functional_pred_over_ts_p3.json';
import * as p4_functional_predictions from '../static/data/subj_functional_pred_over_ts_p4.json';

import * as p1_mortality_predictions from '../static/data/subj_mortality_pred_over_ts_p1.json';
import * as p2_mortality_predictions from '../static/data/subj_mortality_pred_over_ts_p2.json';
import * as p3_mortality_predictions from '../static/data/subj_mortality_pred_over_ts_p3.json';
import * as p4_mortality_predictions from '../static/data/subj_mortality_pred_over_ts_p4.json';

import * as p1_shap_values from '../static/data/working_shap_values_p1.json';
import * as p2_shap_values from '../static/data/working_shap_values_p2.json';
import * as p3_shap_values from '../static/data/working_shap_values_p3.json';
import * as p4_shap_values from '../static/data/working_shap_values_p4.json';

const example_patient_data = {
    'Patient 1': {
        'timestep': 62,
        'data': p2_data,
        'functional_outcome_predictions': p2_functional_predictions,
        'mortality_predictions': p2_mortality_predictions,
        'shap_values': p2_shap_values
    },
    'Patient 2': {
        'timestep': 71,
        'data': p1_data,
        'functional_outcome_predictions': p1_functional_predictions,
        'mortality_predictions': p1_mortality_predictions,
        'shap_values': p1_shap_values
    },
    'Patient 3': {
        'timestep': 30,
        'data': p3_data,
        'functional_outcome_predictions': p3_functional_predictions,
        'mortality_predictions': p3_mortality_predictions,
        'shap_values': p3_shap_values
    },
    'Patient 4': {
        'timestep': 50,
        'data': p4_data,
        'functional_outcome_predictions': p4_functional_predictions,
        'mortality_predictions': p4_mortality_predictions,
        'shap_values': p4_shap_values
    }
}

export default example_patient_data;