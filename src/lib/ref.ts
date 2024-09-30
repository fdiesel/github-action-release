export type RefStringTypes = 'heads' | 'tags' | 'pull' | 'notes' | 'remotes';
export type RefString<Type extends RefStringTypes> = `refs/${Type}/${string}`;
