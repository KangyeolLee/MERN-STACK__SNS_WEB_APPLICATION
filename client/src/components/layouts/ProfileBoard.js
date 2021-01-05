import React from 'react'
import MyProfileView from '../profile/MyProfileView';

const ProfileBoard = ({ match }) => {
  const {
    params: { profileName }
  } = match;

  return (
    <div id='profileBoard' className='main'>
      <div className="container">
        <h1>{profileName}님의 프로필 정보</h1>
        <MyProfileView profileName={profileName} />
      </div>
    </div>
  )
}

export default ProfileBoard
