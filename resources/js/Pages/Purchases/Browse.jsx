import ProductDisplay from '@/Components/ProductDisplay'

export default function Browse() {

    return (
        <>
            <ProductDisplay 
                title="Purchases Requiring Action"
                productData="needAction"
                productType="purchases"
            />

            <ProductDisplay 
                title="Purchased"
                productData="received"
                productType="purchases"
            />
        </>
    )
}
