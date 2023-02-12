import { MockOauthClient } from './MockOauthClient';

export class MockOauthFactory {
  getClient() {
    return new MockOauthClient();
  }
}
