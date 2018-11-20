import { SET_PARAMS } from 'src/utils/constants';
import { Parameters } from 'src/interfaces/Parameters';

export function setParams(params: Parameters) {
    return {
        type: SET_PARAMS,
        params
    }
}