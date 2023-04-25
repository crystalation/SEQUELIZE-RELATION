// routes/users.route.js

const express = require('express');
const { Users, UserInfos } = require('../models');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 회원가입
router.post('/users', async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      name,
      age,
      gender,
      profileImage,
    } = req.body;
    const isExistUser = await Users.findOne({ where: { email } });

    //이미 가입되어 있을 때
    if (isExistUser) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    //닉네임 길이 제한
    if (name.length < 3) {
      res
        .status(412)
        .json({ errorMessage: '닉네임 형식이 일치하지 않습니다.' });
      return;
    }

    //닉네임 형식
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (!nameRegex.test(name)) {
      res
        .status(412)
        .json({ errorMessage: '닉네임 형식이 일치하지 않습니다.' });
      return;
    }

    //닉네임 4자리 이상, 닉네임과 같은 값 포함
    if (password.length < 4 || password.includes(name)) {
      res
        .status(412)
        .json({ errorMessage: '패스워드에 닉네임이 포함되어있습니다.' });
      return;
    }

    //비번 재확인
    if (password !== confirmPassword) {
      res.status(412).json({
        errorMessage: '확인용 패스워드가 일치하지 않습니다.',
      });
      return;
    }
    //Users 테이블에 사용자를 추가합니다.

    const user = await Users.create({ email, password });
    // UserInfos 테이블에 사용자 정보를 추가합니다.
    const userInfo = await UserInfos.create({
      UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
      name,
      age,
      gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
      profileImage,
    });

    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: '회원가입에 실패하였습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    //사용자가 존재하는지 찾아보자
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: '닉네임 또는 패스워드를 확인해주세요.' });
    } else if (user.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    //jwt를 생성하고
    const token = jwt.sign({ userId: user.userId }, 'customized_secret_key'); //user안에 있는 userId,
    //쿠키를 발급
    res.cookie('authorization', `Bearer ${token}`);
    //response할당
    return res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: '서버 에러' });
  }
});

// 사용자 조회
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  const user = await Users.findOne({
    where: { userId },
    attributes: ['userId', 'email', 'createdAt', 'updatedAt'],
    include: [
      {
        model: UserInfos, // 1:1 관계를 맺고있는 UserInfos 테이블을 조회합니다.
        attributes: ['name', 'age', 'gender', 'profileImage'],
      },
    ],
  });

  return res.status(200).json({ data: user });
});

module.exports = router;
