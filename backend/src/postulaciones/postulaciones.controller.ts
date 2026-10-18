import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthRequest, JwtGuard } from '../auth/jwt.guard';
import { PostulacionesService } from './postulaciones.service';
import { CreatePostulacionDto, FilterPostulacionesDto, UpdatePostulacionDto } from './postulacion.dto';

@Controller('postulaciones')
@UseGuards(JwtGuard)
export class PostulacionesController {
  constructor(private readonly jobs: PostulacionesService) {}
  @Get() list(@Req() req: AuthRequest, @Query() filter: FilterPostulacionesDto) {
    return this.jobs.list(req.user.id, filter);
  }
  @Get(':id') find(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.jobs.find(req.user.id, id);
  }
  @Post() create(@Req() req: AuthRequest, @Body() dto: CreatePostulacionDto) {
    return this.jobs.create(req.user.id, dto);
  }
  @Patch(':id') update(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePostulacionDto) {
    return this.jobs.update(req.user.id, id, dto);
  }
  @Delete(':id') remove(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.jobs.remove(req.user.id, id);
  }
}
