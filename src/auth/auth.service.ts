import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SeedService } from '../seed/seed.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private seedService: SeedService,
  ) {}

  async signup(authDto: AuthDto): Promise<void> {
    const { email, password } = authDto;

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      await this.seedService.seed(user);
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

  async login(authDto: AuthDto): Promise<{ accessToken: string }> {
    const { email, password } = authDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !this.isPasswordValid(password, user)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  /* ---------------------------- Private methods --------------------------- */

  private async isPasswordValid(
    password: string,
    user: AuthDto,
  ): Promise<boolean> {
    return user ? bcrypt.compare(password, user.password) : false;
  }
}
