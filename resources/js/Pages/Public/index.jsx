import { useState, useEffect } from 'react'
import { Button, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';
import { ErrorNotification } from '@/Components/Notifications'
import { Link } from '@inertiajs/inertia-react';
import Input from '@/Components/Input'
import TextArea from '@/Components/TextArea'

export default function FrontPage() {

    //form state. Could have been reduced to one object but separating out is easy to read
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [comments, setComments] = useState('')
    const [submitted, setSubmitted] = useState(false)

    //fade state
    const [fadeInClass, setFadeInClass] = useState('')
    const [formFadeIn, setFormFadeIn] = useState('')

    //To catch bots
    const [protection, setProtection] = useState(false)

    const handleSubmit = async (e) => {
        protection ? '' :
        e.preventDefault()
        try {
            await axios.post('/generate-contact-form-email', {
                name: name,
                email: email,
                comments: comments,
            })
            setSubmitted(true)
        } catch (error) {
            return ErrorNotification("Error sending email", error)
        }
    }

    //Fade in effects on scrolling
    useEffect(() => {
        const formOffset = document.getElementById('contact-form').offsetTop
        const formScroll = () => window.scrollY + window.innerHeight > formOffset ? setFormFadeIn('animate-fade') : ''
         // clean up code
         window.removeEventListener('scroll', formScroll);
         window.addEventListener('scroll', formScroll, { passive: true });
         return () => window.removeEventListener('scroll', formScroll);
    },[])

    useEffect(() => {
        const gardenOffset = document.getElementById('garden').offsetTop
        const gardenScroll = () => window.scrollY + window.innerHeight > gardenOffset ? setFadeInClass('animate-fade') : ''
         // clean up code
         window.removeEventListener('scroll', gardenScroll);
         window.addEventListener('scroll', gardenScroll, { passive: true });

         return () => window.removeEventListener('scroll', gardenScroll);
    },[])

    return (
        <>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <Notifications />
                <style>
                    {`
                        .protection{
                            opacity: 0;
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 0;
                            width: 0;
                            z-index: -1;
                        }
                    `}
                </style>
                <nav className="h-16 flex justify-between">
                    <div className="text-3xl md:text-5xl h-full mt-4 ml-8 flex">
                        <div>ZAH</div>
                    </div>
                    <div className="text-2xl md:text-4xl h-full mt-4 mr-8 flex">
                        <Link href={'/login'}>Login</Link>
                    </div>
                </nav>
                <div className="bg-[url('/images/zah.jpg')] bg-center bg-cover w-full h-[calc(100vh-55vh)] opacity-90 md:mt-4">
                        <div className="mx-auto text-left text-6xl h-full overflow-hidden">
                        </div>
                </div>

                <div className="flex justify-center animate-fade">
                    <div className="flex md:flex-row flex-col mt-10 mb-4 w-4/5 space-evenly">

                        <div className="w-full md:w-1/3 m-1">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl">About Us</h1>
                            <div className="text-sm md:text-base">
                                Some text here about how great we are and how we are one of the longest running co-ops with no one able to leave because we're all actually stuck here
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 m-1">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl">Our Ethos</h1>
                            <div className="text-sm md:text-base">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pretium quam vulputate dignissim suspendisse in. A iaculis at erat pellentesque adipiscing commodo. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. Lacus vel facilisis volutpat est velit egestas. Ut tellus elementum sagittis vitae et. Sagittis id consectetur purus ut faucibus. Sed turpis tincidunt id aliquet risus feugiat in ante metus. Felis bibendum ut tristique et egestas quis. Vel risus commodo viverra maecenas accumsan lacus vel.

            Et malesuada fames ac turpis egestas. Diam maecenas sed enim ut sem. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam. Amet cursus sit amet dictum sit. Suscipit adipiscing bibendum est ultricies integer quis auctor. Posuere morbi leo urna molestie at elementum eu facilisis. Enim facilisis gravida neque convallis a. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. Vel facilisis volutpat est velit egestas dui id ornare. Scelerisque in dictum non consectetur a. In mollis nunc sed id semper risus.
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 m-1">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl">Co-operative Living</h1>
                            <div className="text-sm md:text-base">
                                Some text here about how great we are and how we are one of the longest running co-ops with no one able to leave because we're all actually stuck here
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="mt-10 w-full lg:w-4/5">
                        <div id="garden" className={`bg-[url('/images/garden.jpg')] bg-center bg-cover h-[calc(100vh-55vh)] opacity-90 ${fadeInClass}`} />

                        {
                            submitted ?
                                <div className="text-2xl text-red-700 text-center mt-8">Thank you for your Comments. <br /> We will be in touch soon</div>
                            :
                            <>
                                <div id="contact-form" className={`${formFadeIn}`}>
                                    <h2 className="text-2xl md:text-3xl text-center mt-8 mb-1 lg:mb-0">Contact Us</h2>

                                    <form id="contact-form" className='grid grid-cols-8 gap-4 mb-10 p-1 md:p-0' onSubmit={(e) => handleSubmit(e)}>
                                        <input className="protection" autoComplete="off" type="text" id="name" name="name" placeholder="name" onChange={(e) => setProtection(true)} />
                                        <div className="col-start-1 md:col-start-2 col-end-5 lg:col-start-3">
                                            <label className="text-sm md:text-base">Name</label>
                                            <Input className="w-full" value={name} handleChange={(e) => setName(e.target.value)} required={true} />
                                        </div>
                                        <div className="col-start-5 lg:col-end-7 md:col-end-8 col-end-9">
                                            <label className="text-sm md:text-base">Email Address</label>
                                            <Input className="w-full" value={email} handleChange={(e) => setEmail(e.target.value)} required={true} />
                                        </div>
                                        <div className="col-start-1 col-end-9 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-7">
                                            <label className="text-sm md:text-base">Comments</label>
                                            <TextArea className="w-full h-24" value={comments} handleChange={(e) => setComments(e.target.value)} required={true} />
                                        </div>
                                        <Button className="bg-sky-600 hover:!bg-sky-700 col-start-4 col-end-6" type="submit">Submit</Button>
                                    </form>
                                </div>
                            </>
                        }
                    </div>
                </div>

                <footer className="h-60 bg-zinc-100 md:-skew-y-1 text-slate-500">
                    <div className="flex justify-center">
                        <div className="flex flex-col lg:flex-row w-3/5 mt-3">

                            <div className="w-full lg:w-1/3 text-center">
                                <h3 className="text-2xl mb-1 text-slate-600">Resources</h3>
                                <a href="https://www.ica.coop/en" target="_blank">International Cooperative Alliance</a>
                            </div>

                            <div className="w-full lg:w-1/3 mt-6 lg:mt-0 text-center">
                                <h3 className="text-2xl mb-1 text-slate-600">UK Social Housing</h3>
                                <a href="https://diggersanddreamers.org.uk/" target="_blank">Diggers and Dreamers</a>
                            </div>

                            <div className="w-full lg:w-1/3 mt-6 lg:mt-0 text-center">
                                <h3 className="text-2xl text-slate-600">Manchester</h3>
                            </div>

                        </div>
                    </div>
                </footer>
            </MantineProvider>
        </>
    )
}
