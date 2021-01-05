import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addComment_async, addLike_async, deleteComment_async, deletePost_async, getPostById_async } from '../../actions/postActions';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { FcLike } from 'react-icons/fc';
import { TiDelete } from 'react-icons/ti'
import { AiOutlineWarning } from 'react-icons/ai';
import { clearErrors } from '../../actions/authActions';
import { TextareaField } from '../../utils/InputFieldContainer';

const PostBoard = ({ match, history }) => {
  const { auth, post, error } = useSelector(state => state);
  const dispatch = useDispatch();
  const {
    params: { id }
  } = match;
  const { errors } = error;
  const curPost = post?.post;
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(getPostById_async({ id }));
    return () => dispatch(clearErrors());
  }, [dispatch, id]);

  const convertToRaw = (editorState) => {
    const blocksFromHtml = htmlToDraft(editorState);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const prevEditorState = EditorState.createWithContent(contentState);

    return prevEditorState;
  }

  const handleDeletePost = (e) => {
    e.preventDefault();
    dispatch(deletePost_async({ id, history }));
  }

  const handleClickLike = (e) => {
    e.preventDefault();
    dispatch(addLike_async({ id }));
  }

  const handleDeleteComment = (e, commentId) => {
    e.preventDefault();
    const res = window.confirm('정말 해당 댓글을 삭제하시겠습니까?');
    if (res) dispatch(deleteComment_async({ id, commentId }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addComment_async({
      id,
      commentData: {
        'text': comment,
        'title': 'comment-title-mandatory'
      }
    }));
    setComment('');
  }

  console.log(errors)

  return (
    <div id='postBoard' className='main'>
      <div className="container">
        {auth.user.id === curPost.user ? (
          <div className="modify-wrapper">
            <Link to={`/createPost/${curPost._id}`} className="btn modify">수정</Link>
            <span onClick={(e) => handleDeletePost(e)} className="btn delete">삭제</span>
          </div>
        ) : null}

        <h1 className="post-title">{curPost.title} </h1>
        <div className="sub-title">
          <span className="post-writer">{curPost.profileName}</span>
          <span className='dot-divider'>·</span>
          <span className="post-date">{moment(curPost.date).format('llll')}</span>
          <span className='dot-divider'>·</span>
          <span className="post-likes"><FcLike onClick={(e) => handleClickLike(e)} /> {curPost.likes?.length}</span>
        </div>
        {curPost?.text ? <Editor readOnly={true} editorState={convertToRaw(curPost.text)} /> : null}

        <div className="comment-wrapper">
          <h3 className="comment-title">Comment</h3>
          {curPost.comments ? curPost.comments.length ? curPost.comments.map(comment =>
            <div className='comment-box' key={comment._id}>
              <li className='comment-subInfo'>
                <span className='comment-profileName'>{comment.profileName}</span>
                <span className='comment-date'> {moment(comment.date).format('llll')}</span>
                {comment.user === auth.user.id ? <span className='comment-delete'><TiDelete onClick={(e) => handleDeleteComment(e, comment._id)} /></span> : null}
              </li>
              <pre className='comment-text'>{comment.text}</pre>
            </div>) : (
              <p className="no-comment">아직 작성된 코멘트가 없습니다...</p>
            ) : null}
          <form>
            <TextareaField
              stateSet={{
                value: comment,
                onChange: (e) => setComment(e.target.value),
              }}
              className={auth.user.id ? 'active' : 'non-active'}
              disabled={auth.user.id ? false : true}
            />
            <button onClick={(e) => handleSubmit(e)} className="submit btn">등록</button>
            {errors.text ? <span className='warning-msg'><AiOutlineWarning />{errors.text}</span> : null}

          </form>
        </div>
      </div>
    </div>
  )
}

export default PostBoard;
