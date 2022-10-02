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
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async signup(authDto: AuthDto): Promise<User> {
    const { email, password } = authDto;

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      return user;
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
