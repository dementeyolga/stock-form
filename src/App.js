import React, {useEffect, useState} from 'react';
import s from './App.css';
import {Box, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {axiosGetCars} from "./http/request";

const App = () => {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    const [activeBrand, setActiveBrand] = useState('');
    const [activeModel, setActiveModel] = useState('');

    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [yearFrom, setYearFrom] = useState('');

    const [filteredCars, setFilteredCars] = useState([]);
    // const chosenCars = [];


    useEffect(() => {
        const brandsSet = new Set();
        const modelsSet = new Set();

        axiosGetCars().then((data) => {
            setCars(data.data['cars']);
            data.data['cars'].forEach(({brand, model}) => {
                brandsSet.add(brand);
                modelsSet.add(model);
            });
            setBrands([...brandsSet]);
            setModels([...modelsSet]);

        });
    }, []);

    useEffect(() => {
        const modelsSet = new Set();
        if (activeBrand) {
            cars.forEach(({brand, model}) => {
               if (brand === activeBrand) {
                   modelsSet.add(model);
               }
            });
        }
        setModels([...modelsSet]);
        setActiveModel('');
    }, [activeBrand, cars])



    useEffect(() => {
        const updateFilteredCars = () => {
            let filtered = cars.slice();

            if (activeBrand) {
                filtered = filtered.filter(({brand}) => brand === activeBrand);
            }
            if (activeModel) {
                filtered = filtered.filter(({model}) => model === activeModel);
            }
            if (priceFrom) {
                filtered = filtered.filter(({price}) => +price >= +priceFrom.split(' ').join(''));
            }
            if (priceTo) {
                filtered = filtered.filter(({price}) => +price <= +priceTo.split(' ').join(''));
            }
            if (yearFrom) {
                filtered = filtered.filter(({years}) => +years >= +yearFrom);
            }

            return filtered;
        }

        setFilteredCars(updateFilteredCars());
    }, [activeBrand, activeModel, cars, priceFrom, priceTo, yearFrom])

    const checkYear = (event) => {
        event.target.value = event.target.value.replace(/[^\d]/g, '');

        let maxLength = 4;
        if (+event.target.value.length > maxLength) {
            event.target.value = event.target.value.slice(0, maxLength);
        }

        if (+event.target.value > (new Date()).getFullYear()) {
            event.target.value = (new Date()).getFullYear();
        } else if (event.target.value.length === 4 && +event.target.value < 1964) {
            event.target.value = 1964;
        }
    }

    const checkMinYear = (event) => {
        if (+event.target.value < 1964) {
            event.target.value = 1964;
        }
    }

    const checkPrice = (event) => {
        event.target.value = event.target.value.replace(/\D/g, '');
        event.target.value = event.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }


    return (<>
        <form className={s.searchForm}>
            <FormControl variant="filled" margin="normal" fullWidth>
                <InputLabel id="brand-label">Марка</InputLabel>
                <Select
                    labelId="brand-label"
                    id="brand-select"
                    label="Марка"
                    className={s.formInput}
                    onChange={(event) => setActiveBrand(event.target.value)}
                    value={activeBrand}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                    }}
                >
                    <MenuItem value=''>Все марки</MenuItem>
                    {
                        brands.map((el) =>
                            <MenuItem value={el}>{el}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <FormControl variant="filled" margin="normal" fullWidth>
                <InputLabel id="model-label">Модель</InputLabel>
                <Select
                    labelId="model-label"
                    id="model-select"
                    label="Модель"
                    onChange={(event) => setActiveModel(event.target.value)}
                    value={activeModel}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                    }}
                >
                    <MenuItem value=''>Все модели</MenuItem>
                    {
                        models.map((el) =>
                            <MenuItem value={el}>{el}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <Box sx={{
                display: 'flex',
                gap: '16px'
            }}>
                <FormControl margin="normal" sx={{
                    flex: '1',
                    fontFamily: 'serif'
                }}>
                    <TextField id="price-from"
                               label="Цена, от"
                               variant="filled"
                               value={priceFrom}
                               onChange={(event) => setPriceFrom(event.target.value)}
                               onInput={checkPrice}
                               sx={{
                                   backgroundColor: '#ffffff',
                                   borderRadius: '4px',
                                   fontFamily: 'serif'
                               }}/>
                </FormControl>

                <FormControl margin="normal" sx={{
                    flex: '1'
                }}>
                    <TextField id="price-to"
                               label="Цена, до"
                               variant="filled"
                               value={priceTo}
                               onChange={(event) => setPriceTo(event.target.value)}
                               onInput={checkPrice}
                               sx={{
                                   backgroundColor: '#ffffff',
                                   borderRadius: '4px'
                               }}
                    />
                </FormControl>
            </Box>
            <Box sx={{
                display: 'flex',
                gap: '16px'
            }}>
                <FormControl margin="normal" sx={{
                    flex: '1',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                }}>
                    <TextField id="year-from"
                               label="Год, от"
                               variant="filled"
                               value={yearFrom}
                               onChange={(event) => setYearFrom(event.target.value)}
                               onInput={checkYear}
                               onFocus={checkMinYear}
                               sx={{
                                   flex: '1'
                               }}
                    />
                </FormControl>

                <FormControl margin="normal" sx={{
                    flex: '1'
                }}>
                    <a href={`/new-filter?${activeBrand ? 'brand=' + activeBrand : ''}${activeModel ? '&model=' + activeModel : ''}${priceFrom || priceTo ? '&price=[' + priceFrom.split(' ').join('') + ',' + priceTo.split(' ').join('') + ']' : ''}${yearFrom ? '&year=' + yearFrom : ''}`}
                       style={{
                           height: '100%',
                       }}>
                        <Button margin="normal" variant="contained" sx={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: '#ed1c24',
                            '&:hover': {backgroundColor: '#cc1f26',}

                        }}>
                            Показать ({
                            filteredCars.length
                        })
                        </Button>
                    </a>

                </FormControl>
            </Box>
        </form>
    </>)

};

export default App;