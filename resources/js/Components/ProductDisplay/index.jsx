import { useEffect, useState } from 'react'
import ProductGrid from './ProductGrid'
import ProductCards from './ProductCards'

export default function ProductDisplay({title, productData, model}) {

    const [cards, setCards] = useState([])
    useEffect(() => {
        const getCards = async () => {
            let cardData = await axios.get(model+'?cards='+productData)
            setCards(cardData.data)
        }
        getCards()
    },[])
    console.log(cards)

    return (
        <>
            <ProductGrid title={title}>
                <ProductCards
                    cards={cards}
                    model={model}
                />
            </ProductGrid>
        </>
    )
}
