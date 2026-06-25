export interface MonitorState {
  id: number;
  state_key: string;
  state_value: string;
  updated_at: string;
}

export interface MonitorStateRepository {
  getState(key: string): Promise<string | null>;
  saveState(key: string, value: string): Promise<void>;
}
