import { ClockIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { DatePicker, DateRangePicker, TimeRangeInput } from '@mantine/dates'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'
import Checkbox from '@/Components/RequestFormCheckbox'

export default function EditMaintenanceRequest({maintenanceRequest}) {

    const [price, setPrice] = useState(maintenanceRequest.cost)
    const [maintenance, setMaintenance] = useState(maintenanceRequest.type)
	const [dateRange, setDateRange] = useState(maintenance.start_date == maintenance.end_date ? 'single' : 'multiple')

    const { data, setData, post, processing, errors } = useForm({
        required_maintenance: maintenanceRequest.required_maintenance,
        reason: maintenanceRequest.reason,
        cost: maintenanceRequest.cost,
        contractor: maintenanceRequest.contractor,
        contractor_phone: maintenanceRequest.contractor_phone,
        contractor_email: maintenanceRequest.conractor_email,
        type: maintenanceRequest.type,
        start_time: maintenanceRequest.start_time,
        finish_time: maintenanceRequest.finish_time,
        start_date: maintenanceRequest.start_date,
        end_date: maintenanceRequest.end_date,
        emergency: maintenanceRequest.emergency
    })

	/* Fix the TimeInput as it's broken with the package currently set */
	useEffect(() => {
		document.querySelectorAll('.mantine-TimeInput-timeInput').forEach(input => {
			input.style.width="50px",
			input.style.height="30px",
			input.style.border="0px"
		})
	},[])

    function submit(e) {
        e.preventDefault()
        post('/maintenance-requests')
    }

    return (
            <RequestLayout>
                <Title position='centre'>Edit Maintenance</Title> 
                <TileContainer>
        
                    <FormTile position='centre'> 

                        <div className="mt-8">
                            <FormLabel>Maintenance</FormLabel>
                            <Input 
                                type="text" 
                                name="Requirement" 
                                id="RequirementInput" 
                                placeholder="Required Maintenance" 
                                defaultValue={maintenanceRequest.required_maintenance}
                                changeAction={(e) => {setData('required_maintenance', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.required_maintenance}
                            </ShowErrors>

                            <Input 
                                type="text" 
                                name="Reason" 
                                id="ReasonInput" 
                                placeholder="Reason" 
                                defaultValue={maintenanceRequest.reason}
                                changeAction={(e) => {setData('reason', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.reason}
                            </ShowErrors>
                        </div>
       
                        <FormLabel>Cost</FormLabel>
                        <InputContainer>
                            <div>
                                <HiddenCurrencyInput amount={price} />

                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Cost" 
                                    defaultValue={maintenanceRequest.cost}
                                    changeAction={(e) => {e.target.value == '' ? setPrice('') : setPrice(parseFloat(e.target.value).toFixed(2)); setData('cost', e.target.value)}} 
                                />
                                <ShowErrors>{errors.cost}</ShowErrors>
                            </div>

                        </InputContainer>

                        <FormLabel>Date/Time</FormLabel>
                        <InputContainer>
                            <label htmlFor="single">Single Day</label>
                            <input 
                                type="radio" 
                                id="single" 
                                value="single" 
                                name="dateRange" 
                                checked={dateRange == 'single'} 
                                onChange={(e) => {setDateRange('single'); setData({...data, start_date: '', end_date: ''})}} 
                                className="ml-0.5" 
                            />
                            <label htmlFor="multiple" className="ml-5">Multiple Days</label>
                            <input 
                                type="radio" 
                                id="multiple" 
                                value="multiple" 
                                name="dateRange" 
                                checked={dateRange == 'multiple'} 
                                onChange={(e) => {setDateRange('multiple'); setData({...data, start_date: '', end_date: ''})}} 
                                className="ml-0.5" 
                            />

                            <div className="m-auto">
                            {
                                dateRange == 'single' ?
                                    <DatePicker 
                                        placeholder="Date of Maintenance" 
                                        label="Maintenance Date" 
                                        withAsterisk
										value={maintenanceRequest.start_date == maintenanceRequest.end_date && data.start_date ? new Date(data.start_date) : ''}
										defaultValue={new Date(maintenanceRequest.start_date)}
                                        onChange={(e) => setData({...data, start_date: e, end_date: e})}
                                        minDate={new Date}
                                    />

                                : dateRange == 'multiple' ?
                                    <DateRangePicker 
                                        placeholder="Dates of Maintenance" 
                                        label="Maintenance Dates" 
                                        withAsterisk 
										value={maintenanceRequest.start_date != maintenanceRequest.end_date && data.start_date && data.end_date ? [new Date(data.start_date), new Date(data.end_date)] : ''}
										defaultValue={
											maintenanceRequest.start_date != maintenanceRequest.end_date
											? [new Date(maintenanceRequest.start_date), new Date(maintenanceRequest.end_date)]
											: ''
										}
                                        onChange={(e) => setData({...data, start_date: e[0], end_date: e[1]})}
                                        minDate={new Date}
                                    />

                                : ''
                            }
                                <TimeRangeInput 
                                    label="Maintenance Time" 
                                    onChange={(e) => setData({...data, start_time: e[0], finish_time: e[1]})} 
                                    clearable 
									defaultValue={[new Date(maintenanceRequest.start_time), new Date(maintenanceRequest.finish_time)]}
                                    withAsterisk
                                    icon={<ClockIcon className="h-5 w-5" />}
                                />
                                <ShowErrors>{errors.start_time}</ShowErrors>
                                <ShowErrors>{errors.finish_time}</ShowErrors>
                            </div>
                        </InputContainer>

        
                        <FormLabel>Contractor details</FormLabel>
                        <InputContainer>
                            <div>

                                <Input 
                                    type="text"
                                    placeholder="Contractor" 
                                    defaultValue={maintenanceRequest.contractor}
                                    changeAction={(e) => {setData('contractor', e.target.value)}} 
                                />

                                <ShowErrors>
                                    {errors.contractor}
                                </ShowErrors>
                            </div>
                            <div className="flex-row flex">
                                <Input
                                    type="text"
                                    placeholder="phone"
                                    defaultValue={maintenanceRequest.contractor_phone}
                                    changeAction={(e) => {setData('contractor_phone', e.target.value)}}
                                />

                                <Input
                                    type="text"
                                    placeholder="email"
                                    defaultValue={maintenanceRequest.contractor_email}
                                    changeAction={(e) => {setData('contractor_email', e.target.value)}}
                                />
                                <ShowErrors>{errors.contractor_email}</ShowErrors>

                            </div>
                        </InputContainer>

                        <FormLabel>Type</FormLabel>
                        <InputContainer>
                            <div>
                                <select 
                                    onChange={(e) => {
                                        setData('type', e.target.value);
                                        setMaintenance(e.target.value)}
                                    }>
                                    <option value="Repair">Repair</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Gas check">Gas Check</option>
                                    <option value="Fire Alarm check">Fire Alarm Check</option>
                                    <option value="Garden Maintenance">Garden Maintenance</option>
                                    <option value="Drive">Drive/Garage</option>
                                    <option value="Other">Other</option>
                                </select>

                                {maintenance == 'Other' &&
                                <Input
                                    type="text"
                                    placeholder="type of maintenance" 
                                    changeAction={(e) => {setData('type', e.target.value)}} 
                                />}
                            </div>
                        </InputContainer>
        
                        <FormLabel>Check if Emergency</FormLabel>
                        <InputContainer>
                            <Checkbox
                                changeAction={(e) => setData('emergency', e.target.checked)} 
                                defaultValue={maintenanceRequest.emergency}
                            />
                        </InputContainer>

                        <RequestFormButton text="Update Request" submitAction={submit} /> 
                    </FormTile>
                </TileContainer>
            </RequestLayout>

    )
}
