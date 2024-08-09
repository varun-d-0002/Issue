import { useState, useEffect } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Tag,
  Modal,
  Row,
  InputNumber,
  Switch,
  Divider,
  DatePicker,
  Descriptions,
} from 'antd'

import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import dayjs from 'dayjs'
const CustomDatePicker = styled(DatePicker)`
  .ant-picker-input > input {
    text-align: center;
  }
`
const currentDate = dayjs()
const MemberEditModalComponent = (props: {
  publicSettings?: any
  currentMember?: any
  memberEditMutation?: any
  hideMemberEditModal?: any
  isMemberEditModalVisible?: any
  renewPickerValue?: any
}) => {
  const {
    currentMember,
    publicSettings,
    memberEditMutation,
    isMemberEditModalVisible,
    hideMemberEditModal,
    renewPickerValue,
  } = props
  const [isEditPickerOpen, setIsEditPickerOpen] = useState(false)
  const [memberEditForm] = Form.useForm()
  const [editPickerValue, setEditPickerValue] = useState<any>(dayjs().toDate())

  useEffect(() => {
    if (isMemberEditModalVisible && currentMember?.memberId) {
      setEditPickerValue(
        currentMember?.memberSince ? dayjs(currentMember?.memberSince).toDate() : dayjs().toDate(),
      )

      memberEditForm.setFieldsValue({
        memberId: currentMember?.memberId,
        kakeruPoint: currentMember?.kakeruPoint,
        memberSince: isMobile
          ? currentMember?.memberSince || ''
          : currentMember?.memberSince
          ? dayjs(currentMember?.memberSince)
          : undefined,
      })
    }
  }, [currentMember, memberEditForm, isMemberEditModalVisible])
  const handleMemberEdit = (data: any) => {
    const paramData = {
      memberId: currentMember?.memberId,
      memberSince: dayjs(data.memberSince).format('YYYY-MM-DD'),
      kakeruPointIsAdd: data.kakeruPointIsAdd,
      kakeruPoint: data.kakeruPoint,
    }

    memberEditMutation.mutate(paramData)
  }

  return (
    <>
      <Modal
        title='会員変更'
        open={isMemberEditModalVisible}
        onCancel={hideMemberEditModal}
        footer={null}
        destroyOnClose
        centered
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Row>
          <Col span={24}>
            <div className='text-center mb-4'>
              {currentMember?.picUrl !== '' && currentMember?.picUrl !== null ? (
                <Image
                  preview={{
                    mask: <EyeOutlined rev={undefined} />,
                    src: currentMember.picUrl,
                    maskClassName: 'rounded-full',
                  }}
                  width={100}
                  height={100}
                  className='rounded-full'
                  src={`${currentMember.picUrl}/large`}
                  fallback='/no-image.png'
                />
              ) : (
                <Image
                  src='/no-image.png'
                  width={100}
                  height={100}
                  className='rounded-full'
                  preview={{
                    mask: <EyeOutlined rev={undefined} />,
                    src: '/no-image.png',
                    maskClassName: 'rounded-full',
                  }}
                />
              )}
            </div>
            <p className='text-center font-bold text-xl'>
              {currentMember?.lastName || 'ー'} {currentMember?.firstName || 'ー'}様
            </p>
            <p className='text-center text-sm'>
              （{currentMember?.lastNameKana || 'ー'} {currentMember?.firstNameKana || 'ー'}）
            </p>
            <Divider>会員情報</Divider>
            <Descriptions column={1} layout='horizontal' bordered>
              <Descriptions.Item label='会員ID' className='text-center'>
                {currentMember?.memberId || 'ー'}
              </Descriptions.Item>
              <Descriptions.Item label='会員コード' className='text-center'>
                {currentMember?.memberCode || 'ー'}
              </Descriptions.Item>
              <Descriptions.Item label='入会日' className='text-center'>
                {currentMember?.memberSince
                  ? dayjs(currentMember.memberSince).format('YYYY/M/D')
                  : 'ー'}
              </Descriptions.Item>
              <Descriptions.Item label='来店回数' className='text-center'>
                {currentMember?.visits && currentMember?.visits.length > 0
                  ? currentMember.visits.length
                  : 'ー'}
                回
              </Descriptions.Item>
              <Descriptions.Item label='来店日（最後）' className='text-center'>
                {currentMember?.lastVisit
                  ? dayjs(currentMember.lastVisit).format('YYYY/M/D')
                  : 'ー'}
              </Descriptions.Item>

              <Descriptions.Item label='有効期限' className='text-center'>
                {currentMember?.activeUntil ? (
                  <Tag
                    color={
                      dayjs(currentMember.activeUntil).isAfter(dayjs(), 'day') ? 'green' : 'red'
                    }
                    className='mr-0'
                  >
                    {dayjs(currentMember.activeUntil).format('YYYY/M/D')}
                  </Tag>
                ) : (
                  'ー'
                )}
              </Descriptions.Item>
              <Descriptions.Item label='ポイント' className='text-center'>
                <span className='font-bold' style={{ color: publicSettings?.PRIMARY_COLOR }}>
                  {currentMember?.kakeruPoint ?? 'ー'}pt
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Divider>会員変更</Divider>
          <Col span={24}>
            <Form
              name='memberEditForm'
              form={memberEditForm}
              onFinish={handleMemberEdit}
              layout='vertical'
              preserve={false}
              size='large'
              initialValues={{
                kakeruPointIsAdd: true,
              }}
            >
              <Row justify='center'>
                <Col>
                  <Form.Item name='memberId' hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='memberSince'
                    label='入会日'
                    rules={[
                      {
                        required: true,
                        message: '必須です',
                      },
                    ]}
                  >
                    {isMobile ? (
                      <Input
                        placeholder='例：入会日を選択してください'
                        readOnly
                        className='cursor-pointer'
                        onPressEnter={(e) => e.preventDefault()}
                        onClick={() => {
                          setIsEditPickerOpen(true)
                        }}
                      />
                    ) : (
                      <CustomDatePicker
                        className='w-full'
                        disabledDate={(currentDate: any) => dayjs().isBefore(currentDate, 'day')}
                        inputReadOnly
                      />
                    )}
                  </Form.Item>

                  <Form.Item
                    name='kakeruPoint'
                    label='販売会・イベントP'
                    rules={[
                      {
                        required: true,
                        message: '必須です',
                      },
                    ]}
                  >
                    <InputNumber inputMode='numeric' min={0} className='w-full' />
                  </Form.Item>
                  <Form.Item
                    name='kakeruPointIsAdd'
                    className='flex justify-center'
                    valuePropName='checked'
                  >
                    <Switch
                      className='w-full '
                      checkedChildren='ポイント付与'
                      unCheckedChildren='ポイント消費'
                      defaultChecked
                    />
                  </Form.Item>
                </Col>
                <Col span={24} className='text-center'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={memberEditMutation.isLoading}
                    className='px-12'
                  >
                    変更
                  </Button>
                </Col>
              </Row>
            </Form>
            {isMobile ? (
              <DatePicker
                //@ts-ignore
                isOpen={isEditPickerOpen}
                value={editPickerValue}
                theme='ios'
                confirmText='確定'
                cancelText='キャンセル'
                max={dayjs().add(1, 'day').toDate()}
                onSelect={(time: any) => {
                  setIsEditPickerOpen(false)

                  memberEditForm.setFieldsValue({
                    memberSince: dayjs(time).format('YYYY-MM-DD'),
                  })

                  setEditPickerValue(time)
                }}
                onCancel={() => {
                  setIsEditPickerOpen(false)
                }}
              />
            ) : (
              ''
            )}
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default MemberEditModalComponent
