import './App.css';
import React, {useState, useEffect} from 'react';
import Header from './components/Header';
const axios = require('axios');
const username = 'user3472';
const apiKey = '0f6aa487-0f3b-41dc-95be-86c19dd0b98d';

const App3 = () => {
    const [brands, setBrands] = useState([]);
    const [currentBrand, setCurrentBrand] = useState('Choose a brand');
    const [currentBrandId, setCurrentBrandId] = useState('');
    const [next, setNext] = useState('');
    const [nextArray, setNextArray] = useState(['']);

    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('Choose a category');
    const [currentCategoryId, setCurrentCategoryId] = useState('');

    const [userSize, setUserSize] = useState(0);

    const [showSelect, setShowSelect] = useState(false);
    const [showCatSelect, setShowCatSelect] = useState(false);

    const [loading, setLoading] = useState(false);

    const getBrands  = async (direction) => {
        setLoading(true);

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
        });

        setBrands(response.data.brands);
        setNext(response.data.next);

        setLoading(false);
    }

    const getCategories = async (brandId) => {
        setLoading(true);

        const response = await axios.get(`https://size-calculator-api.sspinc.io/categories?brand_id=${brandId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
            }
        });

        setCategories(response.data.categories);

        setLoading(false);
    }

    const handleChangeBrand = (brand) => {
        setCurrentBrand(brand.name);
        setCurrentBrandId(brand.id);
        getCategories(brand.id); //calling the function that gets the categories
        setShowSelect(false);
        alert('You have selected: ' + brand.name + ' id: ' + brand.id);
    }

    const handleChangeCategory = (category) => {
        setCurrentCategory(category.name);
        setCurrentCategoryId(category.id);
        setShowCatSelect(false);
        alert('You have selected: ' + category.name + ' id: ' + category.id);
    }

    const calculateSize = async () => {
        setLoading(true);
        const response = await axios.get(`https://size-calculator-api.sspinc.io/sizes?brand_id=${currentBrandId}&category_id=${currentCategoryId}&measurement=${userSize}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
            }
        });

        console.log('sending request to api');
        console.log({
            currentBrandId, currentCategoryId, userSize
        });
        console.log(response.status);

        setLoading(false);
        console.log(response.data);
    }

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
    <div className='container'>
        <Header />

        {/* brand select */}
        <div className="brand input" onClick={() => setShowSelect(true)}>{currentBrand}</div>
        {showSelect && 
            <div className="brand-select select">
                {loading && <div>Loading...</div>}
                {!loading && brands.map((brand, index) => {
                    return (<div className='select-option' key={index} onClick={() => handleChangeBrand(brand)}>{brand.name}</div>)
                })}
                <div className='button-container'>
                    <button onClick={() => getBrands('bck')}>BACK</button>
                    <button onClick={() => getBrands('fwd')}>NEXT</button>
                    <button onClick={() => setShowSelect(false)}>close</button>
                </div>
            </div>
        }

        {/* category select */}
        <div className="category input" onClick={() => setShowCatSelect(true)}>{currentCategory}</div>
        {showCatSelect &&
            <div className="category-select select">
                {loading && <div>Loading...</div>}
                {!loading && categories.map((category, index) => {
                    return (<div className='select-option' key={index} onClick={() => handleChangeCategory(category)}>{category.name}</div>)
                })}
                <button onClick={() => setShowCatSelect(false)}>close</button>
            </div>
        }

        {/* size select */}
        <div className="size input">
            My size is
            <input type="number" step={'0.1'} onChange={(e) => setUserSize(e.target.value)}/>
            inches.
        </div>

        <button className='calc-button' onClick={() => calculateSize()}>CALCULATE</button>
    </div>
  )
}

export default App3