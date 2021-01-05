import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { rootSaga } from './reducers';

//DESC:   redux-saga 미들웨어 등록
const sagaMiddleware = createSagaMiddleware();

//DESC:   state를 저장/관리 할 store 생성
//        rootReducer 등록 + 미들웨어 적용(redux 개발자 툴 적용)
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

//DESC:   적용할 redux-saga 미들웨어 등록
sagaMiddleware.run(rootSaga);

export default store;
