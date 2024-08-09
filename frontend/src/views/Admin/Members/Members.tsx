import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  UndoOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  EditOutlined,
  HistoryOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  InputNumber,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Badge,
  Table,
  Tag,
  Tooltip,
} from 'antd'

import { m } from 'framer-motion'
import moment from 'moment'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import styled from 'styled-components'
import 'moment/locale/ja'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import * as API from 'common/api'
import * as CONSTANTS from 'common/constant'
import * as UTILITY from 'common/utility'
import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import PageHeader from 'components/admin/PageHeader'
import ChatModalComponent from 'components/admin/Chat/ChatModal'
import MemberRenewModalComponent from 'components/admin/MemberRenewModal'
import MemberEditModalComponent from 'components/admin/MemberEditModal'
import MemberDeviceScanModalComponent from 'components/admin/DeviceScanModal'
import MemberDetailModalComponent from 'components/admin/MemberDetailModal'
import MemberDeviceSelectModalComponent from 'components/admin/DeviceSelectModal'
import MemberPointUpdateModal from 'components/admin/MemberPointUpdateModal'
import MemberCameraScanModalComponent from 'components/admin/CameraScanModal'

dayjs.extend(relativeTime)
moment.locale('ja')

const CustomDatePicker = styled(DatePicker)`
  .ant-picker-input > input {
    text-align: center;
  }
`

const { Option } = Select

