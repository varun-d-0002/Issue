//@ts-nocheck
import { Button, Divider, Form, Image, Input, message, Modal, Upload, UploadFile } from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  CameraTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'
import * as CONSTANTS from 'common/constant'
import TapAnimation from 'components/common/TapAnimation'
import { SetStateAction, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { m } from 'framer-motion'
import { UploadChangeParam } from 'antd/es/upload'

interface Error {
  [x: string]: any
  message: string
  error: {
    response: object
  }
}

interface Props {
  publicSettings?: Object
  isRichmenuModalVisible?: boolean
  hideRichmenuModal?: () => void
  richmenus?: any
}
const checkRichMenuImageSize = (
  type: string,
  param: UploadChangeParam<UploadFile<any>>,
  callback: {
    (value: SetStateAction<undefined>): void
    (value: SetStateAction<undefined>): void
    (arg0: { file: any; preview: string | ArrayBuffer | null }): void
  },
) => {
  const isSt1M = param.file.size / 1024 / 1024 < 1

  if (isSt1M) {
    const reader = new FileReader()
    reader.readAsDataURL(param.file)
    reader.addEventListener('load', (event) => {
      const _loadedImageUrl = event.target.result
      const image = document.createElement('img')

      image.src = _loadedImageUrl
      image.addEventListener('load', async () => {
        const { width, height } = image

        if (type === 'defaultRM') {
          if (width === 1200 && height === 405) {
            callback({
              file: param.file,
              preview: _loadedImageUrl,
            })
          } else {
            message.warning(CONSTANTS.WARN_IMAGE_SIZE_DIFFERENT)
          }
        } else if (type === 'memberRM') {
          if (width === 1200 && height === 810) {
            callback({
              file: param.file,
              preview: _loadedImageUrl,
            })
          } else {
            message.warning(CONSTANTS.WARN_IMAGE_SIZE_DIFFERENT)
          }
        }
      })
    })
  } else {
    message.warning(CONSTANTS.WARN_IMAGE_TOO_BIG)
  }
}

const CustomUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
  }
