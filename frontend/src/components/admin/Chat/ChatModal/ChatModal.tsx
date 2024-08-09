import { SendOutlined, DownloadOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Form, Image, Input, message, Modal, Row, Tooltip } from 'antd'
import * as API from 'common/api'
import * as COMMONS from 'common/constant'
import * as UTILITY from 'common/utility'

import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { m } from 'framer-motion'
const { TextArea } = Input

const ChatModal = (props: {
  publicSettings?: any
  currentMember?: any
  isChatModalVisible?: boolean
  hideChatModal?: () => void
}) => {
  const { publicSettings, currentMember, isChatModalVisible, hideChatModal } = props

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const currentMemberRef = useRef()
  const messageContainerRef = useRef<any>(null)
  const [chatForm] = Form.useForm()

  const [chats, setChats] = useState([])

  const scrollToMessageContainer = () => {
    if (messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  useQuery([API.QUERY_KEY_ADMIN_CHATS, currentMember], () => API.ADMIN_GET_CHATS(currentMember), {
    enabled: !!currentMember && isChatModalVisible,
    onSuccess: (response) => {
      if (isMountedRef.current) {
        setChats(response?.data || [])
        scrollToMessageContainer()
      }
    },
    onError: (error: FetchError) => {
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

  const sendChatMutation = useMutation(API.ADMIN_SEND_CHAT, {
    onSuccess: () => {
      message.success(COMMONS.SUCCESS_MESSAGE_SENT_MSG)
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_CHATS] })
      chatForm.resetFields()
    },
    onError: (error: FetchError) => {
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
    currentMemberRef.current = currentMember
  }, [currentMember])

  useEffect(() => {
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_CHAT, (response) => {
      if (response !== undefined && Object.keys(response).length !== 0) {
        // @ts-expect-error
        if (response?.memberId === currentMemberRef.current?.memberId) {
          queryClient.invalidateQueries({
            queryKey: [API.QUERY_KEY_ADMIN_CHATS],
          })
        }
      }
    })

    return () => {
      socket.off(API.SOCKET_CHAT)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  const handleChat = (data: { contents: any }) => {
    const paramData = {
      contents: data?.contents,
      memberId: currentMember?.memberId,
    }

    sendChatMutation.mutate(paramData)
  }

  return (
    <>
      <Modal
        title={`${
          currentMember?.lastName && currentMember?.firstName
            ? `${currentMember?.lastName || 'ー'} ${currentMember?.firstName || 'ー'}`
            : currentMember?.displayName || 'ー'
        }様`}
        open={isChatModalVisible}
        onCancel={hideChatModal}
        footer={null}
        centered
        destroyOnClose
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <BaseAnimation>
          <m.div
            className='pb-4 overflow-auto'
            style={{
              minHeight: '60vh',
              maxHeight: '60vh',
            }}
          >
            {chats.map((chat: any) => (
              <Row key={chat?.chatId}>
                <Col span={22} offset={chat?.source === 'user' ? 0 : 2}>
                  <div className='m-1'>
                    {chat?.source === 'user' ? (
                      <>
                        <div className='flex flex-row items-start justify-start'>
                          <div className='mr-1'>
                            <Avatar
                              size={40}
                              src={
                                currentMember?.picUrl ? (
                                  <Image
                                    preview={false}
                                    width={40}
                                    height={40}
                                    src={`${currentMember.picUrl}/small`}
                                    fallback='/no-image.png'
                                  />
                                ) : (
                                  <Image
                                    src='/no-image.png'
                                    width={40}
                                    height={40}
                                    preview={false}
                                  />
                                )
                              }
                            />
                          </div>
                          {chat?.contentType === COMMONS.MESSAGE_TYPE_TEXT ? (
                            <div
                              className='text-white rounded-lg p-2 cursor-pointer mr-1'
                              style={{
                                backgroundColor: COMMONS.CUSTOM_GREEN,
                              }}
                            >
                              <span className='whitespace-pre-wrap'>{chat?.contents || ''}</span>
                            </div>
                          ) : chat?.contentType === COMMONS.MESSAGE_TYPE_IMAGE ? (
                            <Image
                              width={200}
                              src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`}
                            />
                          ) : chat?.contentType === COMMONS.MESSAGE_TYPE_AUDIO ? (
                            <figure>
                              <audio controls src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`} />
                            </figure>
                          ) : chat?.contentType === COMMONS.MESSAGE_TYPE_VIDEO ? (
                            <video controls width={200}>
                              <source
                                src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`}
                                type='video/mp4'
                              />
                            </video>
                          ) : chat?.contentType === COMMONS.MESSAGE_TYPE_FILE ? (
                            <div className='w-1/2 mb-4'>
                              <a
                                href={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`}
                                download={chat.contents}
                                target='_blank'
                                rel='noreferrer'
                              >
                                <Button block icon={<DownloadOutlined rev={undefined} />}>
                                  ダウンロード
                                </Button>
                              </a>
                              <p
                                className='hover:opacity-75'
                                style={{
                                  fontSize: '12px',
                                  color: COMMONS.PRIMARY_COLOR,
                                }}
                              >
                                {chat.contents}
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className='flex flex-row items-start justify-start'>
                          <span
                            className='whitespace-pre-wrap'
                            style={{
                              fontSize: '10px',
                              color: COMMONS.GRAY_COLOR,
                              marginLeft: '45px',
                            }}
                          >
                            {chat?.createdAt
                              ? moment(chat.createdAt).format('YYYY年M月D日 HH:mm')
                              : ''}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='flex flex-row items-start justify-end'>
                          {chat?.contentType === COMMONS.MESSAGE_TYPE_TEXT ? (
                            <div
                              className='text-white rounded-lg p-2 cursor-pointer'
                              style={{
                                backgroundColor: publicSettings?.PRIMARY_COLOR,
                              }}
                            >
                              <span className='whitespace-pre-wrap'>{chat?.contents || ''}</span>
                            </div>
                          ) : chat?.contentType === COMMONS.MESSAGE_TYPE_IMAGE ? (
                            <Image
                              width={200}
                              src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        <div className='flex flex-row items-start justify-end'>
                          <span
                            className='whitespace-pre-wrap'
                            style={{
                              fontSize: '10px',
                              color: COMMONS.GRAY_COLOR,
                            }}
                          >
                            {chat?.createdAt
                              ? moment(chat.createdAt).format('YYYY年M月D日 HH:mm')
                              : ''}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            ))}
            <div ref={messageContainerRef}></div>
          </m.div>
          <div
            className='py-4 border-t-2 border-solid'
            style={{
              borderColor: publicSettings?.PRIMARY_COLOR,
            }}
          >
            <Row>
              <Col span={24}>
                <Form
                  form={chatForm}
                  onFinish={handleChat}
                  size='large'
                  colon={false}
                  requiredMark={false}
                  initialValues={{
                    contents: undefined,
                  }}
                >
                  <Row align='top' gutter={[8, 8]}>
                    <Col span={24}>
                      <div className='flex justify-end'>
                        <Tooltip title='送信' placement='top'>
                          <TapAnimation>
                            <Button
                              type='primary'
                              size='large'
                              style={{ borderColor: COMMONS.WHITE_COLOR }}
                              icon={
                                <SendOutlined
                                  style={{ color: COMMONS.WHITE_COLOR }}
                                  rev={undefined}
                                />
                              }
                              htmlType='submit'
                              loading={sendChatMutation.isLoading}
                            />
                          </TapAnimation>
                        </Tooltip>
                      </div>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        className='block'
                        name='contents'
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'メッセージを入力してください',
                          },
                        ]}
                      >
                        <TextArea
                          allowClear
                          bordered
                          showCount
                          autoSize={{ minRows: 5, maxRows: 10 }}
                          maxLength={5000}
                          placeholder='メッセージを入力してください'
                          autoFocus={true}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </BaseAnimation>
      </Modal>
    </>
  )
}

export default ChatModal
