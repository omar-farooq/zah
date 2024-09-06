import { useState, useEffect } from 'react'
import { FormTile, FlexAlignLeft, PreviewImageContainer, PreviewTile, RequestLayout, RequestName, Source, TileContainer, Title } from '@/Layouts/RequestLayout'
import { Modal } from '@mantine/core'
import PreviewImage from '@/Components/PreviewImage'
import Approval from '@/Components/Approval'
import ConfirmPaymentAndReceipt from '@/Components/ConfirmPaymentAndReceipt'

export default function Purchase({auth,purchaseID,purchaseImage}) {

    //variables
    const model = {name: "App\\Models\\Purchase", id: purchaseID}

    //hooks
    const [opened, setOpened] = useState(false)
    const [purchase, setPurchase] = useState({})
    const [paymentStatus, setPaymentStatus] = useState('')

    const getPurchase = async () => {
        let res = await axios.get('/purchases/'+purchaseID+'?getPurchase=true')
        setPurchase(res.data)
        setPaymentStatus(res.data.purchased)
    }

    useEffect(() => {
        if(opened == false) {
            getPurchase()
        }
    },[opened])

    return (
        <>
        <RequestLayout>
            <Title>{purchase.name}</Title>
            <TileContainer>
                <PreviewTile>
                    <FlexAlignLeft>
                        <div className="text-xl font-semibold leading-none text-gray-600 dark:text-white">
                            {purchase.purchased && purchase.received ? 'Paid and Received ' : <button onClick={() => setOpened(true)}>Click here to confirm purchase and delivery</button>} 
                            <br /><br />
        
                            {"£" + purchase.price }{purchase.deliveryCost == '' ? '' : <span className="text-sm"> with £{ purchase.delivery_cost }  delivery fee</span>}
                        </div> 
                    </FlexAlignLeft>

                    <PreviewImageContainer>
                        {
                            purchase.image ?
                                <PreviewImage
                                    src={purchaseImage}
                                />
                            :
                                <img src="/images/No_Image_Available.jpg" />
                        }
                    </PreviewImageContainer>

                    <FlexAlignLeft>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mx-auto">{purchase.description}</p>
                    </FlexAlignLeft>
                    The Co-Op purchased this for the following reason: <i>"{purchase.reason}" </i>
                </PreviewTile>

            </TileContainer>
               
        </RequestLayout>

        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Confirm Purchase details"
        >
            <ConfirmPaymentAndReceipt 
                id={purchase.id}
                openHook={[opened, setOpened]}
                payableHook={[purchase, setPurchase]}
                model={"purchases"}
                paymentStatusHook={[paymentStatus, setPaymentStatus]}
            />
        </Modal>
        </>
   )
}
