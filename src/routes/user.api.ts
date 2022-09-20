import express from 'express';
import { hash, compare } from 'bcrypt';
import { User, IUser } from '../models/user.model';
import auth from '../middleware/auth';
import errorHandler from './error';
import csv from 'csv-parser';
import multer from 'multer';
import fs from 'fs';
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
} from './user.util';
import { useParams } from 'react-router';

const router = express.Router();
const saltRounds = 10;

const upload = multer({ dest: 'uploads/' });

/* account signup endpoint */
router.post('/signup', async (req, res) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { userType } = req.body;
  const { region } = req.body;
  const { district } = req.body;

  if (await User.findOne({ email })) {
    return errorHandler(res, 'User already exists.');
  }

  // hash + salt password
  return hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return errorHandler(res, err.message);
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType: 'Admin',
      region,
      district,
    });

    return newUser
      .save()
      .then(() => res.status(200).json({ success: true }))
      .catch((e) => errorHandler(res, e.message));
  });
});

/* acccount login endpoint */
router.post('/login', async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const user = await User.findOne({ email });
  // user does not exist
  if (!user) return errorHandler(res, 'User does not exist.');

  return compare(password, user.password, (err, result) => {
    if (err) return errorHandler(res, err.message);

    if (result) {
      // password matched
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return Promise.all([accessToken, refreshToken]).then((tokens) =>
        res.status(200).json({
          success: true,
          accessToken: tokens[0],
          refreshToken: tokens[1],
        })
      );
    }

    // wrong password
    return errorHandler(res, 'User email or password is incorrect.');
  });
});

/* Upload CSV*/
router.post('/uploadCSV', upload.single('file'), async (req, res) => {
  console.log('start');
  const results: any = [];
  //const { email } = req;
  //const user = await User.findOne({ email });

  console.log('HELLO');

  // If the file is somehow a csv (frontend shouldn't allow this), then it will fail.
  if (!(req.file.mimetype === 'text/csv')) {
    return res.status(400).json({ success: false });
  }

  console.log('AFTER IF');

  fs.createReadStream(req.file.path)
    // It will read the 1st column of the CSV as Name, the 2nd column as Email, and so on.
    .pipe(
      csv([
        'firstName',
        'lastName',
        'email',
        'password',
        'userType',
        'region',
        'district',
      ])
    )
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
      // we create a new employee object from the csv data
      // NOTE: many of these are placeholders right now (unspecified behavior)
      results.forEach(async (user: any) => {
        const newUser = new User();
        newUser.email = user.email;
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.password = user.password;
        newUser.userType = user.userType;
        newUser.region = user.region;
        newUser.district = user.district;

        try {
          // upload employee object to MongoDB
          await newUser.save();
          /*
          await User.updateOne(
            { _id: userId },
            { $push: { employees: newEmployee.id } },
            { $push: { surveyIds: surveyId } }
          );
          */
        } catch (err) {
          return errorHandler(res, err);
        }
      });
      // We are deleting the file that was uploaded from the server.
      fs.unlink(req.file.path, (err: any) => {
        if (err) console.error(err);
      });
      return res.status(200).json({ success: true });
    });
});

router.delete('/delete/user', async (req, res) => {
  const userId = req.query.id;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) return errorHandler(res, 'User does not exist.');

    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

/* account jwt token refresh */
router.post('/refreshToken', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorHandler(res, 'No token provided.');
  }

  return validateRefreshToken(refreshToken)
    .then((tokenResponse: IUser) => generateAccessToken(tokenResponse))
    .then((accessToken: string) => {
      res.status(200).json({
        success: true,
        accessToken,
      });
    })
    .catch((err: { code: string; message: string }) => {
      if (err.code) {
        return errorHandler(res, err.message, err.code);
      }
      return errorHandler(res, err.message);
    });
});

/* protected: get my info */
router.get('/me', auth, (req, res) => {
  const { userId } = req;

  return User.findById(userId)
    .select('firstName lastName email _id')
    .then((user) => {
      if (!user) return errorHandler(res, 'User does not exist.');

      return res.status(200).json({ success: true, data: user });
    })
    .catch((err) => errorHandler(res, err.message));
});

/* TESTING ENDPOINTS BELOW (DELETE IN PRODUCTION) */
/* fetch all users in database */
router.get('/', (_, res) => {
  User.find({})
    .then((result) => res.status(200).json({ success: true, result }))
    .catch((e) => errorHandler(res, e));
});

/* delete all users in database */
router.delete('/', (_, res) => {
  User.deleteMany({})
    .then(() => res.status(200).json({ success: true }))
    .catch((e) => errorHandler(res, e));
});

export default router;
