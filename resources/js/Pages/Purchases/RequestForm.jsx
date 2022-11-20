import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'

export default function PurchaseRequestForm() {

    //Change background colour
    /*
    useEffect(() => {
        document.getElementsByTagName('main')[0].className = 'bg-gray-100'
        return function changePage() {
            document.getElementsByTagName('main')[0].className = ''
        }
    },[])*/

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [deliveryCost, setDeliveryCost] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('/images/insert_here_placeholder.png')
    const [linkToItem, setLinkToItem] = useState('')
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        reason: '',
        price: '',
        url: linkToItem,
        quantity: '1',
        description: description,
        delivery_cost: '',
        image: null,
    })

    function submit(e) {
        e.preventDefault()
        post('/purchase-requests')
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
                        <div className="mt-8">
                            <Input 
                                type="text" 
                                name="Name" 
                                id="NameInput" 
                                placeholder="Name" 
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
                                    changeAction={(e) => {e.target.value == '' ? setDeliveryCost('') : setDeliveryCost(parseFloat(e.target.value).toFixed(2)); setData('delivery_cost', e.target.value)}} 
                                />


                                <Input 
                                    type="number"
                                    placeholder="Quantity" 
                                    changeAction={(e) => setData('quantity', e.target.value)} 
                                />

                            </div>
                        </InputContainer>
        
                        <FormLabel>Description</FormLabel>
                        <InputContainer>
                            <div>

                                <Input 
                                    type="text"
                                    placeholder="Description" 
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
                                    changeAction={(e) => {setLinkToItem(e.target.value); setData('URL', e.target.value)}} 
                                />
                            </div>
                        </InputContainer>
        
                        <FormLabel>Reason for buying</FormLabel>
                        <InputContainer>
                            <Input
                                type="text"
                                placeholder="Reason" 
                                changeAction={(e) => setData('reason', e.target.value)} 
                            />
                            <ShowErrors>
                                {errors.reason}
                            </ShowErrors>
                        </InputContainer>

                        <RequestFormButton text="Request" submitAction={submit} /> 
                    </FormTile>
                </TileContainer>
            </RequestLayout>

    )
}
