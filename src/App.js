import React, { useEffect, useState } from 'react';
import s from './App.module.scss';
import { Box, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { axiosGetCars } from './http/request';

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

	useEffect(() => {
		const brandsSet = new Set();
		const modelsSet = new Set();

		axiosGetCars().then((data) => {
			setCars(data.data['cars']);
			data.data['cars'].forEach(({ brand, model }) => {
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
			cars.forEach(({ brand, model }) => {
				if (brand === activeBrand) {
					modelsSet.add(model);
				}
			});
		}
		setModels([...modelsSet]);
		setActiveModel('');
	}, [activeBrand, cars]);

	useEffect(() => {
		const updateFilteredCars = () => {
			let filtered = cars.slice();

			if (activeBrand) {
				filtered = filtered.filter(({ brand }) => brand === activeBrand);
			}
			if (activeModel) {
				filtered = filtered.filter(({ model }) => model === activeModel);
			}
			if (priceFrom) {
				filtered = filtered.filter(({ price }) => +price >= +priceFrom.split(' ').join(''));
			}
			if (priceTo) {
				filtered = filtered.filter(({ price }) => +price <= +priceTo.split(' ').join(''));
			}
			if (yearFrom) {
				filtered = filtered.filter(({ years }) => +years >= +yearFrom);
			}

			return filtered;
		};

		setFilteredCars(updateFilteredCars());
	}, [activeBrand, activeModel, cars, priceFrom, priceTo, yearFrom]);

	const checkYear = (event) => {
		event.target.value = event.target.value.replace(/[^\d]/g, '');

		let maxLength = 4;
		if (+event.target.value.length > maxLength) {
			event.target.value = event.target.value.slice(0, maxLength);
		}

		if (+event.target.value > new Date().getFullYear()) {
			event.target.value = new Date().getFullYear();
		} else if (event.target.value.length === 4 && +event.target.value < 1964) {
			event.target.value = 1964;
		}
	};

	const checkMinYear = (event) => {
		if (+event.target.value < 1964) {
			event.target.value = 1964;
		}
	};

	const checkPrice = (event) => {
		event.target.value = event.target.value.replace(/\D/g, '');
		event.target.value = event.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	};

	return (
		<>
			<FormGroup className={s.searchForm}>
				<FormControl variant="filled" size="small" margin="normal" fullWidth>
					<InputLabel id="brand-label">Марка</InputLabel>
					<Select
						labelId="brand-label"
						id="brand-select"
						label="Марка"
						className={s.formInput}
						onChange={(event) => setActiveBrand(event.target.value)}
						value={activeBrand}
						sx={{
							'&:after': { border: 'none' },
						}}
					>
						<MenuItem value="" key={'all'}>
							Все марки
						</MenuItem>

						{brands.map((el) => (
							<MenuItem value={el} key={el}>
								{el}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl variant="filled" size="small" margin="normal" fullWidth>
					<InputLabel id="model-label">Модель</InputLabel>
					<Select
						labelId="model-label"
						id="model-select"
						label="Модель"
						className={s.formInput}
						onChange={(event) => setActiveModel(event.target.value)}
						value={activeModel}
						sx={{
							'&:after': { border: 'none' },
						}}
					>
						<MenuItem value="" key={'all'}>
							Все модели
						</MenuItem>
						{models.map((el) => (
							<MenuItem value={el} key={el}>
								{el}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Box
					sx={{
						display: 'flex',
						gap: '16px',
					}}
				>
					<FormControl
						margin="normal"
						sx={{
							flex: '1',
							fontFamily: 'serif',
						}}
					>
						<TextField
							id="price-from"
							label="Цена, от"
							variant="filled"
							size="small"
							value={priceFrom}
							className={s.formInput}
							onChange={(event) => setPriceFrom(event.target.value)}
							onInput={checkPrice}
							sx={{
								'&:after': { border: 'none' },
							}}
						/>
					</FormControl>

					<FormControl
						margin="normal"
						sx={{
							flex: '1',
						}}
					>
						<TextField
							id="price-to"
							label="Цена, до"
							variant="filled"
							size="small"
							value={priceTo}
							className={s.formInput}
							onChange={(event) => setPriceTo(event.target.value)}
							onInput={checkPrice}
							sx={{
								'&:after': { border: 'none' },
							}}
						/>
					</FormControl>
				</Box>
				<Box
					sx={{
						display: 'flex',
						gap: '16px',
					}}
				>
					<FormControl
						margin="normal"
						sx={{
							flex: '1',
							backgroundColor: '#ffffff',
							borderRadius: '4px',
						}}
					>
						<TextField
							id="year-from"
							label="Год, от"
							variant="filled"
							value={yearFrom}
							size="small"
							className={s.formInput}
							onChange={(event) => setYearFrom(event.target.value)}
							onInput={checkYear}
							onFocus={checkMinYear}
							sx={{
								flex: '1',
							}}
						/>
					</FormControl>

					<FormControl
						margin="normal"
						sx={{
							flex: '1',
						}}
					>
						<a
							href={`/new-filter?${activeBrand ? 'brand=' + activeBrand : ''}${activeModel ? '&model=' + activeModel : ''}${
								priceFrom || priceTo ? '&price=[' + priceFrom.split(' ').join('') + ',' + priceTo.split(' ').join('') + ']' : ''
							}${yearFrom ? '&year=' + yearFrom : ''}`}
							style={{
								height: '100%',
							}}
						>
							<Button
								margin="normal"
								variant="contained"
								size="small"
								sx={{
									height: '100%',
									width: '100%',
									backgroundColor: '#ed1c24',
									'&:hover': { backgroundColor: '#cc1f26' },
								}}
							>
								Показать ({filteredCars.length})
							</Button>
						</a>
					</FormControl>
				</Box>
			</FormGroup>
		</>
	);
};

export default App;
