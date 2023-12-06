
import { monitorRepository } from '../../repository/monitor-repository';


export class MonitorService {

    public async monitorService(contextId: string,  result: any) {
        try {
        const monitor = {
            contextId: contextId,
            status: (result.errorResponse || result.status=='401 Unauthorized') ? 500 : result.status,
            status_description:result.data,
        }
        console.log('monitorService',monitor)
        const retval =  await monitorRepository.createMonitorContent(monitor)
    } catch(err){
        console.log(err)
    }

    }

}

export const monitorService = new MonitorService()