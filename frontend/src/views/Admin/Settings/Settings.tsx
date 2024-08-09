import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Input,
  message,
  Divider,
  Upload,
  Image,
  Descriptions,
  Modal,
  Table,
  Tooltip,
  Radio,
  Tag,
} from 'antd'
import {
  EditOutlined,
  SaveOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import * as API from 'common/api'
import * as UTILITY from 'common/utility'
import * as CONSTANTS from 'common/constant'

import { io } from 'socket.io-client'
import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import RichmenuModalComponent from 'components/admin/Settings/RichmenuModal'
import AdminNotificationModalComponent from 'components/admin/Settings/AdminNotificationModal'
import SpectatorModalComponent from 'components/admin/Settings/SpectatorModal'
import PageHeader from 'components/admin/PageHeader'
import { m } from 'framer-motion'

interface RichMenu {
  richmenuId?: string
  picUrl?: string
  type?: string
  isDisplayed?: boolean
  link1?: string | null
  link2?: string | null
  link3?: string | null
  link4?: string | null
  link5?: string | null
  link6?: string | null
  createdAt?: string
  updatedAt?: string
}

interface DefaultRM extends RichMenu {
  type: 'defaultRM'
}

interface MemberRM extends RichMenu {
  type: 'memberRM'
}

interface RichMenuState {
  defaultRM?: DefaultRM
  memberRM?: MemberRM
}
const { TextArea } = Input

const Settings = (props: Props) => {
  const { publicSettings, auth } = props
  const navigate = useNavigate()

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const queryClient = useQueryClient()

  const [systemColorForm] = Form.useForm()
  const [systemTitleForm] = Form.useForm()

  const [logo, setLogo] = useState(undefined)
  const [favicon, setFavicon] = useState(undefined)
  const [spectators, setSpectators] = useState([])
  const [richmenus, setRichmenus] = useState<RichMenuState>({})
  const [isRichmenuModalVisible, setIsRichmenuModalVisible] = useState(false)
  const [isAdminNotificationModalVisible, setIsAdminNotificationModalVisible] = useState(false)
  const [currentSpectator, setCurrentSpectator] = useState(undefined)
  const [isSpectatorModalVisible, setIsSpectatorModalVisible] = useState(false)

  const [modal, contextHolder] = Modal.useModal()

  useQuery([API.QUERY_KEY_LOGO], () => API.GET_LOGO(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setLogo(response.data)
        } else {
          setLogo(undefined)
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

  useQuery([API.QUERY_KEY_FAVICON], () => API.GET_FAVICON(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setFavicon(response.data)
        } else {
          setFavicon(undefined)
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

  useQuery([API.QUERY_KEY_ADMIN_RICHMENUS], () => API.ADMIN_GET_RICHMENUS(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        if (response?.data) {
          setRichmenus(response.data)
        } else {
          setRichmenus({})
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
  useQuery([API.QUERY_KEY_ADMIN_SPECTATORS], () => API.ADMIN_GET_SPECTATORS(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        setSpectators(response?.data || [])
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

  const logoUploadMutation = useMutation(API.ADMIN_UPLOAD_LOGO, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_UPLOAD_MSG)
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_LOGO] })
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

  const faviconUploadMutation = useMutation(API.ADMIN_UPLOAD_FAVICON, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_UPLOAD_MSG)
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_FAVICON] })
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

  const publicSettingsUpdateMutation = useMutation(API.ADMIN_UPDATE_PUBLIC_SETTINGS, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_UPDATE_MSG)
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_PUBLIC_SETTINGS],
      })
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
  const removeSpectatorMutation = useMutation(API.ADMIN_REMOVE_SPECTATOR, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_DELETE_MSG)
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_SPECTATORS],
      })
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

  const updateRichmenuVisibilityMutation = useMutation(API.ADMIN_UPDATE_RICHMENU_VISIBILITY, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_UPDATE_MSG)
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_RICHMENUS],
      })
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

  useEffect(() => {
    if (!auth) {
      navigate(CONSTANTS.PERMISSION_ERROR_ROUTE)
    }
  }, [auth, navigate])

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

    return () => {
      socket.off(API.SOCKET_SYSTEM_SETTING)
      socket.off(API.SOCKET_FAVICON)
      socket.off(API.SOCKET_LOGO)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  const handleSystemColor = (data: { systemColorFormItem: any }) => {
    const paramData = {
      key: API.SETTINGS_KEY_SYSTEM_COLOR,
      label: API.SETTINGS_LABEL_SYSTEM_COLOR,
      isPublic: true,
      valueString: data.systemColorFormItem,
    }

    if (publicSettings?.PRIMARY_COLOR !== data.systemColorFormItem) {
      publicSettingsUpdateMutation.mutate(paramData)
    }
  }

  const handleSystemTitle = (data: { systemTitleFormItem: any }) => {
    const paramData = {
      key: API.SETTINGS_KEY_SYSTEM_TITLE,
      label: API.SETTINGS_LABEL_SYSTEM_TITLE,
      isPublic: true,
      valueString: data.systemTitleFormItem,
    }

    if (publicSettings?.TITLE !== data.systemTitleFormItem) {
      publicSettingsUpdateMutation.mutate(paramData)
    }
  }
  const handleSpectatorRemove = (spectator: {
    spectatorId: any
    Member: { lastName: any; firstName: any; displayName: any }
  }) => {
    const paramData = {
      spectatorId: spectator?.spectatorId,
    }

    modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined className='text-red-600' rev={undefined} />,
      content: (
        <p>
          <span className='text-red-600'>
            「
            {spectator?.Member?.lastName && spectator?.Member?.firstName
              ? `${spectator?.Member?.lastName} ${spectator?.Member?.firstName}`
              : spectator?.Member?.displayName || 'ー'}
            」
          </span>
          を管理者リストから外してもよろしいでしょうか？
        </p>
      ),
      okText: '外す',
      okType: 'danger',
      cancelText: '閉じる',
      centered: true,
      onOk() {
        removeSpectatorMutation.mutate(paramData)
      },
    })
  }

  const handleRichmenuVisibility = (rmType: string, isDisplayed: any) => {
    const paramData = {
      rmType: rmType,
      isDisplayed: isDisplayed,
    }

    modal.confirm({
      title: '確認',
      content: (
        <p>
          <span style={{ color: publicSettings?.PRIMARY_COLOR }}>
            「
            {rmType === 'defaultRM'
              ? '登録前のリッチメニュー'
              : rmType === 'memberRM'
              ? '登録後のリッチメニュー'
              : 'ー'}
            」
          </span>
          を
          <span
            style={{
              color: publicSettings?.PRIMARY_COLOR,
            }}
          >
            {isDisplayed ? '表示' : '非表示'}
          </span>
          してもよろしいでしょうか？
        </p>
      ),
      okText: '確認',
      okType: 'primary',
      cancelText: '閉じる',
      centered: true,
      onOk() {
        updateRichmenuVisibilityMutation.mutate(paramData)
      },
    })
  }

  const showRichmenuModal = () => {
    setIsRichmenuModalVisible(true)
  }
  const showAdminNotificationModal = () => {
    setIsAdminNotificationModalVisible(true)
  }
  const hideRichmenuModal = () => {
    setIsRichmenuModalVisible(false)
  }
  const hideAdminNotificationModal = () => {
    setIsAdminNotificationModalVisible(false)
  }
  const showSpectatorModal = (spectator: React.SetStateAction<undefined>) => {
    setCurrentSpectator(spectator)
    setIsSpectatorModalVisible(true)
  }
  const hideSpectatorModal = () => {
    setCurrentSpectator(undefined)
    setIsSpectatorModalVisible(false)
  }

  const spectatorColumns = [
    {
      title: 'ID',
      dataIndex: 'spectatorId',
      align: 'center',
      width: 50,
    },
    {
      title: '写真',
      dataIndex: 'picUrl',
      align: 'center',
      width: 50,
      render: (picUrl: any) =>
        picUrl ? (
          <Image
            preview={{
              mask: <EyeOutlined rev={undefined} />,
              src: picUrl,
              maskClassName: 'rounded-full',
            }}
            src={`${picUrl}/large`}
            style={{ maxHeight: '50px' }}
            className='w-full rounded-full object-contain'
            fallback='/no-image.png'
          />
        ) : (
          <Image
            src='/no-image.png'
            preview={false}
            className='w-full rounded-full object-contain'
            style={{
              maxHeight: '50px',
            }}
          />
        ),
    },
    {
      title: 'LINE名・氏名',
      dataIndex: 'displayName',
      align: 'center',
      width: 150,
      render: (member: { displayName: any; lastName: any; firstName: any }) => (
        <>
          <p className='text-sm'>{member?.displayName || 'ー'}</p>
          <p className='text-xs'>({`${member?.lastName || 'ー'} ${member?.firstName || 'ー'}`})</p>
        </>
      ),
    },
    {
      title: '通知設定',
      dataIndex: 'spectator',
      align: 'center',
      width: 200,
      render: (member: { isSpectatingMember: any }) => (
        <div className='flex flex-col'>
          <div className='mb-2'>
            <Tag
              className='mr-0 rounded-full px-4'
              color={member?.isSpectatingMember ? CONSTANTS.CUSTOM_GREEN : CONSTANTS.CUSTOM_RED}
            >
              新規お客様通知
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      align: 'center',
      width: 100,
      render: (spectator: any) => (
        <>
          <Tooltip title='編集' placement='top'>
            <Button
              className='m-1'
              icon={<EditOutlined rev={undefined} />}
              onClick={() => showSpectatorModal(spectator)}
            />
          </Tooltip>
          <Tooltip title='外す' placement='top'>
            <Button
              className='m-1'
              icon={<DeleteOutlined rev={undefined} />}
              danger
              loading={removeSpectatorMutation.isLoading}
              onClick={() => handleSpectatorRemove(spectator)}
            />
          </Tooltip>
        </>
      ),
    },
  ]

  return (
    <>
      <BaseAnimation>
        <PageHeader publicSettings={publicSettings} title='設定' />
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            {auth && auth.auth && auth.auth === CONSTANTS.AUTH_MASTER ? (
              <Col xs={24}>
                <Card
                  title='システム設定'
                  bordered={true}
                  type='inner'
                  headStyle={{
                    color: publicSettings?.PRIMARY_COLOR,
                    backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR,
                  }}
                  style={{
                    borderColor: publicSettings?.PRIMARY_COLOR,
                  }}
                >
                  <Row gutter={[8, 8]}>
                    <Col xs={24} md={12} xl={8} className='text-center'>
                      <Card title='ロゴ設定' className='h-full'>
                        <TapAnimation>
                          <Upload
                            accept='.jpg, .jpeg, .png, .svg'
                            listType='picture-card'
                            showUploadList={false}
                            beforeUpload={() => {
                              return false
                            }}
                            onChange={async (param: any) => {
                              logoUploadMutation.mutate(param.file)
                            }}
                          >
                            {logo ? (
                              <img
                                src={`${API.SETTINGS_UPLOADS_URL}settings/${logo}`}
                                alt='ロゴ'
                                style={{
                                  maxWidth: '100px',
                                  maxHeight: '100px',
                                }}
                              />
                            ) : (
                              'アップロード'
                            )}
                          </Upload>
                        </TapAnimation>
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={8} className='text-center'>
                      <Card title='ファビコン設定' className='h-full'>
                        <TapAnimation>
                          <Upload
                            accept='.ico'
                            listType='picture-card'
                            showUploadList={false}
                            beforeUpload={() => {
                              return false
                            }}
                            onChange={async (param: any) => {
                              faviconUploadMutation.mutate(param.file)
                            }}
                          >
                            {favicon ? (
                              <img
                                src={`${API.SETTINGS_UPLOADS_URL}settings/${favicon}`}
                                alt='ファビコン '
                                style={{
                                  maxWidth: '150px',
                                  maxHeight: '150px',
                                }}
                              />
                            ) : (
                              'アップロード'
                            )}
                          </Upload>
                        </TapAnimation>
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={8} className='text-center'>
                      <Card title='タイトル設定' className='h-full'>
                        <Form
                          form={systemTitleForm}
                          onFinish={handleSystemTitle}
                          layout='vertical'
                          preserve={false}
                          initialValues={{
                            systemTitleFormItem: publicSettings?.TITLE || '',
                          }}
                          size='large'
                        >
                          <Row justify='center'>
                            <Col span={24}>
                              <Form.Item
                                name='systemTitleFormItem'
                                rules={[
                                  {
                                    required: true,
                                    message: '必須です',
                                  },
                                  {
                                    whitespace: true,
                                    message: '必須です',
                                  },
                                ]}
                              >
                                <Input
                                  placeholder='例：○○システム'
                                  onPressEnter={(e) => e.preventDefault()}
                                  allowClear
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row justify='center'>
                            <Col>
                              <TapAnimation>
                                <Button
                                  icon={<SaveOutlined rev={undefined} />}
                                  type='primary'
                                  htmlType='submit'
                                  loading={publicSettingsUpdateMutation.isLoading}
                                >
                                  設定する
                                </Button>
                              </TapAnimation>
                            </Col>
                          </Row>
                        </Form>
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={24} className='text-center h-full'>
                      <Card title='色設定'>
                        <Row gutter={[4, 4]} justify='center'>
                          {CONSTANTS.THEME_COLORS.map((color) => (
                            <Col key={color}>
                              <div
                                className='w-6 h-6 rounded-full cursor-pointer'
                                style={{
                                  backgroundColor: color,
                                  border:
                                    publicSettings?.PRIMARY_COLOR === color
                                      ? '2px solid white'
                                      : 'none',
                                  boxShadow:
                                    publicSettings?.PRIMARY_COLOR === color
                                      ? 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
                                      : 'none',
                                }}
                                onClick={() =>
                                  publicSettings?.PRIMARY_COLOR === color
                                    ? ''
                                    : handleSystemColor({
                                        systemColorFormItem: color,
                                      })
                                }
                              ></div>
                            </Col>
                          ))}
                        </Row>
                        <Divider />
                        <Row justify='center'>
                          <Form
                            form={systemColorForm}
                            name='systemColorForm'
                            onFinish={handleSystemColor}
                            layout='vertical'
                            preserve={false}
                            initialValues={{
                              systemColorFormItem: CONSTANTS.THEME_COLORS.find(
                                (c) => c === publicSettings?.PRIMARY_COLOR,
                              )
                                ? ''
                                : publicSettings?.PRIMARY_COLOR,
                            }}
                            size='large'
                          >
                            <Row justify='center'>
                              <Col>
                                <Form.Item
                                  name='systemColorFormItem'
                                  rules={[
                                    {
                                      required: true,
                                      message: '必須です',
                                    },
                                    {
                                      whitespace: true,
                                      message: '必須です',
                                    },
                                  ]}
                                >
                                  <Input
                                    addonBefore='カスタム色'
                                    placeholder='例：#060606'
                                    onPressEnter={(e) => e.preventDefault()}
                                    allowClear
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row justify='center'>
                              <Col>
                                <TapAnimation>
                                  <Button
                                    icon={<SaveOutlined rev={undefined} />}
                                    type='primary'
                                    htmlType='submit'
                                    loading={publicSettingsUpdateMutation.isLoading}
                                  >
                                    設定する
                                  </Button>
                                </TapAnimation>
                              </Col>
                            </Row>
                          </Form>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ) : (
              ''
            )}
            {auth && auth.auth && auth.auth === CONSTANTS.AUTH_MASTER ? (
              <Col xs={24}>
                <Card
                  title='通知設定'
                  bordered={true}
                  type='inner'
                  headStyle={{
                    color: publicSettings?.PRIMARY_COLOR,
                    backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR,
                  }}
                  style={{
                    borderColor: publicSettings?.PRIMARY_COLOR,
                  }}
                >
                  <m.div
                    variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_CONTAINER}
                    initial='hidden'
                    animate='show'
                    exit='hidden'
                  >
                    <m.div variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM} className='mt-4'>
                      <Card
                        title='管理者通知'
                        extra={
                          <div className='flex'>
                            <TapAnimation>
                              <Button
                                size='large'
                                icon={<EditOutlined rev={undefined} />}
                                onClick={showAdminNotificationModal}
                              >
                                編集
                              </Button>
                            </TapAnimation>
                          </div>
                        }
                      >
                        <Descriptions column={{ xs: 1, sm: 2 }} bordered layout='vertical'>
                          <Descriptions.Item label='新規メンバーが登録されると配信されるメッセージ'>
                            <p className='whitespace-pre-wrap'>
                              {publicSettings?.ADMIN_MESSAGE_MEMBER || 'ー'}
                            </p>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </m.div>
                  </m.div>
                </Card>
              </Col>
            ) : (
              ''
            )}
            {auth && auth.auth && auth.auth === CONSTANTS.AUTH_MASTER ? (
              <Col xs={24}>
                <Card
                  title='管理者通知設定'
                  bordered={true}
                  type='inner'
                  headStyle={{
                    color: publicSettings?.PRIMARY_COLOR,
                    backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR,
                  }}
                  style={{
                    borderColor: publicSettings?.PRIMARY_COLOR,
                  }}
                  extra={
                    <div className='flex'>
                      <div>
                        <TapAnimation>
                          <Button
                            type='primary'
                            size='large'
                            icon={<PlusOutlined rev={undefined} />}
                            //@ts-ignore
                            onClick={showSpectatorModal}
                          >
                            管理者追加
                          </Button>
                        </TapAnimation>
                      </div>
                    </div>
                  }
                >
                  <m.div
                    variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_CONTAINER}
                    initial='hidden'
                    animate='show'
                    exit='hidden'
                  >
                    <m.div variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}>
                      <Table
                        bordered
                        size='small'
                        //@ts-ignore
                        columns={spectatorColumns}
                        dataSource={
                          spectators
                            ? spectators.map((spectator: any, {}) => {
                                return {
                                  key: spectator.spectatorId,
                                  spectatorId: spectator.spectatorId,
                                  picUrl: spectator?.Member?.picUrl,
                                  displayName: spectator.Member,
                                  spectator: spectator,
                                  action: spectator,
                                }
                              })
                            : []
                        }
                        scroll={{
                          x: 640,
                          y: 720,
                        }}
                        pagination={{
                          responsive: true,
                          showTotal: (total, range) => `全${total}件中${range[0]}～${range[1]}件目`,
                          defaultCurrent: 1,
                          defaultPageSize: 20,
                          position: ['bottomCenter'],
                        }}
                      />
                    </m.div>
                  </m.div>
                </Card>
              </Col>
            ) : (
              ''
            )}

            {auth && auth.auth && auth.auth === CONSTANTS.AUTH_MASTER ? (
              <Col xs={24}>
                <Card
                  title='リッチメニュー設定'
                  bordered={true}
                  type='inner'
                  headStyle={{
                    color: publicSettings?.PRIMARY_COLOR,
                    backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR,
                  }}
                  style={{
                    borderColor: publicSettings?.PRIMARY_COLOR,
                  }}
                  extra={
                    <div className='flex'>
                      <TapAnimation>
                        <Button
                          type='primary'
                          size='large'
                          icon={<EditOutlined rev={undefined} />}
                          onClick={showRichmenuModal}
                        >
                          編集
                        </Button>
                      </TapAnimation>
                    </div>
                  }
                >
                  <m.div
                    variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_CONTAINER}
                    initial='hidden'
                    animate='show'
                    exit='hidden'
                  >
                    <m.div variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}>
                      <Row justify='space-between' align='top' gutter={[32, 32]}>
                        <Col xs={24} lg={12}>
                          <div className='flex flex-col justify-between'>
                            <div className='flex flex-col items-center p-4 mb-4'>
                              <p className='text-lg font-bold'>登録前のリッチメニュー</p>
                              <p className='text-xs'>
                                （このリッチメニューは、まだ会員ではないユーザーに表示されます）
                              </p>
                              {richmenus?.defaultRM?.richmenuId ? (
                                <div className='mt-4'>
                                  <Radio.Group
                                    size='large'
                                    optionType='button'
                                    buttonStyle='solid'
                                    options={[
                                      { label: '表示', value: 1 },
                                      { label: '非表示', value: 0 },
                                    ]}
                                    value={richmenus?.defaultRM?.isDisplayed ? 1 : 0}
                                    onChange={(e) => {
                                      handleRichmenuVisibility('defaultRM', e.target.value)
                                    }}
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                            <div className='flex justify-center mb-4'>
                              {richmenus?.defaultRM?.picUrl ? (
                                <Image
                                  src={`${API.SETTINGS_UPLOADS_URL}richmenus/${richmenus.defaultRM.picUrl}`}
                                  alt='登録前のリッチメニュー'
                                  style={{
                                    maxHeight: '250px',
                                  }}
                                  className='rounded object-contain w-full'
                                  preview={{
                                    mask: <EyeOutlined rev={undefined} />,
                                    src: `${API.SETTINGS_UPLOADS_URL}richmenus/${richmenus.defaultRM.picUrl}`,
                                    maskClassName: 'rounded',
                                  }}
                                  fallback='/no-image.png'
                                />
                              ) : (
                                <Image
                                  src='/template-before.png'
                                  alt='登録前のリッチメニュー'
                                  style={{
                                    maxHeight: '250px',
                                  }}
                                  className='rounded object-contain w-full'
                                  preview={false}
                                />
                              )}
                            </div>
                            <div className='flex justify-center'>
                              <Descriptions
                                layout='vertical'
                                colon={false}
                                column={3}
                                bordered
                                className='w-full'
                                size='small'
                              >
                                <Descriptions.Item label='A部分のリンク先'>
                                  {richmenus?.defaultRM?.link1 || 'ー'}
                                </Descriptions.Item>
                                <Descriptions.Item label='B部分のリンク先'>
                                  {richmenus?.defaultRM?.link2 || 'ー'}
                                </Descriptions.Item>
                                <Descriptions.Item label='C部分のリンク先'>
                                  {richmenus?.defaultRM?.link3 || 'ー'}
                                </Descriptions.Item>
                              </Descriptions>
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} lg={12}>
                          <div className='flex flex-col'>
                            <div className='flex flex-col items-center justify-center p-4 mb-4'>
                              <p className='text-lg font-bold'>登録後のリッチメニュー</p>
                              <p className='text-xs'>
                                （このリッチメニューは、会員のユーザーに表示されます）
                              </p>
                              {richmenus?.memberRM?.richmenuId ? (
                                <div className='mt-4'>
                                  <Radio.Group
                                    size='large'
                                    optionType='button'
                                    buttonStyle='solid'
                                    options={[
                                      { label: '表示', value: 1 },
                                      { label: '非表示', value: 0 },
                                    ]}
                                    value={richmenus?.memberRM?.isDisplayed ? 1 : 0}
                                    onChange={(e) => {
                                      handleRichmenuVisibility('memberRM', e.target.value)
                                    }}
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                            <div className='flex justify-center mb-4'>
                              {richmenus?.memberRM?.picUrl ? (
                                <Image
                                  src={`${API.SETTINGS_UPLOADS_URL}richmenus/${richmenus.memberRM.picUrl}`}
                                  alt='登録後のリッチメニュー'
                                  style={{
                                    maxHeight: '250px',
                                  }}
                                  className='rounded object-contain w-full'
                                  preview={{
                                    mask: <EyeOutlined rev={undefined} />,
                                    src: `${API.SETTINGS_UPLOADS_URL}richmenus/${richmenus.memberRM.picUrl}`,
                                    maskClassName: 'rounded',
                                  }}
                                  fallback='/no-image.png'
                                />
                              ) : (
                                <Image
                                  src='/template-after.png'
                                  alt='登録後のリッチメニュー'
                                  style={{
                                    maxHeight: '250px',
                                  }}
                                  className='rounded object-contain w-full'
                                  preview={false}
                                />
                              )}
                            </div>
                            <div className='flex justify-center'>
                              <Descriptions
                                layout='vertical'
                                colon={false}
                                column={2}
                                bordered
                                className='w-full'
                                size='small'
                              >
                                <Descriptions.Item label='A部分のリンク先'>
                                  {richmenus?.memberRM?.link1 || 'ー'}
                                </Descriptions.Item>
                                <Descriptions.Item label='B部分のリンク先'>
                                  {richmenus?.memberRM?.link2 || 'ー'}
                                </Descriptions.Item>
                                <Descriptions.Item label='C部分のリンク先'>
                                  {richmenus?.memberRM?.link3 || 'ー'}
                                </Descriptions.Item>
                                <Descriptions.Item label='D部分のリンク先'>
                                  {richmenus?.memberRM?.link4 || 'ー'}
                                </Descriptions.Item>
                              </Descriptions>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </m.div>
                  </m.div>
                </Card>
              </Col>
            ) : (
              ''
            )}
          </Row>
        </Card>
      </BaseAnimation>
      <RichmenuModalComponent
        {...props}
        isRichmenuModalVisible={isRichmenuModalVisible}
        hideRichmenuModal={hideRichmenuModal}
        richmenus={richmenus}
      />
      <AdminNotificationModalComponent
        {...props}
        isAdminNotificationModalVisible={isAdminNotificationModalVisible}
        hideAdminNotificationModal={hideAdminNotificationModal}
      />
      <SpectatorModalComponent
        {...props}
        isSpectatorModalVisible={isSpectatorModalVisible}
        hideSpectatorModal={hideSpectatorModal}
        currentSpectator={currentSpectator}
      />

      {contextHolder}
    </>
  )
}

export default Settings
