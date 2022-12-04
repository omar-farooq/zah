import ProductDisplay from '@/Components/ProductDisplay'

export default function Browse() {
    return (
        <>
            <ProductDisplay
                title="Requests needing your attention"
                productData="needApproval"
                model="purchase-requests"
            />

            <ProductDisplay
                title="All Purchase Requests"
                productData="all" 
                model="purchase-requests"
            />
        </>
    )
}
