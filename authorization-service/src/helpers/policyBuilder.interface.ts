export interface PolicyBuilder<T> {
  buildAllowPolicy(principal: string, resource: string): T;
  buildDenyPolicy(principal: string, resource: string): T;
}
