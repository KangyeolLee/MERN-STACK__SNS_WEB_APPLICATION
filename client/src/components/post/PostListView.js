import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts_async } from '../../actions/postActions';
import { FcLike } from 'react-icons/fc';
import { FaRegCommentDots } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { GrPrevious, GrNext } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Spinner from '../../utils/Spinner';

const PER_PAGE = 9;

const PostListView = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchPost, setSearchPost] = useState('');
  const { post } = useSelector((state) => state);
  const dispatch = useDispatch();
  const offset = currentPage * PER_PAGE;
  const currentPagePosts = post?.posts.filter(post => post.title.includes(searchPost))
    .slice(offset, offset + PER_PAGE);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  }
  const handleSearchPost = (e) => {
    e.preventDefault();
    setSearchPost(e.target.value);
  }

  const settings = {
    pageCount: Math.ceil(post.posts.filter(post => post.title.includes(searchPost)).length / PER_PAGE),
    pageRangeDisplayed: PER_PAGE,
    previousLabel: <GrPrevious />,
    nextLabel: <GrNext />,
    onPageChange: handlePageClick,
    containerClassName: 'paginationWrapper',
    activeClassName: 'page-active',
    previousClassName: 'prev-btn',
    nextClassName: 'next-btn',
  }

  useEffect(() => {
    dispatch(getPosts_async());
  }, [dispatch]);


  return (
    <div id='postListView' className='main'>
      <div className="container">
        <h1>게시된 포스트 목록</h1>
        <div className="search-box">
          <FiSearch />
          <input value={searchPost} onChange={(e) => handleSearchPost(e)} type="text" placeholder='포스트 검색...' />
        </div>

        <div className="gird-wrapper">
          {
            post.loading
              ? <Spinner />
              : (
                post ? currentPagePosts.length ? (
                  currentPagePosts.map(eachPost =>
                    <Link to={`/postboard/${eachPost._id}`} className='postCard' key={eachPost._id}>
                      <p className='post-title'>{eachPost.title}</p>
                      <p className="post-writer">by. {eachPost.profileName}</p>
                      <div className="post-text" dangerouslySetInnerHTML={{ __html: eachPost.text }}></div>
                      <div className="bottom-overlay">
                        <p className='post-date'>{moment(eachPost.date).format('YY년 MM월 DD일')}</p>
                        <p className="post-sides">
                          <FcLike /> {eachPost.likes.length ? eachPost.likes.length : 0}
                          <FaRegCommentDots /> {eachPost.comments.length ? eachPost.comments.length : 0}
                        </p>
                      </div>
                    </Link>)
                ) : (
                    <p className="no-contents-msg">해당하는 포스트가 없습니다.</p>
                  ) : (
                    <p className="no-contents-msg">아직 작성된 포스트가 없습니다.</p>
                  )
              )
          }
        </div>

        <ReactPaginate {...settings} />

      </div>
    </div >
  )
}

export default PostListView;
