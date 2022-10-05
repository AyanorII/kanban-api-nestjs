import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SeedService } from '../seed/seed.service';
import { AuthDto } from './dto/auth.dto';

export interface AccessToken {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private seedService: SeedService,
  ) {}

  async signup(authDto: AuthDto): Promise<AccessToken> {
    const { email, password } = authDto;

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      // Creates boards, columns, tasks and subtasks for the new user.
      await this.seedService.seed(user);

      const accessToken = await this.createAccessToken(user);
      return accessToken;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      } else {
        console.log(err);
      }
    }
  }

  async login(authDto: AuthDto): Promise<AccessToken> {
    const { email, password } = authDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.isPasswordValid(password, user))) {
      throw new UnauthorizedException('Invalid credentials hihi');
    }

    const accessToken = await this.createAccessToken(user);
    return accessToken;
  }

  /* ---------------------------- Private methods --------------------------- */

  private async isPasswordValid(
    password: string,
    user: AuthDto,
  ): Promise<boolean> {
    return user ? bcrypt.compare(password, user.password) : false;
  }

  private async createAccessToken(user: User): Promise<AccessToken> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
