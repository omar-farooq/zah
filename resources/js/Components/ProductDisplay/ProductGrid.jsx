import { Input, Pagination } from '@mantine/core'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
export default function ProductGrid({children, title, searchable=false, paginate=false, searchHook, activePageHook, totalPageHook}) {

    const [searchTerm, setSearchTerm] = searchHook
    const [totalPages, setTotalPages] = totalPageHook
    const [activePage, setActivePage] = activePageHook

    return (
        <div>
            <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-white py-2 mx-auto w-fit text-center mb-8 bg-slate-700">{title}</h2>
                {
                    searchable &&
                        <Input 
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            placeholder="search"
                            className="ml-0 mb-4 sm:w-1/2 md:w-1/3 lg:w-1/4"
                            onChange={(e) => e.target.value.length > 2 ? setSearchTerm(e.target.value) : setSearchTerm('')}
                        />

                }
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-white p-4">
	    		    {children}
                </div>
                {
                    paginate &&
                        <Pagination
                            className="mt-5 mb-10 justify-center"
                            total={totalPages}
                            page={activePage}
                            onChange={setActivePage}
                            withEdges
                        />
                }
            </div>
        </div>
    )
}
