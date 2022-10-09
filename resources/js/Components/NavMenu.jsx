const NavMenu = [ 
	{id: 1, name: 'Meetings', 
        submenu: [
            {id: 1, name: 'Summary', link: '#'},
            {id: 2, name: 'Minutes', link: '#'},
            {id: 3, name: 'Schedule', link: '/meetings/schedule'}
        ]
    },
	{id: 2, name: 'Purchases', 
        submenu: [
            {id: 1, name: 'All Purchases', link: '#'},
            {id: 2, name: 'Request', link: '/purchase-requests/create'}, 
            {id: 3, name: 'Pending Approval', link: '/purchase-requests/pending'}
        ]
    },
	{id: 3, name: 'Maintenance', 
        submenu: [
            {id: 1, name: 'All Maintenance', link: '#'},
            {id: 2, name: 'Upcoming', link: '#'},
            {id: 3, name: 'Request', link: '/maintenance-requests/create'},
            {id: 4, name: 'Pending Approval', link: '#'}
        ]
    },
	{id: 4, name: 'Treasury', 
        submenu: [
            {id: 1, name: 'Summary', link: '#'}, 
            {id: 2, name: 'Reports', link: '#'}
        ]
    }
] 

export default NavMenu
