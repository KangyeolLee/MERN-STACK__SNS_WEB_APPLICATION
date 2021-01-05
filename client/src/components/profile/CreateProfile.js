import React, { useEffect, useState } from 'react';
import './profile.scss';
import { useSelector, useDispatch } from 'react-redux';
import { InputField, TextareaField, SelectField } from '../../utils/InputFieldContainer';
import {
  createProfile_async,
} from '../../actions/profileActions';
import { useInput } from '../../utils/customHooks';
import { clearErrors } from '../../actions/authActions';
import { getCurrentProfileAPI } from '../../apis/profileAPIs';
import { BsPlusCircleFill } from 'react-icons/bs';

const selectOptions = ['Developer', 'Student', 'Architecture', 'DevOps'];

const CreateProfile = ({ history }) => {
  const { profile, error } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { success, errors } = error;

  //DESC: state 관리 Input cutomHook 등록
  //HACK: 무언가 최적화가 필요하지 않을까 생각...
  //HACK: 해당페이지 새로고침을 막아야할지..? 수정페이지와 등록페이지를 구분? profile 정보 로드를 언제 적용할지...
  const profileName = useInput(
    profile.profile ? profile.profile.profileName : '',
    true
  );
  const status = useInput(profile.profile
    ? !selectOptions.includes(profile.profile.status)
      ? 'direct'
      : profile.profile.status
    : '직업을 선택해주세요...', true);
  const directStatus = useInput(profile.profile ? profile.profile.status : '', true);
  // const company = useInput(profile.profile ? profile.profile.company : '');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState(profile.profile ? profile.profile.skills : [""]);
  const [otherSkillsInputs, setSkillsInputs] = useState(skills ? skills.reduce((acc, cur, idx) => {
    acc['skill' + idx] = cur;
    return acc;
  }, {}) : '');

  const website = useInput(profile.profile ? profile.profile.website : '');
  const location = useInput(profile.profile ? profile.profile.location : '');
  const bio = useInput(profile.profile ? profile.profile.bio : '');
  const github = useInput(
    profile.profile ? profile.profile.githubUsername : ''
  );
  const facebook = useInput(profile.profile ? profile.profile.social.facebook : '');
  const instagram = useInput(profile.profile ? profile.profile.social.instagram : '');
  const twitter = useInput(profile.profile ? profile.profile.social.twitter : '');
  const youtube = useInput(profile.profile ? profile.profile.social.youtube : '');

  //HACK: async 호출에서 최적화가 잘 되는지 확인이 필요할 듯...
  //HACK: 대책1) useInput을 useState로 바꾸고, setter를 useEffect 내부에서 직접 관리
  //      대책2) 아래와 같은 방식으로 API를 직접 호출하여 비동기로 사용
  useEffect(() => {
    // dispatch(getProfile_async());
    const test = async () => {
      const prof = await getCurrentProfileAPI();
      const comp = prof.data.data.company;
      setCompany(comp);
    };

    test();

    // setCompany(profile.profile.company);

    return () => dispatch(clearErrors());
  }, [dispatch]);

  const handlePlusBtnClick = (e) => {
    e.preventDefault();
    setSkills([...skills, '']);
  }

  const handleInputSkills = (e) => {
    const { value, name } = e.target;
    setSkillsInputs({
      ...otherSkillsInputs,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const profileData = {
      profileName: profileName.value,
      status: status.value === 'direct' ? directStatus.value : status.value,
      // company: company.value,
      company,
      website: website.value,
      location: location.value,
      skills: Object.values(otherSkillsInputs).filter(el => el).join(','),
      bio: bio.value,
      githubUsername: github.value,
      facebook: facebook.value,
      instagram: instagram.value,
      twitter: twitter.value,
      youtube: youtube.value,
    };

    dispatch(
      createProfile_async({
        profileData,
        history,
      })
    );
  };

  return (
    <form className='createProfile main'>
      <div className='container'>
        {!profile.loading ? (
          <>
            <InputField
              type='text'
              placeholder='(필수) 사용할 프로필 명을 적어주세요...'
              className='profileName'
              errors={errors}
              success={success}
              stateSet={profileName}
              info='프로필 명'
            />

            <SelectField
              className='status'
              defaultOption='직업을 선택해주세요...'
              options={selectOptions}
              info='직업'
              stateSet={status}
            />

            {status.value === 'direct' || !selectOptions.includes(status.value)
              ? (
                <InputField
                  className='status'
                  type='text'
                  placeholder='(필수) 직업을 적어주세요...'
                  errors={errors}
                  success={success}
                  stateSet={directStatus} />
              ) : (

                <InputField
                  disabled
                  className='status'
                  placeholder='(필수) 직업을 적어주세요...' />

              )}

            {/* HACK: key 값이 있으면 리렌더링 시 Input창 Focus out 발생..
            HACK: useMemo 관련 렌더링 최적화 관련 파악 필요 ..        */}
            <h2 className='inputTitle'>스킬</h2>
            <div className='inputFieldWrapper'>
              <InputField
                type='text'
                placeholder='(필수) 언어 및 기술...'
                className='skills'
                errors={errors}
                success={success}
                name='skill0'
                stateSet={{
                  value: otherSkillsInputs ? otherSkillsInputs['skill0'] : '',
                  onChange: (e) => handleInputSkills(e)
                }}
              />

              {skills ? skills.slice(1).map((skill, idx) => {
                const skillName = 'skill' + (idx + 1);
                return (
                  <InputField
                    key={skill + idx}
                    type='text'
                    placeholder='언어 및 기술...'
                    className='skills'
                    name={skillName}
                    stateSet={{
                      value: otherSkillsInputs[skillName],
                      onChange: (e) => handleInputSkills(e),
                    }}
                  />
                )
              }) : null}

              <p className="plus-btn"><BsPlusCircleFill onClick={(e) => handlePlusBtnClick(e)} /></p>

            </div>

            <InputField
              type='text'
              placeholder='현재 다니는 회사가 있다면 적어주세요...'
              className='company'
              stateSet={{
                value: company,
                onChange: (e) => setCompany(e.target.value),
              }}
              info='회사'
            />

            <InputField
              type='text'
              placeholder='현재 거주하고 있는 장소 또는 회사 위치를 적어주세요...'
              className='location'
              stateSet={location}
              info='거주지'
            />

            <InputField
              type='text'
              placeholder='활동하는 깃허브 주소 또는 계정명을 적어주세요...'
              className='github'
              stateSet={github}
              info='깃허브'
            />

            <InputField
              type='text'
              placeholder='관련 웹사이트 또는 홈페이지가 있다면 적어주세요...'
              className='website'
              stateSet={website}
              errors={errors}
              success={success}
              info='웹사이트'
            />

            <InputField
              type='text'
              placeholder='facebook 주소가 있나요?'
              className='facebook'
              errors={errors}
              success={success}
              stateSet={facebook}
              info='SNS' />

            <InputField
              type='text'
              placeholder='instagram 주소가 있나요?'
              className='instagram'
              errors={errors}
              success={success}
              stateSet={instagram}
            />

            <InputField
              type='text'
              placeholder='twitter 주소가 있나요?'
              className='twitter'
              errors={errors}
              success={success}
              stateSet={twitter}
            />

            <InputField
              type='text'
              placeholder='youtube 주소가 있나요?'
              className='youtube'
              errors={errors}
              success={success}
              stateSet={youtube}
            />

            <TextareaField
              type='text'
              placeholder='자기소개를 간단히 적어주세요...'
              className='bio'
              stateSet={bio}
              info='자기소개'
              resize='vertical'
            />

            <button className='btn' onClick={(e) => handleSubmit(e)}>
              제출
            </button>
          </>
        ) : (
            '로딩중'
          )}
      </div>
    </form>
  );
};

export default CreateProfile;
