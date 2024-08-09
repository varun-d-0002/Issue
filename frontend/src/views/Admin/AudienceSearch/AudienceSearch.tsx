import React, { useState } from 'react'
import {
  Button,
  Col,
  Form,
  message,
  Row,
  Modal,
  DatePicker,
  Input,
  Divider,
  Select,
  Card,
  InputNumber,
  Statistic,
} from 'antd'
import { UndoOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import equal from 'fast-deep-equal'
import * as COMMONS from 'common/constant'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'
import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import PageHeader from 'components/admin/PageHeader'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import 'moment/locale/ja'
import styled from 'styled-components'
import dayjs from 'dayjs'

moment.locale('ja')

const { Option } = Select

const CustomDatePicker = styled(DatePicker)`
  .ant-picker-input > input {
    text-align: center;
  }
`
const AudienceSearch = (props: { publicSettings?: any }) => {
  const { publicSettings } = props
  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [audienceForm] = Form.useForm()
  const [membersFilterForm] = Form.useForm()
  const [resultTotal, setResultTotal] = useState(0)
  const [audienceSearchedValue, setAudienceSearchedValue] = useState(undefined)
  const [modal, contextHolder] = Modal.useModal()
  const currentDate = dayjs()
  const audienceCreateMutation = useMutation(API.ADMIN_CREATE_AUDIENCE, {
    onSuccess: () => {
      message.success(COMMONS.SUCCESS_CREATE_MSG)
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_AUDIENCES],
      })
      navigate(COMMONS.ADMIN_AUDIENCES_ROUTE)
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
        message.warning(COMMONS.WARN_AUDIENCE_NAME_EXIST_MSG)
      } else if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
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

  const searchAudienceMembersMutation = useMutation(API.ADMIN_SEARCH_AUDIENCE_MEMBERS, {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        setResultTotal(response?.data?.count || 0)
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
  const clearFilters = () => {
    membersFilterForm.resetFields()
  }
  const handleCreate = () => {
    if (resultTotal > 0) {
      membersFilterForm
        .validateFields()
        .then((filterValues) => {
          if (equal(filterValues, audienceSearchedValue)) {
            modal.confirm({
              title: 'オーディエンス作成',
              content: (
                <>
                  <Form
                    form={audienceForm}
                    name='audienceForm'
                    layout='vertical'
                    preserve={false}
                    scrollToFirstError
                  >
                    <Row justify='center'>
                      <Col span={24}>
                        <Form.Item
                          name='name'
                          label='オーディエンス名'
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: 'オーディエンス名を入力してください',
                            },
                            {
                              max: 50,
                              message: 'オーディエンス名は50文字以内である必要があります',
                            },
                          ]}
                        >
                          <Input allowClear maxLength={50} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </>
              ),
              okText: '確認',
              okType: 'primary',
              cancelText: '閉じる',
              centered: true,
              onOk(close) {
                audienceForm
                  .validateFields()
                  .then((audienceValues) => {
                    const paramData = {
                      ...processAudienceSearchParams(filterValues),
                      audienceName: audienceValues.name,
                    }

                    audienceCreateMutation.mutate(paramData, {
                      onSuccess: (data, variables, context) => {
                        close()
                      },
                    })
                  })
                  .catch((error) => {})
              },
            })
          } else {
            message.warning(COMMONS.WARN_AUDIENCE_NOT_MATCH_MSG)
          }
        })
        .catch((error) => {})
    } else {
      message.warning(COMMONS.WARN_AUDIENCE_COUNT_ZERO_MSG)
    }
  }

  const processAudienceSearchParams = (data: {
    fullNameFilter: undefined
    genderFilter: undefined
    ageMinFilter: undefined
    ageMaxFilter: undefined
    countVisitMinFilter: undefined
    countVisitMaxFilter: undefined
    lastVisitMinFilter: undefined
    lastVisitMaxFilter: undefined
    telephoneFilter: undefined
    occupationFilter: undefined
    addressFilter: undefined
    serviceTypesFilter: undefined
    serviceAreasFilter: undefined
  }) => {
    let params = {
      fullName: data?.fullNameFilter ? data?.fullNameFilter : undefined,
      gender: data?.genderFilter ? data?.genderFilter : undefined,
      dateOfBirthMin: data?.ageMinFilter
        ? currentDate
            .subtract(1, 'year')
            .add(1, 'day')
            .subtract(data.ageMinFilter, 'year')
            .format('YYYY-MM-DD')
        : undefined,
      dateOfBirthMax: data?.ageMaxFilter
        ? currentDate.subtract(data.ageMaxFilter, 'year').format('YYYY-MM-DD')
        : undefined,
      countVisitMinFilter: data?.countVisitMinFilter ? data?.countVisitMinFilter : undefined,
      countVisitMaxFilter: data?.countVisitMaxFilter ? data?.countVisitMaxFilter : undefined,
      lastVisitMinFilter: data?.lastVisitMinFilter ? data?.lastVisitMinFilter : undefined,
      lastVisitMaxFilter: data?.lastVisitMaxFilter ? data?.lastVisitMaxFilter : undefined,
      telephoneFilter: data?.telephoneFilter ? data?.telephoneFilter : undefined,
      occupationFilter: data?.occupationFilter ? data?.occupationFilter : undefined,
      addressFilter: data?.addressFilter ? data?.addressFilter : undefined,
      serviceTypes: data?.serviceTypesFilter ? data?.serviceTypesFilter : undefined,
      serviceAreas: data?.serviceAreasFilter ? data?.serviceAreasFilter : undefined,
    }

    return params
  }

  const handleFilter = () => {
    membersFilterForm
      .validateFields()
      .then((values) => {
        if (!equal(values, audienceSearchedValue)) {
          const paramData = processAudienceSearchParams(values)

          setAudienceSearchedValue(values)

          searchAudienceMembersMutation.mutate(paramData)
        }
      })
      .catch((error) => {})
  }

  return (
    <>
      <BaseAnimation>
        <PageHeader publicSettings={publicSettings} title='新規作成' />
        <Card
          headStyle={{
            color: publicSettings?.PRIMARY_COLOR,
            backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR,
          }}
          style={{
            borderColor: publicSettings?.PRIMARY_COLOR,
          }}
          bordered={false}
          className='shadow-none'
        >
          <Row>
            <Col xs={24}>
              <Form
                form={membersFilterForm}
                onFinish={handleFilter}
                layout='vertical'
                size='large'
                initialValues={{
                  fullNameFilter: undefined,
                  genderFilter: undefined,
                  ageMinFilter: undefined,
                  ageMaxFilter: undefined,
                  countVisitMinFilter: undefined,
                  countVisitMaxFilter: undefined,
                  lastVisitMinFilter: undefined,
                  lastVisitMaxFilter: undefined,
                  telephoneFilter: undefined,
                  occupationFilter: undefined,
                  addressFilter: undefined,
                  serviceTypesFilter: undefined,
                  serviceAreasFilter: undefined,
                }}
              >
                <Row gutter={[8, 8]} justify='end' className='mb-4'>
                  <Col>
                    <TapAnimation>
                      <Button
                        type='dashed'
                        icon={<UndoOutlined rev={undefined} />}
                        onClick={clearFilters}
                      >
                        フィルタークリア
                      </Button>
                    </TapAnimation>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} justify='start'>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='氏名' name='fullNameFilter' className='mb-4'>
                      <Input placeholder='例：山田' allowClear />
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='性別' name='genderFilter' className='mb-4'>
                      <Select placeholder='性別を選択してください' allowClear>
                        {COMMONS.GENDER.map((gender) => (
                          <Option key={gender.value} value={gender.value}>
                            {gender.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='最低年齢' name='ageMaxFilter' className='mb-4'>
                      <InputNumber
                        placeholder='例：18'
                        addonAfter='才'
                        min={1}
                        className='w-full'
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='最大年齢' name='ageMinFilter' className='mb-4'>
                      <InputNumber
                        placeholder='例：20'
                        addonAfter='才'
                        min={1}
                        className='w-full'
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='最低来店回数' name='countVisitMinFilter' className='mb-4'>
                      <InputNumber placeholder='例：1' addonAfter='回' min={1} className='w-full' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='最大来店回数' name='countVisitMaxFilter' className='mb-4'>
                      <InputNumber placeholder='例：5' addonAfter='回' min={1} className='w-full' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='来店日から' name='lastVisitMinFilter' className='mb-4'>
                      <CustomDatePicker className='w-full' inputReadOnly />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='来店日まで' name='lastVisitMaxFilter' className='mb-4 w-full'>
                      <CustomDatePicker className='w-full' inputReadOnly />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='電話番号' name='telephoneFilter' className='mb-4'>
                      <Input placeholder='例：080-3641-2545' allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='ご希望種別' name='serviceTypesFilter' className='mb-4 w-full'>
                      <Select placeholder='ご希望種別' mode='multiple' allowClear>
                        {COMMONS.PREFERENCETYPES?.map((oc) => (
                          <Option key={oc?.value + ''} value={oc?.value + ''} label={oc?.label}>
                            {oc?.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item
                      help='物件希望エリア'
                      name='serviceAreasFilter'
                      className='mb-4 w-full'
                    >
                      <Select placeholder='物件希望エリア' mode='multiple' allowClear>
                        <Option value='小牧市'>小牧市</Option>
                        <Option value='豊山町'>豊山町</Option>
                        <Option value='名古屋市'>名古屋市</Option>
                        <Option value='北名古屋市'>北名古屋市</Option>
                        <Option value='岩倉市'>岩倉市</Option>
                        <Option value='春日井市'>春日井市</Option>
                        <Option value='その他'>その他</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item
                      help='郵便番号・都道府県・住所'
                      name='addressFilter'
                      className='mb-4'
                    >
                      <Input placeholder='例：愛知県名古屋○○' allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className='mt-4' justify='center'>
                  <Col>
                    <Button
                      icon={<SearchOutlined rev={undefined} />}
                      type='primary'
                      htmlType='submit'
                      className='w-32'
                      onClick={handleFilter}
                    >
                      検索
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Divider />
            <Col span={24}>
              <Card
                headStyle={{
                  backgroundColor: publicSettings?.PRIMARY_COLOR,
                }}
                className='text-center'
                type='inner'
                title={<span className='font-normal text-white '>検索結果：</span>}
              >
                <Statistic
                  value={resultTotal}
                  valueStyle={{
                    color: publicSettings?.PRIMARY_COLOR,
                    fontWeight: 'bold',
                  }}
                  prefix={<UserOutlined className='p-1' rev={undefined} />}
                  suffix='件'
                />
              </Card>
            </Col>
            <Divider />

            <Col span={24} className='text-center mb-4'>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                className='w-44'
                onClick={handleCreate}
              >
                作成
              </Button>
            </Col>
          </Row>
        </Card>
        {contextHolder}
      </BaseAnimation>
    </>
  )
}

export default AudienceSearch
