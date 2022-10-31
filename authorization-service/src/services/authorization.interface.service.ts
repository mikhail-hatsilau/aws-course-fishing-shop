export interface AuthorizationService {
  validateCredentials(token: string): boolean;
}
