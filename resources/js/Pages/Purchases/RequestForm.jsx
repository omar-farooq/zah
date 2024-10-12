import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import { NumberInput } from '@mantine/core'
import PreviewImage from '@/Components/PreviewImage'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'

export default function PurchaseRequestForm() {

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
                                <PreviewImage 
                                    src={image} 
                                />
                            </label>
                            <Input 
                                id="file-input" 
                                type="file" 
                                additionalClasses="hidden" 
                                accept="image/png, image/jpeg" 
                                changeaction={(e) => { setImage(URL.createObjectURL(e.target.files[0])); setData('image', e.target.files[0])}} 
                            />
                        </div>
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                            <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mx-auto">{description}</p>
                            {
                                linkToItem && linkToItem.includes('http') ?
                                    <a href={`${linkToItem}`} target="_blank" className="text-base font-semibold leading-none text-gray-600 dark:text-white">View Source</a>
                                : linkToItem ?
                                    <a href={`//${linkToItem}`} target="_blank" className="text-base font-semibold leading-none text-gray-600 dark:text-white">View Source</a>
                                : ''
                            }
                        </div>
                    </PreviewTile>
        
                    <FormTile> 
                        <div className="mt-8">
                            <FormLabel>Item</FormLabel>
                            <Input 
                                type="text" 
                                name="Name" 
                                id="NameInput" 
                                placeholder="Name" 
                                changeaction={(e) => {setName(e.target.value); setData('name', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.name}
                            </ShowErrors>
                        </div>
       
                        <InputContainer>
                            <div>
                                <NumberInput 
                                    classNames={{input: 'border border-gray-300 rounded placeholder-gray-600 text-gray-600 h-12'}}
                                    label="Price"
                                    step={0.01}
                                    precision={2}
                                    min={0}
                                    placeholder="Price" 
                                    parser={(value) => value.replace(/\£\s?|(,*)/g, '')}
                                    formatter={(value) =>
                                                !Number.isNaN(parseFloat(value))
                                                  ? `£ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                                  : '£ '
                                    }
                                    onChange={(e) => {e == '' ? setPrice('') : setPrice(parseFloat(e).toFixed(2)); setData('price', e)}} 
                                />
                                <ShowErrors>{errors.price}</ShowErrors>
                            </div>

                            <div className="flex-row flex space-x-6 mt-2">

                                <NumberInput 
                                    classNames={{input: 'border border-gray-300 rounded placeholder-gray-600 text-gray-600 h-12'}}
                                    label="Delivery Cost"
                                    step={0.01}
                                    precision={2}
                                    min={0}
                                    placeholder="Delivery Cost" 
                                    parser={(value) => value.replace(/\£\s?|(,*)/g, '')}
                                    formatter={(value) =>
                                                !Number.isNaN(parseFloat(value))
                                                  ? `£ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                                  : '£ '
                                    }
                                    onChange={(e) => {e == '' ? setDeliveryCost('') : setDeliveryCost(parseFloat(e).toFixed(2)); setData('delivery_cost', e)}} 
                                />


                                <NumberInput 
                                    classNames={{input: 'border border-gray-300 rounded placeholder-gray-600 text-gray-600 h-12'}}
                                    label="Quantity"
                                    step={1}
                                    defaultValue={1}
                                    min={1}
                                    placeholder="e.g. 1" 
                                    onChange={(e) => setData('quantity', e)} 
                                />

                            </div>
                        </InputContainer>
        
                        <FormLabel>Description</FormLabel>
                        <InputContainer>
                            <div>

                                <Input 
                                    type="text"
                                    placeholder="Description" 
                                    changeaction={(e) => {setDescription(e.target.value); setData('description', e.target.value)}} 
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
                                    changeaction={(e) => {setLinkToItem(e.target.value); setData('url', e.target.value)}} 
                                />
                            </div>
                        </InputContainer>
        
                        <FormLabel>Reason for buying</FormLabel>
                        <InputContainer>
                            <Input
                                type="text"
                                placeholder="Reason" 
                                changeaction={(e) => setData('reason', e.target.value)} 
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