const Members = (props: Props) => {
  const { publicSettings } = props

  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [memberFilterForm] = Form.useForm()
  const memberId = searchParams.get('memberId')

  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()
  const membersRef = useRef<any>()

  const [members, setMembers] = useState([])
  const [currentMember, setCurrentMember] = useState<any>({})
  const [isChatModalVisible, setIsChatModalVisible] = useState(false)
  const [confirmMember, setConfirmMember] = useState<any>({})
  const [renewPickerValue, setRenewPickerValue] = useState(moment().toDate())
  const [renewConfirmPickerValue, setRenewConfirmPickerValue] = useState(moment().toDate())

  const [isMemberVisit, setIsMemberVisit] = useState(false)

  const [stopCameraStream, setStopCameraStream] = useState(false)
  const [isMemberRenewModalVisible, setIsMemberRenewModalVisible] = useState(false)
  const [isMemberDetailModalVisible, setIsMemberDetailModalVisible] = useState(false)
  const [isMemberRenewSelectModalVisible, setIsMemberRenewSelectModalVisible] = useState(false)
  const [isMemberRenewDeviceModalVisible, setIsMemberRenewDeviceModalVisible] = useState<any>(false)
  const [isMemberRenewCameraModalVisible, setIsMemberRenewCameraModalVisible] = useState(false)
  const [isMemberRenewConfirmModalVisible, setIsMemberRenewConfirmModalVisible] = useState(false)
  const [isMemberEditModalVisible, setIsMemberEditModalVisible] = useState(false)
  const [paginationPerPage, setPaginationPerPage] = useState(20)
  const [paginationPage, setPaginationPage] = useState(1)
  const [paginationTotal, setPaginationTotal] = useState(0)
  const [paginationSort, setPaginationSort] = useState('desc')
  const [paginationSortKey, setPaginationSortKey] = useState('updatedAt')

  const [filterFullName, setFilterFullName] = useState(undefined)
  const [filterGender, setFilterGender] = useState(undefined)
  const [filterAgeMin, setFilterAgeMin] = useState<any>(undefined)
  const [filterAgeMax, setFilterAgeMax] = useState<any>(undefined)
  const [filterCountVisitMin, setFilterCountVisitMin] = useState(undefined)
  const [filterCountVisitMax, setFilterCountVisitMax] = useState(undefined)
  const [filterLastVisitMin, setFilterLastVisitMin] = useState(undefined)
  const [filterLastVisitMax, setFilterLastVisitMax] = useState(undefined)
  const [filterTelephone, setFilterTelephone] = useState(undefined)
  const [filterOccupation, setFilterOccupation] = useState(undefined)
  const [filterAddress, setFilterAddress] = useState(undefined)
  const [filterLineFriend, setFilterLineFriend] = useState(undefined)
  const [filterServiceTypes, setFilterServiceTypes] = useState(undefined)
  const [filterServiceAreas, setFilterAreasTypes] = useState(undefined)
  const currentDate = dayjs()
  const [modal, contextHolder] = Modal.useModal()

  const showMemberDetailModal = (memberId: any) => {
    handleMemberDetail(memberId)
    setIsMemberDetailModalVisible(true)
  }
  const hideMemberDetailModal = () => {
    setCurrentMember({})
    setIsMemberDetailModalVisible(false)
  }
  const showMemberRenewSelectModal = (isVisit = false) => {
    setIsMemberVisit(isVisit)
    setIsMemberRenewSelectModalVisible(true)
  }
  const hideMemberRenewSelectModal = () => {
    setIsMemberRenewSelectModalVisible(false)
  }
  const hideMemberRenewModal = () => {
    setCurrentMember({})
    setIsMemberRenewModalVisible(false)
  }

  const showMemberRenewModal = (member: any) => {
    handleMemberDetail(member.memberId)
    if (!isMemberVisit) {
      setRenewPickerValue(
        member?.activeUntil
          ? dayjs(member?.activeUntil).add(1, 'year').subtract(1, 'day').toDate()
          : dayjs(member?.memberSince).add(1, 'year').subtract(1, 'day').toDate(),
      )
    }

    setIsMemberRenewModalVisible(true)
  }
  const showMemberRenewDeviceModal = () => {
    hideMemberRenewSelectModal()
    setIsMemberRenewDeviceModalVisible(true)
  }
  const hideMemberRenewDeviceModal = () => {
    setIsMemberRenewDeviceModalVisible(false)
  }
  const showMemberEditModal = (memberId: any) => {
    handleMemberDetail(memberId)
    setIsMemberEditModalVisible(true)
  }
  const hideMemberEditModal = () => {
    setCurrentMember({})
    setIsMemberEditModalVisible(false)
  }

  const showMemberRenewCameraModal = () => {
    hideMemberRenewSelectModal()
    setStopCameraStream(false)
    setIsMemberRenewCameraModalVisible(true)
  }

  const hideMemberRenewCameraModal = () => {
    setStopCameraStream(true)
    setIsMemberRenewCameraModalVisible(false)
  }

  const showMemberRenewConfirmModal = (member: any = {}) => {
    setConfirmMember(member)
    hideMemberRenewDeviceModal()
    hideMemberRenewCameraModal()

    if (!isMemberVisit) {
      setRenewConfirmPickerValue(
        member?.activeUntil
          ? dayjs(member?.activeUntil).add(1, 'year').subtract(1, 'day').toDate()
          : dayjs(member?.memberSince).add(1, 'year').subtract(1, 'day').toDate(),
      )
    }

    setIsMemberRenewConfirmModalVisible(true)
  }

  const hideMemberRenewConfirmModal = () => {
    setConfirmMember({})
    setIsMemberVisit(false)
    setIsMemberRenewConfirmModalVisible(false)
  }
  const showChatModal = (member: any) => {
    setCurrentMember(member)
    setIsChatModalVisible(true)
  }

  const hideChatModal = () => {
    setCurrentMember({})
    setIsChatModalVisible(false)
  }
  useQuery(
    [
      API.QUERY_KEY_ADMIN_MEMBERS,
      {
        paginationPerPage: paginationPerPage,
        paginationPage: paginationPage,
        paginationSort: paginationSort,
        paginationSortKey: paginationSortKey,
        filterFullName: filterFullName,
        filterGender: filterGender,
        filterAgeMin: filterAgeMin,
        filterAgeMax: filterAgeMax,
        filterTelephone: filterTelephone,
        filterOccupation: filterOccupation,
        filterAddress: filterAddress,
        filterLineFriend: filterLineFriend,
        filterLastVisitMin: filterLastVisitMin,
        filterLastVisitMax: filterLastVisitMax,
        filterCountVisitMin: filterCountVisitMin,
        filterCountVisitMax: filterCountVisitMax,
        filterServiceTypes: filterServiceTypes,
        filterServiceAreas: filterServiceAreas,
      },
    ],
    () =>
      API.ADMIN_GET_MEMBERS(
        paginationPerPage,
        paginationPage,
        paginationSort,
        paginationSortKey,
        filterFullName,
        filterGender,
        filterAgeMin,
        filterAgeMax,
        filterTelephone,
        filterOccupation,
        filterCountVisitMin,
        filterCountVisitMax,
        filterLastVisitMin,
        filterLastVisitMax,
        filterAddress,
        filterLineFriend,
        filterServiceTypes,
        filterServiceAreas,
      ),
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        if (isMountedRef.current) {
          if (response?.data?.rows && response.data.rows.length > 0) {
            setMembers(response.data.rows)
          } else {
            setMembers([])
          }

          setPaginationPerPage(response.data.perPage || 20)
          setPaginationPage(response.data.page || 1)
          setPaginationTotal(response.data.count || 0)
          setPaginationSort(response.data.sort || 'desc')
          setPaginationSortKey(response.data.sortKey || 'updatedAt')
        }
      },
      onError: (error: FetchError) => {
        if (error?.response?.status === CONSTANTS.RESPONSE_PERMISSION_ERROR) {
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
    },
  )

  const memberGetMutation = useMutation(API.ADMIN_GET_MEMBER, {
    onSuccess: (response) => {
      setCurrentMember(response?.data || {})
    },
    onError: (error: FetchError) => {
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

  const memberEditMutation = useMutation(API.ADMIN_RENEW_MEMBER, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_UPDATE_MSG)
      hideMemberEditModal()
      hideMemberRenewConfirmModal()
      //@ts-ignore
      queryClient.invalidateQueries(API.QUERY_KEY_ADMIN_MEMBERS)
    },
    onError: (error: FetchError) => {
      if (error?.response?.status === CONSTANTS.RESPONSE_PERMISSION_ERROR) {
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

  const memberDeleteMutation = useMutation(API.ADMIN_DELETE_MEMBER, {
    onSuccess: () => {
      message.success(CONSTANTS.SUCCESS_DELETE_MSG)
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_MEMBERS] })
    },
    onError: (error: FetchError) => {
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
    membersRef.current = members
  }, [members])

  useEffect(() => {
    const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

    socket.on(API.SOCKET_MEMBER, () => {
      queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_MEMBERS] })
    })

    socket.on(API.SOCKET_CHAT, (response) => {
      if (
        membersRef.current?.find((m: { memberId: number }) => m?.memberId === response?.memberId)
      ) {
        queryClient.invalidateQueries({
          queryKey: [API.QUERY_KEY_ADMIN_MEMBERS],
        })
      }
    })

    return () => {
      socket.off(API.SOCKET_MEMBER)
      socket.off(API.SOCKET_CHAT)

      socket.disconnect()
    }

    // eslint-disable-next-line
  }, [])

  const handleMemberDelete = (member: any) => {
    const paramData = {
      memberId: member.memberId,
    }

    modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined className='text-red-600' rev={undefined} />,
      content: (
        <p>
          <span className='text-red-600'>{`${member.lastName || 'ー'}${
            member.firstName || 'ー'
          }`}</span>
          様の情報を削除してもよろしいでしょうか？
        </p>
      ),
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
        memberDeleteMutation.mutate(paramData)
      },
    })
  }

  const handleMemberDetail = (memberId: any) => {
    const paramData = {
      memberId: memberId,
    }

    memberGetMutation.mutate(paramData)
  }

  const CONSTANTStartColumns = [
    {
      title: 'ID',
      dataIndex: 'memberId',
      align: 'center',
      width: 50,
      sorter: () => {},
    },
    {
      title: '写真',
      dataIndex: 'picUrl',
      align: 'center',
      width: 70,
      render: (picUrl: string | null) =>
        picUrl !== '' && picUrl !== null ? (
          <Image
            preview={{
              mask: <EyeOutlined rev={undefined} />,
              src: picUrl,
              maskClassName: 'rounded-full',
            }}
            width={50}
            height={50}
            className='rounded-full'
            src={`${picUrl}/small`}
            fallback='/no-image.png'
          />
        ) : (
          <Image
            src='/no-image.png'
            width={50}
            height={50}
            className='rounded-full'
            preview={{
              mask: <EyeOutlined rev={undefined} />,
              src: '/no-image.png',
              maskClassName: 'rounded-full',
            }}
          />
        ),
    },
    {
      title: 'LINE名',
      dataIndex: 'displayName',
      align: 'center',
      width: 70,
    },
    {
      title: '氏名',
      dataIndex: 'fullName',
      align: 'center',
      width: 100,
    },

    {
      title: '性別',
      dataIndex: 'gender',
      align: 'center',
      width: 50,
    },
    {
      title: '生年月日',
      dataIndex: 'dateOfBirth',
      align: 'center',
      width: 100,
      render: (dateOfBirth: any) => (
        <>
          {dateOfBirth ? currentDate.diff(dayjs(dateOfBirth), 'year') : ''}歳
          <br />
          {dateOfBirth ? dateOfBirth : ''}
        </>
      ),
    },
    {
      title: '住所',
      dataIndex: 'address',
      align: 'center',
      width: 130,
    },
    {
      title: '電話番号',
      dataIndex: 'telephone',
      align: 'center',
      width: 120,
    },
    {
      title: '来店回数',
      dataIndex: 'countVisit',
      align: 'center',
      width: 100,
      render: (countVisit: any) => <>{countVisit || 'ー'}回</>,
    },
    {
      title: '来店日（最後）',
      dataIndex: 'lastVisit',
      align: 'center',
      width: 100,
      render: (lastVisit: moment.MomentInput) => (
        <>{lastVisit ? moment(lastVisit).format('YYYY/M/D') : 'ー'}</>
      ),
    },
    {
      title: '入会日',
      dataIndex: 'memberSince',
      align: 'center',
      width: 100,
      sorter: () => {},
      render: (memberSince: moment.MomentInput) => (
        <>{memberSince ? moment(memberSince).format('YYYY/M/D') : 'ー'}</>
      ),
    },
    {
      title: '有効期限',
      dataIndex: 'activeUntil',
      align: 'center',
      width: 100,
      sorter: () => {},
      render: (activeUntil: moment.MomentInput) => (
        <>
          {activeUntil ? (
            <Tag
              color={moment(activeUntil).isAfter(moment(), 'day') ? 'green' : 'red'}
              className='mr-0 p-2'
            >
              {moment(activeUntil).format('YYYY/M/D')}
            </Tag>
          ) : (
            'ー'
          )}
        </>
      ),
    },
    {
      title: '物件希望エリア',
      dataIndex: 'preferenceAreas',
      align: 'center',
      width: 100,
      sorter: () => {},
      render: (preferenceAreas: any) => (
        <>
          {preferenceAreas ? (
            <>
              {preferenceAreas.map((preferenceAreas: any) => (
                <Tag key={preferenceAreas} color='processing'>
                  <span key={preferenceAreas.id}>{preferenceAreas}</span>
                </Tag>
              ))}
            </>
          ) : (
            'ー'
          )}
        </>
      ),
    },
    {
      title: 'ご希望種別',
      dataIndex: 'preferenceTypes',
      align: 'center',
      width: 100,
      sorter: () => {},
      render: (preferenceTypes: any) => (
        <>
          {preferenceTypes ? (
            <>
              {preferenceTypes.map((preferenceTypes: any, index: any) => (
                <Tag key={preferenceTypes} color='success'>
                  <span key={preferenceTypes.id}>
                    {CONSTANTS.PREFERENCETYPES?.find((pr) => pr?.value + '' === preferenceTypes)
                      ?.label || preferenceTypes}
                  </span>
                </Tag>
              ))}
            </>
          ) : (
            'ー'
          )}
        </>
      ),
    },
  ]
  const visitColumns = [
    {
      title: '来店日',
      dataIndex: 'visitDate',
      align: 'center',
      render: (visitDate: moment.MomentInput) =>
        visitDate ? moment(visitDate).format('YYYY/M/D HH:mm') : 'ー',
    },
  ]

  const commonEndColumns = [
    {
      title: '',
      dataIndex: 'action',
      align: 'center',
      width: 400,
      render: (member: { unreadCount: number; memberId: any; lastName?: any; firstName?: any }) => (
        <>
          <TapAnimation className='inline-block'>
            <Tooltip title='詳細' placement='top'>
              <Button
                size='large'
                className='m-1'
                icon={<EyeOutlined rev={undefined} />}
                onClick={() => {
                  showMemberDetailModal(member?.memberId)
                }}
              />
            </Tooltip>
          </TapAnimation>
          <Divider type='vertical' />
          <TapAnimation className='inline-block'>
            <Badge
              style={{ backgroundColor: CONSTANTS.CUSTOM_GREEN }}
              count={member?.unreadCount || 0}
            >
              <Tooltip title='LINEチャット' placement='top'>
                <Button
                  size='large'
                  className='m-1'
                  icon={<CommentOutlined rev={undefined} />}
                  onClick={() => showChatModal(member)}
                />
              </Tooltip>
            </Badge>
          </TapAnimation>
          <Divider type='vertical' />
          <TapAnimation className='inline-block'>
            <Tooltip title='更新' placement='top'>
              <Button
                size='large'
                className='m-1'
                icon={<HistoryOutlined rev={undefined} />}
                onClick={() => {
                  showMemberRenewModal(member)
                }}
              />
            </Tooltip>
          </TapAnimation>
          <Divider type='vertical' />
          <TapAnimation className='inline-block'>
            <Tooltip title='変更' placement='top'>
              <Button
                size='large'
                className='m-1'
                icon={<EditOutlined rev={undefined} />}
                onClick={() => {
                  showMemberEditModal(member?.memberId)
                }}
              />
            </Tooltip>
          </TapAnimation>
          <Divider type='vertical' />
          <TapAnimation className='inline-block'>
            <Tooltip title='削除' placement='top'>
              <Button
                size='large'
                className='m-1'
                icon={<DeleteOutlined rev={undefined} />}
                danger
                onClick={() => {
                  handleMemberDelete(member)
                }}
              />
            </Tooltip>
          </TapAnimation>
        </>
      ),
    },
  ]

  const memberColumns = [...CONSTANTStartColumns, ...commonEndColumns]

  const handleTableChange = (
    paginationData: { pageSize: SetStateAction<number>; current: SetStateAction<number> },
    filters: any,
    sorter: { order: string; field: SetStateAction<string> },
  ) => {
    if (paginationData.pageSize !== paginationPerPage) {
      setPaginationPerPage(paginationData.pageSize)
    }

    if (paginationData.current !== paginationPage) {
      setPaginationPage(paginationData.current)
    }

    if (sorter && sorter.order) {
      if (sorter.order === 'ascend') {
        if (sorter.order !== paginationSort) {
          setPaginationSort('asc')
        }
      } else if (sorter.order === 'descend') {
        if (sorter.order !== paginationSort) {
          setPaginationSort('desc')
        }
      }
    }

    if (sorter && sorter.field) {
      if (sorter.field !== paginationSortKey) {
        setPaginationSortKey(sorter.field)
      }
    }
  }
  const handleFilter = (data: any) => {
    if (data.fullNameFilter !== filterFullName) {
      setFilterFullName(data.fullNameFilter)
    }

    if (data.genderFilter !== filterGender) {
      setFilterGender(data.genderFilter)
    }
    if (data.ageMinFilter !== filterAgeMin) {
      setFilterAgeMin(
        data.ageMinFilter
          ? currentDate
              .subtract(1, 'year')
              .add(1, 'day')
              .subtract(data.ageMinFilter, 'year')
              .format('YYYY-MM-DD')
          : undefined,
      )
    }
    if (data.ageMaxFilter !== filterAgeMax) {
      setFilterAgeMax(
        data.ageMaxFilter
          ? currentDate.subtract(data.ageMaxFilter, 'year').format('YYYY-MM-DD')
          : undefined,
      )
    }
    if (data.countVisitMinFilter !== filterCountVisitMin) {
      setFilterCountVisitMin(data.countVisitMinFilter)
    }
    if (data.countVisitMaxFilter !== filterCountVisitMax) {
      setFilterCountVisitMax(data.countVisitMaxFilter)
    }
    if (data.lastVisitMinFilter !== filterLastVisitMin) {
      setFilterLastVisitMin(data.lastVisitMinFilter)
    }
    if (data.lastVisitMaxFilter !== filterLastVisitMax) {
      setFilterLastVisitMax(data.lastVisitMaxFilter)
    }
    if (data.telephoneFilter !== filterTelephone) {
      setFilterTelephone(data.telephoneFilter)
    }
    if (data.occupationFilter !== filterOccupation) {
      setFilterOccupation(data.occupationFilter)
    }
    if (data.addressFilter !== filterAddress) {
      setFilterAddress(data.addressFilter)
    }
    if (data.isFriendFilter !== filterLineFriend) {
      setFilterLineFriend(data.isFriendFilter)
    }
    if (data.serviceAreasFilter !== filterServiceAreas) {
      setFilterAreasTypes(data.serviceAreasFilter)
    }
    if (data.serviceTypesFilter !== filterServiceTypes) {
      setFilterServiceTypes(data.serviceTypesFilter)
    }
  }

  const clearFilter = () => {
    setFilterFullName(undefined)
    setFilterGender(undefined)
    setFilterAgeMin(undefined)
    setFilterAgeMax(undefined)
    setFilterCountVisitMin(undefined)
    setFilterCountVisitMax(undefined)
    setFilterLastVisitMin(undefined)
    setFilterLastVisitMax(undefined)
    setFilterTelephone(undefined)
    setFilterOccupation(undefined)
    setFilterAddress(undefined)
    setFilterLineFriend(undefined)

    memberFilterForm.resetFields()
  }

  return (
    <>
      <BaseAnimation>
        <PageHeader publicSettings={publicSettings} title={'会員管理'} />
        <Card
          bordered={false}
          className='shadow-none'
          extra={
            <>
              <div className='py-2 inline-flex my-2 '>
                <TapAnimation>
                  <Button
                    type='primary'
                    size='large'
                    icon={<BarcodeOutlined rev={undefined} />}
                    onClick={() => {
                      showMemberRenewSelectModal(true)
                    }}
                    className='w-32 mx-4'
                  >
                    来店記録
                  </Button>
                </TapAnimation>

                <TapAnimation>
                  <Button
                    type='primary'
                    size='large'
                    icon={<AppstoreAddOutlined rev={undefined} />}
                    onClick={() => {
                      showMemberRenewSelectModal()
                    }}
                    className='w-32'
                  >
                    会員更新
                  </Button>
                </TapAnimation>
              </div>
            </>
          }
        >
          <Row>
            <Col xs={24}>
              <Form
                form={memberFilterForm}
                name='memberFilterForm'
                onFinish={handleFilter}
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
                  lineFriendFilter: undefined,
                }}
              >
                <Row gutter={[8, 8]} justify='end' className='mb-4'>
                  <Col>
                    <TapAnimation>
                      <Button
                        type='dashed'
                        icon={<UndoOutlined rev={undefined} />}
                        onClick={clearFilter}
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
                        {CONSTANTS.GENDER.map((gender) => (
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
                    <Form.Item help='LINE友だち' name='isFriendFilter' className='mb-4'>
                      <Select placeholder='LINE友だち状態' allowClear>
                        <Option value={1}>LINE友だちしている</Option>
                        <Option value={0}>LINE友だちしてない</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Form.Item help='ご希望種別' name='serviceTypesFilter' className='mb-4 w-full'>
                      <Select placeholder='ご希望種別' mode='multiple' allowClear>
                        {CONSTANTS.PREFERENCETYPES?.map((oc) => (
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
                  <Col xs={{ span: 24 }} lg={{ span: 12 }}>
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
                    >
                      検索
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Divider />
            <Col xs={24}>
              <m.div
                variants={CONSTANTS.ANIMATION_VARIANT_STAGGER_CONTAINER}
                initial='hidden'
                animate='show'
                exit='hidden'
              >
                <Table
                  $publicSettings={publicSettings}
                  bordered
                  size='small'
                  //@ts-ignore
                  columns={memberColumns}
                  scroll={{
                    x: 640,
                    y: 720,
                  }}
                  locale={{ emptyText: 'お客様のデータがありません。' }}
                  //@ts-ignore
                  onChange={handleTableChange}
                  pagination={{
                    responsive: true,
                    showSizeChanger: true,
                    onShowSizeChange: (current, pageSize) => setPaginationPerPage(pageSize),
                    current: paginationPage,
                    pageSize: paginationPerPage,
                    total: paginationTotal,
                    showTotal: (total, range) => `全${total}件中${range[0]}～${range[1]}件目`,
                    defaultCurrent: 1,
                    defaultPageSize: 20,
                    position: ['bottomCenter'],
                  }}
                  dataSource={
                    members
                      ? members.map((member: any, {}) => {
                          return {
                            key: member.memberId,
                            memberId: member.memberId,
                            picUrl: member.picUrl,
                            displayName: member.displayName,
                            fullName: `${member.lastName || 'ー'} ${member.firstName || 'ー'}`,
                            dateOfBirth: member.dateOfBirth,
                            gender: CONSTANTS.GET_GENDER_BY_VALUE(member.gender),
                            memberSince: member.memberSince,
                            telephone: member.telephone || 'ー',
                            address: `〒${member.postalCode || ''},${member.address || ''},${
                              member.building || ''
                            }`,
                            preferenceAreas: member.preferenceAreas,
                            preferenceTypes: member.preferenceTypes,
                            countVisit: member.countVisit,
                            lastVisit: member.lastVisit,
                            activeUntil: member.activeUntil,
                            action: member,
                          }
                        })
                      : []
                  }
                />
              </m.div>
            </Col>
          </Row>
        </Card>
      </BaseAnimation>

      <ChatModalComponent
        {...props}
        isChatModalVisible={isChatModalVisible}
        hideChatModal={hideChatModal}
        currentMember={currentMember}
      />
      <MemberEditModalComponent
        {...props}
        currentMember={currentMember}
        memberEditMutation={memberEditMutation}
        hideMemberEditModal={hideMemberEditModal}
        isMemberEditModalVisible={isMemberEditModalVisible}
      />
      <MemberDetailModalComponent
        {...props}
        currentMember={currentMember}
        visitColumns={visitColumns}
        isMemberDetailModalVisible={isMemberDetailModalVisible}
        hideMemberDetailModal={hideMemberDetailModal}
      />

      <MemberDeviceSelectModalComponent
        {...props}
        isMemberVisit={isMemberVisit}
        showMemberRenewDeviceModal={showMemberRenewDeviceModal}
        isMemberRenewSelectModalVisible={isMemberRenewSelectModalVisible}
        hideMemberRenewSelectModal={hideMemberRenewSelectModal}
        showMemberRenewCameraModal={showMemberRenewCameraModal}
      />
      <MemberDeviceScanModalComponent
        {...props}
        isMemberVisit={isMemberVisit}
        isMemberRenewDeviceModalVisible={isMemberRenewDeviceModalVisible}
        hideMemberRenewDeviceModal={hideMemberRenewDeviceModal}
        showMemberRenewConfirmModal={showMemberRenewConfirmModal}
      />
      <MemberCameraScanModalComponent
        {...props}
        isMemberRenewCameraModalVisible={isMemberRenewCameraModalVisible}
        hideMemberRenewCameraModal={hideMemberRenewCameraModal}
        showMemberRenewConfirmModal={showMemberRenewConfirmModal}
        stopCameraStream={stopCameraStream}
      />
      <MemberRenewModalComponent
        {...props}
        currentMember={currentMember}
        isMemberRenewModalVisible={isMemberRenewModalVisible}
        hideMemberRenewModal={hideMemberRenewModal}
        hideMemberRenewConfirmModal={hideMemberRenewConfirmModal}
        setRenewPickerValue={setRenewPickerValue}
        renewPickerValue={renewPickerValue}
      />
      <MemberPointUpdateModal
        {...props}
        confirmMember={confirmMember}
        isMemberVisit={isMemberVisit}
        hideMemberRenewConfirmModal={hideMemberRenewConfirmModal}
        memberEditMutation={memberEditMutation}
        renewConfirmPickerValue={renewConfirmPickerValue}
        setRenewConfirmPickerValue={setRenewConfirmPickerValue}
        isMemberRenewConfirmModalVisible={isMemberRenewConfirmModalVisible}
      />
      {contextHolder}
    </>
  )
}

export default Members
