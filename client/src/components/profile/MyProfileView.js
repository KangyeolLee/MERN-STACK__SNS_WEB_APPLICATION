import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfileByProfileName_async, getProfile_async } from '../../actions/profileActions';
import { AiFillInstagram, AiFillYoutube, AiFillTwitterSquare, AiFillFacebook } from 'react-icons/ai';
import moment from 'moment';
import './profile.scss';
import Spinner from '../../utils/Spinner';

const MyProfileView = ({ profileName }) => {
  const { auth, profile } = useSelector((state) => state);
  const dispatch = useDispatch();
  const backgroundColor = [
    '#228be6', '#58032b', '#235984', '#376525', '#760F34',
    '#3208BD', '#747C57', '#1D0D9C', '#702627', '#CE443'
  ];

  useEffect(() => {
    if (profileName) {
      dispatch(getProfileByProfileName_async({ profileName }));
    } else {
      dispatch(getProfile_async());
    }
  }, [dispatch, profileName]);

  if (profile.loading) {
    return <Spinner />
  } else {
    return (
      <div id='profileView'>
        <div className='box-model profile-setting'>
          {auth ? (
            <>
              <div className='box-model__item'>
                <div className="box-model__item-list box-model__item-up">
                  <h3 className='title-tag'>이름</h3>
                  <p className='tag-content'>{auth.user.name}</p>

                  <h3 className='title-tag'>이메일 주소</h3>
                  <p className='tag-content'>{auth.user.email}</p>

                  <h3 className='title-tag'>가입날짜</h3>
                  <p className='tag-content'>{moment(auth.user.date).format('llll')}</p>
                </div>

                <div className="box-model__item-list box-model__item-bottom">
                  <h3 className='title-tag'>프로필명</h3>
                  <p className='tag-content'>{profile.profile ? profile.profile.profileName ? profile.profile.profileName : '-' : '-'}</p>

                  <h3 className='title-tag'>직업</h3>
                  <p className='tag-content'>{profile.profile ? profile.profile.status ? profile.profile.status : '-' : '-'}</p>

                  <h3 className='title-tag'>회사</h3>
                  <p className='tag-content'>{profile.profile ? profile.profile.company ? profile.profile.company : '-' : '-'}</p>

                  <h3 className='title-tag'>웹사이트</h3>
                  <p className='tag-content'>{profile.profile ? profile.profile.website ? profile.profile.website : '-' : '-'}</p>

                  <h3 className='title-tag'>거주지</h3>
                  <p className='tag-content'>{profile.profile ? profile.profile.location ? profile.profile.location : '-' : '-'}</p>

                  <h3 className='title-tag'>깃허브</h3>
                  <p className='tag-content'>{profile.profile ? profile.profile.githubUsername ? profile.profile.githubUsername : '-' : '-'}</p>
                </div>
              </div>


              <div className='box-model__item'>
                <h3 className='title-tag'>스킬</h3>
                <p className='tag-content'>{profile.profile ? profile.profile.skills.length ? profile.profile.skills.map((skill, index) => {
                  const randomColor = backgroundColor[index % (backgroundColor.length - 1)];
                  return (
                    <span key={skill} style={{ backgroundColor: randomColor }} className="skill-tag">{skill}</span>
                  )
                }) : '-' : '-'}</p>

                <h3 className='title-tag'>경력</h3>
                <p className='tag-content'>{profile.profile ? profile.profile.experience.length ? '유' : '무' : '무'}</p>

                <h3 className='title-tag'>SNS</h3>
                <p className='tag-content sns-tag facebook'><AiFillFacebook /><span className='sns-link'>{profile.profile ? profile.profile.social.facebook ? profile.profile.social.facebook : '-' : '-'}</span></p>
                <p className='tag-content sns-tag instagram'><AiFillInstagram /><span className='sns-link'>{profile.profile ? profile.profile.social.instagram ? profile.profile.social.instagram : '-' : '-'}</span></p>
                <p className='tag-content sns-tag twitter'><AiFillTwitterSquare /><span className='sns-link'>{profile.profile ? profile.profile.social.twitter ? profile.profile.social.twitter : '-' : '-'}</span></p>
                <p className='tag-content sns-tag youtube'><AiFillYoutube /><span className='sns-link'>{profile.profile ? profile.profile.social.youtube ? profile.profile.social.youtube : '-' : '-'}</span></p>

                <h3 className='title-tag'>자기소개</h3>
                <pre className='tag-content'>{profile.profile ? profile.profile.bio ? profile.profile.bio : '-' : '-'}</pre>
              </div>
            </>
          ) : (
              <>
                <p className='no-content-msg'>아직 작성된 프로필이 없습니다.</p>
              </>
            )
          }
        </div>

        {profileName ? null : (
          <Link to='/createProfile' className='btn'>
            Edit
          </Link>
        )}

      </div>
    )
  }
}

export default MyProfileView;
