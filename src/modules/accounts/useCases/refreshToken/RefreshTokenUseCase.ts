import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider') private dateProvider: IDateProvider,
  ) {}
  async execute(token: string): Promise<ITokenResponse> {
    const { sub, email } = verify(token, auth.secretRefreshToken) as IPayload;

    const user_id = sub;

    const userTokens =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token,
      );

    if (!userTokens) {
      throw new AppError('Refresh Token does not exists!');
    }

    await this.usersTokensRepository.deleteById(userTokens.id);

    const refreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: sub,
      expiresIn: auth.expiresInRefreshToken,
    });

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      auth.expiresRefreshTokenDays,
    );

    await this.usersTokensRepository.create({
      expires_date: refreshTokenExpiresDate,
      refresh_token: refreshToken,
      user_id,
    });

    const newtoken = sign({}, auth.secretToken, {
      subject: user_id,
      expiresIn: auth.expirestInToken,
    });

    return {
      refresh_token: refreshToken,
      token: newtoken,
    };
  }
}
