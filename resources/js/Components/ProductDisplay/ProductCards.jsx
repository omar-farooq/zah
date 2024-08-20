import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
export default function ProductCards({cards,model}) {

    const getImage = async (imageName) => {
        let { data: res } = await axios.get('/getImage?name='+imageName)
        return res
    }

    const [imageCards, setImageCards] = useState([])

    useEffect(() => {
        const fetchImages = async () => {
            const updatedCards = await Promise.all(
                cards.data.map(async (product) => ({
                    ...product,
                    imageUrl: await getImage(product.image)
                }))
            )
            setImageCards(updatedCards)
        }
        fetchImages()
    },[])

    return (
        imageCards ?
        imageCards.map((product) => (
            <div key={product.id} className="group relative">
                <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                    {
                        product.image ?
                            <img
                              src={product.imageUrl}
                              alt={product.imageAlt}
                              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        :
                            <img
                              src={"/images/No_Image_Available.jpg"}
                              alt="No image available"
                              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                    }
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <Link href={model + '/' + product.id}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">£{product.price}</p>
                </div>
            </div>
        )) 
        : ''
    )
}
