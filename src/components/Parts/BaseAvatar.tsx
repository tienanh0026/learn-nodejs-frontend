import clsx from 'clsx'
import { forwardRef } from 'react'

type AvatarProps = {
  src?: string
  name: string
  colorClass?: string
  wrapperClass?: string
  onClick?: () => void
}

const BaseAvatar = forwardRef<HTMLDivElement, AvatarProps>(function BaseAvatar(
  {
    src,
    name,
    colorClass = 'bg-slate-600 text-white',
    wrapperClass,
    onClick,
  }: AvatarProps,
  ref
) {
  const avatarClass = clsx(
    wrapperClass,
    colorClass,
    'rounded-full border border-black aspect-square flex items-center justify-center cursor-pointer'
  )
  return (
    <div className={avatarClass} onClick={onClick} ref={ref}>
      {src ? (
        <img src={src} />
      ) : (
        <div className="p-1 aspect-square">{name[0]}</div>
      )}
    </div>
  )
})

BaseAvatar.displayName = 'BaseAvatar'

export default BaseAvatar
