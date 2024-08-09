import axios from 'axios'

export const SITE_URL = import.meta.env.VITE_API_URL

export const BASE_URL = `${SITE_URL}/api`
export const UPLOADS_URL = `${SITE_URL}/uploads`
export const MESSAGE_STORAGE_URL = `${SITE_URL}/storage/line`
export const POSTAL_CODE_URL = 'https://yubinbango.github.io/yubinbango-data/data'

/* BACKEND API URLS */
export const API_ADMIN_AUTH = `${BASE_URL}/auth`
export const API_ADMIN_LOGIN = `${API_ADMIN_AUTH}/login`
export const API_ADMIN_LOGIN_DEMO = `${API_ADMIN_AUTH}/login/demo` // new api for getting credentials
export const API_ADMIN_LOGIN_DEMO_USER = `${API_ADMIN_AUTH}/login/demo` // new api call for demo user
export const API_ADMIN_LOGOUT = `${API_ADMIN_AUTH}/logout`
export const API_ADMIN_AUTH_CHECK = `${API_ADMIN_AUTH}/auth`
export const API_ADMIN_CHECK_SESSION = `${API_ADMIN_AUTH}/sess`
export const SETTINGS_UPLOADS_URL = `${SITE_URL}/uploads/`
export const API_UPLOADS = `${SITE_URL}/uploads/settings/`
export const API_ADMIN_RICHMENUS = `${BASE_URL}/m/richmenus`
export const API_ADMIN_SETTINGS = `${BASE_URL}/m/settings`
export const API_ADMIN_AUDIENCES = `${BASE_URL}/m/audiences`
export const API_ADMIN_MEMBERS = `${BASE_URL}/m/members`
export const API_ADMIN_CHATS = `${BASE_URL}/m/members/chats`
export const API_ADMIN_SPECTATORS = `${BASE_URL}/m/spectators`
export const API_CLIENT = `${BASE_URL}/liff`

/* QUERY KEY */
export const QUERY_KEY_ADMIN_AUTH = 'ADMIN_AUTH'
export const QUERY_KEY_ADMIN_CHECK_SESSION = 'ADMIN_CHECK_SESSION'
export const QUERY_KEY_ADMIN_RICHMENUS = 'ADMIN_RICHMENUS'
export const QUERY_KEY_ADMIN_MEMBERS = 'ADMIN_MEMBERS'
export const QUERY_KEY_ADMIN_AUDIENCES = 'ADMIN_AUDIENCES'
export const QUERY_KEY_ADMIN_PUBLIC_SETTINGS = 'ADMIN_PUBLIC_SETTINGS'
export const QUERY_KEY_ADMIN_SPECTATOR_CANDIDATES = 'ADMIN_SPECTATOR_CANDIDATES'
export const QUERY_KEY_CLIENT_PERSONAL_INFO = 'CLIENT_PERSONAL_INFO'
export const QUERY_KEY_ADMIN_SPECTATORS = 'ADMIN_SPECTATORS'
export const QUERY_KEY_LOGO = 'LOGO'
export const QUERY_KEY_ADMIN_CHATS = 'ADMIN_CHATS'
export const QUERY_KEY_FAVICON = 'FAVICON'
export const QUERY_KEY_STORE_PIC = 'STORE_PIC'
export const QUERY_KEY_PUBLIC_SETTINGS = 'PUBLIC_SETTINGS'
export const QUERY_KEY_PUBLIC_HOLIDAYS = 'PUBLIC_HOLIDAYS'
/* SETTINGS KEY */
export const SETTINGS_KEY_SYSTEM_COLOR = 'systemColor'
export const SETTINGS_KEY_SYSTEM_TITLE = 'systemTitle'
export const SETTINGS_KEY_ADMIN_MESSAGE_MEMBER = 'watchMemberTemplate'

/* SOCKET PATH */
export const SOCKET_PATH = '/socket.io'

/* AXIOS CONFIG */
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 10000,
})

/* BACKEND API REQUESTS */
export async function ADMIN_LOGIN(data: any) {
  return await axiosInstance.post(API_ADMIN_LOGIN, data)
}

