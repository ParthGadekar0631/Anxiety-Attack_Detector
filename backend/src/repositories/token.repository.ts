import { TokenModel } from '../models/token.model';

export class TokenRepository {
  create(data: { user: string; tokenHash: string; expiresAt: Date }) {
    return TokenModel.create(data);
  }

  findByToken(tokenHash: string) {
    return TokenModel.findOne({ tokenHash }).exec();
  }

  deleteByToken(tokenHash: string) {
    return TokenModel.deleteOne({ tokenHash }).exec();
  }

  deleteByUser(userId: string) {
    return TokenModel.deleteMany({ user: userId }).exec();
  }
}

export const tokenRepository = new TokenRepository();
