export type Auth = Record<'id' | 'access_key' | 'hub_url' | 'hub_url_static_cert', string> | null;
export type Config = ({ version: number; last_updated: string } & Record<string, any>) | null;
export type Licence = {
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
  parameters: Record<string, any>;
  message?: string;
};

export type State = Record<'auth', Auth> & Record<'config', Config> & Record<'licenses', Array<Licence>>;
