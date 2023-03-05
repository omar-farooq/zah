export default function ViewMaintenance({maintenance}) {

    return (
        <div class="grid grid-cols-2 gap-2 bg-white w-2/5">
            <span>Maintenance:</span> <span>{maintenance.maintenance_request.required_maintenance}</span>
            <span>Type:</span> <span>{maintenance.maintenance_request.type}</span>

            <span>Start Date:</span> <span>{maintenance.maintenance_request.start_date.split('T')[0]}</span>
            <span>Start Time:</span> <span>{maintenance.maintenance_request.start_time.split('T')[1].split('.')[0]}</span>
            <span>End Date:</span> <span>{maintenance.maintenance_request.end_date.split('T')[0]}</span>
            <span>Finish Time:</span> <span>{maintenance.maintenance_request.finish_time.split('T')[1].split('.')[0]}</span>

            <span>Reason:</span> <span>{maintenance.maintenance_request.reason}</span>
            <span>Cost:</span> <span>£{maintenance.maintenance_request.cost}</span>

            <span>Contractor Name:</span> <span>{maintenance.maintenance_request.contractor}</span>
            <span>Contractor Email:</span> <span>{maintenance.maintenance_request.contractor_email}</span>
            <span>Contractor Phone:</span> <span>{maintenance.maintenance_request.contractor_phone}</span>
            
        </div>
    )

}
