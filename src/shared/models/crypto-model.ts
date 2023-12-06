import '../db'
import {
  Column,
  ForeignKey,
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsTo
} from 'sequelize-typescript'



@Table({ tableName: 'crypto', timestamps: false })
export default class CryptoModel extends Model<CryptoModel> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id?: number;

  @Column({ field: 'nome' })
  public nome: string;

  @Column({ field: 'simbolo' })
  public simbolo: string;
  
  @Column({ field: 'valor' })
  public valor: number;

  
}

export class CryptoModelCreator {
  public static create (source: CryptoModel): CryptoModel {
    if (source) {
      return Object.assign(new CryptoModel(), source)
    }
    return null
  }
}
