import NavSubMenuLink from '@/Components/NavSubMenuLink'

export default function NavSubMenu(props) {
    const [submenuOpen, setSubmenuOpen] = props.submenuState
	return (
		<ul id="dropdown-menu" className={`absolute border mt-3 ${submenuOpen ? '' : 'hidden'}`}>
			{props.submenu.map((item,i) => {
				return (
					<li key={item.id} className="list-none w-40 h-8 bg-white">
						<NavSubMenuLink href={item.link}>{item.name}</NavSubMenuLink>
					</li>
				)
			})}
		</ul>
	)
}
