import { db } from '../models'

const getManager = db.Manager.getManager

const findManagerByUsername = db.Manager.findManagerByUsername

export default { getManager, findManagerByUsername }
