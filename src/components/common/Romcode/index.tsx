import useRomcode from './useRomcode'
import { FC } from 'react'

const Romcode: FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  const reactNode = useRomcode(children)
  return <div className={className}>{reactNode}</div>
}

export default Romcode
