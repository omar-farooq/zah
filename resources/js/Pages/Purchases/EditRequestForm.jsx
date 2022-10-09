import { useState } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'

export default function PurchaseRequestForm({purchaseRequest}) {

    console.log(purchaseRequest)
    const [name, setName] = useState(purchaseRequest.name)
    const [price, setPrice] = useState(purchaseRequest.price)
    const [deliveryCost, setDeliveryCost] = useState(purchaseRequest.delivery_cost)
    const [description, setDescription] = useState(purchaseRequest.description)
    const [image, setImage] = useState("/images/"+purchaseRequest.image)
    const [linkToItem, setLinkToItem] = useState(purchaseRequest.url)
    const { data, setData, patch, processing, errors } = useForm({
        name: purchaseRequest.name || '',
        reason: purchaseRequest.reason || '',
        price: purchaseRequest.price || '',
        url: purchaseRequest.url || '',
        quantity: purchaseRequest.quantity || '1',
        description: purchaseRequest.description || '',
        delivery_cost: purchaseRequest.delivery_cost || '',
        image: purchaseRequest.image || '',
    })

    function submit(e) {
        e.preventDefault()
        patch('/purchase-requests/' + purchaseRequest.id)
    }

    return (
            <RequestLayout>
                <Title>Purchase Request</Title> 
                <TileContainer>
                    <PreviewTile>
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                            <p className="text-xl md:text-2xl leading-normal text-gray-800 dark:text-gray-50">{name}</p>
                            <p className="text-xl font-semibold leading-none text-gray-600 dark:text-white">{price == '' ? '' : "£" + price }{deliveryCost == '' ? '' : <span className="text-sm"> with £{ deliveryCost }  delivery fee</span>}</p>
                        </div>
                        <div className="mt-6 sm:mt-0 xl:my-10 xl:px-20 w-52 sm:w-96 xl:w-auto">
                            <label htmlFor="file-input">
                                <img src={image} />
                            </label>
                            <Input 
                                id="file-input" 
                                type="file" 
                                additionalClasses="hidden" 
                                accept="image/png, image/jpeg" 
                                changeAction={(e) => { setImage(URL.createObjectURL(e.target.files[0])); setData('image', e.target.files[0])}} 
                            />
                        </div>
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                            <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mx-auto">{description}</p>
                            <a href={linkToItem} className="text-base font-semibold leading-none text-gray-600 dark:text-white">click here</a>
                        </div>
                    </PreviewTile>
        
                    <FormTile> 
                        <div>Warning: this will reset approvals</div>
                        <div className="mt-8">
                            <Input 
                                type="text" 
                                name="Name" 
                                id="NameInput" 
                                placeholder="Name" 
                                defaultValue={purchaseRequest.name}
                                changeAction={(e) => {setName(e.target.value); setData('name', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.name}
                            </ShowErrors>
                        </div>
       
                        <FormLabel>Financial</FormLabel>
                        <InputContainer>
                            <div>
                                <HiddenCurrencyInput amount={price} />

                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Price"
                                    defaultValue={purchaseRequest.price}
                                    changeAction={(e) => {e.target.value == '' ? setPrice('') : setPrice(parseFloat(e.target.value).toFixed(2)); setData('price', e.target.value)}} 
                                />
                                <ShowErrors>{errors.price}</ShowErrors>
                            </div>

                            <div className="flex-row flex">

                                <HiddenCurrencyInput amount={deliveryCost} />

                                <Input 
                                    type="number"
                                    step="0.01"
                                    placeholder="Delivery Cost"
                                    defaultValue={purchaseRequest.delivery_cost}
                                    changeAction={(e) => {e.target.value == '' ? setDeliveryCost('') : setDeliveryCost(parseFloat(e.target.value).toFixed(2)); setData('delivery_cost', e.target.value)}} 
                                />


                                <Input 
                                    type="number"
                                    placeholder="Quantity" 
                                    changeAction={(e) => setData('quantity', e.target.value)} 
                                    defaultValue={purchaseRequest.quantity}
                                />

                            </div>
                        </InputContainer>
        
                        <FormLabel>Description</FormLabel>
                        <InputContainer>
                            <div>

                                <Input 
                                    type="text"
                                    placeholder="Description" 
                                    defaultValue={purchaseRequest.description}
                                    changeAction={(e) => {setDescription(e.target.value); setData('description', e.target.value)}} 
                                />

                                <ShowErrors>
                                    {errors.description}
                                </ShowErrors>
                            </div>
                        </InputContainer>

                        <FormLabel>URL</FormLabel>
                        <InputContainer>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="URL" 
                                    defaultValue={purchaseRequest.url}
                                    changeAction={(e) => {setLinkToItem(e.target.value); setData('URL', e.target.value)}} 
                                />
                            </div>
                        </InputContainer>
        
                        <FormLabel>Reason for buying</FormLabel>
                        <InputContainer>
                            <Input
                                type="text"
                                placeholder="Reason" 
                                defaultValue={purchaseRequest.reason}
                                changeAction={(e) => setData('reason', e.target.value)} 
                            />
                            <ShowErrors>
                                {errors.reason}
                            </ShowErrors>
                        </InputContainer>

                        <RequestFormButton text="Update Request" submitAction={submit} /> 
                    </FormTile>
                </TileContainer>
            </RequestLayout>

    )
}
