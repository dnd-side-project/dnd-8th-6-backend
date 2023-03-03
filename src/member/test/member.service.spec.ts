// import { Test, TestingModule } from '@nestjs/testing';
// import { MemberService } from '../application/member.service';
// import { BadRequestException, UnauthorizedException } from '@nestjs/common';
// import { SocialType } from '../domain/social-type.enum';
// import { MemberResponseDto } from '../presentation/dto/member-response.dto';
// import { MemberRepository } from '../repository/member.repository';
// import { MockMemberRepository } from './mock-member.repository';
//
// describe('MemberService', () => {
//   let service: MemberService;
//   let repository: MemberRepository;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MemberService,
//         {
//           provide: MemberRepository,
//           useClass: MockMemberRepository,
//         },
//       ],
//     }).compile();
//
//     service = module.get<MemberService>(MemberService);
//     repository = module.get<MemberRepository>(MemberRepository);
//     await repository.clear();
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
//
//   it('사용자의 Id를 검색해 Member 조회에 성공한다.', async () => {
//     const member: MemberResponseDto = await service.getMemberById(1);
//     expect(member.id).toEqual(1);
//     expect(member.name).toEqual('member');
//     expect(member.socialType).toEqual(SocialType.GITHUB);
//   });
//
//   it('존재하지 않는 사용자의 Id를 검색해 Member 조회에 실패한다.', () => {
//     expect(service.getMemberById(2)).rejects.toThrow(BadRequestException);
//   });
//
//   it('검색어에 속하는 이름 또는 githubId를 가진 Member 를 조회한다.', async () => {
//     const member = await service.getMemberById(1);
//     const memberList = await service.getMemberList('m');
//
//     expect(memberList).toContainEqual(member);
//   });
//
//   it('사용자의 정보를 수정한다.', async () => {
//     const updateMemberRequestDto = {
//       name: 'newName',
//       githubId: 'dev',
//     };
//     const member: MemberResponseDto = await service.updateMember(
//       1,
//       updateMemberRequestDto,
//     );
//
//     expect(member.id).toEqual(1);
//     expect(member.name).toEqual('newName');
//     expect(member.githubId).toEqual('dev');
//   });
//
//   it('존재하지 않는 Member 정보를 수정하여 수정에 실패한다.', () => {
//     const updateMemberRequestDto = {
//       name: 'newName',
//       githubId: 'dev',
//     };
//     expect(service.updateMember(2, updateMemberRequestDto)).rejects.toThrow(
//       BadRequestException,
//     );
//   });
//
//   it('Member 정보를 삭제한다.', async () => {
//     await service.deleteMember(3, 'refreshToken');
//     await expect(async () => {
//       await service.getMemberById(3);
//     }).rejects.toThrow(BadRequestException);
//   });
//
//   it('올바르지 않은 값 전달로 Member 삭제에 실패한다.', () => {
//     expect(service.deleteMember(4, 'invalidRefreshToken')).rejects.toThrow(
//       UnauthorizedException,
//     );
//   });
//
//   it('존재하지 않는 Member 삭제에 실패한다.', () => {
//     expect(service.deleteMember(2, 'refreshToken')).rejects.toThrow(
//       BadRequestException,
//     );
//   });
// });
