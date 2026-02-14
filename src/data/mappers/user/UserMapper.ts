// TODO: vao ser usados, mas ainda não foram

// import { User } from '@/src/domain/entities/User';
// import { UserDTO } from '../dtos/UserDTO';

// export class UserMapper {
//   static fromDtoToDomain(user: UserDTO): User {
//     return User.reconstitute({
//       id: String(user.id),
//       name: user.name,
//       email: user.email,
//       password: user.password,
//       createdAt: new Date(user.createdAt),
//       updatedAt: new Date(user.updatedAt),
//     });
//   }

//   static fromDomainToDto(entity: User): Partial<UserDTO> {
//     return {
//       id: Number(entity.id),
//       name: entity.name,
//       email: entity.email,
//       password: entity.password,
//       createdAt: entity.createdAt.toISOString(),
//       updatedAt: entity.updatedAt.toISOString(),
//     };
//   }
// }
