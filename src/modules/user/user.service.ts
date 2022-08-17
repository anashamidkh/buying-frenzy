import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  /**
   *
   * @param {UserRepository} userRepository
   */
  constructor(private userRepository: UserRepository) {}

  /**
   * Get user by id
   * @param {number} id
   * @returns {Promise<User>}
   */
  public async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }
}
