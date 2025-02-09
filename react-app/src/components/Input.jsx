import React from 'react'

const Input = ({ display, setter }) => {
  return (
    <div className="input field" onClick={() => setter(true)}>
        {display}
        <div className='dropdown-icon'>
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.53617 8.99272L0.747868 0.791069L10.2449 0.745107L5.53617 8.99272Z" fill="#B4C6C1"/>
            </svg>
        </div>
    </div>
  )
}

export default Input