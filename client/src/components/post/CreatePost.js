import React, { useState } from 'react';
import DraftEditor from '../../utils/DraftEditor';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './post.scss';
import { InputField } from '../../utils/InputFieldContainer';
import { useInput } from '../../utils/customHooks';
import { useDispatch, useSelector } from 'react-redux';
import { addPost_async, updatePost_async } from '../../actions/postActions';
import { useEffect } from 'react';
import { getPostById_async } from '../../actions/postActions';
import { clearErrors } from '../../actions/authActions';
import { AiOutlineWarning } from 'react-icons/ai';

const CreatePost = ({ history, match }) => {
  const { post, error } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { success, errors } = error;
  const {
    params: { id }
  } = match;
  const titleInput = useInput(id ? post.post?.title : '', true);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (id) {
      dispatch(getPostById_async({ id }));
      if (post.post?.text) {
        const blocksFromHtml = htmlToDraft(post.post.text);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const prevEditorState = EditorState.createWithContent(contentState);
        setEditorState(prevEditorState);
      }
    }
    return () => dispatch(clearErrors());
  }, [dispatch, id, post.post.text]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    const postData = {
      title: titleInput.value,
      text: htmlContent === '<p></p>\n' ? null : htmlContent,
    };

    if (!id) {
      dispatch(addPost_async({ postData, history }));
    } else {
      console.log('update!')
      dispatch(updatePost_async({ id, postData, history }));
    }
  };

  return (
    <form className='createPost main'>
      <div className='container'>
        <InputField
          type='text'
          placeholder='포스트 제목을 작성하세요...'
          className='title'
          errors={errors}
          success={success}
          stateSet={titleInput}
        />

        {/* HACK: 에러메시지 발생 시 빨간 레이아웃 적용할 지 고려 */}
        <DraftEditor
          editorState={editorState}
          setEditorState={setEditorState}
        />

        <div className='warning-wrapper'>
          {errors.text ? (
            <p className='warning-msg'>
              <AiOutlineWarning />
              {errors.text}
            </p>
          ) : null}
        </div>

        <button className='btn' onClick={(e) => handleSubmit(e)}>
          제출
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
