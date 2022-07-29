import React from 'react'
import { useEffect, useState } from 'react';

const axios = require('axios');
const username = 'user3472';
const apiKey = '0f6aa487-0f3b-41dc-95be-86c19dd0b98d';

const App2 = () => {

    const [brands, setBrands] = useState([]);
    const [currentBrand, setCurrentBrand] = useState('');
    const [next, setNext] = useState('');
    const [nextArray, setNextArray] = useState(['']);

    const getBrands = async (direction) => {
        let nextStep;
        if (direction === 'fwd') {
            nextStep = next;
        } else if (direction === 'bck') {
            nextStep = nextArray[nextArray.indexOf(next) - 2];
        }
        const response = await axios.get(`https://size-calculator-api.sspinc.io/brands?limit=10&next=${nextStep}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
            }
        })
        console.log(response.data);
        setBrands(response.data.brands);
        setNext(response.data.next);
    }

    const handleChangeBrand = (e) => {
        if (currentBrand === 'paginate-fwd') {
            console.log('paginating forward');
            console.log(next);
            getBrands('fwd');
        }
        else if (currentBrand === 'paginate-bck') {
            console.log('paginating backward');
            console.log(`finding previous next in nextarray. current next is: ${next}`);
            console.log(nextArray.indexOf(next));
            console.log(nextArray.indexOf(next) - 2);
            console.log(nextArray);
            console.log(nextArray[nextArray.indexOf(next) - 2]);
            getBrands('bck');
        }
    }

    useEffect(() => {
        console.log(currentBrand);
        if (currentBrand === 'paginate-fwd' || currentBrand === 'paginate-bck') {
            handleChangeBrand();
        }
    }, [currentBrand]);

    useEffect(() => {
        console.log('next is: ', next);
        if (!(nextArray.includes(next))) {
            setNextArray([...nextArray, next]);
        }
    }, [next]);

    useEffect(() => {
        getBrands('fwd');
    }, []);

  return (
    <div>
        <select name="brand" id="brand" onChange={(e) => setCurrentBrand(e.target.value)}>
            <option value="">Select a brand</option>
            {/* {nextArray.length > 2 && <option value="paginate-bck">PREVIOUS BRANDS</option>} */}
            {nextArray.indexOf(next) > 1 && <option value="paginate-bck">PREVIOUS BRANDS</option>}
            {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
            <option value="paginate-fwd">MORE BRANDS</option>
        </select>
    </div>
  )
}

export default App2