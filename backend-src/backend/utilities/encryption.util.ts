import bcrypt from 'bcryptjs'
import { generate } from 'generate-password'
import jwt from 'jsonwebtoken'
import { systemConfig } from '../config'
const saltRounds = 10
const signJWT = (data: string | object | Buffer, key = systemConfig.ENC_SEC as string) => jwt.sign(data, key)

const verifyJWT = (token: string, key: string, options?: jwt.VerifyOptions & { complete: true }) =>
	jwt.verify(token, key, options) as jwt.JwtPayload

const createHash = async (data: string): Promise<string> => bcrypt.hash(data, saltRounds)

const comparePassword = async (data: string, hash: string): Promise<boolean> => bcrypt.compare(data, hash)

const generateToken = (length = 32) => generate({ length: length, numbers: true })

export default { signJWT, verifyJWT, createHash, comparePassword, generateToken }
