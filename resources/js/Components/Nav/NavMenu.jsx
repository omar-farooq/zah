const NavMenu = [

    {id: 0, label: 'Dashboard' },

	{id: 1, label: 'Meetings', 
        links: [
            {id: 1, label: 'Summary', link: '#'},
            {id: 2, label: 'Join', link: '/meetings/create'},
            {id: 3, label: 'Previous Minutes', link: '/meetings'},
            {id: 4, label: 'Schedule', link: '/meetings/schedule'}
        ]
    },
	{id: 2, label: 'Purchases', 
        links: [
            {id: 1, label: 'All Purchases', link: '#'},
            {id: 2, label: 'Request', link: '/purchase-requests/create'}, 
            {id: 3, label: 'Pending Approval', link: '/purchase-requests'}
        ]
    },
	{id: 3, label: 'Maintenance', 
        links: [
            {id: 1, label: 'All Maintenance', link: '#'},
            {id: 2, label: 'Upcoming', link: '#'},
            {id: 3, label: 'Request', link: '/maintenance-requests/create'},
            {id: 4, label: 'Pending Approval', link: '/maintenance-requests'}
        ]
    },
	{id: 4, label: 'Treasury', 
        links: [
            {id: 1, label: 'Summary', link: '#'}, 
            {id: 2, label: 'Reports', link: '#'}
        ]
    },
    {id: 5, label: 'Members',
        links: [
            {id: 1, label: 'Roles', link: '/roles'},
        ]
    },
] 

export default NavMenu
