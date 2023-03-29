import { DateTimeToUKDate } from '@/Shared/Functions'
export default function ViewMaintenance({maintenance}) {

    return (
        <div className="grid grid-cols-2 gap-2 bg-white w-full sm:w-4/5 lg:w-2/5 mt-10 shadow p-5 text-sm md:text-base lg:text-lg">
            <span className="font-bold">Maintenance:</span> <span>{maintenance.maintenance_request.required_maintenance}</span>
            <span className="font-bold">Type:</span> <span>{maintenance.maintenance_request.type}</span>

            <span className="font-bold">Start Date:</span> <span>{DateTimeToUKDate(maintenance.maintenance_request.start_date)}</span>
            <span className="font-bold">Start Time:</span> <span>{maintenance.maintenance_request.start_time.split(':')[0]+':'+maintenance.maintenance_request.start_time.split(':')[1]}</span>
            <span className="font-bold">End Date:</span> <span>{DateTimeToUKDate(maintenance.maintenance_request.end_date)}</span>
            <span className="font-bold">Finish Time:</span> <span>{maintenance.maintenance_request.finish_time.split(':')[0]+':'+maintenance.maintenance_request.finish_time.split(':')[1]}</span>

            <span className="font-bold">Reason:</span> <span>{maintenance.maintenance_request.reason}</span>
            <span className="font-bold">Cost:</span> <span>£{maintenance.maintenance_request.cost}</span>

            <span className="font-bold">Contractor Name:</span> <span>{maintenance.maintenance_request.contractor}</span>
            <span className="font-bold">Contractor Email:</span> <span>{maintenance.maintenance_request.contractor_email}</span>
            <span className="font-bold">Contractor Phone:</span> <span>{maintenance.maintenance_request.contractor_phone}</span>
            
        </div>
    )

}
