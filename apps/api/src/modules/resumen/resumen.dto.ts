import { IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class GuardarIaConfigDto {
  @IsOptional()
  @IsString()
  @IsIn(['gemini', 'openai', 'groq'], {
    message: 'El proveedor debe ser gemini, openai o groq',
  })
  proveedor?: 'gemini' | 'openai' | 'groq';

  @IsString()
  @IsNotEmpty({ message: 'La API Key es obligatoria' })
  @MinLength(10, { message: 'La API Key parece demasiado corta' })
  apiKey!: string;
}