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
import { GoogleUser } from './interfaces';

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
    const { password, ...rest } = authDto;

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: { password: hashedPassword, ...rest },
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.createAccessToken(user);
    return accessToken;
  }

  async googleLogin(req) {
    const user = req.user as GoogleUser;
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!userAlreadyExists) {
      const accessToken = await this.signup({
        email: user.email,
        password: this.randomPassword(),
        photo: user.picture,
      });

      return accessToken;
    }

    return user.accessToken;
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

  private randomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
