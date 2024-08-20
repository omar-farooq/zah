import {
    ClipboardDocumentListIcon,
    CurrencyPoundIcon,
    FolderIcon,
    HomeIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    WrenchIcon
} from '@heroicons/react/24/outline'

const NavMenu = [

    {id: 0, label: 'Dashboard', icon: HomeIcon, link: '/dashboard' },

	{id: 1, label: 'Meetings', icon: ClipboardDocumentListIcon,
        links: [
            {id: 1, label: 'Schedule', link: '/meetings/schedule'},
            {id: 2, label: 'Join', link: '/meetings/create'},
            {id: 3, label: 'Previous Minutes', link: '/meetings'},
        ]
    },
	{id: 2, label: 'Treasury', icon: CurrencyPoundIcon,
        links: [
            {id: 1, label: 'Summary', link: '/treasury'}, 
            {id: 2, label: 'Reports', link: '/treasury-reports'},
            {id: 3, label: 'Plans', link: '/treasury-plans/latest'},
            {id: 4, label: 'Accounts', link: '/accounts'},
            {id: 5, label: 'Rents', link: '/rents'}
        ]
    },
	{id: 3, label: 'Purchases', icon: ShoppingBagIcon,
        links: [
            {id: 1, label: 'All Purchases', link: '/purchases'},
            {id: 2, label: 'Request', link: '/purchase-requests/create'}, 
            {id: 3, label: 'Pending Approval', link: '/purchase-requests'}
        ]
    },
	{id: 4, label: 'Maintenance', icon: WrenchIcon,
        links: [
            {id: 1, label: 'All Maintenance', link: '/maintenance'},
            {id: 2, label: 'Upcoming', link: '/maintenance/upcoming'},
            {id: 3, label: 'Request', link: '/maintenance-requests/create'},
            {id: 4, label: 'Pending Approval', link: '/maintenance-requests'}
        ]
    },
    {id: 5, label: 'Documents', icon: FolderIcon,
        links: [
            {id: 1, label: 'Browse', link: '/documents'},
            {id: 2, label: 'Upload', link: '/documents/create'},
            {id: 3, label: 'Documentation', link: '/documentation'},
        ]
    },
    {id: 6, label: 'Users', icon: UserGroupIcon,
        links: [
            {id: 1, label: 'Member Roles', link: '/roles'},
            {id: 2, label: 'Manage', link: '/users'},
            {id: 3, label: 'Rules', link: '/rules'}
        ]
    },
] 

export default NavMenu
