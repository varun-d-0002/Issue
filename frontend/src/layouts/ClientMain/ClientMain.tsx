import liff from '@line/liff'
import { ConfigProvider, Layout, message, Spin } from 'antd'
import * as API from 'common/api'
import * as COMMONS from 'common/constant'
import * as UTILITY from 'common/utility'
import { io } from 'socket.io-client'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const { Content } = Layout

const ClientMain = (props: Props) => {
  const { children } = props
  const { liffId } = useParams()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const queryClient = useQueryClient()

  const personalInfoRef = useRef<any>()

  const [accessToken, setAccessToken] = useState(undefined)
  const [personalInfo, setPersonalInfo] = useState(undefined)

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
          console.log(response.data)
          setLogo(response.data)
        }
      }
    },
    onError: (error: Error) => {
      message.error({
        content: COMMONS.ERROR_SYSTEM_MSG,
        key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
      })
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

  useQuery(
    [API.QUERY_KEY_CLIENT_PERSONAL_INFO, accessToken],
    () => API.CLIENT_GET_PERSONAL_INFO(accessToken),
    {
      enabled: !!accessToken,
      onSuccess: (response) => {
        if (isMountedRef.current) {
          setPersonalInfo(response.data)
        }
      },
      onError: (error: FetchError) => {
        if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
          message.error({
            content: COMMONS.ERROR_SYSTEM_MSG,
            key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
          })
        } else {
          message.error({
            content: COMMONS.ERROR_SYSTEM_MSG,
            key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
          })
        }
      },
    },
  )

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
    personalInfoRef.current = personalInfo
  }, [personalInfo])

  useEffect(() => {
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_SYSTEM_SETTING, (response) => {
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

    socket.on(API.SOCKET_MEMBER, (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        if (response?.memberId === personalInfoRef.current?.memberId) {
          queryClient.invalidateQueries({
            queryKey: [API.QUERY_KEY_CLIENT_PERSONAL_INFO],
          })
        }
      }
    })

    return () => {
      socket.off(API.SOCKET_SYSTEM_SETTING)
      socket.off(API.SOCKET_FAVICON)
      socket.off(API.SOCKET_LOGO)
      socket.off(API.SOCKET_MEMBER)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    try {
      console.log('access token calling')
      //@ts-ignore
      setAccessToken(liff.getAccessToken())
    } catch (err) {
      navigate(`${COMMONS.CLIENT_LOGIN_ROUTE}/${liffId}`)
    }

    // eslint-disable-next-line
  }, [liffId])
  const childrenWithProps = React.Children.map(children, (element: any) =>
    React.cloneElement(element, {
      logo: logo,
      storePic: storePic,
      publicSettings: publicSettings,
      accessToken: accessToken,
      setAccessToken: setAccessToken,
      personalInfo: personalInfo,
    }),
  )

  return (
    <>
      <Helmet>{publicSettings?.TITLE ? <title>{publicSettings.TITLE}</title> : ''}</Helmet>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: publicSettings.PRIMARY_COLOR,
            colorLink: publicSettings.PRIMARY_COLOR,
            colorLinkActive: publicSettings.PRIMARY_COLOR,
            colorLinkHover: publicSettings.PRIMARY_COLOR,
          },
        }}
      >
        <div className='flex flex-col w-full min-h-full'>
          <Spin
            spinning={
              useIsFetching({
                fetchStatus: 'fetching',
              }) > 0
                ? true
                : false
            }
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
            }}
          >
            <Layout className='min-h-screen bg-white'>
              <Content>
                <div className='w-full m-auto'>{childrenWithProps}</div>
              </Content>
            </Layout>
          </Spin>
        </div>
      </ConfigProvider>
    </>
  )
}

export default ClientMain
