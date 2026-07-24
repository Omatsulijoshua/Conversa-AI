export declare const SUPPORTED_AI_PROVIDERS: readonly ["openai", "gemini", "grok", "anthropic", "deepseek", "mistral", "openrouter", "groq"];
export type SupportedAiProvider = (typeof SUPPORTED_AI_PROVIDERS)[number];
export declare const DEFAULT_CHAT_MODELS: Record<SupportedAiProvider, string>;
export declare const OPENAI_COMPATIBLE_BASE_URLS: Partial<Record<SupportedAiProvider, string>>;
