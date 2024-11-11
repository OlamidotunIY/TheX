import { body, check } from "express-validator";

const registerValidation = [
    body("username").notEmpty().withMessage("Username is required"),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body("password").notEmpty().withMessage("Password is required")
];

const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body("password").notEmpty().withMessage("Password is required")
];

const changePasswordValidation = [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required")
];

const updateProfileValidation = [
    body().custom((value, { req }) => {
        let allowedFields = ["fullname", "profilePicture"];
        for (let key in req.body) {
            if (!allowedFields.includes(key)) {
                throw new Error(`${key} Can not be updated`);
            }
        }
        return true;
    }),
];

export default { 
    registerValidation, loginValidation,
    changePasswordValidation, updateProfileValidation 
};