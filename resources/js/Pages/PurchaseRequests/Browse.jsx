import ProductDisplay from '@/Components/ProductDisplay'

export default function Browse({requestNumber}) {
    return (
        requestNumber === 0 ?
            <div className="mt-10 text-2xl">There are no purchase requests</div>
            :
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
                    searchable
                    paginate
                />
            </>
        
    )
}
