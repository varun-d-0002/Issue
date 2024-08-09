import { Divider, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import * as CONSTANTS from 'common/constant'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'
import { SettingOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons'

interface Event {
  key?: string
}

const CustomMenu = styled(Menu)`
  &.ant-menu-inline-collapsed > .ant-menu-item {
    padding-inline: 30% !important;
  }

  &.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    padding-inline: 30% !important;
  }
`

const menuItems = [
  {
    key: CONSTANTS.PAGE_ADMIN_MEMBERS,
    icon: <TeamOutlined className=' max-w-full' rev={undefined} />,
    label: <span className='text-sm'>{CONSTANTS.PAGE_ADMIN_MEMBERS}</span>,
  },

  {
    key: CONSTANTS.PAGE_ADMIN_AUDIENCES,
    icon: <IdcardOutlined rev={undefined} className=' max-w-full' />,
    label: <span className='text-sm'>{CONSTANTS.PAGE_ADMIN_AUDIENCES}</span>,
  },
  {
    key: CONSTANTS.PAGE_ADMIN_SETTINGS,
    icon: <SettingOutlined rev={undefined} className=' max-w-full' />,
    label: <span className='text-sm'>{CONSTANTS.PAGE_ADMIN_SETTINGS}</span>,
  },
]

const Sidebar = (props: {
  publicSettings?: any
  isCollapsed?: any
  logo?: any
  collapseToggle?: any
}) => {
  const { publicSettings, isCollapsed, logo } = props
  const location = useLocation()
  const navigate = useNavigate()

  const getSelectedKeys = () => {
    return UTILITY.GET_SELECTED_KEY_BY_ROUTE(CONSTANTS.ROUTES, location?.pathname)
  }

  const getOpenKeys = () => {
    return UTILITY.GET_OPEN_KEY_BY_ROUTE(CONSTANTS.ROUTES, location?.pathname)
  }

  const handleClick = (event: Event) => {
    const route = UTILITY.GET_ROUTE_BY_KEY(CONSTANTS.ROUTES, event?.key)

    if (route) {
      navigate(route)
    }
  }

  return (
    <div className='flex flex-col h-full' style={{ overflowX: 'hidden', overflowY: 'auto' }}>
      <div className='flex m-4'>
        <img
          src={logo ? API.API_UPLOADS + logo : '/logo.svg'}
          alt='ロゴ'
          className='mx-auto rounded max-w-full object-contain'
          style={{ height: '32px' }}
        />
      </div>
      <Divider className='mt-0' />
      <div className='text-center mx-4'>
        <p className={`${isCollapsed ? 'text-xs' : 'text-base'}`}>
          {publicSettings?.TITLE || import.meta.env.VITE_SYSTEM_TITLE || ''}
        </p>
      </div>
      <Divider />
      <div className='flex flex-col justify-between h-full'>
        <CustomMenu
          mode='inline'
          triggerSubMenuAction='click'
          onClick={handleClick}
          defaultSelectedKeys={[CONSTANTS.ADMIN_LANDING_ROUTE]}
          defaultOpenKeys={[getOpenKeys()]}
          selectedKeys={[getSelectedKeys()]}
          items={menuItems}
        />
        <div>
          <Divider />
          <div className='flex justify-center mb-4 mx-4'>
            <img
              src={
                import.meta.env.VITE_APP_LINE_QR_URL ||
                'https://qr-official.line.me/gs/M_928hgbja_GW.png'
              }
              alt='LINE'
              className='max-w-full'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
