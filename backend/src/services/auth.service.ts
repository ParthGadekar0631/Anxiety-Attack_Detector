import ms from 'ms';
import { userRepository } from '../repositories/user.repository';
import { tokenRepository } from '../repositories/token.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../utils/jwt';
import { env } from '../config/env';
import type { IUser } from '../models/user.model';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: IUser['role'];
}

interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDto) {
    const existing = await userRepository.findByEmail(data.email.toLowerCase());
    if (existing) {
      throw new AppError('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role ?? 'patient',
    });

    const tokens = await this.issueTokens(user);
    return { user: this.sanitizeUser(user), tokens };
  }

  async login(data: LoginDto) {
    const user = await userRepository.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.issueTokens(user);
    return { user: this.sanitizeUser(user), tokens };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError('Missing refresh token', HttpStatus.BAD_REQUEST);
    }

    const storedToken = await tokenRepository.findByToken(refreshToken);
    if (!storedToken) {
      throw new AppError('Session expired', HttpStatus.UNAUTHORIZED);
    }

    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      await tokenRepository.deleteByToken(refreshToken);
      throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    const tokens = await this.issueTokens(user);
    await tokenRepository.deleteByToken(refreshToken);
    return { user: this.sanitizeUser(user), tokens };
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await tokenRepository.deleteByToken(refreshToken);
    }
  }

  private async issueTokens(user: IUser) {
    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const expiresInMs = ms(env.REFRESH_TOKEN_TTL);
    const expiresAt = new Date(Date.now() + (typeof expiresInMs === 'number' ? expiresInMs : 0));

    await tokenRepository.create({
      user: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: IUser) {
    const plain = user.toObject();
    delete (plain as Partial<IUser>).password;
    return plain;
  }
}

export const authService = new AuthService();
