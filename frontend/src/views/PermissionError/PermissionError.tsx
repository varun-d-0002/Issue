import { Result } from 'antd'

import BaseAnimation from 'components/common/BaseAnimation'

import * as CONSTANT from 'common/constant'

const PermissionError = () => {
  return (
    <BaseAnimation>
      <div className='flex h-screen'>
        <div className='m-auto'>
          <Result status='403' title='401' subTitle={CONSTANT.ERROR_401_MSG} />
        </div>
      </div>
    </BaseAnimation>
  )
}

export default PermissionError
