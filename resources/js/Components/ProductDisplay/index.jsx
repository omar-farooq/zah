import { useEffect, useState } from 'react'
import { Loader } from '@mantine/core'
import ProductGrid from './ProductGrid'
import ProductCards from './ProductCards'

export default function ProductDisplay({title, productData, model, searchable=false, paginate=false, loadingHook}) {

    const [cards, setCards] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState('')
    const [loading, setLoading] = loadingHook

    const getCards = async (page) => {
        let cardData = await axios.get(model+'?cards='+productData+'&search='+searchTerm+'&page='+activePage)
        setCards(cardData.data)
        setTotalPages(cardData.data.last_page)
        setLoading(false)
    }

    useEffect(() => {
        getCards()
    },[searchTerm, activePage])

    return (
        loading ? '' :
            cards.data?.length === 0 && !searchable ? '' :
        <>
            <ProductGrid 
                title={title} 
                searchable={searchable}
                paginate={paginate}
                searchHook={[searchTerm, setSearchTerm]}
                activePageHook={[activePage, setActivePage]}
                totalPageHook={[totalPages, setTotalPages]}
            >
                <ProductCards
                    cards={cards}
                    model={model}
                />
            </ProductGrid>
        </>
    )
}
