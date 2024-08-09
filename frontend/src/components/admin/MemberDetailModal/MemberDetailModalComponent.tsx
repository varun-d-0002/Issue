import { EyeOutlined } from '@ant-design/icons'
import { Button, Col, Image, Tag, Modal, Row, Table, Divider, Descriptions } from 'antd'

import moment from 'moment'

const MemberDetailModalComponent = (props: {
  publicSettings?: any
  hideMemberDetailModal?: any
  isMemberDetailModalVisible?: boolean
  currentMember?: any
  visitColumns?: any
}) => {
  const {
    currentMember,
    isMemberDetailModalVisible,
    hideMemberDetailModal,
    publicSettings,
    visitColumns,
  } = props
  return (
    <>
      <Modal
        title='会員詳細'
        open={isMemberDetailModalVisible}
        onCancel={hideMemberDetailModal}
        footer={null}
        destroyOnClose
        centered
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Row justify='center'>
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
                  ? moment(currentMember.memberSince).format('YYYY/M/D')
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
                  ? moment(currentMember.lastVisit).format('YYYY/M/D')
                  : 'ー'}
              </Descriptions.Item>
              <Descriptions.Item label='有効期限' className='text-center'>
                {currentMember?.activeUntil ? (
                  <Tag
                    color={
                      moment(currentMember.activeUntil).isAfter(moment(), 'day') ? 'green' : 'red'
                    }
                    className='mr-0'
                  >
                    {moment(currentMember.activeUntil).format('YYYY/M/D')}
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
          <Divider>個人情報</Divider>
          <Col span={24}>
            <Descriptions column={1} layout='horizontal' bordered>
              <Descriptions.Item label='LINE名' className='text-center'>
                {currentMember?.displayName || 'ー'}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Divider>来店履歴</Divider>
          <Col span={24}>
            <Table
              bordered
              size='large'
              columns={visitColumns}
              dataSource={
                currentMember?.visits
                  ? currentMember.visits.map(
                      (memberVisit: { memberVisitId: any; visitDate: any }, index: any) => {
                        return {
                          key: index,
                          visitDate: memberVisit.visitDate,
                        }
                      },
                    )
                  : []
              }
              locale={{ emptyText: '履歴がありません' }}
              pagination={{
                responsive: true,
                defaultPageSize: 5,
                position: ['bottomCenter'],
              }}
            />
          </Col>
        </Row>
        <Divider />
        <Row justify='center'>
          <Col>
            <Button size='large' className='px-12' onClick={hideMemberDetailModal}>
              閉じる
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default MemberDetailModalComponent
