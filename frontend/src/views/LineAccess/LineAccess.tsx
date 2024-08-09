import { Result } from 'antd'

import BaseAnimation from 'components/common/BaseAnimation'

import * as CONSTANT from 'common/constant'

const LineAccess = () => {
  return (
    <BaseAnimation>
      <div className='flex h-screen'>
        <div className='m-auto'>
          <Result status='403' title='403' subTitle={CONSTANT.ERROR_LINE_403_MSG} />
        </div>
      </div>
    </BaseAnimation>
  )
}

export default LineAccess
