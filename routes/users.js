// DESC:  라우터 연동 관련 모듈 로드
const express = require('express');
const router = express.Router();

// DESC:  보안 관련 모듈 로드
const bcrypt = require('bcryptjs'); //MORE: 비밀번호 Hashing with Salt 모듈
const jwt = require('jsonwebtoken'); //MORE: JsonWebToken 생성 및 인증 모듈
const passport = require('passport'); //MORE: 패스포트 모듈
const keys = process.env.SECRETORKEY; //MORE: 보안 관련 JWT 토큰 암호키 (/config.env)

// DESC:  유저 및 프로필 모델 스키마 로드
const User = require('../models/User');
const Profile = require('../models/Profile');

// DESC:  회원가입 관련 입력 검증 모듈 로드
const validateRegisterInput = require('../validation/register');
// DESC:  로그인 관련 입력 검증 모듈 로드
const validateLoginInput = require('../validation/login');

// DESC:  라우트 연동 설정
// MORE:  @ 회원 가입
//        @route POST api/users/register
//        @access Public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  try {
    const originUser = await User.findOne({ email: req.body.email });
    if (originUser) {
      return res.status(400).json({
        success: false,
        errors: {
          email: '이미 해당 이메일로 가입한 사용자가 있습니다.',
        },
      });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    //MORE: bcryptjs 모듈을 이용하여 Salt 값을 활용해 유저 패스워드 Hashing
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).json({
          success: false,
          errors: {
            'server-error': 'bcrypt.genSalt() error',
            message: err.message,
          },
        });
      } else {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) {
            return res.status(500).json({
              success: false,
              errors: {
                'server-error': 'bcrypt.hash() error',
                message: err.message,
              },
            });
          } else {
            newUser.password = hash;
            const user = await newUser.save();

            return res.status(201).json({
              success: true,
              data: user,
              message: 'Success for user register',
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: {
        'access-error': error.message,
      },
    });
  }
});

// MORE:  @ 회원 탈퇴 : JWT 확인 후 탈퇴 진행
//        @route DELETE api/users/unregister
//        @access Private
router.delete(
  '/unregister',
  // MORE:  현재 유저가 로그인이 되어있음을 확인 후 콜백함수 진행
  //        # 로그인 인증은 JWT를 이용하며 이 과정에서 세션이나 쿠키 등은 사용하지 않음
  //        # 따라서 session의 값은 false로 설정
  //        # JWT 토큰이 발행되면 request.user에 사용자 관련 정보들이 저장됨
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });

      return res.status(200).json({
        success: true,
        message: '성공적으로 회원탈퇴를 했습니다.',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        errors: {
          'access-error': error.message,
        },
      });
    }
  }
);

// MORE:  @ 회원 로그인 : JWT 토큰 반환
//        @route POST api/users/login
//        @access Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        errors: {
          email: '해당하는 회원이 존재하지 않습니다.',
        },
      });
    }

    // MORE:  유저 패스워드가 암호화 되었으므로 입력된 번호가 서로 같은 패스워드인지를 확인하는 절차
    const result = await bcrypt.compare(password, user.password);

    if (result) {
      // MORE:  입력된 패스워드와 설정된 패스워드가 일치하는 경우 => JWT PAYLOAD 생성
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        date: user.date,
      };

      // MORE:  해당 PAYLOAD를 바탕으로 JWT 토큰 생성 => 만료시간은 기본 1시간으로 설정
      //        # payload [객체/버퍼/문자열 등..]
      //        # keys => [secret] => 서명을 만들 때 사용되는 알고리즘에서 사용하는 암호키
      //        # options [expiresIn, algorithm, notbefore, audience, issuer, ... ]
      //        # callback(err, token)
      jwt.sign(payload, keys, { expiresIn: 3600 }, (error, token) => {
        if (error) {
          return res.status(500).json({
            success: false,
            errors: {
              'access-error': error.message,
            },
          });
        } else {
          res.status(201).json({
            success: true,
            token: 'Bearer ' + token,
          });
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        errors: {
          password: '비밀번호가 일치하지 않습니다.',
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: {
        'access-error': error.message,
      },
    });
  }
});

// MORE:  @ 현재 로그인 된 회원 정보 반환
//        @route GET api/users/current
//        @access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      date: req.user.date,
    });
  }
);

module.exports = router;
