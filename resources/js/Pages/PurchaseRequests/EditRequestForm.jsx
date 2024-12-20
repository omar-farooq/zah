import { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import { NumberInput } from '@mantine/core'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'
import PreviewImage from '@/Components/PreviewImage'

export default function EditPurchaseRequestForm({purchaseRequest, requestImage}) {

    const [name, setName] = useState(purchaseRequest.name)
    const [price, setPrice] = useState(purchaseRequest.price)
    const [deliveryCost, setDeliveryCost] = useState(purchaseRequest.delivery_cost)
    const [description, setDescription] = useState(purchaseRequest.description)
    const [image, setImage] = useState("/images/"+purchaseRequest.image)
    const [linkToItem, setLinkToItem] = useState(purchaseRequest.url)
    const { data, setData, post, processing, errors } = useForm({
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
        router.post('/purchase-requests/' + purchaseRequest.id, {
            _method: 'patch',
            formData: data,
        })
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
                                {typeof data.image != 'string' ?
                                    <img src={image} />
                                    :
                                    <PreviewImage
                                        src={requestImage}
                                    />
                                }
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
                        <div>Warning: this will reset approvals</div>
                        <div className="mt-8">
                            <Input 
                                type="text" 
                                name="Name" 
                                id="NameInput" 
                                placeholder="Name" 
                                defaultValue={purchaseRequest.name}
                                changeaction={(e) => {setName(e.target.value); setData('name', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.name}
                            </ShowErrors>
                        </div>
       
                        <FormLabel>Financial</FormLabel>
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
                                    defaultValue={purchaseRequest.price}
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
									defaultValue={purchaseRequest.delivery_cost}
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
                                    defaultValue={purchaseRequest.quantity}
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
                                    defaultValue={purchaseRequest.description}
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
                                    defaultValue={purchaseRequest.url}
                                    changeaction={(e) => {setLinkToItem(e.target.value); setData('url', e.target.value)}} 
                                />
                            </div>
                        </InputContainer>
        
                        <FormLabel>Reason for buying</FormLabel>
                        <InputContainer>
                            <Input
                                type="text"
                                placeholder="Reason" 
                                defaultValue={purchaseRequest.reason}
                                changeaction={(e) => setData('reason', e.target.value)} 
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
