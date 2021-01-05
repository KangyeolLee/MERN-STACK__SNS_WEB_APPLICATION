import { handleActions } from 'redux-actions';
import { USER_REGISTER, SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validation/empty';

//DESC: authReducer 초기상태 정의
const initialState = {
  isAuthenticated: false,
  user: {},
};

//DESC: handleActions 함수를 통해 reducer 동작 정의
export default handleActions(
  {
    [USER_REGISTER]: (state, action) => state,
    [SET_CURRENT_USER]: (state, action) => ({
      ...state,
      isAuthenticated: !isEmpty(action.payload),
      user: action.payload,
    }),
  },
  initialState
);
