import { Row, Col, Button, Dropdown, message } from 'antd'
import { MdAccountCircle, MdExpandMore, MdLogout, MdMenu } from 'react-icons/md'
import styled from 'styled-components'
import { useMutation } from '@tanstack/react-query'
import * as API from '../../../../common/api'
import * as CONSTANTS from '../../../../common/constant'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  toggleDrawer?: () => void
  isBigScreen?: boolean
}
interface Error {
  [x: string]: any
  message: string
  error: {
    response: any
  }
}
const CustomMenuButton = styled(Button)`
  & {
    border: none;
    box-shadow: none;
  }

  &:hover {
    border: none;
    box-shadow: none;
  }

  &:focus {
    border: none;
    box-shadow: none;
  }

  &:active {
    border: none;
    box-shadow: none;
  }
`

const Topbar = (props: TopBarProps) => {
  const { toggleDrawer, isBigScreen } = props
  const navigate = useNavigate()
  const logoutMutation = useMutation(API.ADMIN_LOGOUT, {
    onSuccess: (response) => {
      message.success(CONSTANTS.SUCCESS_LOGOUT_MSG)
      navigate(CONSTANTS.ADMIN_LOGIN_ROUTE)
    },
    onError: (error: Error) => {
      if (error?.response?.status === CONSTANTS.RESPONSE_SYSTEM_ERROR) {
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

  const logoutHandler = () => {
    logoutMutation.mutate()
  }

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case 'logout':
        logoutHandler()
        break
      default:
        break
    }
  }

  const menuProps = {
    onClick: handleMenuClick,
    items: [
      {
        key: 'logout',
        label: <span className='text-sm'>ログアウト</span>,
        icon: <MdLogout className='text-base text-rose-600 leading-none' />,
      },
    ],
  }

  return (
    <Row justify={isBigScreen ? 'end' : 'space-between'} align='middle' className='px-6'>
      {!isBigScreen && (
        <Col>
          <CustomMenuButton
            size='large'
            icon={<MdMenu className='text-4xl align-middle' />}
            onClick={toggleDrawer}
          />
        </Col>
      )}
      <Col>
        <Dropdown arrow trigger={['click']} menu={menuProps}>
          <Button
            type='text'
            size='large'
            icon={<MdAccountCircle className='text-2xl align-middle text-primary mr-2' />}
          >
            <span className='text-xs align-middle font-bold'>管理者</span>
            <MdExpandMore className='align-middle ml-2' />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  )
}

export default Topbar
