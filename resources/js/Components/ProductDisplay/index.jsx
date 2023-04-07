import { useEffect, useState } from 'react'
import ProductGrid from './ProductGrid'
import ProductCards from './ProductCards'

export default function ProductDisplay({title, productData, model, searchable=false, paginate=false}) {

    const [cards, setCards] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState('')

    const getCards = async (page) => {
        let cardData = await axios.get(model+'?cards='+productData+'&search='+searchTerm+'&page='+activePage)
        setCards(cardData.data)
        setTotalPages(cardData.data.last_page)
    }

    useEffect(() => {
        getCards()
    },[searchTerm, activePage])

    return (
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
