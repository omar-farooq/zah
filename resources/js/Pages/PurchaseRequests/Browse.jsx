import { useState } from 'react'
import { Loader } from '@mantine/core' 

import ProductDisplay from '@/Components/ProductDisplay'

export default function Browse({requestNumber}) {
    const [requiringActionLoading, setRequiringActionLoading] = useState(true)
    const [requestedLoading, setRequestedLoading] = useState(true)

    return (
        requestNumber === 0 ?
            <div className="mt-10 text-2xl">There are no purchase requests</div>
            :
            <>
            {
                (requiringActionLoading && requestedLoading) &&
                <Loader color="cyan" size="xl" className="mt-40" />
            }
                <ProductDisplay
                    title="Requests needing your attention"
                    productData="needApproval"
                    model="purchase-requests"
                    loadingHook={[requiringActionLoading, setRequiringActionLoading]}
                />

                <ProductDisplay
                    title="All Purchase Requests"
                    productData="all" 
                    model="purchase-requests"
                    loadingHook={[requestedLoading, setRequestedLoading]}
                    searchable
                    paginate
                />
            </>
        
    )
}
