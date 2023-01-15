import { Injectable } from '@nestjs/common';


@Injectable()
export class UserService {
    test(testParam: string): string {
        console.log(testParam);
        const dummy = 'test';
        return dummy;
    }
}
