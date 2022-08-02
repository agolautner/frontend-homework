import React from 'react';

const Results = ({data, setter}) => {

    console.log('results are: ', data);
  return (
        <div className='results'>
        Your size is  
            {!data.length && <div className='results-data'>not found.</div>}
            {data.length === 2 && <div className='results-data'>{data[1].label} or {data[0].label}</div>}
            {/* {data.length && data.map((item, index) => {
                return (<div key={index}>{item.label}</div>)
                })
            } */}
            <button className='results-button' onClick={() => setter(false)}>OK</button>
        </div>
  )
}

export default Results