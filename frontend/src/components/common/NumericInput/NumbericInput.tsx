import React from 'react'
import { Input, InputProps, InputRef } from 'antd'

const NumericInput = (
  props: JSX.IntrinsicAttributes & InputProps & React.RefAttributes<InputRef>,
) => {
  const onChange = (e: { target: { value: any } }) => {
    const { value } = e.target
    const reg = /^-?\d*(\.\d*)?$/

    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      //@ts-ignore
      props.onChange(value)
    }
  }

  return <Input {...props} onChange={onChange} onPressEnter={(e) => e.preventDefault()} />
}

export default NumericInput
