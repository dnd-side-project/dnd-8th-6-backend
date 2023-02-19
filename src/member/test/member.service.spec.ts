import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '../application/member.service';
import { BadRequestException } from '@nestjs/common';
import { SocialType } from '../domain/social-type.enum';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('사용자의 Id를 검색해 Member 조회에 성공한다.', () => {
    const member = service.getMemberById(1);
    expect(member.id).toEqual(1);
    expect(member.name).toEqual('member');
    expect(member.socialType).toEqual(SocialType.GITHUB);
    expect(member.socialId).toEqual('1');
    expect(member.githubId).toBeNull();
  });

  it('존재하지 않는 사용자의 Id를 검색해 Member 조회에 실패한다.', () => {
    expect(service.getMemberById(2)).rejects.toThrow(BadRequestException);
  });

  it('검색어에 속하는 이름 또는 githubId를 가진 Member 를 조회한다.', () => {
    const member = service.getMemberById(1);
    const memberList = service.getMemberList('member');

    expect(memberList).toContainEqual(member);
  });

  it('사용자의 정보를 수정한다.', () => {
    const updateMemberRequestDto = {
      name: 'newName',
      githubId: 'dev',
    };
    const member = service.updateMember(1, updateMemberRequestDto);

    expect(member.id).toEqual(1);
    expect(member.name).toEqual('newName');
    expect(member.githubId).toEqual('dev');
  });

  it('존재하지 않는 Member 정보를 수정하여 수정에 실패한다.', () => {
    const updateMemberRequestDto = {
      name: 'newName',
      githubId: 'dev',
    };
    expect(service.updateMember(1, updateMemberRequestDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Member 정보를 삭제한다.', () => {
    service.deleteMember(3, 'refreshToken');
    expect(service.getMemberById(3)).rejects.toThrow(BadRequestException);
  });

  it('올바르지 않은 값 전달로 Member 삭제에 실패한다.', () => {
    expect(service.deleteMember(4, 'invalidRefreshToken')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('존재하지 않는 Member 삭제에 실패한다.', () => {
    expect(service.deleteMember(2, 'refreshToken')).rejects.toThrow(
      BadRequestException,
    );
  });
});
