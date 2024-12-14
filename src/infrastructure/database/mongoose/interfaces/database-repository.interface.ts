import { UserEntity } from 'src/domain/entities/user.entity';

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  updateById(id: string,updateData: Partial<UserEntity>):Promise<UserEntity | null>
}
