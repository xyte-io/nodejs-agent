/* eslint-disable no-var */

export type Auth = Record<'id' | 'access_key' | 'hub_url' | 'hub_url_static_cert', string> | null;
export type Config = ({ version: number; last_updated: string } & Record<string, unknown>) | null;
export type License = {
  id: string;
  data: string;
  signature: string;
  add?: boolean;
  remove?: boolean;
  update?: boolean;
};

export type Command = {
  id: string;
  status: 'done' | 'failed' | 'pending' | 'in_progress';
  name: string;
  parameters: Record<string, unknown>;
  message?: string;
};

export type State = Record<'auth', Auth> & Record<'config', Config> & Record<'licenses', Array<License>>;

declare global {
  var applicationState: State;
}

export default global;
