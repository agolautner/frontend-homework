import { useEffect, useState } from 'react';

const axios = require('axios');
const username = 'user3472';
const apiKey = '0f6aa487-0f3b-41dc-95be-86c19dd0b98d';

function App() {
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState('');
  const [categories, setCategories] = useState([]);
  const [next, setNext] = useState('');

  //STORING 'NEXT' PROPERTIES IN AN ARRAY FOR PAGINATION
  const [nextArray, setNextArray] = useState([]);

  const getBrands = async (direction) => {
    console.log("getting brands");
    let nextStep;

    if (direction === 'bck') {
      console.log(nextArray);
      nextStep = nextArray[nextArray.indexOf(next) - 1];
      console.log('next step is: ', nextStep);
    } else {
      nextStep = next;
      console.log('first object in new data should be: ', nextStep);
    }
    const response = await axios.get(`https://size-calculator-api.sspinc.io/brands?limit=17&next=${nextStep}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
      }
    })
    console.log(response.data);
  
    await setBrands(response.data.brands);
    await setNext(response.data.next);
    console.log('first object in new data should be: ', response.data.next);

    //PUSHING 'NEXT' TO THE ARRAY CONTAINING 'NEXT' PROPERTIES, IF IT ISN'T ALREADY IN THE ARRAY
    if(!(nextArray.includes(response.data.next))) {
      setNextArray([...nextArray, response.data.next]);
    }
  }

  //GETTING CATEGORIES FOR THE SPECIFIED BRAND
  const getCategories = async (brand) => {
    setCategories([]);
    const response = await axios.get(`https://size-calculator-api.sspinc.io/categories?brand_id=${brand}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
      }
    })
    if (brand !== 'paginate-fwd' && brand !== 'paginate-bck') {
      setCategories(response.data.categories);
    }
    console.log(response.data)
  }

  const paginateSelect = (e) => {
    if(e.target.value === "paginate-fwd") {
      console.log("paginate-fwd");
      setCategories([]);
      getBrands('fwd');
      setBrand(brands[0].id);
    }
    if(e.target.value === "paginate-bck") {
      console.log('paginate-bck');
      setCategories([]);
      getBrands('bck');
      setBrand(brands[0].id);
    }
  }

  const handleBrandChange = async (e) => {
    if (e.target.value !== 'paginate-fwd' && e.target.value !== 'paginate-bck') {
      setBrand(e.target.value);
      getCategories(e.target.value);
    } else if (e.target.value === 'paginate-fwd' || e.target.value === 'paginate-bck') {
      paginateSelect(e)
    }
  }

  useEffect(() => {
    getBrands('fwd');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        size calculator
      </header>
      <select name="brand" id="brand" onChange={(e) => handleBrandChange(e)} value={brand}>
        <option value="">Select a brand</option>
        <option value="paginate-bck">SHOW FEWER BRANDS</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>{brand.name}</option>
        ))}
        <option value="paginate-fwd">SHOW MORE BRANDS</option>
      </select>
      <br />
      <select name="categories" id="categories" disabled={categories.length === 0}>
        <option value="">Select a category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <br />
      <p>My size is </p> <input type="number" id="size" step='0.1'/> <p> inches</p>
    </div>
  );
}

export default App;
