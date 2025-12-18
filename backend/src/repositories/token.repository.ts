import { TokenModel } from '../models/token.model';

export class TokenRepository {
  create(data: { user: string; token: string; expiresAt: Date }) {
    return TokenModel.create(data);
  }

  findByToken(token: string) {
    return TokenModel.findOne({ token }).exec();
  }

  deleteByToken(token: string) {
    return TokenModel.deleteOne({ token }).exec();
  }

  deleteByUser(userId: string) {
    return TokenModel.deleteMany({ user: userId }).exec();
  }
}

export const tokenRepository = new TokenRepository();
