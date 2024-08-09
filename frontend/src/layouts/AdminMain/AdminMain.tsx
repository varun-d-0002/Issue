import React, { useState, useEffect } from 'react'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { ConfigProvider, Layout, Spin, Drawer, message } from 'antd'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import BaseAnimation from 'components/common/BaseAnimation'

import * as CONSTANTS from 'common/constant'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { io } from 'socket.io-client'

const { Header, Sider, Content } = Layout

const CustomSider = styled(Sider)`
  &.ant-layout-sider {
    overflow: auto !important;
    height: 100vh !important;
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
  }

  &.ant-layout-sider-has-trigger {
    padding-bottom: 35px !important;
  }

  .ant-layout-sider-trigger {
    color: #fff !important;
    background-color: ${(props) =>
      //@ts-ignore
      props?.$publicSettings?.PRIMARY_COLOR
        ? //@ts-ignore
          props.$publicSettings.PRIMARY_COLOR
        : CONSTANTS.PRIMARY_COLOR} !important;
    height: 35px !important;
    line-height: 35px !important;
  }
`

const AdminMain = (props: Props) => {
  const { children } = props
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const [auth, setAuth] = useState({})
  const [logo, setLogo] = useState(undefined)
  const [favicon, setFavicon] = useState(undefined)
  const [storePic, setStorePic] = useState(undefined)
  const [publicSettings, setPublicSettings] = useState({
    PRIMARY_COLOR: CONSTANTS.PRIMARY_COLOR,
    PRIMARY_LIGHT_COLOR: CONSTANTS.PRIMARY_LIGHT_COLOR,
    TITLE: import.meta.env.VITE_SYSTEM_TITLE || '',
    ADMIN_MESSAGE_MEMBER: API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER,
  })
  const queryClient = useQueryClient()
  const isBigScreen = useMediaQuery({
    minWidth: CONSTANTS.XL_SCREEN_SIZE,
  })

  const toggleCollapse = (collapse: boolean | ((prevState: boolean) => boolean)) => {
    setIsCollapsed(collapse)
  }

  const showDrawer = () => {
    setIsDrawerVisible(true)
  }

  const hideDrawer = () => {
    setIsDrawerVisible(false)
  }

  const toggleDrawer = () => {
    if (isDrawerVisible) {
      hideDrawer()
    } else {
      showDrawer()
    }
  }

  useQuery([API.QUERY_KEY_LOGO], () => API.GET_LOGO(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          console.log(response.data)
          setLogo(response.data)
        }
      }
    },
    onError: (error: FetchError) => {
      message.error({
        content: CONSTANTS.ERROR_SYSTEM_MSG,
        key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
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
    onError: (error: FetchError) => {
      message.error({
        content: CONSTANTS.ERROR_SYSTEM_MSG,
        key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
      })
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
    onError: (error: FetchError) => {
      message.error({
        content: CONSTANTS.ERROR_SYSTEM_MSG,
        key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
      })
    },
  })

  useQuery([API.QUERY_KEY_ADMIN_PUBLIC_SETTINGS], () => API.GET_ADMIN_PUBLIC_SETTINGS(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          handlePublicSettings(response.data)
        }
      }
    },
    onError: (error: FetchError) => {
      message.error({
        content: CONSTANTS.ERROR_SYSTEM_MSG,
        key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
      })
    },
  })

  useQuery([API.QUERY_KEY_ADMIN_AUTH], API.ADMIN_GET_AUTH, {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setAuth(response.data)
        } else {
          setAuth({})
        }
      }
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === CONSTANTS.RESPONSE_PERMISSION_ERROR) {
        navigate(CONSTANTS.PERMISSION_ERROR_ROUTE)
      } else if (error?.response?.status === CONSTANTS.RESPONSE_SESSION_ERROR) {
        message.warning({
          content: CONSTANTS.ERROR_SESSION_MSG,
          key: CONSTANTS.MESSAGE_SESSION_ERROR_KEY,
        })
        navigate(CONSTANTS.ADMIN_LOGIN_ROUTE)
      } else if (error?.response?.status === CONSTANTS.RESPONSE_SYSTEM_ERROR) {
        message.error({
          content: CONSTANTS.ERROR_SYSTEM_MSG,
          key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
        })
      } else {
        message.error({
          content: CONSTANTS.ERROR_SYSTEM_MSG,
          key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
        })
      }
    },
  })

  const handlePublicSettings = (data: any) => {
    setPublicSettings({
      PRIMARY_COLOR: data[API.SETTINGS_KEY_SYSTEM_COLOR]
        ? data[API.SETTINGS_KEY_SYSTEM_COLOR].valueString
        : CONSTANTS.PRIMARY_COLOR,
      PRIMARY_LIGHT_COLOR: data[API.SETTINGS_KEY_SYSTEM_COLOR]
        ? CONSTANTS.COLOR_ADJUST(data[API.SETTINGS_KEY_SYSTEM_COLOR].valueString, 100)
        : CONSTANTS.PRIMARY_LIGHT_COLOR,
      TITLE: data[API.SETTINGS_KEY_SYSTEM_TITLE]
        ? data[API.SETTINGS_KEY_SYSTEM_TITLE].valueString
        : import.meta.env.VITE_SYSTEM_TITLE,
      ADMIN_MESSAGE_MEMBER: data[API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER]
        ? data[API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER].valueString
        : undefined,
    })
  }
  useEffect(() => {
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_SYSTEM_SETTING, () => {
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_PUBLIC_SETTINGS],
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

  useEffect(() => {
    let link: any = document.querySelector("link[rel~='icon']")

    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }

    if (favicon) {
      link.href = API.API_UPLOADS + favicon
    }
  }, [favicon])

  const childrenWithProps = React.Children.map(children, (element: any) =>
    React.cloneElement(element, {
      publicSettings: publicSettings,
      auth: auth,
      storePic: storePic,
    }),
  )

  return (
    <>
      <Helmet>{publicSettings.TITLE ? <title>{publicSettings.TITLE}</title> : ''}</Helmet>
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
            }
            className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            style={{
              zIndex: 1001,
            }}
          >
            <BaseAnimation>
              <Layout className='min-h-full' hasSider>
                {isBigScreen && (
                  <CustomSider
                    //@ts-ignore
                    $publicSettings={publicSettings}
                    theme='light'
                    collapsible
                    collapsed={isCollapsed}
                    onCollapse={toggleCollapse}
                    className='shadow'
                  >
                    <Sidebar
                      //@ts-ignore
                      auth={auth}
                      logo={logo}
                      publicSettings={publicSettings}
                      isCollapsed={isCollapsed}
                    />
                  </CustomSider>
                )}
                <Layout
                  className='min-h-screen'
                  style={{ marginLeft: isBigScreen ? (isCollapsed ? 80 : 200) : 0 }}
                >
                  <Header className='p-0 bg-white shadow'>
                    <Topbar
                      toggleDrawer={toggleDrawer}
                      //@ts-ignore
                      auth={auth}
                      publicSettings={publicSettings}
                      isBigScreen={isBigScreen}
                    />
                  </Header>
                  <div>
                    <Content className='m-4'>{childrenWithProps}</Content>
                  </div>
                  {!isBigScreen && (
                    <Drawer
                      placement='left'
                      bodyStyle={{ padding: 0 }}
                      width={200}
                      closable={false}
                      onClose={hideDrawer}
                      open={isDrawerVisible}
                    >
                      <Sidebar />
                    </Drawer>
                  )}
                </Layout>
              </Layout>
            </BaseAnimation>
          </Spin>
        </div>
      </ConfigProvider>
    </>
  )
}

export default AdminMain
