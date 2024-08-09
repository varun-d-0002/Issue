import { Result } from 'antd'

import BaseAnimation from 'components/common/BaseAnimation'

import * as CONSTANT from 'common/constant'

const NotFound = () => {
  return (
    <BaseAnimation>
      <div className='flex h-screen'>
        <div className='m-auto'>
          <Result status='404' title='404' subTitle={CONSTANT.ERROR_404_MSG} />
        </div>
      </div>
    </BaseAnimation>
  )
}

export default NotFound
