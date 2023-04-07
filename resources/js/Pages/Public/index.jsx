import { useState, useEffect } from 'react'
import { Button } from '@mantine/core'
import { Link } from '@inertiajs/inertia-react';
import Input from '@/Components/Input'
import TextArea from '@/Components/TextArea'

export default function FrontPage() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [comments, setComments] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [fadeInClass, setFadeInClass] = useState('')
    const [formFadeIn, setFormFadeIn] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    useEffect(() => {
        const gardenOffset = document.getElementById('garden').offsetTop
        const formOffset = document.getElementById('contact-form').offsetTop
        const gardenScroll = () => window.scrollY + window.innerHeight > gardenOffset ? setFadeInClass('animate-fade') : ''
        const formScroll = () => window.scrollY + window.innerHeight > formOffset ? setFormFadeIn('animate-fade') : ''
         // clean up code
         window.removeEventListener('scroll', gardenScroll);
         window.addEventListener('scroll', gardenScroll, { passive: true });

         window.removeEventListener('scroll', formScroll);
         window.addEventListener('scroll', formScroll, { passive: true });
         return () => window.removeEventListener('scroll', formScroll);
         return () => window.removeEventListener('scroll', gardenScroll);
    },[])

    return (
        <>
            <nav className="h-16 flex justify-between">
                <div className="text-5xl h-full mt-3 ml-8 flex">
                    <div>ZAH</div>
                </div>
                <div className="text-4xl h-full mt-3 mr-8 flex">
                    <Link href={'/login'}>Login</Link>
                </div>
            </nav>
            <div className="bg-[url('/images/zah.jpg')] bg-center bg-cover w-full h-[calc(100vh-55vh)] opacity-90 -skew-y-1 mt-4">
                    <div className="mx-auto text-left text-6xl h-full overflow-hidden">
                    </div>
            </div>

            <div className="flex justify-center animate-fade">
                <div className="flex mt-10 mb-4 w-4/5 space-evenly">

                    <div className="w-1/3 m-1">
                        <h1 className="text-4xl">About Us</h1>
                        <div className="">
                            Some text here about how great we are and how we are one of the longest running co-ops with no one able to leave because we're all actually stuck here
                        </div>
                    </div>

                    <div className="w-1/3 m-1">
                        <h1 className="text-4xl">Our Ethos</h1>
                        <div className="">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pretium quam vulputate dignissim suspendisse in. A iaculis at erat pellentesque adipiscing commodo. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. Lacus vel facilisis volutpat est velit egestas. Ut tellus elementum sagittis vitae et. Sagittis id consectetur purus ut faucibus. Sed turpis tincidunt id aliquet risus feugiat in ante metus. Felis bibendum ut tristique et egestas quis. Vel risus commodo viverra maecenas accumsan lacus vel.

        Et malesuada fames ac turpis egestas. Diam maecenas sed enim ut sem. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam. Amet cursus sit amet dictum sit. Suscipit adipiscing bibendum est ultricies integer quis auctor. Posuere morbi leo urna molestie at elementum eu facilisis. Enim facilisis gravida neque convallis a. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. Vel facilisis volutpat est velit egestas dui id ornare. Scelerisque in dictum non consectetur a. In mollis nunc sed id semper risus.
                        </div>
                    </div>

                    <div className="w-1/3 m-1">
                        <h1 className="text-4xl">Co-operative Living</h1>
                        <div className="">
                            Some text here about how great we are and how we are one of the longest running co-ops with no one able to leave because we're all actually stuck here
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex justify-center w-full">
                <div className="mt-10 w-4/5">
                    <div id="garden" className={`bg-[url('/images/garden.jpg')] bg-center bg-cover h-[calc(100vh-55vh)] opacity-90 ${fadeInClass}`} />

                    {
                        submitted ?
                            <div className="text-2xl text-red-700 text-center mt-8">Thank you for your Comments. <br /> We will be in touch soon</div>
                        :
                        <>
                            <div id="contact-form" className={`${formFadeIn}`}>
                                <h2 className="text-3xl text-center mt-8">Contact Us</h2>

                                <form id="contact-form" className='grid grid-cols-8 gap-4 mb-10' onSubmit={(e) => handleSubmit(e)}>
                                    <div className="col-start-3 col-end-5">
                                        <label>Name</label>
                                        <Input className="w-full" value={name} handleChange={(e) => setName(e.target.value)} required={true} />
                                    </div>
                                    <div className="col-start-5 col-end-7">
                                        <label>Email Address</label>
                                        <Input className="w-full" value={email} handleChange={(e) => setEmail(e.target.value)} required={true} />
                                    </div>
                                    <div className="col-start-3 col-end-7">
                                        <label>Comments</label>
                                        <TextArea className="w-full h-24" value={comments} handleChange={(e) => setComments(e.target.value)} required={true} />
                                    </div>
                                    <Button className="bg-sky-600 hover:!bg-sky-700 col-start-4 col-end-6" type="submit">Submit</Button>
                                </form>
                            </div>
                        </>
                    }
                </div>
            </div>

            <footer className="h-60 bg-zinc-100 -skew-y-1" />
        </>
    )
}
