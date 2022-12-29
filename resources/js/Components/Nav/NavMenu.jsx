import {
    HomeIcon,
    WrenchIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    CurrencyPoundIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline'

const NavMenu = [

    {id: 0, label: 'Dashboard', icon: HomeIcon, link: '/dashboard' },

	{id: 1, label: 'Meetings', icon: ClipboardDocumentListIcon,
        links: [
            {id: 1, label: 'Summary', link: '#'},
            {id: 2, label: 'Join', link: '/meetings/create'},
            {id: 3, label: 'Previous Minutes', link: '/meetings'},
            {id: 4, label: 'Schedule', link: '/meetings/schedule'}
        ]
    },
	{id: 2, label: 'Purchases', icon: ShoppingBagIcon,
        links: [
            {id: 1, label: 'All Purchases', link: '/purchases'},
            {id: 2, label: 'Request', link: '/purchase-requests/create'}, 
            {id: 3, label: 'Pending Approval', link: '/purchase-requests'}
        ]
    },
	{id: 3, label: 'Maintenance', icon: WrenchIcon,
        links: [
            {id: 1, label: 'All Maintenance', link: '/maintenance'},
            {id: 2, label: 'Upcoming', link: '/maintenance/upcoming'},
            {id: 3, label: 'Request', link: '/maintenance-requests/create'},
            {id: 4, label: 'Pending Approval', link: '/maintenance-requests'}
        ]
    },
	{id: 4, label: 'Treasury', icon: CurrencyPoundIcon,
        links: [
            {id: 1, label: 'Summary', link: '#'}, 
            {id: 2, label: 'Reports', link: '/treasury'},
            {id: 3, label: 'Plans', link: '/treasury-plans'}
        ]
    },
    {id: 5, label: 'Members', icon: UserGroupIcon,
        links: [
            {id: 1, label: 'Roles', link: '/roles'},
            {id: 1, label: 'Memberships', link: '/memberships'},
            {id: 1, label: 'Discussion', link: '/forum'}
        ]
    },
] 

export default NavMenu
