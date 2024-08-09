import { m } from 'framer-motion'
interface Props {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  style?: Object
}
const ANIMATION_TAP_HOVER_VARIANT = {
  tap: {
    scale: 0.9,
  },
}

const TapAnimation = (props: Props) => {
  const { children, onClick, className, style } = props

  return (
    <m.div
      whileTap='tap'
      variants={ANIMATION_TAP_HOVER_VARIANT}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children}
    </m.div>
  )
}

export default TapAnimation
