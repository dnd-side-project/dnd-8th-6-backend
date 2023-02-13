import { MockOauthClient } from './mock-oauth.client';

export class MockOauthFactory {
  getClient() {
    return new MockOauthClient();
  }
}
