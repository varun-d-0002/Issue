import React, { useEffect, useRef, useState } from 'react'

import { ConfigProvider, Layout, Spin } from 'antd'
import * as API from 'common/api'
import * as COMMONS from 'common/constant'
import * as UTILITY from 'common/utility'
import { io } from 'socket.io-client'
import BaseAnimation from '../../components/common/BaseAnimation'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
const { Content } = Layout

const Minimal = (props: Props) => {
  const { children } = props

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const queryClient = useQueryClient()
  const [logo, setLogo] = useState(undefined)
  const [favicon, setFavicon] = useState(undefined)
  const [storePic, setStorePic] = useState(undefined)
  const [publicSettings, setPublicSettings] = useState({
    PRIMARY_COLOR: COMMONS.PRIMARY_COLOR,
    PRIMARY_LIGHT_COLOR: COMMONS.PRIMARY_LIGHT_COLOR,
    TITLE: import.meta.env.VITE_SYSTEM_TITLE || '',
  })

  useQuery([API.QUERY_KEY_LOGO], () => API.GET_LOGO(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setLogo(response.data)
        }
      }
    },
  })

  useQuery([API.QUERY_KEY_FAVICON], () => API.GET_FAVICON(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setFavicon(response.data)
        }
      }
    },
  })

  useQuery([API.QUERY_KEY_STORE_PIC], () => API.GET_STORE_PIC(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setStorePic(response.data)
        }
      }
    },
  })

  useQuery([API.QUERY_KEY_PUBLIC_SETTINGS], () => API.GET_PUBLIC_SETTINGS(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          handlePublicSettings(response.data)
        }
      }
    },
  })

  const handlePublicSettings = (data: any) => {
    setPublicSettings({
      PRIMARY_COLOR: data[API.SETTINGS_KEY_SYSTEM_COLOR]
        ? data[API.SETTINGS_KEY_SYSTEM_COLOR].valueString
        : COMMONS.PRIMARY_COLOR,
      PRIMARY_LIGHT_COLOR: data[API.SETTINGS_KEY_SYSTEM_COLOR]
        ? COMMONS.COLOR_ADJUST(data[API.SETTINGS_KEY_SYSTEM_COLOR].valueString, 100)
        : COMMONS.PRIMARY_LIGHT_COLOR,
      TITLE: data[API.SETTINGS_KEY_SYSTEM_TITLE]
        ? data[API.SETTINGS_KEY_SYSTEM_TITLE].valueString
        : import.meta.env.VITE_SYSTEM_TITLE,
    })
  }

  useEffect(() => {
    let link: any = document.querySelector("link[rel~='icon']")

    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }

    if (favicon) {
      link.href = API.SETTINGS_UPLOADS_URL + favicon
    }
  }, [favicon])

  useEffect(() => {
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_SYSTEM_SETTING, () => {
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_PUBLIC_SETTINGS],
      })
    })

    socket.on(API.SOCKET_FAVICON, () => {
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_FAVICON] })
    })

    socket.on(API.SOCKET_LOGO, () => {
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_LOGO] })
    })

    socket.on(API.SOCKET_STORE_PIC, () => {
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_STORE_PIC] })
    })

    return () => {
      socket.off(API.SOCKET_SYSTEM_SETTING)
      socket.off(API.SOCKET_FAVICON)
      socket.off(API.SOCKET_LOGO)
      socket.off(API.SOCKET_STORE_PIC)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  const childrenWithProps = React.Children.map(children, (element: any) =>
    React.cloneElement(element, {
      logo: logo,
      storePic: storePic,
      publicSettings: publicSettings,
    }),
  )

  return (
    <>
      <Helmet>{publicSettings.TITLE ? <title>{publicSettings.TITLE}</title> : ''}</Helmet>
      <ConfigProvider
        theme={{
          token: {},
        }}
      >
        <div className='flex flex-col w-full min-h-full'>
          <Spin
            spinning={
              useIsFetching({
                fetchStatus: 'fetching',
              }) > 0
            }
            className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            style={{
              zIndex: 1001,
            }}
          >
            <BaseAnimation>
              <Layout className='min-h-screen'>
                <Content className='bg-white'>{childrenWithProps}</Content>
              </Layout>
            </BaseAnimation>
          </Spin>
        </div>
      </ConfigProvider>
    </>
  )
}

export default Minimal
