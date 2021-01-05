import React from 'react';
import './App.scss';
import StartPage from './components/layouts/StartPage';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { checkLogInOrOut } from './validation/loginout';
import Dashboard from './components/layouts/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateProfile from './components/profile/CreateProfile';
import CreatePost from './components/post/CreatePost';
import PostListView from './components/post/PostListView';
import ProfileListView from './components/profile/ProfileListView';
import PostBoard from './components/layouts/PostBoard';
import ProfileBoard from './components/layouts/ProfileBoard';

const App = () => {
  //HACK: 로그인 세션 만료 검사가 새로고침 시에만 이루어짐. 라우트 이동 간에 활성화 될 수 있도록 수정 필요
  //MORE: 로그인 또는 로그아웃 상태 검사
  const startInterval = (callback, delay) => {
    callback();
    return setInterval(callback, delay * 1000);
  }
  startInterval(checkLogInOrOut, 1800);

  return (
    <Provider store={store}>
      <Router>
        <div className='App'>
          <Navbar />
          <Route exact path='/' component={StartPage} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/createProfile' component={CreateProfile} />
          <Switch>
            <Route exact path='/createPost' component={CreatePost} />
            <Route path='/createPost/:id' component={CreatePost} />
          </Switch>
          <Route exact path='/posts' component={PostListView} />
          <Route exact path='/developers' component={ProfileListView} />
          <Route exact path='/postboard/:id' component={PostBoard} />
          <Route exact path='/profileboard/:profileName' component={ProfileBoard} />
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
