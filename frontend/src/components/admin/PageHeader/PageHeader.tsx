import { Breadcrumb, theme } from 'antd/es'
import { MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
interface HeaderProps {
  publicSettings?: any
  routes?: any
  title?: any
  previous?: string
  actions?: any
}

const { useToken } = theme

const PageHeader = (props: HeaderProps) => {
  const { publicSettings, routes, title, previous, actions } = props

  const { token } = useToken()
  const navigate = useNavigate()

  return (
    <div className='flex flex-col mb-4'>
      {routes && (
        <div className='flex justify-start mb-4'>
          <Breadcrumb routes={routes} />
        </div>
      )}
      <div className='flex flex-wrap gap-y-4 justify-between items-center'>
        <div className='flex flex-wrap items-center'>
          {previous && (
            <MdArrowBack
              onClick={() => {
                navigate(previous)
              }}
              style={{ color: publicSettings?.PRIMARY_COLOR }}
              className='text-2xl mr-4 cursor-pointer'
            />
          )}
          <p className='text-lg font-bold' style={{ color: token.colorText }}>
            {title}
          </p>
        </div>
        <div className='flex flex-wrap items-center'>{actions || ''}</div>
      </div>
    </div>
  )
}

export default PageHeader
