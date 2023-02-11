import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Dev sleact docs')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
 
    await app.listen(3000);
}
bootstrap();
