import ProductDisplay from '@/Components/ProductDisplay'

export default function Browse() {

    return (
        <>
            <ProductDisplay 
                title="Purchases Requiring Action"
                productData="needAction"
                model="purchases"
            />

            <ProductDisplay 
                title="Purchased"
                productData="received"
                model="purchases"
                searchable
                paginate
            />
        </>
    )
}
