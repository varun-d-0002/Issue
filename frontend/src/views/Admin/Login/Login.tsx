import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, message } from 'antd'
import * as API from 'common/api'
import * as CONSTANTS from '../../../common/constant'
import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import { m } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const Login = (props: Props) => {
  const { logo, publicSettings } = props
  const navigate = useNavigate()
  const [form] = Form.useForm()

  useQuery([API.QUERY_KEY_ADMIN_CHECK_SESSION], API.ADMIN_CHECK_SESSION, {
    onSuccess: () => {
      navigate(CONSTANTS.ADMIN_MEMBERS_ROUTE)
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === CONSTANTS.RESPONSE_SYSTEM_ERROR) {
        message.error({
          content: CONSTANTS.ERROR_SYSTEM_MSG,
          key: CONSTANTS.MESSAGE_SYSTEM_ERROR_KEY,
        })
      }
    },
  })

  const loginMutation = useMutation(API.ADMIN_LOGIN, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_LOGIN_MSG)
      navigate(CONSTANTS.ADMIN_MEMBERS_ROUTE)
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === CONSTANTS.RESPONSE_PERMISSION_ERROR) {
        message.warning(CONSTANTS.ERROR_ADMIN_LOGIN_MISMATCH_MSG)
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

  const loginHandler = (formData: { [param: string]: string }) => {
    const data = {
      username: formData['loginUsername'],
      password: formData['loginPassword'],
    }

    loginMutation.mutate(data, {
      onSettled: () => {
        form.resetFields()
      },
    })
  }
  const handleRedirect = () => {
    navigate(CONSTANTS.ADMIN_LOGIN_DEMO)
  }

  return (
    <>
      <BaseAnimation>
        <div className='flex h-screen'>
          <m.div
            variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_CONTAINER}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='w-11/12 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 p-5 m-auto'
          >
            <m.div variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM} className='flex mb-4'>
              <img
                src={logo ? `${API.SETTINGS_UPLOADS_URL}settings/${logo}` : 'logo.svg'}
                alt='ロゴ'
                className='mx-auto rounded max-w-full'
                style={{ maxHeight: '150px' }}
              />
            </m.div>
            <m.div variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM} className='mb-10'>
              <p className='text-lg text-center'>
                {publicSettings?.TITLE || import.meta.env.VITE_SYSTEM_TITLE}
              </p>
            </m.div>
            <m.div variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_ITEM}>
              <Form name='loginForm' onFinish={loginHandler} size='large' form={form}>
                <Form.Item
                  name='loginUsername'
                  rules={[
                    {
                      required: true,
                      message: 'ユーザー名を入力してください',
                    },
                  ]}
                >
                  <Input
                    disabled={loginMutation.isLoading}
                    name='loginUsername'
                    autoCapitalize='none'
                    prefix={<UserOutlined rev={undefined} />}
                    placeholder='ユーザー名'
                    autoComplete='username'
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='loginPassword'
                  rules={[
                    {
                      required: true,
                      message: 'パスワードを入力してください',
                    },
                  ]}
                >
                  <Input.Password
                    disabled={loginMutation.isLoading}
                    name='loginPassword'
                    prefix={<LockOutlined rev={undefined} />}
                    type='password'
                    placeholder='パスワード'
                    autoComplete='current-password'
                  />
                </Form.Item>
                <Form.Item className='text-center'>
                  <TapAnimation>
                    <Button
                      type='primary'
                      htmlType='submit'
                      className='px-8 w-32'
                      loading={loginMutation.isLoading}
                    >
                      ログイン
                    </Button>
                  </TapAnimation>
                </Form.Item>
              </Form>
              <>
                <Divider />
                <div className='text-center'>
                  <TapAnimation>
                    <Button
                      type='primary'
                      className='m-1 w-32'
                      loading={loginMutation.isLoading}
                      onClick={handleRedirect}
                    >
                      デモログイン
                    </Button>
                  </TapAnimation>
                </div>
              </>
            </m.div>
          </m.div>
        </div>
      </BaseAnimation>
    </>
  )
}

export default Login
