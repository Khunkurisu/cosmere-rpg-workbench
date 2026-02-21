export const HOOKS = {
	INIT: 'init',
	READY: 'ready',
	RENDER_SHEET: (context: string) => `render${context}` as const,
	PRE_CREATE: (context: string) => `preCreate${context}` as const,
	CREATE: (context: string) => `create${context}` as const,
	PRE_UPDATE: (context: string) => `preUpdate${context}` as const,
	UPDATE: (context: string) => `update${context}` as const,
	PRE_USE_ITEM: 'cosmere-rpg.preUseItem',
} as const;
