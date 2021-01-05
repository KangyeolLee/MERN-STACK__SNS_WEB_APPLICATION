import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const DraftEditor = ({ editorState, setEditorState }) => {
  //MORE: Image Upload - drag & drop function
  const imageUploadCallBack = file => new Promise(
    (resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      let img = new Image();
      reader.onload = function (e) {
        img.src = this.result
        resolve({
          data: {
            link: img.src
          }
        })
      }
    }
  );

  return (
    <div>
      <Editor
        placeholder='포스트 내용을 입력하세요...'
        editorState={editorState}
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        localization={{
          locale: 'ko',
        }}
        wrapperClassName='wrapper-class'
        editorClassName='editor-class'
        toolbarClassName='toolbar-class'
        toolbar={{
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            alt: { present: true },
            uploadEnabled: true,
            uploadCallback: imageUploadCallBack,
            alignmentEnabled: true,
            previewImage: true,
            inputAccept: 'image/*',
          },
        }}
      />
    </div>
  );
};

export default DraftEditor;
