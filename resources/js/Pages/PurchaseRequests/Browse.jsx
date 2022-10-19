import ProductGrid from '@/Components/ProductGrid'
import ProductCards from '@/Components/ProductCards'

export default function Browse({purchaseRequests, unapprovedRequests, auth}) {

    let arr = []
    const userNeedsToReviewList = unapprovedRequests.reduce((allUnapproved, unapproved) => { 
        if(!unapproved.approvals.find(x => x.user_id == auth.user.id)) { 
            arr.push(unapproved);
        }
            return arr
    },{})

    return (
        <>
            <ProductGrid title="Requests needing your attention">
                <ProductCards 
                    products={userNeedsToReviewList} 
                    linkLocation="/purchase-requests/"
                />
            </ProductGrid>
            <ProductGrid title="All Purchase Requests">
                <ProductCards 
                    products={purchaseRequests.data} 
                    linkLocation="/purchase-requests/"
                />
            </ProductGrid>
        </>
    )
}
