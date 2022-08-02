import './App.css';
import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import Input from './components/Input';
import Option from './components/Option';
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
    }

    const handleChangeCategory = (category) => {
        setCurrentCategory(category.name);
        setCurrentCategoryId(category.id);
        setShowCatSelect(false);
    }

    const calculateSize = async () => {
        setLoading(true);
        const response = await axios.get(`https://size-calculator-api.sspinc.io/sizes?brand_id=${currentBrandId}&category_id=${currentCategoryId}&measurement=${userSize}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
            }
        });

        setLoading(false);
        console.log(response.data);
    }

    useEffect(() => {
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
        <Input display={currentBrand} setter={setShowSelect}/>
        {showSelect && 
            <div className="brand-select select">
                {loading && <div>Loading...</div>}
                {!loading && brands.map((brand, index) => {
                    return (<Option key={index} handler={handleChangeBrand} object={brand}/>)
                    // return (<div className='select-option' key={index} onClick={() => handleChangeBrand(brand)}>{brand.name}</div>)
                })}
                <div className='button-container'>
                    <button onClick={() => getBrands('bck')}>BACK</button>
                    <button onClick={() => setShowSelect(false)}>x</button>
                    <button onClick={() => getBrands('fwd')}>NEXT</button>
                </div>
            </div>
        }

        {/* category select */}
        <Input display={currentCategory} setter={setShowCatSelect}/>
        {showCatSelect &&
            <div className="category-select select">
                {loading && <div>Loading...</div>}
                {!loading && categories.map((category, index) => {
                    return (<Option key={index} handler={handleChangeCategory} object={category}/>)
                    // return (<div className='select-option' key={index} onClick={() => handleChangeCategory(category)}>{category.name}</div>)
                })}
                <button onClick={() => setShowCatSelect(false)}>x</button>
            </div>
        }

        {/* size select */}
        <div className="size input">
            My size is
            <input className='num-input' type="number" step={'0.1'} onChange={(e) => setUserSize(e.target.value)}/>
            inches.
        </div>

        <button className='calc-button' onClick={() => calculateSize()}>CALCULATE</button>
    </div>
  )
}

export default App3