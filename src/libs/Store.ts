import type { Registrant } from "./Registrant";

const STORAGE_KEY = "Marathon.tasks";
const defaultTasks: Registrant[] = [];

export const loadTasks = (): Registrant[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultTasks;
  } catch {
    return defaultTasks;
  }
};

export const saveTasks = (tasks: Registrant[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
