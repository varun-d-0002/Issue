import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	CreationAttributes,
	Op,
	Transaction
} from 'sequelize'
import { sequelize } from './database'

interface systemSettingType {
	label: string
	valueFlag: boolean | null
	valueString: string | null
	valueNumber: number | null
}
class SystemSettingModel extends Model<
	InferAttributes<SystemSettingModel>,
	InferCreationAttributes<SystemSettingModel>
> {
	//ATTRIBUTES
	declare name: string
	declare label: string
	declare valueFlag: boolean | null
	declare valueString: string | null
	declare valueNumber: number | null
	declare accessCategory: CreationOptional<0 | 1 | 2> // 0 - public, 1 - admin, 2 - system internal

	static PUBLIC_ACCESS = 0 as const
	static ADMIN_ACCESS = 1 as const
	static INTERNAL_ACCESS = 2 as const
	//ASSOCIATIONS

	//METHODS
	static findSettings = async (key: string, transaction?: Transaction) =>
		SystemSettingModel.findOne({
			where: {
				name: key,
				accessCategory: { [Op.in]: [this.PUBLIC_ACCESS, this.ADMIN_ACCESS] }
			},
			transaction
		})

	static getSettings = async () =>
		SystemSettingModel.findAll({
			where: { accessCategory: { [Op.in]: [this.PUBLIC_ACCESS, this.ADMIN_ACCESS] } }
		}).then(SystemSettingModel.settingName)

	static updateSettingsInBulk = async (
		settings: CreationAttributes<SystemSettingModel>[],
		transaction?: Transaction
	) =>
		SystemSettingModel.bulkCreate(settings, {
			updateOnDuplicate: ['label', 'valueFlag', 'valueNumber', 'valueString', 'accessCategory'],
			transaction
		})

	static findPublicSettings = async () =>
		SystemSettingModel.findAll({ where: { accessCategory: this.PUBLIC_ACCESS } }).then(
			SystemSettingModel.settingName
		)

	static createSettings = async (params: CreationAttributes<SystemSettingModel>) => SystemSettingModel.create(params)

	static deleteSettings = async (key: string) => SystemSettingModel.destroy({ where: { name: key } })

	//FAVICON
	static findFavicon = async () => {
		const favicon = await SystemSettingModel.findOne({ where: { name: 'favicon' }, attributes: ['valueString'] })
		return favicon?.valueString ?? null
	}
	//LOGO
	static findLogo = async () => {
		const logo = await SystemSettingModel.findOne({ where: { name: 'logo' }, attributes: ['valueString'] })
		return logo?.valueString ?? null
	}

	static findStorePic = async () => {
		const storePic = await SystemSettingModel.findOne({ where: { name: 'storePic' }, attributes: ['valueString'] })
		return storePic?.valueString ?? null
	}

	private static settingName(settings: SystemSettingModel[]) {
		const result: Record<string, systemSettingType> = {}
		for (const ps of settings) {
			const key = ps.name
			// eslint-disable-next-line security/detect-object-injection
			result[key] = {
				label: ps.label,
				valueFlag: ps.valueFlag,
				valueString: ps.valueString,
				valueNumber: ps.valueNumber
			}
		}
		return result
	}
}

SystemSettingModel.init(
	{
		name: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false },
		label: { type: DataTypes.STRING(50), allowNull: false },
		valueFlag: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: null },
		valueString: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
		valueNumber: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
		accessCategory: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 }
	},
	{
		sequelize: sequelize,
		timestamps: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'systemSettings',
		modelName: 'SystemSetting',
		name: {
			singular: 'SystemSetting',
			plural: 'systemSettings'
		}
	}
)
export default SystemSettingModel
