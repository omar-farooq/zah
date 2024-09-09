import { ClockIcon } from '@heroicons/react/24/outline'
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates'
import { NumberInput } from '@mantine/core'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import { useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Checkbox from '@/Components/RequestFormCheckbox'
import Input from '@/Components/RequestFormInput'
import RequestFormButton from '@/Components/RequestFormButton'

export default function MaintenanceRequestForm() {

    const [price, setPrice] = useState('')
    const [dateRange, setDateRange] = useState('single')
    const [maintenance, setMaintenance] = useState('Repair')

    const { data, setData, post, processing, errors } = useForm({
        required_maintenance: '',
        reason: '',
        cost: '',
        contractor: '',
        contractor_phone: '',
        contractor_email: '',
        type: 'Repair',
        start_date: '',
        end_date: '',
        start_time: '',
        finish_time: '',
        emergency: '0'
    })

    function submit(e) {
        e.preventDefault()
        post('/maintenance-requests')
    }

    return (
            <RequestLayout>
                <Title position='centre'>Request Maintenance</Title> 
                <TileContainer>
        
                    <FormTile position='centre'> 

                        <div className="mt-8 flex flex-col space-y-2">
                            <div>
                                <FormLabel>Maintenance needed</FormLabel>
                                <Input 
                                    type="text" 
                                    name="Requirement" 
                                    id="RequirementInput" 
                                    placeholder="e.g. fix the front door" 
                                    changeAction={(e) => {setData('required_maintenance', e.target.value)}} 
                                />
                                <ShowErrors>
                                    {errors.required_maintenance}
                                </ShowErrors>
                            </div>

                            <div>
                                <FormLabel>Reason</FormLabel>
                                <Input 
                                    type="text" 
                                    name="Reason" 
                                    id="ReasonInput" 
                                    placeholder="e.g. lock isn't working" 
                                    changeAction={(e) => {setData('reason', e.target.value)}} 
                                />
                                <ShowErrors>
                                    {errors.reason}
                                </ShowErrors>
                            </div>
                            <div>
                                <FormLabel>Estimated Cost</FormLabel>
                                <NumberInput 
                                    classNames={{input: 'border border-gray-300 rounded placeholder-gray-600 text-gray-600 h-12'}}
                                    step={0.01}
                                    precision={2}
                                    min={0}
                                    placeholder="Cost" 
                                    parser={(value) => value.replace(/\£\s?|(,*)/g, '')}
                                    formatter={(value) =>
                                                !Number.isNaN(parseFloat(value))
                                                  ? `£ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                                  : '£ '
                                    }
                                    onChange={(e) => {e == '' ? setPrice('') : setPrice(parseFloat(e).toFixed(2)); setData('cost', e)}} 
                                />

                                <ShowErrors>{errors.cost}</ShowErrors>
                            </div>
                        </div>
       
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
                                    <DateInput
                                        placeholder="Date of Maintenance" 
                                        label="Maintenance Date" 
                                        withAsterisk
                                        onChange={(e) => setData({...data, start_date: e, end_date: e})}
                                        minDate={new Date}
                                    />

                                : dateRange == 'multiple' ?
                                    <DatePickerInput
                                        type="range"
                                        placeholder="Dates of Maintenance" 
                                        label="Maintenance Dates" 
                                        withAsterisk 
                                        onChange={(e) => setData({...data, start_date: e[0], end_date: e[1]})}
                                        minDate={new Date}
                                    />

                                : ''
                            }
                                <TimeInput 
                                    label="Maintenance Start Time" 
                                    onChange={(e) => setData({...data, start_time: e.target.value})} 
                                    withAsterisk
                                    icon={<ClockIcon className="h-5 w-5" />}
                                />

                                <TimeInput 
                                    label="Maintenance Finish Time" 
                                    onChange={(e) => setData({...data, finish_time: e.target.value})} 
                                    withAsterisk
                                    icon={<ClockIcon className="h-5 w-5" />}
                                />
                                <ShowErrors>{errors.start_time}</ShowErrors>
                                <ShowErrors>{errors.finish_time}</ShowErrors>
                            </div>
                        </InputContainer>

                        <InputContainer>
                            <div>
                        		<FormLabel>Contractor name</FormLabel>

                                <Input 
                                    type="text"
                                    placeholder="Contractor" 
                                    changeAction={(e) => {setData('contractor', e.target.value)}} 
                                />

                                <ShowErrors>
                                    {errors.contractor}
                                </ShowErrors>
                            </div>
                            <div className="flex-row flex space-x-4">
								<div>
                    	    		<FormLabel>Phone</FormLabel>
                	                <Input
            	                        type="text"
        	                            placeholder="e.g. 07979940337"
    	                                changeAction={(e) => {setData('contractor_phone', e.target.value)}}
	                                />
								</div>

								<div>
                        			<FormLabel>Email</FormLabel>
									<Input
										type="text"
										placeholder="e.g. mail@superb-builders.co.uk"
										changeAction={(e) => {setData('contractor_email', e.target.value)}}
									/>
									<ShowErrors>{errors.contractor_email}</ShowErrors>
								</div>

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
                            />
                        </InputContainer>

                        <RequestFormButton text="Make Request" submitAction={submit} /> 
                    </FormTile>
                </TileContainer>
            </RequestLayout>

    )
}
