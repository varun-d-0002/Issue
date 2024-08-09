import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Form, Input, message, Divider, Select, DatePicker } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import liff from '@line/liff'
import { m } from 'framer-motion'
import * as COMMONS from 'common/constant'
import * as UTILITY from 'common/utility'
import * as API from 'common/api'
import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import NumericInputComponent from 'components/common/NumericInput'
import dayjs from 'dayjs'

const { TextArea } = Input
const Register = (props: Props) => {
  const { logo, publicSettings } = props

  const { liffId } = useParams()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const campaign = searchParams.get('campaign')
  const { Option } = Select
  const navigate = useNavigate()
  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const [registerProfileForm] = Form.useForm()
  const [accessToken, setAccessToken] = useState(undefined)

  useQuery(
    [API.QUERY_KEY_CLIENT_PERSONAL_INFO, accessToken],
    () => API.CLIENT_GET_PERSONAL_INFO(accessToken),
    {
      enabled: !!accessToken,
      onSuccess: (response) => {
        if (isMountedRef.current) {
          if (response?.data.memberId && response?.data.memberCode)
            navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
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
  const registerProfileMutation = useMutation(API.CLIENT_REGISTER_PROFILE, {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        message.success(COMMONS.SUCCESS_REGISTER_MSG)
        navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`, { replace: true })
      }
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
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
    try {
      //@ts-expect-error
      setAccessToken(liff.getAccessToken())
    } catch (err) {
      navigate(`${COMMONS.CLIENT_LOGIN_ROUTE}/${liffId}`)
    }

    // eslint-disable-next-line
  }, [liffId])

  const registerProfileHandler = (data: {
    lastName: any
    firstName: any
    lastNameKana: any
    firstNameKana: any
    telephone: any
    gender: any
    dateOfBirth: any
    serviceAreas: any
    serviceTypes: any
    prefecture: any
    postalCode: any
    address: any
    building: any
  }) => {
    const paramData = {
      accessToken: accessToken,
      lastName: data.lastName,
      firstName: data.firstName,
      lastNameKana: data.lastNameKana,
      firstNameKana: data.firstNameKana,
      telephone: data.telephone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      postalCode: data.postalCode,
      prefecture: data.prefecture,
      address: data.address,
      building: data.building,
      serviceAreas: data.serviceAreas,
      serviceTypes: data.serviceTypes,
    }
    if (!data.prefecture) {
      API.GET_ADDRESS_BY_POSTAL_CODE(data.postalCode).then((text) => {
        //@ts-expect-error
        const matcher = text.match(/({".*"]})/)

        if (matcher) {
          const json = JSON.parse(matcher[0])
          const address = json[data.postalCode]

          if (address && address[0] && address[1]) {
            const index = address[0] - 1

            paramData.prefecture = COMMONS.PREFECTURES[index]['value']
            registerProfileMutation.mutate(paramData)
          } else {
            message.warning(COMMONS.WARN_POSTAL_CODE_WRONG_MSG)
          }
        }
      })
    } else {
      registerProfileMutation.mutate(paramData)
    }
  }
  const postalSearchHandler = () => {
    const postalCode = registerProfileForm.getFieldValue('postalCode')

    if (postalCode.length === 7) {
      API.GET_ADDRESS_BY_POSTAL_CODE(postalCode).then((text) => {
        //@ts-expect-error
        const matcher = text.match(/({".*"]})/)

        if (matcher) {
          const json = JSON.parse(matcher[0])
          const address = json[postalCode]
          if (address && address[0] && address[1]) {
            const index = address[0] - 1

            registerProfileForm.setFieldsValue({
              prefecture: `${COMMONS.PREFECTURES[index]['value']}`,
              address: `${COMMONS.PREFECTURES[index]['label']}${address[1]}${address[2]}${
                address[3] ? address[3] : ''
              }`,
            })
          } else {
            message.warning(COMMONS.WARN_POSTAL_CODE_WRONG_MSG)
          }
        }
      })
    }
  }

  return (
    <>
      <BaseAnimation>
        <m.div
          variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
          initial='hidden'
          animate='show'
          exit='hidden'
          className='py-8'
        >
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='flex justify-center'>
            {logo ? (
              <img
                style={{
                  maxHeight: '150px',
                }}
                alt='ロゴ'
                src={logo ? API.API_UPLOADS + logo : '/logo.svg'}
                className='rounded max-w-full object-contain'
              />
            ) : (
              <img
                style={{
                  maxHeight: '150px',
                }}
                alt='ロゴ'
                src='/logo.svg'
                className='rounded max-w-full object-contain'
              />
            )}
          </m.div>
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mt-4'>
            <p
              className='text-center text-2xl font-bold w-full border-b border-t-0 border-r-0 border-t-0 border-l-0 border-dashed py-4 px-6 mb-8'
              style={{ color: publicSettings?.PRIMARY_COLOR }}
            >
              {campaign ? 'キャンペーン応募' : 'お客様情報登録'}
            </p>
          </m.div>
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='my-8'>
            <p className='text-center text-base font-bold'>下記内容についてご登録ください</p>
          </m.div>
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mb-8'>
            <Form
              form={registerProfileForm}
              onFinish={registerProfileHandler}
              size='large'
              layout='horizontal'
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              labelAlign='left'
              requiredMark={false}
              colon={false}
              scrollToFirstError
            >
              <Form.Item required label='氏名（漢字）' className='px-6 mb-0'>
                <Form.Item
                  name='lastName'
                  className='inline-block mr-2'
                  style={{ width: 'calc(50% - 0.25rem)' }}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '姓を入力してください',
                    },
                    {
                      max: 50,
                      message: '50文字未満である必要があります',
                    },
                  ]}
                >
                  <Input placeholder='例：山田' onPressEnter={(e) => e.preventDefault()} />
                </Form.Item>
                <Form.Item
                  name='firstName'
                  className='inline-block'
                  style={{ width: 'calc(50% - 0.25rem)' }}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '名を入力してください',
                    },
                    {
                      max: 50,
                      message: '50文字未満である必要があります',
                    },
                  ]}
                >
                  <Input placeholder='例：太郎' onPressEnter={(e) => e.preventDefault()} />
                </Form.Item>
              </Form.Item>
              <Form.Item required label='氏名（フリガナ）' className='px-6 mb-0'>
                <Form.Item
                  name='lastNameKana'
                  className='inline-block mr-2'
                  style={{ width: 'calc(50% - 0.25rem)' }}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '姓を入力してください',
                    },
                    {
                      max: 50,
                      message: '50文字未満である必要があります',
                    },
                    {
                      pattern: new RegExp('[\u30a0-\u30ff]'),
                      message: '全角カタカナで入力してください',
                    },
                  ]}
                >
                  <Input placeholder='例：ヤマダ' onPressEnter={(e) => e.preventDefault()} />
                </Form.Item>
                <Form.Item
                  name='firstNameKana'
                  className='inline-block'
                  style={{ width: 'calc(50% - 0.25rem)' }}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '名を入力してください',
                    },
                    {
                      max: 50,
                      message: '50文字未満である必要があります',
                    },
                    {
                      pattern: new RegExp('[\u30a0-\u30ff]'),
                      message: '全角カタカナで入力してください',
                    },
                  ]}
                >
                  <Input placeholder='例：タロウ' onPressEnter={(e) => e.preventDefault()} />
                </Form.Item>
              </Form.Item>
              <Form.Item label='性別' name='gender' className='px-6'>
                <Select placeholder='性別' allowClear>
                  {COMMONS.GENDER?.map((oc) => (
                    <Option key={oc?.value + ''} value={oc?.value + ''} label={oc?.label}>
                      {oc?.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label='電話番号'
                name='telephone'
                className='px-6'
                rules={[
                  {
                    required: true,
                    message: '電話番号を入力してください',
                  },
                  {
                    max: 15,
                    message: '電話番号は15数字未満である必要があります',
                  },
                ]}
              >
                <Input placeholder='例：06-6271-5080' allowClear />
              </Form.Item>
              <Form.Item
                name='dateOfBirth'
                label='生年月日'
                rules={[
                  {
                    required: true,
                    message: '生年月日を入力してください',
                  },
                ]}
                className='px-6'
              >
                <DatePicker
                  defaultPickerValue={dayjs('2000-01-01', 'YYYY-MM-DD')}
                  className='w-full'
                  inputReadOnly
                  placeholder='生年月日'
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name='postalCode'
                label='郵便番号'
                className='px-6'
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '郵便番号を入力してください',
                  },
                  {
                    len: 7,
                    message: '',
                  },
                ]}
              >
                <NumericInputComponent
                  placeholder='例：4600008'
                  maxLength={7}
                  allowClear
                  onPressEnter={(e) => {
                    e.preventDefault()
                    postalSearchHandler()
                  }}
                  onChange={(e) => {
                    postalSearchHandler()
                  }}
                  pattern='[0-9]*'
                  inputMode='numeric'
                />
              </Form.Item>
              <Form.Item hidden name='prefecture'>
                <Input />
              </Form.Item>
              <Form.Item label='住所' className='px-6 mb-0' required>
                <Form.Item
                  name='address'
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '住所を入力してください',
                    },
                  ]}
                >
                  <TextArea autoSize placeholder='愛知県名古屋市中区栄1-1' />
                </Form.Item>
                <Form.Item
                  name='building'
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '住所を入力してください',
                    },
                  ]}
                >
                  <TextArea autoSize placeholder='◯◯ビル101' />
                </Form.Item>
              </Form.Item>
              <Form.Item
                label='ご希望種別'
                name='serviceTypes'
                rules={[
                  {
                    required: true,
                    message: 'ご希望種別を入力してください',
                  },
                ]}
                className='px-6'
              >
                <Select placeholder='ご希望種別' mode='multiple' showSearch={false} allowClear>
                  {COMMONS.PREFERENCETYPES?.map((oc) => (
                    <Option key={oc?.value + ''} value={oc?.value + ''} label={oc?.label}>
                      {oc?.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label='物件希望エリア'
                name='serviceAreas'
                className='px-6'
                rules={[
                  {
                    required: true,
                    message: '物件希望エリアを入力してください',
                  },
                ]}
              >
                <Select placeholder='物件希望エリア' mode='multiple' showSearch={false} allowClear>
                  <Option value='小牧市'>小牧市</Option>
                  <Option value='豊山町'>豊山町</Option>
                  <Option value='名古屋市'>名古屋市</Option>
                  <Option value='北名古屋市'>北名古屋市</Option>
                  <Option value='岩倉市'>岩倉市</Option>
                  <Option value='春日井市'>春日井市</Option>
                  <Option value='その他'>その他</Option>
                </Select>
              </Form.Item>

              <Divider />
              <div className='flex justify-center px-4'>
                <TapAnimation className='w-full'>
                  <Button
                    type='primary'
                    className='w-full h-12'
                    htmlType='submit'
                    size='large'
                    loading={registerProfileMutation.isLoading}
                  >
                    登録する
                  </Button>
                </TapAnimation>
              </div>
            </Form>
          </m.div>
        </m.div>
      </BaseAnimation>
    </>
  )
}

export default Register
