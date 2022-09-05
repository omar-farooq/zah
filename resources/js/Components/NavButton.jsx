import { Fragment, useState } from 'react'
import NavSubMenu from '@/Components/NavSubMenu'

export default function NavButton(props) {
	const [submenuState, setSubmenuState] = useState(false)

	function toggleSubmenu() {
		setSubmenuState(!submenuState)
	}

	function closeSubmenu() {
		setSubmenuState(false)
	}

	return (
			<Fragment>
				<button onClick={toggleSubmenu} onBlur={closeSubmenu}>{props.name}</button>
				<NavSubMenu key={props.submenu} submenu={props.submenu} hidden={submenuState} />
			</Fragment>
	)
}
