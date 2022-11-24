import { Fragment, useState } from 'react'
import NavButton from '@/Components/NavButton'
import NavMenu from '@/Components/NavMenu'
import NavSubMenu from '@/Components/NavSubMenu'

export default function Nav() {

	return (
		<nav className="flex bg-gray-900 py-2 mx-auto justify-around">
			<div>
				<h3 className="text-2xl font-medium text-blue-500">InProgress</h3>
			</div>
			<div className="flex flex-nowrap">
				{NavMenu.map((menu) => { 
					return (
						<div key={menu.id} className="px-6">
							<NavButton name={menu.name} submenu={menu.submenu} />
						</div>
					)
				})}
			</div>
		</nav>
	);
}

