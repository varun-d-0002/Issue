import { Modal, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'
import * as API from 'common/api'
import * as CONSTANTS from 'common/constant'

const CameraScanModal = (props: {
  isMemberVisit?: any
  isMemberRenewCameraModalVisible?: any
  hideMemberRenewDeviceModal?: any
  hideMemberRenewCameraModal?: any
  showMemberRenewConfirmModal?: any
  stopCameraStream?: any
}) => {
  const {
    isMemberRenewCameraModalVisible,
    hideMemberRenewCameraModal,
    showMemberRenewConfirmModal,
    stopCameraStream,
    isMemberVisit,
  } = props

  const navigate = useNavigate()

  const memberCheckMutation = useMutation(API.ADMIN_CHECK_MEMBER, {
    onSuccess: (response) => {
      showMemberRenewConfirmModal(response?.data || {})
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

  const handleMemberCheck = (data: any) => {
    const paramData = {
      memberCode: data.memberCode,
    }

    memberCheckMutation.mutate(paramData)
  }
  return (
    <>
      <Modal
        title={`${isMemberVisit ? '来店記録' : '会員更新'}・カメラ`}
        open={isMemberRenewCameraModalVisible}
        onCancel={hideMemberRenewCameraModal}
        footer={null}
        destroyOnClose
        centered
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className='barcode-wrapper'>
          <div className='barcode-image-wrapper'>
            <BarcodeScannerComponent
              stopStream={stopCameraStream}
              onUpdate={(err, result: any) => {
                if (result) {
                  console.log(result.text)
                  handleMemberCheck({ memberCode: result.text })
                }
              }}
              onError={(error: any) => {
                if (error.name === 'NotAllowedError') {
                  message.info(CONSTANTS.INFO_CAMERA_PERMISSION_MSG)
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CameraScanModal
