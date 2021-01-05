import { handleActions } from 'redux-actions';
import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

//DESC: errorReducer 초기상태 정의
const initialState = {
  success: false,
  errors: {},
};

//DESC: handleActions 함수를 통해 reducer 동작 정의
export default handleActions(
  {
    [GET_ERRORS]: (state, action) => action.payload,
    [CLEAR_ERRORS]: (state, action) => initialState,
  },
  initialState
);
