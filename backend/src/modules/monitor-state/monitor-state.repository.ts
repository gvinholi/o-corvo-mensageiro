import { supabase } from "../../config/supabase";
import {
  MonitorState,
  MonitorStateRepository,
} from "./monitor-state.types";

const TABLE_NAME = "monitor_state";

const validateStateKey = (key: string) => {
  if (!key.trim()) {
    throw new Error("A chave do estado do monitor não pode ser vazia.");
  }
};

export const monitorStateRepository: MonitorStateRepository = {
  async getState(key: string): Promise<string | null> {
    validateStateKey(key);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("state_value")
      .eq("state_key", key)
      .maybeSingle<Pick<MonitorState, "state_value">>();

    if (error) {
      throw new Error(
        `Erro ao buscar estado do monitor "${key}": ${error.message}`
      );
    }

    return data?.state_value ?? null;
  },

  async saveState(key: string, value: string): Promise<void> {
    validateStateKey(key);

    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        state_key: key,
        state_value: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "state_key",
      }
    );

    if (error) {
      throw new Error(
        `Erro ao salvar estado do monitor "${key}": ${error.message}`
      );
    }
  },
};