`

const RichmenuModal = (props: Props) => {
  const { publicSettings, isRichmenuModalVisible, hideRichmenuModal, richmenus } = props

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [defaultRichmenuForm] = Form.useForm()
  const [memberRichmenuForm] = Form.useForm()

  const [defaultRichmenuImageFile, setDefaultRichmenuImageFile] = useState(undefined)
  const [memberRichmenuImageFile, setMemberRichmenuImageFile] = useState(undefined)

  const [modal, contextHolder] = Modal.useModal()

  const richmenuUpdateMutation = useMutation(API.ADMIN_UPDATE_RICHMENU, {
    onSuccess: () => {
      if (isMountedRef.current) {
        message.success(CONSTANTS.SUCCESS_UPDATE_MSG)
        queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_RICHMENUS] })
      }
    },
    onError: (error: Error) => {
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

  const richmenuDeleteMutation = useMutation(API.ADMIN_DELETE_RICHMENU, {
    onSuccess: () => {
      if (isMountedRef.current) {
        message.success(CONSTANTS.SUCCESS_DELETE_MSG)
        queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_RICHMENUS] })
      }
    },
    onError: (error: Error) => {
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
    if (!isRichmenuModalVisible) {
      defaultRichmenuForm.resetFields()
      memberRichmenuForm.resetFields()

      setDefaultRichmenuImageFile(undefined)
      setMemberRichmenuImageFile(undefined)
    }

    // eslint-disable-next-line
  }, [isRichmenuModalVisible])

  useEffect(() => {
    if (isRichmenuModalVisible) {
      if (richmenus?.defaultRM?.picUrl) {
        defaultRichmenuForm.setFieldsValue({
          richmenuImage: richmenus.defaultRM.picUrl,
          linkA: richmenus.defaultRM?.link1 ? richmenus.defaultRM?.link1 : undefined,
          linkB: richmenus.defaultRM?.link2 ? richmenus.defaultRM?.link2 : undefined,
          linkC: richmenus.defaultRM?.link3 ? richmenus.defaultRM?.link3 : undefined,
        })

        setDefaultRichmenuImageFile({
          preview: `${API.SETTINGS_UPLOADS_URL}richmenus/${richmenus.defaultRM.picUrl}`,
        })
      } else {
        defaultRichmenuForm.resetFields()

        setDefaultRichmenuImageFile(undefined)
      }

      if (richmenus?.memberRM?.picUrl) {
        memberRichmenuForm.setFieldsValue({
          richmenuImage: richmenus.memberRM.picUrl,
          linkA: richmenus.memberRM?.link1 ? richmenus.memberRM?.link1 : undefined,
          linkB: richmenus.memberRM?.link2 ? richmenus.memberRM?.link2 : undefined,
          linkC: richmenus.memberRM?.link3 ? richmenus.memberRM?.link3 : undefined,
          linkD: richmenus.memberRM?.link4 ? richmenus.memberRM?.link4 : undefined,
        })

        setMemberRichmenuImageFile({
          preview: `${API.SETTINGS_UPLOADS_URL}richmenus/${richmenus.memberRM.picUrl}`,
        })
      } else {
        memberRichmenuForm.resetFields()

        setMemberRichmenuImageFile(undefined)
      }
    }

    // eslint-disable-next-line
  }, [richmenus, isRichmenuModalVisible])

  const handleRichmenuUpdate = (
    type: string,
    field: { file: any } | undefined,
    data: { linkA: any; linkB: any; linkC: any; linkD: any },
  ) => {
    if (type === 'defaultRM') {
      const paramData = {
        type: type,
        isDisplayed: richmenus.defaultRM?.isDisplayed,
        picUrl: field.file ? field.file : undefined,
        link1: data.linkA || '',
        link2: data.linkB || '',
        link3: data.linkC || '',
      }

      richmenuUpdateMutation.mutate(paramData)
    } else if (type === 'memberRM') {
      const paramData = {
        type: type,
        isDisplayed: richmenus.memberRM?.isDisplayed,
        picUrl: field.file ? field.file : undefined,
        link1: data.linkA || '',
        link2: data.linkB || '',
        link3: data.linkC || '',
        link4: data.linkD || '',
      }

      richmenuUpdateMutation.mutate(paramData)
    }
  }

  const handleRichmenuDelete = (type: string) => {
    const paramData = {
      type: type,
    }

    modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined className='text-red-600' />,
      content: 'リッチメニューを削除してもよろしいでしょうか？',
      okText: '削除',
      okButtonProps: {
        size: 'large',
        type: 'primary',
        danger: true,
      },
      cancelText: '閉じる',
      cancelButtonProps: {
        size: 'large',
      },
      centered: true,
      onOk() {
        richmenuDeleteMutation.mutate(paramData)
      },
    })
  }

  return (
    <>
      <Modal
        title='リッチメニュー設定'
        open={isRichmenuModalVisible}
        onCancel={hideRichmenuModal}
        footer={null}
        getContainer={false}
        destroyOnClose
        centered
        bodyStyle={{
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <m.div
          className='flex flex-col'
          variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_CONTAINER}
          initial='hidden'
          animate='show'
          exit='hidden'
        >
          <Divider>登録前のリッチメニュー</Divider>
          <m.div
            className='flex flex-col justify-center bg-amber-50 p-4 rounded mb-4'
            variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}
          >
            <Image
              src='/template-before.png'
              alt='テンプレート'
              preview={{
                mask: <EyeOutlined />,
                src: '/template-before.png',
                maskClassName: 'rounded',
              }}
              className='w-full rounded object-contain'
              fallback='/no-image.png'
            />
            <p className='my-4'>リッチメニューの画像は以下の要件を満たす必要があります</p>
            <ol className='custom-ol list-none list-outside mb-2'>
              <li>画像フォーマット：JPEGまたはPNG</li>
              <li>画像の幅サイズ（ピクセル）：1200px</li>
              <li>画像の高さサイズ（ピクセル）：405px</li>
              <li>最大ファイルサイズ：1MB</li>
            </ol>
          </m.div>
          <m.div
            className='border border-custom-gray p-4'
            variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}
          >
            <Form
              name='defaultRichmenuForm'
              form={defaultRichmenuForm}
              onFinish={(data) => {
                handleRichmenuUpdate('defaultRM', defaultRichmenuImageFile, data)
              }}
              layout='vertical'
              requiredMark={false}
              preserve={false}
              initialValues={{
                richmenuImage: undefined,
              }}
              scrollToFirstError
            >
              <div className='flex flex-col'>
                <div className='flex justify-end mb-4'>
                  <TapAnimation>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        handleRichmenuDelete('defaultRM')
                      }}
                      loading={richmenuDeleteMutation.isLoading}
                      disabled={richmenus.defaultRM ? false : true}
                    />
                  </TapAnimation>
                </div>
                <Form.Item
                  name='richmenuImage'
                  className='whitespace-pre-wrap text-center'
                  help={`※このリッチメニューは、まだ会員ではないユーザーに\n表示されます`}
                  valuePropName='file'
                >
                  <CustomUpload
                    accept='.jpg, .jpeg, .png'
                    listType='picture'
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={() => {
                      return false
                    }}
                    onChange={async (param) => {
                      checkRichMenuImageSize('defaultRM', param, setDefaultRichmenuImageFile)
                    }}
                  >
                    {defaultRichmenuImageFile?.preview ? (
                      <img
                        src={defaultRichmenuImageFile.preview}
                        alt='登録前のリッチメニュー'
                        style={{
                          maxHeight: '250px',
                        }}
                        className='w-full object-contain cursor-pointer'
                      />
                    ) : (
                      <div
                        style={{
                          height: '250px',
                          backgroundColor: '#fafafa',
                          border: '1px dashed #d9d9d9',
                        }}
                        className='flex justify-center items-center rounded cursor-pointer'
                      >
                        <TapAnimation>
                          <Button
                            type='dashed'
                            icon={<CameraTwoTone twoToneColor={publicSettings?.PRIMARY_COLOR} />}
                          >
                            アップロード
                          </Button>
                        </TapAnimation>
                      </div>
                    )}
                  </CustomUpload>
                </Form.Item>
                <Divider />
                <Form.Item
                  name='linkA'
                  className='mt-4'
                  rules={[
                    {
                      type: 'url',
                      message: '入力のURLが有効なURLではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='A部分のリンク先：'
                    placeholder={`例：${API.SITE_URL}`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='linkB'
                  className='mt-4'
                  rules={[
                    {
                      message: '入力の番号が有効な番号ではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='B部分のリンク先：'
                    placeholder={`例：${API.SITE_URL}`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='linkC'
                  className='mt-4'
                  rules={[
                    {
                      message: '入力の番号が有効な番号ではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='C部分のリンク先：'
                    placeholder={`tel：0123456789`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Divider />
                <div className='flex justify-center'>
                  <TapAnimation>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={richmenuUpdateMutation.isLoading}
                      disabled={
                        defaultRichmenuImageFile?.file ||
                        defaultRichmenuForm.getFieldValue('richmenuImage')
                          ? false
                          : true
                      }
                    >
                      設定する
                    </Button>
                  </TapAnimation>
                </div>
              </div>
            </Form>
          </m.div>
          <Divider>登録後のリッチメニュー</Divider>
          <m.div
            className='flex flex-col justify-center bg-amber-50 p-4 rounded mb-4'
            variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}
          >
            <Image
              src='/template-after.png'
              alt='テンプレート'
              preview={{
                mask: <EyeOutlined />,
                src: '/template-after.png',
                maskClassName: 'rounded',
              }}
              className='w-full rounded object-contain'
              fallback='/no-image.png'
            />
            <p className='my-4'>リッチメニューの画像は以下の要件を満たす必要があります</p>
            <ol className='custom-ol list-none list-outside mb-2'>
              <li>画像フォーマット：JPEGまたはPNG</li>
              <li>画像の幅サイズ（ピクセル）：1200px</li>
              <li>画像の高さサイズ（ピクセル）：810px</li>
              <li>最大ファイルサイズ：1MB</li>
            </ol>
          </m.div>
          <m.div
            className='border border-custom-gray p-4'
            variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}
          >
            <Form
              name='memberRichmenuForm'
              form={memberRichmenuForm}
              onFinish={(data) => {
                handleRichmenuUpdate('memberRM', memberRichmenuImageFile, data)
              }}
              layout='vertical'
              requiredMark={false}
              preserve={false}
              initialValues={{
                richmenuImage: undefined,
              }}
              scrollToFirstError
            >
              <div className='flex flex-col'>
                <div className='flex justify-end mb-4'>
                  <TapAnimation>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        handleRichmenuDelete('memberRM')
                      }}
                      loading={richmenuDeleteMutation.isLoading}
                      disabled={richmenus.memberRM ? false : true}
                    />
                  </TapAnimation>
                </div>
                <Form.Item
                  name='richmenuImage'
                  className='whitespace-pre-wrap text-center'
                  help={`※このリッチメニューは、会員のユーザーに\n表示されます`}
                  valuePropName='file'
                >
                  <CustomUpload
                    accept='.jpg, .jpeg, .png'
                    listType='picture'
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={() => {
                      return false
                    }}
                    onChange={async (param) => {
                      checkRichMenuImageSize('memberRM', param, setMemberRichmenuImageFile)
                    }}
                  >
                    {memberRichmenuImageFile?.preview ? (
                      <img
                        src={memberRichmenuImageFile.preview}
                        alt='登録前のリッチメニュー'
                        style={{
                          maxHeight: '250px',
                        }}
                        className='w-full object-contain cursor-pointer'
                      />
                    ) : (
                      <div
                        style={{
                          height: '250px',
                          backgroundColor: '#fafafa',
                          border: '1px dashed #d9d9d9',
                        }}
                        className='flex justify-center items-center rounded cursor-pointer'
                      >
                        <TapAnimation>
                          <Button
                            type='dashed'
                            icon={<CameraTwoTone twoToneColor={publicSettings?.PRIMARY_COLOR} />}
                          >
                            アップロード
                          </Button>
                        </TapAnimation>
                      </div>
                    )}
                  </CustomUpload>
                </Form.Item>
                <Divider />
                <Form.Item
                  name='linkA'
                  className='mt-4'
                  rules={[
                    {
                      type: 'url',
                      message: '入力のURLが有効なURLではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='A部分のリンク先：'
                    placeholder={`例：${API.SITE_URL}`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='linkB'
                  className='mt-4'
                  rules={[
                    {
                      message: '入力の番号が有効な番号ではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='B部分のリンク先：'
                    placeholder={`tel：0123456789`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='linkC'
                  className='mt-4'
                  rules={[
                    {
                      type: 'url',
                      message: '入力のURLが有効なURLではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='C部分のリンク先：'
                    placeholder={`例：${API.SITE_URL}`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='linkD'
                  className='mt-4'
                  rules={[
                    {
                      type: 'url',
                      message: '入力のURLが有効なURLではありません',
                    },
                  ]}
                >
                  <Input
                    addonBefore='D部分のリンク先：'
                    placeholder={`例：${API.SITE_URL}`}
                    onPressEnter={(e) => e.preventDefault()}
                    allowClear
                  />
                </Form.Item>
                <Divider />
                <div className='flex justify-center'>
                  <TapAnimation>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={richmenuUpdateMutation.isLoading}
                      disabled={
                        memberRichmenuImageFile?.file ||
                        memberRichmenuForm.getFieldValue('richmenuImage')
                          ? false
                          : true
                      }
                    >
                      設定する
                    </Button>
                  </TapAnimation>
                </div>
              </div>
            </Form>
          </m.div>
        </m.div>
      </Modal>
      {contextHolder}
    </>
  )
}

export default RichmenuModal
