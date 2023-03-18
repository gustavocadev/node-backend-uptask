import { Request, Response } from 'express'
import { UserModel } from '../models/User'
import { RequestWithUser, UserType } from '../types/types'
import bcryptjs from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { emailRegister } from '../helpers/email'

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await UserModel.find().lean()
		res.json(users)
	} catch (error) {
		console.log(error)
	}
}

export const createUser = async (req: Request<{}, {}, UserType>, res: Response) => {
	try {
		// destructuring the req.body
		const { name, email, password, ...body } = req.body

		// Hash password
		const salt = await bcryptjs.genSalt(10)
		const passwordHashed = await bcryptjs.hash(password, salt)

		// Create user
		const newUser = {
			name,
			email,
			password: passwordHashed,
			token: randomUUID(),
		}

		// create the model instance
		const user = new UserModel(newUser)

		// Save user
		await user.save()

		// Send email to confirm the account
		emailRegister({
			email: user.email,
			name: user.name,
			token: user.token!,
		})

		// Send response
		res.json({
			msg: 'Usuario creado correctamente, now you need to check your email to activate your account',
		})
	} catch (error) {
		console.log(error)
	}
}

export const userProfile = async (req: RequestWithUser, res: Response) => {
	try {
		res.json(req.user)
	} catch (error) {
		console.log(error)
	}
}

export const confirmUser = async (req: Request, res: Response) => {
	const { token } = req.params

	const userConfirm = await UserModel.findOne({ token })

	if (!userConfirm) {
		return res.json({
			msg: 'Token not found or token was already used',
		})
	}

	try {
		userConfirm.token = ''
		userConfirm.isconfirm = true
		await userConfirm.save()

		res.json({
			msg: 'User confirmed correctamente!',
		})
	} catch (error) {
		console.log(error)
		res.json({
			msg: 'Error al confirmar el usuario',
		})
	}
}

export const seedUsers = async (req: Request, res: Response) => {
	// delete all users
	await UserModel.deleteMany({})

	res.json({
		msg: 'Users deleted',
	})
}
