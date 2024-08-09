import * as API from 'common/api'

const TopBarComponent = (props: { logo: any }) => {
  const { logo } = props

  return (
    <>
      <div className='flex flex-col px-4'>
        <div className='flex justify-center'>
          {logo ? (
            <img
              style={{
                maxHeight: '120px',
              }}
              alt='ロゴ'
              src={`${API.SETTINGS_UPLOADS_URL}settings/${logo}`}
              className='rounded max-w-full object-contain'
            />
          ) : (
            <img
              style={{
                maxHeight: '120px',
              }}
              alt='ロゴ'
              src='/logo.svg'
              className='rounded max-w-full object-contain'
            />
          )}
        </div>
      </div>
    </>
  )
}

export default TopBarComponent
