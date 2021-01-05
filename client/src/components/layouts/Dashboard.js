import React from 'react';
import 'moment/locale/ko';
import MyProfileView from '../profile/MyProfileView';
import MyPostView from '../post/MyPostView';

const Dashboard = ({ history }) => {
  //HACK: async 호출에서 최적화가 잘 되는지 확인이 필요할 듯...

  return (
    <div className='dashboard main'>
      <div className='container'>
        <h1>My 프로필</h1>
        <MyProfileView />

        <h1>My 포스트</h1>
        <MyPostView history={history} />
      </div>
    </div>
  );
};

export default Dashboard;
