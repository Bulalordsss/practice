import * as SQLite from 'expo-sqlite';

export type LocalTodoItem = {
  id: number;
  title: string;
  details: string;
  completed: boolean;
  createdAt: string;
  hidden: boolean;
};

const DATABASE_NAME = 'local-todos.db';
const TABLE_NAME = 'local_todos';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function initializeTodoDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      hidden INTEGER NOT NULL DEFAULT 0
    );
  `);

  try {
    await db.execAsync(`
      ALTER TABLE ${TABLE_NAME}
      ADD COLUMN details TEXT NOT NULL DEFAULT '';
    `);
  } catch {
    // Column already exists on existing installs.
  }

  try {
    await db.execAsync(`
      ALTER TABLE ${TABLE_NAME}
      ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0;
    `);
  } catch {
    // Column already exists on existing installs.
  }
}

export async function getLocalTodos(): Promise<LocalTodoItem[]> {
  const db = await getDatabase();
  await initializeTodoDatabase();

  const rows = await db.getAllAsync<{
    id: number;
    title: string;
    details: string | null;
    completed: number;
    created_at: string;
    hidden: number;
  }>(`
    SELECT id, title, details, completed, created_at, hidden
    FROM ${TABLE_NAME}
    WHERE hidden = 0
    ORDER BY datetime(created_at) DESC, id DESC;
  `);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    details: row.details ?? '',
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    hidden: Boolean(row.hidden),
  }));
}

export async function insertLocalTodo(title: string, details: string): Promise<LocalTodoItem> {
  const db = await getDatabase();
  await initializeTodoDatabase();

  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `
      INSERT INTO ${TABLE_NAME} (title, details, completed, created_at)
      VALUES (?, ?, ?, ?);
    `,
    title,
    details,
    0,
    createdAt
  );

  return {
    id: result.lastInsertRowId,
    title,
    details,
    completed: false,
    createdAt,
    hidden: false,
  };
}

export async function updateLocalTodo(
  id: number,
  payload: { title: string; details: string; completed: boolean }
) {
  const db = await getDatabase();
  await initializeTodoDatabase();

  await db.runAsync(
    `
      UPDATE ${TABLE_NAME}
      SET title = ?, details = ?, completed = ?
      WHERE id = ?;
    `,
    payload.title,
    payload.details,
    payload.completed ? 1 : 0,
    id
  );
}

export async function hideLocalTodo(id: number) {
  const db = await getDatabase();
  await initializeTodoDatabase();

  await db.runAsync(
    `
      UPDATE ${TABLE_NAME}
      SET hidden = 1
      WHERE id = ?;
    `,
    id
  );
}
