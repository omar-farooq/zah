import { useState } from 'react'
import { useForm } from '@inertiajs/inertia-react'

export default function PurchaseRequestForm() {

	const [name, setName] = useState('')
	const [price, setPrice] = useState('')
	const [description, setDescription] = useState('')
    const [image, setImage] = useState('/images/insert_here_placeholder.png')
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        reason: '',
        price: '',
        url: '',
        delivery_cost: '',
    })

    function submit(e) {
        e.preventDefault()
        post('/purchase-requests')
    }

    return (
		<>

		<div>
        <div className="py-16 px-4 md:px-6 2xl:px-0 flex justify-center items-center 2xl:mx-auto 2xl:container">
            <div className="flex flex-col justify-start items-start w-full space-y-9">
                <div className="flex justify-start flex-col items-start space-y-2">
                    <p className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 dark:text-gray-50">Purchase Request</p>
                </div>
    
                <div className="flex flex-col xl:flex-row justify-center xl:justify-between space-y-6 xl:space-y-0 xl:space-x-6 w-full">
                    <div className="xl:w-3/5 flex flex-col sm:flex-row xl:flex-col justify-center items-center bg-white dark:bg-gray-800 py-7 sm:py-0 xl:py-10 px-10 xl:w-full">
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                            <p className="text-xl md:text-2xl leading-normal text-gray-800 dark:text-gray-50">{name}</p>
                            <p className="text-base font-semibold leading-none text-gray-600 dark:text-white">{price == '' ? '' : "£" }{price}</p>
                        </div>
                        <div className="mt-6 sm:mt-0 xl:my-10 xl:px-20 w-52 sm:w-96 xl:w-auto">
                            <label htmlFor="file-input">
                            <img src={image} />
                            </label>
                            <input id="file-input" type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
                        </div>
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                            <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mx-auto">{description}</p>
                            <p className="text-base font-semibold leading-none text-gray-600 dark:text-white">click here</p>
                        </div>
                    </div>
    
                    <div className="p-8 bg-white dark:bg-gray-800 flex flex-col lg:w-full xl:w-3/5">
    
                        <div className="mt-8">
                            <input className="border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="text" name="" id="" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                        </div>
    
                        <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">Financial</label>
                        <div className="mt-2 flex-col">
                            <div>
                                { price == '' ? '' : <input value="£" disabled className="absolute mt-4 ml-1.5 w-3" /> }
                                <input className="border rounded-tl rounded-tr border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="number" step="0.01" name="" id="" placeholder="Price" onChange={(e) => e.target.value == '' ? setPrice('') : setPrice(parseFloat(e.target.value).toFixed(2))} />
                            </div>
                            <div className="flex-row flex">
                                <input className="border rounded-bl border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="email" name="" id="" placeholder="Delivery Cost" />
                                <input className="border rounded-br border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="email" name="" id="" placeholder="Quantity" />
                            </div>
                        </div>
    
                        <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">Description</label>
                        <div className="mt-2 flex-col">
                            <div>
                                <input className="border rounded border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="email" name="" id="" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>

                        <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">URL</label>
                        <div className="mt-2 flex-col">
                            <div>
                                <input className="border rounded border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="text" name="" id="" placeholder="URL" />
                            </div>
                        </div>
    
                        <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">Reason for buying</label>
                        <div className="mt-2 flex-col">
                            <input className="border rounded-bl rounded-br border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600" type="text" name="" id="" placeholder="Reason" />
                        </div>
    
                        <button className="mt-8 border border-transparent hover:border-gray-300 dark:bg-white dark:hover:bg-gray-900 dark:text-gray-900 dark:hover:text-white dark:border-transparent bg-gray-900 hover:bg-white text-white hover:text-gray-900 flex justify-center items-center py-4 rounded w-full">
                            <div>
                                <p className="text-base leading-4">Request</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
	</>

    )
}
