import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PropTypes } from 'prop-types'

import styled from 'styled-components'
import { fetchListForCategory } from '@/utils/http/fetchListForCategory'
import Container from '@components/ui/Container'
import GridContainer from '@components/ui/GridContainer'
import { OpacityMotionContainer } from '@components/ui/MotionContainer'
import Loader from '@components/ui/Loader'
import ErrorBlock from '@components/ui/ErrorBlock'
import Title from '@components/ui/Title'
import { categoryOptions } from '@utils/resources/category-options'

const DiscoverResource = ({ type }) => {
	const storedCategory = localStorage.getItem(`selectedCategory_${type}`)
	const [selectedCategory, setSelectedCategory] = useState(storedCategory || categoryOptions[type][0].id)
	const [resourceList, setResourceList] = useState([])

	const categorySelectHandler = event => {
		localStorage.setItem(`selectedCategory_${type}`, event.target.value)
		setSelectedCategory(event.target.value)
	}

	const { data, isPending, isError, isSuccess } = useQuery({
		queryKey: [`${type}-data`, selectedCategory],
		queryFn: ({ signal }) => fetchListForCategory({ signal, resourceType: type, category: selectedCategory }),
	})

	useEffect(() => {
		if (isSuccess) {
			setResourceList(data)
		}
	}, [isSuccess, data])

	return (
		<StyledContainer>
			<Wrapper>
				<StyledTitle>Select your favorite {type} category:</StyledTitle>
				<StyledSelect id='category-selection' value={selectedCategory} onChange={categorySelectHandler} className='select'>
					{categoryOptions[type].map(category => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</StyledSelect>
			</Wrapper>

			<>
				{isPending && <Loader />}
				{isError && <ErrorBlock message='Something went wrong, please try again later.' />}
				{isSuccess && !data.length && <p>No data available for the selected category.</p>}
				{isSuccess && data.length > 0 && (
					<OpacityMotionContainer>
						<GridContainer movies={resourceList} path={type} />
					</OpacityMotionContainer>
				)}
			</>
		</StyledContainer>
	)
}

DiscoverResource.propTypes = {
	type: PropTypes.string,
}

export default DiscoverResource

const StyledContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 60px;
	text-align: center;
`

const Wrapper = styled.section`
	margin: 20px 0 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: baseline;
	width: 100%;
	gap: 10px;

	@media (min-width: 600px) {
		flex-direction: row;
		gap: 30px;
	}

	@media (min-width: 700px) {
		margin: 40px 0 50px;
		flex-direction: row;
		justify-content: start;
	}
`

const StyledTitle = styled(Title)`
	margin: 10px 0;
	display: flex;
	align-items: center;
`

const StyledSelect = styled.select`
	width: 200px;
	cursor: pointer;
	padding: 10px 20px;
	appearance: none;
	text-align-last: center;
	-webkit-appearance: none;
	border-radius: 50px;
	background-color: rgb(49, 51, 60);
	color: rgb(249, 249, 249);
	outline: none;
	transition: border 0.3s, background-color 0.3s;

	&:hover {
		background-color: rgba(49, 51, 60, 0.5);
	}

	&.select {
		background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%),
			linear-gradient(to right, #ccc, #ccc);
		background-position: calc(100% - 20px) calc(10px + 5px), calc(100% - 15px) calc(10px + 5px), calc(100% - 30px) 10px;
		background-size: 5px 5px, 5px 5px, 1px 15px;
		background-repeat: no-repeat;
	}
`
