import React, { useState, useEffect } from 'react'
import { Button, Card, message, Table, Modal, Tooltip } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { io } from 'socket.io-client'
import * as COMMONS from 'common/constant'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'
import BaseAnimation from 'components/common/BaseAnimation'
import PageHeader from 'components/admin/PageHeader'
import { m } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Audiences = (props: Props) => {
  const { publicSettings } = props

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()

  const [categories, setCategories] = useState([])

  const [audiences, setAudiences] = useState([]) as unknown as [
    a: audienceType[],
    b: (arg: audienceType[]) => void,
  ]

  const [modal, contextHolder] = Modal.useModal()

  useQuery([API.QUERY_KEY_ADMIN_AUDIENCES], () => API.ADMIN_GET_AUDIENCES(), {
    onSuccess: (response) => {
      if (isMountedRef.current) {
        setAudiences(response?.data || [])
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

  const audienceDeleteMutation = useMutation(API.ADMIN_DELETE_AUDIENCE, {
    onSuccess: () => {
      message.success(COMMONS.SUCCESS_DELETE_MSG)
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_AUDIENCES],
      })
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
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_AUDIENCE, (response) => {
      queryClient.invalidateQueries({
        queryKey: [API.QUERY_KEY_ADMIN_AUDIENCES],
      })
    })

    return () => {
      socket.off(API.SOCKET_AUDIENCE)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  const handleAudienceDelete = (audience: { audienceGroupId: any; description: string }) => {
    const paramData = {
      audienceGroupId: audience.audienceGroupId,
    }

    modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined className='text-red-600' rev={undefined} />,
      content: (
        <p>
          <span className='text-red-600'>{audience.description || 'ー'}</span>
          を削除してもよろしいでしょうか？
        </p>
      ),
      okText: '削除',
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
      cancelText: '閉じる',
      centered: true,
      onOk() {
        audienceDeleteMutation.mutate(paramData)
      },
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'audienceGroupId',
      align: 'center',
      width: 100,
      sorter: (a: { audienceGroupId: number }, b: { audienceGroupId: number }) =>
        a.audienceGroupId - b.audienceGroupId,
      sortDirections: ['ascend', 'descend'],
      render: (audienceGroupId: any) => audienceGroupId ?? 'ー',
    },
    {
      title: 'オーディエンス名',
      dataIndex: 'description',
      align: 'center',
      width: 100,
      sorter: (a: { description: any }, b: { description: any }) =>
        (a.description || '').localeCompare(b.description || ''),
      sortDirections: ['ascend', 'descend'],
      render: (description: any) => description ?? 'ー',
    },
    {
      title: '備考',
      dataIndex: 'remarks',
      align: 'center',
      width: 100,
      render: (remarks: any) => remarks ?? 'ー',
    },
    {
      title: 'サイズ',
      dataIndex: 'audienceCount',
      align: 'center',
      width: 100,
      sorter: (a: { audienceCount: number }, b: { audienceCount: number }) =>
        a.audienceCount - b.audienceCount,
      sortDirections: ['ascend', 'descend'],
      render: (audienceCount: any) => audienceCount ?? 'ー',
    },
    {
      title: '状態',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (status: any) => (status ? UTILITY.GET_AUDIENCE_STATUS(status) : 'ー'),
    },
    {
      title: '作成日',
      dataIndex: 'created',
      align: 'center',
      width: 150,
      sorter: (a: { createdAt: string }, b: { createdAt: any }) =>
        a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'],
      render: (createdAt: moment.MomentInput) =>
        createdAt ? (
          <>
            {moment(createdAt).format('YYYY/M/D')}
            <br />
            {moment(createdAt).format('HH:mm')}
          </>
        ) : (
          'ー'
        ),
    },
    {
      title: '',
      dataIndex: 'action',
      align: 'center',
      width: 50,
      render: (audience: { audienceGroupId: any; description: string }) => (
        <>
          <Tooltip title='削除' placement='top'>
            <Button
              size='large'
              className='m-1'
              icon={<DeleteOutlined rev={undefined} />}
              danger
              onClick={() => {
                handleAudienceDelete(audience)
              }}
            />
          </Tooltip>
        </>
      ),
    },
  ]

  return (
    <>
      <BaseAnimation>
        <PageHeader publicSettings={publicSettings} title='オーディエンス' />
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
          <m.div
            className='flex flex-col'
            variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
            initial='hidden'
            animate='show'
            exit='hidden'
          >
            <m.div
              className='flex justify-end mb-2'
              variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
            >
              <Button
                type='primary'
                size='large'
                icon={<PlusOutlined rev={undefined} />}
                // onClick={showAudienceModal}
                onClick={() => {
                  navigate(COMMONS.ADMIN_AUDIENCES_SEARCH_ROUTE)
                }}
              >
                新規作成
              </Button>
            </m.div>
            <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
              <Table
                bordered
                size='small'
                //@ts-ignore
                columns={columns}
                dataSource={
                  audiences.length > 0
                    ? audiences.map((a) => {
                        return {
                          key: a.audienceGroupId,
                          audienceGroupId: a?.audienceGroupId,
                          description: a?.description,
                          remarks: a?.remarks,
                          audienceCount: a?.audienceCount,
                          status: a?.status,
                          created: a?.created,
                          action: a,
                        }
                      })
                    : []
                }
                scroll={{
                  x: 640,
                  y: 720,
                }}
                locale={{ emptyText: 'オーディエンスのデータがありません' }}
                pagination={{
                  responsive: true,
                  showTotal: (total, range) => `全${total}件中${range[0]}～${range[1]}件目`,
                  defaultCurrent: 1,
                  defaultPageSize: 20,
                  position: ['bottomCenter'],
                }}
              />
            </m.div>
          </m.div>
        </Card>
      </BaseAnimation>

      {contextHolder}
    </>
  )
}

export default Audiences
