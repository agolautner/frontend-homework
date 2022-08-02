import React from 'react'

const Option = ({handler, object}) => {
  return (
    <div className='select-option' onClick={() => handler(object)}>{object.name}</div>
  )
}

export default Option