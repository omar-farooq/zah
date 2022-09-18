import { useState, useEffect } from 'react'
import { MultiSelect } from 'primereact/multiselect'
import "primereact/resources/themes/tailwind-light/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

export default function TenantMultiSelect(props) {

	const [selectedTenants, setSelectedTenants] = props.tenantFunctions
	const [ids, setIds] = props.idFunctions
	const [tenants, setTenants] = useState([])

	useEffect(() => {
			async function GetTenants() {
				let tenantList = await axios.get('/tenants')
				setTenants(tenantList.data.tenants)
			}

			GetTenants()
		}, [])

	const handleChange = (e) => {
		//Create objects for each tenant to manipulate in the parent
		setSelectedTenants(e.value.map((x) => (
			tenants.find(({id}) => id == x)
		))	
		.map(tenant => ( 
			{id: tenant.id, name:tenant.name}
		)))

		//Set the selected IDs 
		setIds(e.value)
	}

	return (
		 <MultiSelect display="chip" options={tenants} optionLabel="name" optionValue="id" value={ids} onChange={handleChange} placeholder={props.placeholder} />
	)
                
 
}
