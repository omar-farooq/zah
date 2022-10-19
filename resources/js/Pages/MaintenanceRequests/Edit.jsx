import { useState } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { Calendar } from 'primereact/calendar'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'
import Checkbox from '@/Components/RequestFormCheckbox'

export default function EditMaintenanceRequest({maintenanceRequest}) {

    const [price, setPrice] = useState(maintenanceRequest.cost)
    const [startTime, setStartTime] = useState(new Date(maintenanceRequest.start))
    const [endTime, setEndTime] = useState(new Date(maintenanceRequest.finish))
    const [maintenance, setMaintenance] = useState(maintenanceRequest.type)

    const { data, setData, post, processing, errors } = useForm({
        required_maintenance: maintenanceRequest.required_maintenance,
        reason: maintenanceRequest.reason,
        cost: maintenanceRequest.cost,
        contractor: maintenanceRequest.contractor,
        contractor_phone: maintenanceRequest.contractor_phone,
        contractor_email: maintenanceRequest.conractor_email,
        type: maintenanceRequest.type,
        start: maintenanceRequest.start,
        finish: maintenanceRequest.finish,
        emergency: maintenanceRequest.emergency
    })

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

                        <FormLabel> Date/time</FormLabel>
                        <InputContainer>
                            <div className="m-auto">
                                <Calendar 
                                    id="time24h" 
                                    onChange={(e) => {
                                        setData('start', e.value);
                                        setStartTime(e.value)
                                    }} 
                                    showTime
                                    value={startTime}
                                    defaultValue={maintenanceRequest.start}
                                    placeholder="Start Time" 
                                />
                                <ShowErrors>{errors.start}</ShowErrors>

                                <Calendar 
                                    id="time24h" 
                                    onChange={(e) => { 
                                        setData('finish', e.value);
                                        setEndTime(e.value)
                                    }} 
                                    showTime 
                                    value={endTime}
                                    placeholder="Finish Time" 
                                />
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
