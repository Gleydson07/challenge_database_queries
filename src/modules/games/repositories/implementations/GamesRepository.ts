import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const response = await this.repository
      .createQueryBuilder()
      .where("title ILIKE :title", {title: `%${param}%`})
      .getMany();

      return response;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const response = await this.repository
      .query(`SELECT count(*) FROM games`); 

    return response;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const response = await this.repository
      .createQueryBuilder()
      .select("id")
      .relation(Game, "users")
      .of(id)
      .loadMany();

    return response
  }
}
