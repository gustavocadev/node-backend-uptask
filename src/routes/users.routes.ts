import { Router } from 'express'
import { getUsers, createUser, userProfile, seedUsers, confirmUser } from '../controllers'
import { check } from 'express-validator'
import { isEmailAvailable, validateErrors } from '../helpers/validators'
import { isAuth } from '../middlewares'

const router = Router()
// GET /users
router.get('/', getUsers)

router.get('/confirm/:token', confirmUser)

// POST /users
router.post('/', [check('email').custom(isEmailAvailable), validateErrors], createUser)

router.get('/profile', isAuth, userProfile)

router.get('/seed', seedUsers)

export default router
