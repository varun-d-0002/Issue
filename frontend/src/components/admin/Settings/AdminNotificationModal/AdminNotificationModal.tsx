import { Button, Divider, Form, Input, message, Modal } from 'antd'
import * as COMMONS from 'common/constant'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'

import TapAnimation from 'components/common/TapAnimation'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { io } from 'socket.io-client'
interface Error {
  [x: string]: any
  message: string
  error: {
    response: object
  }
}
const { TextArea } = Input

const AdminNotificationModal = (props: {
  publicSettings?: any
  isAdminNotificationModalVisible?: any
  hideAdminNotificationModal?: any
}) => {
  const { publicSettings, isAdminNotificationModalVisible, hideAdminNotificationModal } = props

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [adminNotificationForm] = Form.useForm()

  const adminNotificationMutation = useMutation(API.ADMIN_UPDATE_SETTINGS_BATCH, {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        message.success(COMMONS.SUCCESS_UPDATE_MSG)
        queryClient.invalidateQueries({
          queryKey: [API.QUERY_KEY_ADMIN_PUBLIC_SETTINGS],
        })
        hideAdminNotificationModal()
      }
    },
    onError: (error: Error) => {
      if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
        navigate(COMMONS.PERMISSION_ERROR_ROUTE)
      } else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
        message.warning({
          content: COMMONS.ERROR_SESSION_MSG,
          key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
        })
        navigate(COMMONS.ADMIN_LOGIN_ROUTE)
      } else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
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
  })

  useEffect(() => {
    if (!isAdminNotificationModalVisible) {
      adminNotificationForm.resetFields()
    }
  }, [isAdminNotificationModalVisible, adminNotificationForm])

  useEffect(() => {
    if (isAdminNotificationModalVisible) {
      adminNotificationForm.setFieldsValue({
        memberMessage: publicSettings?.ADMIN_MESSAGE_MEMBER || undefined,
      })
    }

    // eslint-disable-next-line
  }, [isAdminNotificationModalVisible])

  useEffect(() => {
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_SYSTEM_SETTING, () => {
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_PUBLIC_SETTINGS],
      })
    })

    return () => {
      socket.off(API.SOCKET_SYSTEM_SETTING)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  const handleAdminNotification = (data: { memberMessage: any }) => {
    let paramArray = []

    paramArray.push({
      name: API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER,
      label: API.SETTINGS_LABEL_ADMIN_MESSAGE_MEMBER,
      valueString: data.memberMessage,
      isPublic: false,
    })

    const paramData = {
      settings: paramArray,
    }

    adminNotificationMutation.mutate(paramData)
  }

  return (
    <>
      <Modal
        open={isAdminNotificationModalVisible}
        onCancel={hideAdminNotificationModal}
        title='管理者通知設定'
        footer={null}
        bodyStyle={{
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        maskClosable={false}
        width={720}
        destroyOnClose
        centered
      >
        <Form
          form={adminNotificationForm}
          layout='vertical'
          initialValues={{
            memberMessage: undefined,
            campaignMessage: undefined,
            reservationMessage: undefined,
            reservationCancelMessage: undefined,
          }}
          onFinish={handleAdminNotification}
          size='large'
          requiredMark={false}
          //@ts-ignore
          scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
        >
          <m.div
            variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
            initial='hidden'
            animate='show'
            exit='hidden'
          >
            <m.div
              variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
              className='p-4 bg-yellow-300 rounded mb-8'
            >
              <p className='text-center'>設定されてない場合は、メッセージが配信されません。</p>
            </m.div>
            <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
              <Form.Item
                name='memberMessage'
                label='新規メンバーが登録されると配信されるメッセージ'
                extra={
                  <p className='whitespace-pre-wrap'>{`※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。\n※メッセージに[TEL]を入力すると、配信の時にお客様の電話番号に変換されます。`}</p>
                }
              >
                <TextArea placeholder='メッセージを入力してください' autoSize />
              </Form.Item>
            </m.div>
            <Divider />
            <m.div
              variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
              className='flex justify-center'
            >
              <TapAnimation>
                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  className='m-1 w-32'
                  loading={adminNotificationMutation.isLoading}
                >
                  保存する
                </Button>
              </TapAnimation>
            </m.div>
          </m.div>
        </Form>
      </Modal>
    </>
  )
}

export default AdminNotificationModal
