import { generate } from '@ant-design/colors'

/* ROUTES */
export const ADMIN_LANDING_ROUTE = '/'
export const ADMIN_SETTINGS_ROUTE = '/settings'
export const ADMIN_LOGIN_ROUTE = '/login'
export const ADMIN_LOGIN_DEMO = '/login/demo' // new route for demo user
export const ADMIN_MEMBERS_ROUTE = '/members'
export const ADMIN_AUDIENCES_ROUTE = '/audiences'
export const ADMIN_AUDIENCES_SEARCH_ROUTE = '/audienceSearch'

export const LINE_ACCESS_ROUTE = '/line-access'
export const LINE_FRIEND_ROUTE = '/line-friend'
export const NOT_FOUND_ROUTE = '/404'
export const PERMISSION_ERROR_ROUTE = '/401'

export const CLIENT_LOGIN_ROUTE = '/liff/login'
export const CLIENT_REGISTER_ROUTE = '/liff/register'
export const CLIENT_MEMBERSHIP_ROUTE = '/liff/membership'
export const CLIENT_PROFILE_UPDATE_ROUTE = '/liff/update'
export const CLIENT_REGISTRATIONS_ROUTE = '/liff/registrations'

/* PAGES */
export const PAGE_ADMIN_MEMBERS = '会員管理'
export const PAGE_ADMIN_SETTINGS = '設定'
export const PAGE_ADMIN_AUDIENCES = 'オーディエンス'
export const PAGE_CLIENT_LOGIN = 'オーディエンス'

export const ROUTES = [
  { route: ADMIN_SETTINGS_ROUTE, page: PAGE_ADMIN_SETTINGS },
  { route: ADMIN_MEMBERS_ROUTE, page: PAGE_ADMIN_MEMBERS },
  { route: ADMIN_AUDIENCES_ROUTE, page: PAGE_ADMIN_AUDIENCES },
]

/* AUTH TYPE */
export const AUTH_MASTER = 'master'

/* ALERT MESSAGES */
export const ERROR_SYSTEM_MSG = 'システムエラー'
export const ERROR_SESSION_MSG = 'もう一度ログインしてください'
export const ERROR_401_MSG = '許可が足りないです。'
export const ERROR_404_MSG = 'アクセスしたページは存在しません'
export const ERROR_LINE_403_MSG = 'LINEアプリからアクセスしてください'
export const ERROR_LINE_FRIEND_MSG = 'LINEで友だち追加してアクセスしてください'
export const ERROR_ADMIN_LOGIN_MISMATCH_MSG = 'ユーザー名またはパスワードが間違っています'
export const SUCCESS_MESSAGE_SENT_MSG = 'メッセージを送信しました。'
export const WARN_AUDIENCE_NAME_EXIST_MSG = 'このオーディエンス名はすでに存在しています'
export const WARN_AUDIENCE_COUNT_ZERO_MSG = '応募者0人でオーディエンスを作成することはできません'
export const WARN_AUDIENCE_NOT_MATCH_MSG =
  '検索条件が変更されています。一度検索ボタンクリックしてその後作成してください。'
export const WARN_IMAGE_TOO_BIG = '画像サイズが大きすぎます'
export const WARN_IMAGE_SIZE_DIFFERENT = '画像サイズが違います'
export const SUCCESS_LOGIN_MSG = 'ログインしました。'
export const SUCCESS_LOGOUT_MSG = 'ログアウトしました。'
export const SUCCESS_CREATE_MSG = '作成しました。'
export const SUCCESS_REGISTER_MSG = '登録しました。'
export const SUCCESS_ADD_MSG = '追加しました。'
export const SUCCESS_SAVE_MSG = '保存しました。'
export const SUCCESS_DELETE_MSG = '削除しました。'
export const SUCCESS_CANCEL_MSG = 'キャンセルしました。'
export const SUCCESS_UPLOAD_MSG = 'アプロードしました。'
export const SUCCESS_UPDATE_MSG = '保存しました。'
export const WARN_POSTAL_CODE_WRONG_MSG = 'システムエラー'
export const INFO_CAMERA_PERMISSION_MSG = 'カメラの許可をお願いします'
export const WARN_MEMBER_CODE_NOT_EXIST_MSG = 'この会員コードを持つユーザーはありません'
export const ERROR_EMAIL_UNIQUE_MSG = 'このメールアドレスはすでに登録されています'

/* RESPONSE TYPE */
export const RESPONSE_PERMISSION_ERROR = 401
export const RESPONSE_SESSION_ERROR = 403
export const RESPONSE_NOT_ACCEPTABLE_ERROR = 406
export const RESPONSE_CONFLICT_ERROR = 409
export const RESPONSE_SYSTEM_ERROR = 500

/* MESSAGE KEY */
export const MESSAGE_SESSION_ERROR_KEY = 'SESSION_ERROR'
export const MESSAGE_SYSTEM_ERROR_KEY = 'SYSTEM_ERROR'

/* SYSTEM TYPE */
export const DEFAULT_SYSTEM_TYPE = 'イベント'

// SCREEN SIZE
export const XL_SCREEN_SIZE = 1224
export const LG_SCREEN_SIZE = 992
export const MD_SCREEN_SIZE = 768
export const SM_SCREEN_SIZE = 576

