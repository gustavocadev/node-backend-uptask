import nodemailer from 'nodemailer'

type EmailRegisterProps = {
	email: string
	name: string
	token: string
}

export const emailRegister = async (payload: EmailRegisterProps) => {
	const { email, name, token } = payload

	const transport = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: process.env.EMAIL_PORT ?? 2525,
		auth: {
			user: process.env.EMAIL_USER ?? '',
			pass: process.env.EMAIL_PASS ?? '',
		},
	})

	// Infomacion del email
	const info = await transport.sendMail({
		from: '"Fred Foo 👻" <>', // sender address
		to: email,
		subject: 'Hello ✔ - Lets confirm your account', // Subject line
		text: 'Hello world?', // plain text body
		html: `<b>Hello ${name}</b> <a href="http://localhost:5173/confirm/${token}">Confirm your account</a>
    <p>Or copy and paste this link in your browser: http://localhost:5173/confirm/${token}</p>
    `, // html body
	})
}

export const emailResetPassword = async (payload: EmailRegisterProps) => {
	const { email, name, token } = payload

	// todo: move to env variables
	const transport = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: process.env.EMAIL_PORT ?? 2525,
		auth: {
			user: process.env.EMAIL_USER ?? '',
			pass: process.env.EMAIL_PASS ?? '',
		},
	})

	// Infomacion del email
	const info = await transport.sendMail({
		from: '"Shaggy Foo 👻" <>', // sender address
		to: email,
		subject: 'Hello ✔ - Lets reset your password', // Subject line
		text: 'Hello world?', // plain text body
		html: `<b>Hello ${name}</b> <a href="http://localhost:5173/forgot-password/${token}">Reset your account</a>
    <p>Or copy and paste this link in your browser: http://localhost:5173/forgot-password/${token}</p>
    `, // html body
	})
}
