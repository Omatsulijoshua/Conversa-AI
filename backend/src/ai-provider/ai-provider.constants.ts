export const SUPPORTED_AI_PROVIDERS = [
  'openai',
  'gemini',
  'grok',
  'anthropic',
  'deepseek',
  'mistral',
  'openrouter',
] as const;

export type SupportedAiProvider = (typeof SUPPORTED_AI_PROVIDERS)[number];

export const DEFAULT_CHAT_MODELS: Record<SupportedAiProvider, string> = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
  grok: 'grok-2-latest',
  anthropic: 'claude-3-5-haiku-latest',
  deepseek: 'deepseek-chat',
  mistral: 'mistral-small-latest',
  openrouter: 'openai/gpt-4o-mini',
};

export const OPENAI_COMPATIBLE_BASE_URLS: Partial<Record<SupportedAiProvider, string>> = {
  openai: 'https://api.openai.com/v1',
  grok: 'https://api.x.ai/v1',
  deepseek: 'https://api.deepseek.com/v1',
  mistral: 'https://api.mistral.ai/v1',
  openrouter: 'https://openrouter.ai/api/v1',
};

