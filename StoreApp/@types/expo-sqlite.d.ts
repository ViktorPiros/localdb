declare module 'expo-sqlite' {
    export function openDatabase(
      name: string,
      version?: string,
      description?: string,
      size?: number,
      callback?: (db: any) => void
    ): any;
  }