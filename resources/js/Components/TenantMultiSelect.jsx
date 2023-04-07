import { useState, useEffect } from 'react'
import { MultiSelect } from '@mantine/core'

export default function TenantMultiSelect(props) {

	const [selectedTenants, setSelectedTenants] = props.tenantFunctions
	const [ids, setIds] = props.idFunctions
	const [tenants, setTenants] = useState([])

	useEffect(() => {
			async function GetTenants() {
				let tenantList = await axios.get('/tenants')
				setTenants(tenantList.data.tenants.map(x => ({
                    value: x.id,
                    label: x.name
                })))
			}

			GetTenants()
		}, [])

	const handleChange = (e) => {
		//Create objects for each tenant to manipulate in the parent

        setSelectedTenants(
            tenants.reduce((a,b) => {
                if(e.some(x => x == b.value)) {
                    return [...a, {id: b.value, name: b.label}]
                } else {
                    return [...a]
                }
            },[])
        )

		//Set the selected IDs 
		setIds(e)
	}

	return (
		 <MultiSelect 
            data={tenants} 
            label="Assign to members"
            onChange={handleChange} 
            placeholder={props.placeholder} 
        />
	)
                
 
}