/* FORM SCROLL CONFIG */
export const FORM_SCROLL_CONFIG = {
  behavior: 'smooth',
  block: 'top',
  inline: 'center',
}

/* THEME COLOR */
export const PRIMARY_COLOR = '#99CA29'
export const PRIMARY_LIGHT_COLOR = '#fdfff0'
export const SECONDARY_COLOR = '#21acd7'
export const SECONDARY_LIGHT_COLOR = '#f0feff'
export const THIRD_COLOR = '#fa8c16'
export const THIRD_LIGHT_COLOR = '#fff7e6'
export const CUSTOM_GREEN = '#8ac926'
export const CUSTOM_LIGHT_GREEN = '#fcfff0'
export const CUSTOM_RED = '#ff595e'
export const CUSTOM_LIGHT_RED = '#fff2f0'
export const CUSTOM_YELLOW = '#FAD717'
export const CUSTOM_LIGHT_YELLOW = '#FEFBE8'
export const CUSTOM_GRAY_COLOR = '#d9d9d9'
export const CUSTOM_CAMPAIGN_COLOR = '#960E0E'
export const GRAY_COLOR = '#9CA3AF'
export const WHITE_COLOR = '#FFF'
export const BLACK_COLOR = '#000'
export const SATURDAY_COLOR = '#00c2ff'
export const SUNDAY_COLOR = '#c40055'

/* MESSAGE TYPE */
export const MESSAGE_TYPE_TEXT = 'text'
export const MESSAGE_TYPE_IMAGE = 'image'
export const MESSAGE_TYPE_AUDIO = 'audio'
export const MESSAGE_TYPE_VIDEO = 'video'
export const MESSAGE_TYPE_FILE = 'file'

export function COLOR_ADJUST(color: any, amount: number) {
  const colors = generate(color)

  return colors[amount - 100] || colors[0]
}

export const ANIMATION_VARIANT_STAGGER_CONTAINER = {
  hidden: {
    transition: {
      staggerChildren: 0.01,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
  show: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: 1,
      when: 'beforeChildren',
    },
  },
}

export const ANIMATION_VARIANT_STAGGER_ITEM = {
  hidden: {
    opacity: 0,
    transition: { type: 'linear' },
  },
  show: {
    opacity: 1,
    transition: { type: 'linear' },
  },
}

export const PREFECTURES = [
  { value: 1, label: '北海道' },
  { value: 2, label: '青森県' },
  { value: 3, label: '岩手県' },
  { value: 4, label: '宮城県' },
  { value: 5, label: '秋田県' },
  { value: 6, label: '山形県' },
  { value: 7, label: '福島県' },
  { value: 8, label: '茨城県' },
  { value: 9, label: '栃木県' },
  { value: 10, label: '群馬県' },
  { value: 11, label: '埼玉県' },
  { value: 12, label: '千葉県' },
  { value: 13, label: '東京都' },
  { value: 14, label: '神奈川県' },
  { value: 15, label: '新潟県' },
  { value: 16, label: '富山県' },
  { value: 17, label: '石川県' },
  { value: 18, label: '福井県' },
  { value: 19, label: '山梨県' },
  { value: 20, label: '長野県' },
  { value: 21, label: '岐阜県' },
  { value: 22, label: '静岡県' },
  { value: 23, label: '愛知県' },
  { value: 24, label: '三重県' },
  { value: 25, label: '滋賀県' },
  { value: 26, label: '京都府' },
  { value: 27, label: '大阪府' },
  { value: 28, label: '兵庫県' },
  { value: 29, label: '奈良県' },
  { value: 30, label: '和歌山県' },
  { value: 31, label: '鳥取県' },
  { value: 32, label: '島根県' },
  { value: 33, label: '岡山県' },
  { value: 34, label: '広島県' },
  { value: 35, label: '山口県' },
  { value: 36, label: '徳島県' },
  { value: 37, label: '香川県' },
  { value: 38, label: '愛媛県' },
  { value: 39, label: '高知県' },
  { value: 40, label: '福岡県' },
  { value: 41, label: '佐賀県' },
  { value: 42, label: '長崎県' },
  { value: 43, label: '熊本県' },
  { value: 44, label: '大分県' },
  { value: 45, label: '宮崎県' },
  { value: 46, label: '鹿児島県' },
  { value: 47, label: '沖縄県' },
]
export const THEME_COLORS = [
  '#99CA29',
  '#EA638C',
  '#DB5461',
  '#BB3E03',
  '#E85D75',
  '#C76D7E',
  '#AB92BF',
  '#8D6B94',
  '#4EA5D9',
  '#134074',
  '#005F73',
  '#8DA9C4',
  '#72A1E5',
  '#0A9396',
  '#84A07C',
  '#3C787E',
  '#77878B',
  '#9a8c98',
  '#9F8082',
  '#b5838d',
  '#6d6875',
  '#30343F',
  '#2E382E',
]
export const GENDER = [
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
]
export const GET_GENDER_BY_VALUE = (value: string) => {
  switch (value) {
    case 'male':
      return '男性'
    case 'female':
      return '女性'
    default:
      return 'ー'
  }
}

export const PREFERENCETYPES = [
  { value: 'buy', label: '買いたい' },
  { value: 'lend', label: '貸したい' },
  { value: 'borrow', label: '借りたい' },
  { value: 'sell', label: '売りたい' },
]
