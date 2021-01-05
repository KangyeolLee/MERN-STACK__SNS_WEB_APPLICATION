import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfiles_async } from '../../actions/profileActions'
import moment from 'moment';
import { FiSearch } from 'react-icons/fi';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { GoSignIn } from 'react-icons/go'
import { BsFillBagFill, BsTagFill } from "react-icons/bs";
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Spinner from '../../utils/Spinner';

const PER_PAGE = 9;

const ProfileListView = () => {
  const backgroundColor = [
    '#228be6', '#58032b', '#235984', '#376525', '#760F34',
    '#3208BD', '#747C57', '#1D0D9C', '#702627', '#CE443'
  ];
  const [currentPage, setCurrentPage] = useState(0);
  const [searchProfile, setSearchProfile] = useState('');
  const { profile } = useSelector(state => state);
  const dispatch = useDispatch();
  const offset = currentPage * PER_PAGE;
  const currentPageProfiles = profile?.profiles?.filter(profile => profile.profileName.includes(searchProfile))
    .slice(offset, offset + PER_PAGE);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  }

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchProfile(e.target.value);
  }

  useEffect(() => {
    dispatch(getProfiles_async());
  }, [dispatch]);

  const settings = {
    pageCount: Math.ceil(profile?.profiles?.filter(profile => profile.profileName.includes(searchProfile)).length / PER_PAGE),
    pageRangeDisplayed: PER_PAGE,
    previousLabel: <GrPrevious />,
    nextLabel: <GrNext />,
    onPageChange: handlePageClick,
    containerClassName: 'paginationWrapper',
    activeClassName: 'page-active',
    previousClassName: 'prev-btn',
    nextClassName: 'next-btn',
  }


  return (
    <div id='profileListView' className='main'>
      <div className="container">
        <h1>등록된 개발자 목록</h1>
        <div className="search-box">
          <FiSearch />
          <input value={searchProfile} onChange={(e) => handleSearchInput(e)} type="text" placeholder='개발자 검색...' />
        </div>

        <div className="gird-wrapper">
          {
            profile.loading
              ? <Spinner />
              : (
                currentPageProfiles ? currentPageProfiles.length ? (
                  currentPageProfiles.map(eachProfile =>
                    <Link key={eachProfile._id} to={`/profileboard/${eachProfile.profileName}`} className='profileCard'>
                      <div className="specifications developer-profileName">{eachProfile.profileName ? eachProfile.profileName : 'undefined..'}</div>
                      <div className="specifications developer-signIn"><GoSignIn /> <span className="title-tag">등록일</span> {moment(eachProfile.date).format('YYYY년 MM월 DD일')}</div>
                      <div className="specifications developer-status"><BsFillBagFill /> <span className="title-tag">직업</span> {eachProfile.status}</div>
                      <div className="specifications developer-skills"><BsTagFill /> <span className="title-tag">기술</span>
                        <p className='skill-tag-wrapper'>
                          {eachProfile.skills.map((skill, index) => {
                            const randomColor = backgroundColor[index % (backgroundColor.length - 1)];
                            return (
                              <span key={skill} style={{ backgroundColor: randomColor }} className="skill-tag">{skill}</span>
                            )
                          })}
                        </p>
                      </div>
                      {/* <div className="specifications developer-biography"><BsBook /> <span className="title-tag">소개</span> <p className="description"> {eachProfile.bio}</p></div> */}
                    </Link>)
                ) : (
                    <p className="no-contents-msg">해당 프로필명의 개발자가 없습니다.</p>
                  ) : (
                    <p className="no-contents-msg">아직 등록된 개발자가 없습니다.</p>
                  )
              )
          }

        </div>

        <ReactPaginate {...settings} />

      </div>
    </div>
  )
}


export default ProfileListView
