import { useEffect, useRef } from 'react'
import { Tag } from 'antd'

export const GET_ROUTE_BY_KEY = (routes: any[], key: string | undefined) => {
  return routes.find((r: { page: any }) => r?.page === key)?.route
}

export const GET_SELECTED_KEY_BY_ROUTE = (routes: any[], route: string | any[]) => {
  return routes
    .filter((r: { isSubMenu: any }) => !r?.isSubMenu)
    ?.find((r: { route: any }) => route?.includes(r?.route))?.page
}

export const GET_OPEN_KEY_BY_ROUTE = (routes: any[], route: string | any[]) => {
  return routes
    .filter((r: { isSubMenu: any }) => r?.isSubMenu)
    ?.find((r: { route: any }) => route?.includes(r?.route))?.page
}

export const USE_IS_MOUNTED_REF = () => {
  const isMountedRef = useRef<React.ReactNode>(null)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  })

  return isMountedRef
}

export const GET_AUDIENCE_STATUS = (value: audienceStatusType): React.ReactNode => {
  switch (value) {
    case 'IN_PROGRESS':
      return (
        <Tag color='#fcbf49' className='mr-0'>
          作成中
        </Tag>
      )
    case 'READY':
      return (
        <Tag color='#06d6a0' className='mr-0'>
          完成
        </Tag>
      )
    case 'FAILED':
      return (
        <Tag color='#ff6b6b' className='mr-0'>
          エラー
        </Tag>
      )
    case 'EXPIRED':
      return (
        <Tag color='#f77f00' className='mr-0'>
          期限切れ
        </Tag>
      )
    case 'INACTIVE':
      return (
        <Tag color='#38a3a5' className='mr-0'>
          無効
        </Tag>
      )
    case 'ACTIVATING':
      return (
        <Tag color='#52b788' className='mr-0'>
          有効化中
        </Tag>
      )
    default:
      break
  }
}
