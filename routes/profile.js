// DESC:  라우터 연동 관련 모듈 로드
const express = require('express');
const router = express.Router();

// DESC:  보안 관련 모듈 로드 (로그인 인증)
const passport = require('passport');

// DESC:  유저 및 프로필 모델 스키마 로드
const User = require('../models/User');
const Profile = require('../models/Profile');

// DESC:  프로필 작성 관련 입력 검증 모듈 로드 [프로필명, 직업, 언어, 각종 사이트 URL]
const validateProfileInput = require('../validation/profile');
// DESC:  프로필 작성 내 경력사항 관련 입력 검증 모듈 로드
const validateExperienceInput = require('../validation/experience');

// DESC:  라우트 연동 설정
// MORE:  @모든 사용자 프로필 조회
//        @route GET api/profile/all
//        @access Public
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name');
    if (!profiles.length) {
      return res.status(404).json({
        success: false,
        errors: {
          noProfile: '등록된 프로필이 없습니다.',
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: profiles,
        message: '모든 회원 프로필 불러오기 성공',
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      errors: {
        noProfile: '등록된 프로필이 없습니다.',
        'error-message': error.message,
      },
    });
  }
});

// MORE:  @현재 로그인 된 회원 프로필 얻기
//        @route GET api/profile
//        @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        'name'
      );
      if (!profile) {
        return res.status(404).json({
          success: false,
          errors: {
            noProfile: '해당 프로필이 없습니다.',
          },
        });
      } else {
        return res.status(200).json({
          success: true,
          data: profile,
          message: '현재 회원 프로필 불러오기 성공',
        });
      }
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: {
          noProfile: '등록된 프로필이 없습니다.',
          'error-message': error.message,
        },
      });
    }
  }
);

// MORE:  @프로필 명으로 해당 프로필 얻기
//        @route GET api/profile/profileName/:profileName
//        @access Public
router.get('/profileName/:profileName', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      profileName: req.params.profileName,
    }).populate('user', 'name');

    if (!profile) {
      return res.status(404).json({
        success: false,
        errors: {
          noProfile: '해당 프로필 명의 프로필이 존재하지 않습니다.',
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: profile,
        message: '해당 프로필 명의 프로필 불러오기 성공',
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      errors: {
        noProfile: '등록된 프로필이 없습니다.',
        'error-message': error.message,
      },
    });
  }
});

// MORE:  @사용자 아이디로 해당 프로필 얻기
//        @route GET api/profile/id/:userId
//        @access Public
router.get('/id/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      'user',
      'name'
    );
    if (!profile) {
      return res.status(404).json({
        success: false,
        errors: {
          noProfile: '해당 사용자의 프로필이 존재하지 않습니다.',
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: profile,
        message: '해당 사용자의 프로필 불러오기 성공',
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      errors: {
        noProfile: '등록된 프로필이 없습니다.',
        'error-message': error.message,
      },
    });
  }
});

// MORE:  @유저 프로필 추가 / 수정
//        @route POST api/profile
//        @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //DESC: 작성한 프로필명이 DB에 이미 존재하는지 체크
    const profileName = await Profile.findOne({
      profileName: req.body.profileName,
    });

    //MORE: 유저가 자신의 프로필명을 갱신하는 경우와 유저가 다른이의 프로필명과 중복되는 이름을 설정하는지 구분 필요
    const { errors, isValid } =
      profileName && profileName.user.toString() === req.user.id
        ? validateProfileInput(req.body)
        : validateProfileInput(req.body, profileName);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    //DESC: 프로필 유저 기본 정보 생성
    const profileField = {
      //MORE: 위 Validation을 통한 필수 입력 정보
      user: req.user.id,
      profileName: req.body.profileName,
      skills: req.body.skills.split(','),
      //MORE: 선택 입력 정보 1 [프로필 유저 기본 정보]
      company: req.body.company ? req.body.company : null,
      website: req.body.website ? req.body.website : null,
      location: req.body.location ? req.body.location : null,
      bio: req.body.bio ? req.body.bio : null,
      status: req.body.status ? req.body.status : null,
      githubUsername: req.body.githubUsername ? req.body.githubUsername : null,
      //MORE: 선택 입력 정보 2 [프로필 유저 소셜 미디어 정보]
      social: {
        youtube: req.body.youtube ? req.body.youtube : null,
        twitter: req.body.twitter ? req.body.twitter : null,
        facebook: req.body.facebook ? req.body.facebook : null,
        instagram: req.body.instagram ? req.body.instagram : null,
      },
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //MORE: 기존 프로필이 이미 있는 경우 => 업데이트
      if (profile) {
        //HACK: 상단에서 profile을 이미 findOne 했기 때문에, 다시 query를 별도 지정할 필요 없음
        const updatedProfile = await profile.update(
          { $set: profileField },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          data: updatedProfile,
          message: '프로필 정보 업데이트 완료',
        });
      }

      //MORE: 새로 프로필 정보를 생성하는 경우
      else {
        const newProfile = await new Profile(profileField).save();
        return res.status(201).json({
          success: true,
          data: newProfile,
          message: '프로필 정보 생성 완료',
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
  }
);

// MORE:  @프로필에 경력 추가
//        @route POST api/profile/experience
//        @access Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(404).json({
          success: false,
          errors: {
            noProfile: '해당 프로필이 없습니다.',
          },
        });
      } else {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };

        //TODO: 따로 ODM 으로 업데이트 vs 직접 배열에 추가
        profile.experience.unshift(newExp);

        const newProfile = await profile.save();
        return res.status(200).json({
          success: true,
          data: newProfile,
          message: '프로필 경력 추가 성공',
        });
      }
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: {
          'access-error': error.message,
        },
      });
    }
  }
);

module.exports = router;
