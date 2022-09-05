import NavSubMenuLink from '@/Components/NavSubMenuLink'

export default function NavSubMenu(props) {
	return (
		<ul id="dropdown-menu" className={`absolute border ${props.hidden ? '' : 'hidden'}`}>
			{props.submenu.map((item,i) => {
				return (
					<li key={i} className="list-none w-32 h-8">
						<NavSubMenuLink>{item}</NavSubMenuLink>
					</li>
				)
			})}
		</ul>
	)
}
