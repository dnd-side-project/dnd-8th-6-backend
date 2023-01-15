import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    testController(@Param() testParam: string): string {
        return this.userService.test(testParam);
    }
}
