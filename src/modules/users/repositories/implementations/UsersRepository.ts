import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userWithGamers = await this.repository.findOneOrFail({
      id: user_id
    }, {
      relations: ['games']
    });

    if(!userWithGamers){
      throw new Error("User no found");
    }
    
    return userWithGamers;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const response = await this.repository.query("SELECT * FROM users ORDER BY users.first_name"); 
    
    // Complete usando raw query
    return response;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const response = await this.repository
    .query(`SELECT * FROM users WHERE LOWER(users.first_name) LIKE LOWER($1) AND LOWER(users.last_name) LIKE LOWER($2)`, [first_name, last_name]); 
    
    // Complete usando raw query
    return response;
  }
}
