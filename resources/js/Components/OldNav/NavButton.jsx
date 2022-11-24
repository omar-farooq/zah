import { Fragment, useState, useRef } from 'react'
import useComponentVisible from '@/Hooks/useComponentVisible'
import NavSubMenu from '@/Components/NavSubMenu'

export default function NavButton(props) {
	const [submenuOpen, setSubmenuOpen] = useState(false)

    const navRef = useRef();

    useComponentVisible(navRef, () => {
        if(submenuOpen) setSubmenuOpen(false)
    })

	function toggleSubmenu() {
		setSubmenuOpen(!submenuOpen)
	}

	function closeSubmenu() {
		setSubmenuState(false)
	}

	return (
			<Fragment>
                <div id="nav-wrapper" ref={navRef}>
    				<button onClick={toggleSubmenu} className="text-white mt-1">{props.name}</button>
	    			<NavSubMenu key={props.submenu} submenu={props.submenu} submenuState={[submenuOpen, setSubmenuOpen]} />
                </div>
			</Fragment>
	)
}
