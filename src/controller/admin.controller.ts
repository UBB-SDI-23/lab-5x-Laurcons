import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { AllowRoles } from 'src/lib/decorator/allow-roles';
import { Public } from 'src/lib/decorator/is-public';
import AdminService from 'src/service/admin.service';

@Controller('/admin')
export default class AdminController {
  constructor(private adminService: AdminService) {}

  @AllowRoles(['admin'])
  @HttpCode(204)
  @Post('/delete-all')
  async deleteAllData() {
    await this.adminService.deleteAllData();
    return;
  }

  @AllowRoles(['admin'])
  @Sse('/write-all')
  async writeData() {
    return await this.adminService.writeAllData();
  }
}
