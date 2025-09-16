import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'khusanboyev',
    description: 'users username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'khusanboyev1409',
    description: 'users password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
