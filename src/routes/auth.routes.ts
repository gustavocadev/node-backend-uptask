import { Router } from 'express'
import { check } from 'express-validator'
import {
	signIn,
	verifyToken,
	reqResetPassword,
	verifyTokenPassword,
	createNewPassword,
} from '../controllers'
import { validateErrors } from '../helpers'

const router = Router()

// POST /auth/login
router.post('/login', signIn)

// verify token to confirm account
router.get('/verify/:token', verifyToken)

// forgot password
router.post('/reset-password', reqResetPassword)

/// verify token to reset password
router.get('/reset-password/:token', verifyTokenPassword)

// reset password
router.post(
	'/reset-password/:token',
	[check('password', 'password is too short').isLength({ min: 6 }), validateErrors],
	createNewPassword
)
export default router
