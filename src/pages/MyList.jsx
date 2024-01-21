import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styled from 'styled-components'
import Container from '@components/UI/Container'
import { OpacityMotionContainer } from '@components/UI/MotionContainer'
import GridContainer from '@components/UI/GridContainer'
import Title from '@components/UI/Title'

import { fetchWatchListData } from '@store/watchlist-actions'
import { auth } from '@/firebase'

const MyListPage = () => {
	const dispatch = useDispatch()
	const watchList = useSelector(state => state.watchList)
	const [resourceArray, setResourceArray] = useState([])

	useEffect(() => {
		if (auth.currentUser) {
			dispatch(fetchWatchListData({ user: auth.currentUser.uid }))
		} else {
			console.log('User is not logged in.')
		}
	}, [dispatch])

	useEffect(() => {
		const filteredResources = watchList.resources.filter(resource => {
			return resource.userId === auth.currentUser.uid
		})

		setResourceArray(filteredResources)
	}, [watchList.resources])

	return (
		<StyledContainer>
			<Title>My List</Title>
			<OpacityMotionContainer>
				<Wrapper>
					{resourceArray.length > 0 ? (
						<GridContainer movies={resourceArray} />
					) : (
						<InfoParagraph>{`Your watch list is empty. Why don't you add something in here? 💫`}</InfoParagraph>
					)}
				</Wrapper>
			</OpacityMotionContainer>
		</StyledContainer>
	)
}

export default MyListPage

const StyledContainer = styled(Container)`
	margin-top: 30px;
	padding: 60px;
	text-align: center;
`

const Wrapper = styled.section`
	padding-bottom: 60px;
	width: 100%;
	text-align: left;
`

const InfoParagraph = styled.p`
	@media (min-width: 600px) {
		font-size: 18px;
	}

	@media (min-width: 1000px) {
		font-size: 20px;
	}
`
