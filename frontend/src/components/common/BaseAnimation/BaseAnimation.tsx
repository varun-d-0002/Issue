import { m } from 'framer-motion'
interface Props {
  children?: React.ReactNode
  className?: string
  style?: Object
}
const BaseV = {
  hidden: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const BaseAnimation = (props: Props) => {
  return (
    <m.div
      initial='hidden'
      animate='enter'
      exit='exit'
      variants={BaseV}
      transition={{ type: 'linear' }}
      className={props.className}
      style={props.style}
    >
      {props.children}
    </m.div>
  )
}

export default BaseAnimation
