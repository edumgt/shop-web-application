import React from 'react'

const Card: React.FC<{className?: string}>=
({children,className}) => {
  return (
    <div className={`rounded shadow-md py-2 ${className}`}>
      {children}
    </div>
  )
}
export const CardSection: React.FC<{
  className?: string
  withBorder?: boolean
  withPadding?: boolean
}> = ({children,className='', withBorder=false,withPadding=false}) => {
  return (
    <div
      className={`
      ${withBorder ? 'border-b ' : ''}
      ${withPadding ? 'px-8 py-5' : ''}
      ${className}`}>{children}</div>
  )
}
export default Card