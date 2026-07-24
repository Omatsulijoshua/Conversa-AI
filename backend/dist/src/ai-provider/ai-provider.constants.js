"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENAI_COMPATIBLE_BASE_URLS = exports.DEFAULT_CHAT_MODELS = exports.SUPPORTED_AI_PROVIDERS = void 0;
exports.SUPPORTED_AI_PROVIDERS = [
    'openai',
    'gemini',
    'grok',
    'anthropic',
    'deepseek',
    'mistral',
    'openrouter',
    'groq',
];
exports.DEFAULT_CHAT_MODELS = {
    openai: 'gpt-4o-mini',
    gemini: 'gemini-1.5-flash',
    grok: 'grok-2-latest',
    anthropic: 'claude-3-5-haiku-latest',
    deepseek: 'deepseek-chat',
    mistral: 'mistral-small-latest',
    openrouter: 'openai/gpt-4o-mini',
    groq: 'llama-3.3-70b-versatile',
};
exports.OPENAI_COMPATIBLE_BASE_URLS = {
    openai: 'https://api.openai.com/v1',
    grok: 'https://api.x.ai/v1',
    deepseek: 'https://api.deepseek.com/v1',
    mistral: 'https://api.mistral.ai/v1',
    openrouter: 'https://openrouter.ai/api/v1',
    groq: 'https://api.groq.com/openai/v1',
};
//# sourceMappingURL=ai-provider.constants.js.map