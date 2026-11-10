import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(60)
  nombre: string;

  @IsEmail()
  email: string;

  // 72 es el máximo que bcrypt procesa; más allá ignora los caracteres
  @IsString() @MinLength(8) @MaxLength(72)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