//new api call for demo user
export async function ADMIN_LOGIN_DEMO(data: any) {
  return await axiosInstance.get(API_ADMIN_LOGIN_DEMO, data)
}
export async function ADMIN_LOGIN_DEMO_USER(data: any) {
  return await axiosInstance.post(API_ADMIN_LOGIN_DEMO_USER, data)
}
export async function ADMIN_LOGOUT() {
  return await axiosInstance.get(API_ADMIN_LOGOUT)
}
export async function ADMIN_CHECK_SESSION() {
  return await axiosInstance.get(API_ADMIN_CHECK_SESSION)
}
export async function ADMIN_GET_AUTH() {
  return await axiosInstance.get(API_ADMIN_AUTH_CHECK)
}
export async function GET_LOGO() {
  return await axiosInstance.get(BASE_URL + '/logo')
}

export async function GET_FAVICON() {
  return await axiosInstance.get(BASE_URL + '/favicon')
}

export async function ADMIN_UPLOAD_FAVICON(favicon: string) {
  const headerData = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  }

  const formData = new FormData()
  formData.append('picUrl', favicon)

  return await axiosInstance.put(BASE_URL + '/m/favicon', formData, headerData)
}
export async function ADMIN_UPLOAD_LOGO(logo: File) {
  const headerData = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  }

  const formData = new FormData()
  formData.append('picUrl', logo)

  return await axiosInstance.put(BASE_URL + '/m/logo', formData, headerData)
}

export async function GET_STORE_PIC() {
  return await axiosInstance.get(BASE_URL + '/store/pic')
}

export async function GET_PUBLIC_SETTINGS() {
  return await axiosInstance.get(BASE_URL + '/settings')
}

export async function ADMIN_UPLOAD_STORE_PIC(logo: File) {
  const headerData = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  }

  const formData = new FormData()
  formData.append('picUrl', logo)

  return await axiosInstance.put(BASE_URL + '/m/store/pic', formData, headerData)
}

export async function ADMIN_GET_MEMBERS(
  paginationPerPage: number,
  paginationPage: number,
  paginationSort: string,
  paginationSortKey: string,
  filterFullName: undefined,
  filterGender: undefined,
  filterAgeMin: undefined,
  filterAgeMax: undefined,
  filterTelephone: undefined,
  filterOccupation: undefined,
  filterCountVisitMin: undefined,
  filterCountVisitMax: undefined,
  filterLastVisitMin: undefined,
  filterLastVisitMax: undefined,
  filterAddress: undefined,
  filterLineFriend: undefined,
  filterServiceTypes: undefined,
  filterServiceAreas: undefined,
) {
  const paramData = {
    params: {
      perPage: paginationPerPage,
      page: paginationPage,
      sort: paginationSort,
      sortKey: paginationSortKey,
      name: filterFullName,
      gender: filterGender,
      dateOfBirthMin: filterAgeMin,
      dateOfBirthMax: filterAgeMax,
      telephone: filterTelephone,
      occupation: filterOccupation,
      countVisitMin: filterCountVisitMin,
      countVisitMax: filterCountVisitMax,
      lastVisitMin: filterLastVisitMin,
      lastVisitMax: filterLastVisitMax,
      address: filterAddress,
      isFriends: filterLineFriend,
      serviceTypes: filterServiceTypes,
      serviceAreas: filterServiceAreas,
    },
  }

  return await axiosInstance.get(API_ADMIN_MEMBERS, paramData)
}
export async function ADMIN_GET_MEMBER(data: { memberId: string }) {
  return await axiosInstance.get(API_ADMIN_MEMBERS + '/' + data.memberId)
}
export async function ADMIN_DELETE_MEMBER(data: { memberId: string }) {
  return await axiosInstance.delete(API_ADMIN_MEMBERS + '/' + data.memberId)
}

export async function GET_ADMIN_PUBLIC_SETTINGS() {
  return await axiosInstance.get(BASE_URL + '/m/settings')
}
export async function ADMIN_RENEW_MEMBER(data: { memberId: string }) {
  return await axiosInstance.put(API_ADMIN_MEMBERS + '/' + data.memberId, data)
}

export async function ADMIN_CHECK_MEMBER(data: any) {
  return await axiosInstance.post(API_ADMIN_MEMBERS + '/barcode', data)
}

export async function ADMIN_UPDATE_SETTINGS_BATCH(data: any) {
  return await axiosInstance.put(API_ADMIN_SETTINGS, data)
}

// @ts-ignore
export async function ADMIN_UPDATE_PUBLIC_SETTINGS(data) {
  return await axiosInstance.put(API_ADMIN_SETTINGS + '/' + data.key, data)
}
export async function ADMIN_REMOVE_SPECTATOR(data: { spectatorId: string }) {
  return await axiosInstance.delete(API_ADMIN_SPECTATORS + '/' + data.spectatorId)
}

