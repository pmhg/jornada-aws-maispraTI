import { ColumnDB, TableDB } from '@pmhg/leeurope-crud-repository-dynamodb'
import { dateDeserializer, dateSerializer } from '@pmhg/leeurope-http-aws-api-node'

const monitorTable = process.env.JORNADA_MONITOR_TABLE
                                 


@TableDB(monitorTable)
export class MonitorModel {
  public id: string;

  @ColumnDB('pk')
  public pk: string;

  @ColumnDB('sk')
  public sk?: string;

  @ColumnDB('contextId')
  public contextId: string;

  @ColumnDB('status')
  public status: number;

  @ColumnDB('status_description')
  public status_description: string;

  @ColumnDB('created_at',
    dateSerializer(),
    dateDeserializer()
  )
  public createdAt?: Date;

  @ColumnDB('updated_at',
    dateSerializer(),
    dateDeserializer()
  )
  public updatedAt?: Date;

 
}
