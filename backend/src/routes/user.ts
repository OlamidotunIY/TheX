import express from 'express';
import UserController from '../controller/user';
import Validation from '../validation/user';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', 
    Validation.registerValidation,
    UserController.register
);
router.post('/login', 
    Validation.loginValidation,
    UserController.login
);
router.get('/profile', 
    auth,
    UserController.getProfile
);
router.patch('/change-password', 
    auth,
    Validation.changePasswordValidation,
    UserController.changePassword
);
router.patch('/update-profile', 
    auth,
    Validation.updateProfileValidation,
    UserController.updateProfile
);

export default router;