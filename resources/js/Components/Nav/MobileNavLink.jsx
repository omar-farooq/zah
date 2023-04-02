import ResponsiveNavLink from '@/Components/ResponsiveNavLink'

export default function MobileNavLink({name, endpoint, linkClick}) {

    return (
        <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink href={route(endpoint)} active={route().current(endpoint)} onclick={() => linkClick()}>
                {name}
            </ResponsiveNavLink>
        </div>
    )
}
