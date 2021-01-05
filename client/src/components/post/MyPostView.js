import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyPosts_async } from '../../actions/postActions';
import Slider from 'react-slick';
import moment from 'moment';
import 'moment/locale/ko';
import './post.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProfile_async } from '../../actions/profileActions';
import { BsFillGrid3X3GapFill, BsListOl } from 'react-icons/bs';
import { FcLike } from 'react-icons/fc';
import { FaRegCommentDots } from 'react-icons/fa';
import Spinner from '../../utils/Spinner';

const MyPostView = ({ history }) => {
  const { profile, post } = useSelector((state) => state);
  const [toggleState, setToggleState] = useState('off');
  const dispatch = useDispatch();
  const settings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: post.posts.length > 3 ? 3 : post.posts.length,
    slidesToScroll: 1,
  }

  const handleClick = () => {
    if (!profile.profile.profileName) {
      alert('먼저 기본 프로필 작성 후 포스팅할 수 있습니다.');
      return;
    }
    history.push('/createPost');
  }

  const handleClickToggle = (e) => {
    e.preventDefault();
    if (toggleState === 'on') setToggleState('off');
    else setToggleState('on');
  }

  useEffect(() => {
    dispatch(getMyPosts_async());
    dispatch(getProfile_async());
  }, [dispatch]);

  if (post.loading) {
    return (
      <Spinner />
    )
  } else {
    return (
      <div id='postView'>
        { toggleState === 'off'
          ? <BsListOl onClick={(e) => handleClickToggle(e)} id='see-opton-for-list' className='select-view-option' />
          : <BsFillGrid3X3GapFill onClick={(e) => handleClickToggle(e)} id='see-opton-for-grid' className='select-view-option' />}

        <div className='box-model post-setting'>
          {post.posts.length ? toggleState === 'off' ? (
            <Slider {...settings}>
              {post.posts.map((myPost) => <Link to={`/postboard/${myPost._id}`} className='slider-card' key={myPost._id}>
                <p className='post-title'>{myPost.title}</p>
                <p className='post-date'>마지막 수정: {moment(myPost.date).format('YYYY-MM-DD')}</p>
                <p className="post-likes">좋아요 개수: {myPost.likes.length}</p>
                <p className="post-comments">댓글 개수: {myPost.comments.length}</p>
              </Link>)}
            </Slider>
          ) : (
              <ul className="grid-mode-view">
                {post.posts.map((myPost, index) => <Link to={`/postboard/${myPost._id}`} className='gird-card' key={myPost._id}>
                  <div className="post-lists">
                    <span className="post-number">{'#' + (index + 1)}</span>
                    <span className='post-title'>{myPost.title}</span>
                    <span className='post-date'>{moment(myPost.date).format('YYYY-MM-DD')}</span>
                    <span className="dot-divider">·</span>
                    <span className='post-likes'><FcLike /> {myPost.likes.length}</span>
                    <span className="dot-divider">·</span>
                    <span className='post-comments'><FaRegCommentDots /> {myPost.comments.length}</span>
                  </div>
                </Link>)}
              </ul>
            ) : (
              <p className='no-content-msg'>아직 작성된 포스트가 없습니다.</p>
            )}
        </div>
        <button onClick={() => handleClick()} className='btn'>
          Post
      </button>
      </div>
    )
  }
}

export default MyPostView;
