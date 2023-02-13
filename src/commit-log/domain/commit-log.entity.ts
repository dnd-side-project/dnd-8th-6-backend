import { Member } from 'src/member/domain/member.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'commit_cnt', default: 0, nullable: false  })
  commitCnt!: Member;

  @Column({ type: 'date', name: 'commit_date', nullable: false })
  commitDate!: Date;

  @ManyToOne(() => Member, (member) => member.githubId, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'github_id'})
  githubId: string;
}