export async function ADMIN_GET_RICHMENUS() {
  return await axiosInstance.get(API_ADMIN_RICHMENUS)
}

export async function ADMIN_UPDATE_RICHMENU(data: { [x: string]: string | Blob }) {
  const headerData = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  }

  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })

  return await axiosInstance.put(API_ADMIN_RICHMENUS, formData, headerData)
}

export async function ADMIN_UPDATE_RICHMENU_VISIBILITY(data: any) {
  return await axiosInstance.put(API_ADMIN_RICHMENUS + '/props', data)
}

export async function ADMIN_DELETE_RICHMENU(data: { type: any }) {
  const param = {
    data: {
      type: data.type,
    },
  }

  return await axiosInstance.delete(API_ADMIN_RICHMENUS, param)
}

export async function ADMIN_GET_AUDIENCES() {
  return await axiosInstance.get(API_ADMIN_AUDIENCES)
}
export async function ADMIN_CREATE_AUDIENCE(data: any) {
  return await axiosInstance.post(API_ADMIN_AUDIENCES, data)
}

export async function ADMIN_DELETE_AUDIENCE(data: { audienceGroupId: string }) {
  return await axiosInstance.delete(API_ADMIN_AUDIENCES + '/' + data.audienceGroupId)
}
export async function ADMIN_SEARCH_AUDIENCE_MEMBERS(data: any) {
  return await axiosInstance.post(API_ADMIN_AUDIENCES + '/find', data)
}

export async function ADMIN_GET_CHATS(member: { memberId: string }) {
  return await axiosInstance.get(API_ADMIN_CHATS + '/' + member?.memberId)
}

export async function ADMIN_SEND_CHAT(data: { memberId: string }) {
  return await axiosInstance.post(API_ADMIN_CHATS + '/' + data.memberId, data)
}
export async function ADMIN_GET_SPECTATOR_CANDIDATES() {
  const paramData = {
    params: {},
  }

  return await axiosInstance.get(API_ADMIN_SPECTATORS + '/candidates', paramData)
}

export async function ADMIN_GET_SPECTATORS() {
  return await axiosInstance.get(API_ADMIN_SPECTATORS)
}
export async function ADMIN_ADD_SPECTATOR(data: any) {
  return await axiosInstance.post(API_ADMIN_SPECTATORS, data)
}

export const GET_ADDRESS_BY_POSTAL_CODE = async (postalCode: any) => {
  const p3 = postalCode.substr(0, 3)

  return await fetch(`${POSTAL_CODE_URL}/${p3}.js`)
    .then((response) => response.text())
    .then((text) => text)
    .catch(() => {})
}

////CLIENTS SIDE

export async function CLIENT_GET_PERSONAL_INFO(accessToken: any) {
  const headerData = { headers: { 'access-token': accessToken } }

  return await axiosInstance.get(API_CLIENT + '/personal', headerData)
}

export async function CLIENT_REGISTER_PROFILE(data: { accessToken: any }) {
  const headerData = {
    headers: { 'access-token': data.accessToken },
  }

  return await axiosInstance.put(API_CLIENT + '/personal', data, headerData)
}
export async function CLIENT_UPDATE_PROFILE(data: { accessToken: any }) {
  const headerData = {
    headers: {
      'access-token': data.accessToken,
    },
  }

  return await axiosInstance.put(API_CLIENT + '/personal', data, headerData)
}
///COMMON

/* SOCKET LABEL */
export const SOCKET_SYSTEM_SETTING = 'systemSetting'
export const SOCKET_FAVICON = 'favicon'
export const SOCKET_LOGO = 'logo'
export const SOCKET_STORE_PIC = 'storePic'
export const SOCKET_CATEGORY = 'category'
export const SOCKET_TEMPLATE = 'template'
export const SOCKET_OCCASION = 'occasion'
export const SOCKET_OCCURRENCE = 'occurrence'
export const SOCKET_REGISTRATION = 'registration'
export const SOCKET_MEMBER = 'member'
export const SOCKET_CHAT = 'chat'
export const SOCKET_AUDIENCE = 'audience'
/* SETTINGS LABEL */
export const SETTINGS_LABEL_SYSTEM_COLOR = 'システム色'
export const SETTINGS_LABEL_SYSTEM_TITLE = 'システムタイトル'
export const SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_TITLE = '予約画面タイトル'
export const SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_SUBTITLE = '予約画面サブタイトル'
export const SETTINGS_LABEL_ADMIN_MESSAGE_MEMBER = '新規メンバーメッセージ'
