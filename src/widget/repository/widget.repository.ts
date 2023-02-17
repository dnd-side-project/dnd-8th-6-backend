import { EntityRepository, Repository } from 'typeorm';
import { Widget } from '../domain/widget.entity';

@EntityRepository(Widget)
export class WidgetRepository extends Repository<Widget> {}
