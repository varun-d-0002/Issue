import { Button, Col, Image, Input, Modal, Row, Form, Divider, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as API from 'common/api'
import * as CONSTANTS from 'common/constant'

const DeviceScanModal = (props: {
  isMemberVisit?: any
  isMemberRenewDeviceModalVisible?: any
  hideMemberRenewDeviceModal?: any
  hideMemberRenewCameraModal?: any
  showMemberRenewConfirmModal?: any
}) => {
  const {
    isMemberVisit,
    isMemberRenewDeviceModalVisible,
    hideMemberRenewDeviceModal,
    hideMemberRenewCameraModal,
    showMemberRenewConfirmModal,
  } = props

  const barcodeRef = useRef<any>(null)
  const [memberRenewDeviceForm] = Form.useForm()
  const navigate = useNavigate()

  const memberCheckMutation = useMutation(API.ADMIN_CHECK_MEMBER, {
    onSuccess: (response) => {
      showMemberRenewConfirmModal(response?.data || {})
      hideMemberRenewDeviceModal()
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === CONSTANTS.RESPONSE_CONFLICT_ERROR) {
        message.warning(CONSTANTS.WARN_MEMBER_CODE_NOT_EXIST_MSG)
        hideMemberRenewCameraModal()
      } else if (error?.response?.status === CONSTANTS.RESPONSE_PERMISSION_ERROR) {
        navigate(CONSTANTS.PERMISSION_ERROR_ROUTE)
      } else if (error?.response?.status === CONSTANTS.RESPONSE_SESSION_ERROR) {
        message.warning(CONSTANTS.ERROR_SESSION_MSG)
        navigate(CONSTANTS.ADMIN_LOGIN_ROUTE)
      } else if (error?.response?.status === CONSTANTS.RESPONSE_SYSTEM_ERROR) {
        message.error(CONSTANTS.ERROR_SYSTEM_MSG)
      } else {
        message.error(CONSTANTS.ERROR_SYSTEM_MSG)
      }
    },
  })

  useEffect(() => {
    setTimeout(() => {
      if (barcodeRef && barcodeRef.current) {
        barcodeRef.current.focus()
      }
    }, 1000)
  }, [isMemberRenewDeviceModalVisible])

  const handleMemberCheck = (data: any) => {
    const paramData = {
      memberCode: data.memberCode,
    }

    memberCheckMutation.mutate(paramData)
  }
  return (
    <>
      <Modal
        title={`${isMemberVisit ? '来店記録' : '会員更新'}・装置と手入力`}
        open={isMemberRenewDeviceModalVisible}
        onCancel={hideMemberRenewDeviceModal}
        footer={null}
        destroyOnClose
        centered
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Form
          name='memberRenewDeviceForm'
          form={memberRenewDeviceForm}
          onFinish={handleMemberCheck}
          layout='vertical'
          preserve={false}
          size='large'
        >
          <Row justify='center'>
            <Col>
              <Form.Item
                name='memberCode'
                label='会員コード（バーコード）'
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '必須です',
                  },
                ]}
              >
                <Input
                  ref={barcodeRef}
                  placeholder='例：000000000000000'
                  allowClear
                  pattern='[0-9]*'
                  inputMode='numeric'
                />
              </Form.Item>
            </Col>
            <Col span={24} className='text-center'>
              <Button
                type='primary'
                htmlType='submit'
                className='px-12'
                loading={memberCheckMutation.isLoading}
              >
                確認
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default DeviceScanModal
