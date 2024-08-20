import { useState } from 'react'
import { Loader } from '@mantine/core'
import ProductDisplay from '@/Components/ProductDisplay'

export default function Browse() {

    const [requiringActionLoading, setRequiringActionLoading] = useState(true)
    const [purchasedLoading, setPurchasedLoading] = useState(true)

    return (
        <>
        {
            (requiringActionLoading && purchasedLoading) &&
            <Loader color="cyan" size="xl" className="mt-40" />
        }
            <ProductDisplay 
                title="Purchases Requiring Action"
                productData="needAction"
                model="purchases"
                loadingHook={[requiringActionLoading, setRequiringActionLoading]}
            />

            <ProductDisplay 
                title="Purchased"
                productData="received"
                model="purchases"
                searchable
                paginate
                loadingHook={[purchasedLoading, setPurchasedLoading]}
            />
        </>
    )
}
