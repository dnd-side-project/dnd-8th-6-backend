import { MemberGrade } from '../../domain/member-grade.enum';

export class GradeDto {
  readonly grade: MemberGrade;

  readonly exp: number;

  readonly score: number;

  constructor(grade: MemberGrade, exp: number, score: number) {
    this.grade = grade;
    this.exp = exp;
    this.score = score;
  }
}
