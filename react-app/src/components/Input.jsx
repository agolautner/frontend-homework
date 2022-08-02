import React from 'react'

const Input = ({ display, setter }) => {
  return (
    <div className="input field" onClick={() => setter(true)}>{display}</div>
  )
}

export default Input