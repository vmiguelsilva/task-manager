import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../guards/roles';

export const Auth = () => applyDecorators(UseGuards(AuthGuard('jwt'), RolesGuard));
