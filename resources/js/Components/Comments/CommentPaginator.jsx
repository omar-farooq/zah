import { Paginator } from 'primereact/paginator'

export default function CommentPaginator({commentHook}) {

    const [comments, setComments] = commentHook

    const template = {
        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        'FirstPageLink': (options) => {
            const pageClasses = 'p-paginator-first pi pi-angle-double-left'
            return (
                <button 
                    onClick={() => pageChange(comments.first_page_url)} 
                    className={ pageClasses  }
                />
            )
        },

        'PrevPageLink': (options) => {
            return (
                <button 
                    onClick={() => pageChange(comments.prev_page_url)} 
                    className="p-paginator-prev pi pi-chevron-left" 
                    disabled = { comments.current_page == 1 ? true : false }
                />
            )
        },

        'PageLinks': (options) => {
            options.currentPage = comments.current_page
            options.totalPages = comments.last_page
            const pageClasses = 'p-paginator-page p-paginator-element p-link'
            return (
                /* handle clicking on the first 3 pages */
                comments.current_page < 4 ?

                    <button 
                        className={
                            options.page + 1 == options.currentPage ? 'p-highlight ' + pageClasses : pageClasses
                        }
                        onClick={() => {
                            pageChange(
                                comments.links.find(page => page.label == options.page + 1).url
                            );
                            options.currentPage = comments.current_page;
                        }}
                    >
                        {options.page + 1}
                    </button>

                /* handle clicking on the last 3 pages */
                :comments.last_page - comments.current_page < 2 && comments.last_page != 4 ?

                    <button 
                        className={
                            options.page + comments.last_page - 4 == options.currentPage ? 'p-highlight ' + pageClasses : pageClasses
                        }
                        onClick={() => {
                            pageChange(
                                comments.links.find(page => page.label == options.page - 4 + comments.last_page).url
                            );
                            options.currentPage = comments.current_page;
                        }}
                    >
                        {comments.last_page - 4 + options.page}
                    </button>

                /* handle if only 4 pages */
                :comments.last_page == 4 ?

                    <button 
                        className={
                            options.page + 1 == options.currentPage ? 'p-highlight ' + pageClasses : pageClasses
                        }
                        onClick={() => {
                            pageChange(
                                comments.links.find(page => page.label == options.page + 1).url
                            );
                            options.currentPage = comments.current_page;
                        }}
                    >
                        {options.page + 1}
                    </button>

                /* clicking on any of the middle pages */
                : 
                    <button 
                        className={
                            options.page + comments.current_page - 2 == options.currentPage ? 'p-highlight ' + pageClasses : pageClasses
                        }
                        onClick={() => {
                            pageChange(
                                comments.links.find(page => page.label == options.page + comments.current_page - 2).url
                            );
                            options.currentPage = comments.current_page;
                        }}
                    >
                        {comments.current_page + options.page - 2}
                    </button>
            )
        },

        'NextPageLink': (options) => {
            return (
                <button 
                    onClick={() => pageChange(comments.next_page_url)} 
                    className="p-paginator-next pi pi-chevron-right" 
                    disabled = { comments.last_page == comments.current_page ? true : false }
                />
            )
        },
        'LastPageLink': (options) => {
            return (
                <button 
                    onClick={() => pageChange(comments.last_page_url)} 
                    className="p-paginator-last pi pi-angle-double-right"
                />
            )
        },
    }

    async function pageChange (link) {
        let res = await axios.get(link)
        setComments(res.data)
    }

    return (
        <Paginator template={template} totalRecords={comments.total} rows={comments.per_page}  />
    )
}
