import { Link } from '@inertiajs/react';
export default function Header() {
    return (
        <>
            <nav className="h-16 flex justify-between">
                <div className="text-3xl md:text-5xl h-full mt-4 ml-8 flex">
                    <div><a href="/">ZAH</a></div>
                </div>
                <div className="text-2xl md:text-4xl h-full mt-4 mr-8 flex">
                    <Link href={'/login'}>Login</Link>
                </div>
            </nav>
            <div className="bg-[url('/images/zah.jpg')] bg-center bg-cover w-full h-[calc(100vh-55vh)] opacity-90 md:mt-4">
                <div className="mx-auto text-left text-6xl h-full overflow-hidden" />
            </div>
        </>
)};
