export class MockJwtService {
  signAsync() {
    return 'jwt';
  }

  decode() {
    return {
      exp: 100,
    };
  }
}
