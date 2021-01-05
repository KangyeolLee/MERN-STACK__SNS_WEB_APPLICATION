import React from 'react';
import classNames from 'classnames';
import { FaRegUserCircle } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineMail, AiOutlineWarning } from 'react-icons/ai';

//DESC: input 태그 박스모델 컴포넌트
export const InputField = React.memo(({
  className,
  type,
  name,
  placeholder,
  stateSet, //MORE: input 태그의 value 와 onChange 관리
  icon,
  errors,
  success,
  info,
  disabled
}) => {
  //MORE: String Type의 icon을 인자로 받아 해당하는 react-icons 이미지 생성
  const svgImg = (icon) => {
    switch (icon) {
      case 'FaRegUserCircle':
        return <FaRegUserCircle />;

      case 'RiLockPasswordLine':
        return <RiLockPasswordLine />;

      case 'AiOutlineMail':
        return <AiOutlineMail />;

      default:
        break;
    }
  };

  if (disabled) {
    return (
      <div className='input-wrapper'>
        <input
          //MORE: error-message의 유무로 required 클래스명 추가
          className={classNames(`user-input ${className}-data`, {
            required: errors ? errors[className] : false,
          })}
          type={type}
          placeholder={placeholder}
          disabled
        />
      </div>
    )
  } else {
    return (
      <div className='input-wrapper'>
        {info && <h2>{info}</h2>}
        <input
          //MORE: error-message의 유무로 required 클래스명 추가
          className={classNames(`user-input ${className}-data`, {
            required: errors ? errors[className] : false,
          })}
          type={type}
          name={name}
          placeholder={placeholder}
          {...stateSet}
        />
        {icon && svgImg(icon)}

        {!success && errors && errors[className] && (
          <p className='warning-msg'>
            <AiOutlineWarning /> {errors[className]}
          </p>
        )}
      </div>
    );
  }

});

export const SelectField = ({
  className,
  defaultOption,
  stateSet, //MORE: input 태그의 value 와 onChange 관리
  options,
  errors,
  success,
  info,
}) => {
  return (
    <div className='input-wrapper'>
      {info && <h2>{info}</h2>}
      <select
        //MORE: error-message의 유무로 required 클래스명 추가
        className={classNames(`user-input ${className}-data`, {
          required: errors ? errors[className] : false,
        })}
        onChange={stateSet.onChange}
        value={options.includes(stateSet.value) ? stateSet.value : 'direct'}>
        <option defaultValue={defaultOption} disabled>{defaultOption}</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
        <option value="direct">직접 입력</option>
      </select >

      {!success && errors && errors[className] && (
        <p className='warning-msg'>
          <AiOutlineWarning /> {errors[className]}
        </p>
      )}
    </div >
  )
}

export const TextareaField = ({
  className,
  type,
  placeholder,
  stateSet, //MORE: input 태그의 value 와 onChange 관리
  icon,
  disabled,
  errors,
  success,
  info,
  resize,
}) => {
  if (disabled) {
    return (
      <div className="textarea-wrapper">
        <textarea
          //MORE: error-message의 유무로 required 클래스명 추가
          className={classNames(`user-input ${className}-data`, {
            required: errors ? errors[className] : false,
          })}
          type={type}
          placeholder='로그인 후 작성 가능합니다...'
          style={{ resize }}
          disabled
        />
      </div>
    )
  } else {
    return (
      <div className='textarea-wrapper'>
        {info && <h2>{info}</h2>}
        <textarea
          //MORE: error-message의 유무로 required 클래스명 추가
          className={classNames(`user-input ${className}-data`, {
            required: errors ? errors[className] : false,
          })}
          type={type}
          placeholder={placeholder}
          {...stateSet}
          style={{ resize }}
        />

        {!success && errors && errors[className] && (
          <p className='warning-msg'>
            <AiOutlineWarning /> {errors[className]}
          </p>
        )}
      </div>
    );
  }
};

