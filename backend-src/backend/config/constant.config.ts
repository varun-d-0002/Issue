// import type { IAuth, richmenuType } from '../../types'

export const AUTH_LEVELS: Record<IAuth, IAuth> = {
	master: 'master',
	manager: 'manager'
}

export const RICHMENU_HEIGHT = 810
export const RICHMENU_WIDTH = 1200
export const RICHMENU_AREA_BIG_HEIGHT = 810
export const RICHMENU_AREA_BIG_WIDTH = 800
export const RICHMENU_AREA_SMALL_HEIGHT = 405
export const RICHMENU_AREA_SMALL_WIDTH = 400

export const RICHMENU_TYPES = ['defaultRM', 'memberRM'] as richmenuType[]

export const API_TIMEOUT = 3000 //10000;

export const RESPONSE_SUCCESS = 200
export const BAD_REQUEST = 400
export const PERMISSION_ERROR = 401 //not enough authorization
export const SESSION_ERROR = 403 //no-session
export const NOT_ACCEPTABLE = 406 //not acceptable
export const CONFLICT_ERROR = 409
export const TOO_MANY_REQUESTS = 429
export const SYSTEM_ERROR = 500

export const MEMBER_WATCH_MESSAGE = '新規登録の通知です！\n会員：[NAME]'

export const WATCH_MESSAGE_KEY_MEMBER = 'watchMemberTemplate'

export const SERVICE_AREAS = ['小牧市', '豊山町', '名古屋市', '北名古屋市', '岩倉市', '春日井市', 'その他']
export const SERVICE_TYPES = ['buy', 'lend', 'borrow', 'sell']
