/**
 * References or sources cited by the AI model in its response. `ai.citations`
 *
 * Attribute Value Type: `Array<string>` {@link AI_CITATIONS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example ["Citation 1","Citation 2"]
 */
declare const AI_CITATIONS = "ai.citations";
/**
 * Type for {@link AI_CITATIONS} ai.citations
 */
type AI_CITATIONS_TYPE = Array<string>;
/**
 * The number of tokens used to respond to the message. `ai.completion_tokens.used`
 *
 * Attribute Value Type: `number` {@link AI_COMPLETION_TOKENS_USED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_OUTPUT_TOKENS} `gen_ai.usage.output_tokens`, {@link GEN_AI_USAGE_COMPLETION_TOKENS} `gen_ai.usage.completion_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_OUTPUT_TOKENS} (gen_ai.usage.output_tokens) instead
 * @example 10
 */
declare const AI_COMPLETION_TOKENS_USED = "ai.completion_tokens.used";
/**
 * Type for {@link AI_COMPLETION_TOKENS_USED} ai.completion_tokens.used
 */
type AI_COMPLETION_TOKENS_USED_TYPE = number;
/**
 * Documents or content chunks used as context for the AI model. `ai.documents`
 *
 * Attribute Value Type: `Array<string>` {@link AI_DOCUMENTS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example ["document1.txt","document2.pdf"]
 */
declare const AI_DOCUMENTS = "ai.documents";
/**
 * Type for {@link AI_DOCUMENTS} ai.documents
 */
type AI_DOCUMENTS_TYPE = Array<string>;
/**
 * The reason why the model stopped generating. `ai.finish_reason`
 *
 * Attribute Value Type: `string` {@link AI_FINISH_REASON_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_RESPONSE_FINISH_REASONS} `gen_ai.response.finish_reasons`
 *
 * @deprecated Use {@link GEN_AI_RESPONSE_FINISH_REASONS} (gen_ai.response.finish_reasons) instead
 * @example "COMPLETE"
 */
declare const AI_FINISH_REASON = "ai.finish_reason";
/**
 * Type for {@link AI_FINISH_REASON} ai.finish_reason
 */
type AI_FINISH_REASON_TYPE = string;
/**
 * Used to reduce repetitiveness of generated tokens. The higher the value, the stronger a penalty is applied to previously present tokens, proportional to how many times they have already appeared in the prompt or prior generation. `ai.frequency_penalty`
 *
 * Attribute Value Type: `number` {@link AI_FREQUENCY_PENALTY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_FREQUENCY_PENALTY} `gen_ai.request.frequency_penalty`
 *
 * @deprecated Use {@link GEN_AI_REQUEST_FREQUENCY_PENALTY} (gen_ai.request.frequency_penalty) instead
 * @example 0.5
 */
declare const AI_FREQUENCY_PENALTY = "ai.frequency_penalty";
/**
 * Type for {@link AI_FREQUENCY_PENALTY} ai.frequency_penalty
 */
type AI_FREQUENCY_PENALTY_TYPE = number;
/**
 * For an AI model call, the function that was called. This is deprecated for OpenAI, and replaced by tool_calls `ai.function_call`
 *
 * Attribute Value Type: `string` {@link AI_FUNCTION_CALL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_NAME} `gen_ai.tool.name`, {@link MCP_TOOL_NAME} `mcp.tool.name`
 *
 * @deprecated Use {@link GEN_AI_TOOL_NAME} (gen_ai.tool.name) instead
 * @example "function_name"
 */
declare const AI_FUNCTION_CALL = "ai.function_call";
/**
 * Type for {@link AI_FUNCTION_CALL} ai.function_call
 */
type AI_FUNCTION_CALL_TYPE = string;
/**
 * Unique identifier for the completion. `ai.generation_id`
 *
 * Attribute Value Type: `string` {@link AI_GENERATION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_RESPONSE_ID} `gen_ai.response.id`
 *
 * @deprecated Use {@link GEN_AI_RESPONSE_ID} (gen_ai.response.id) instead
 * @example "gen_123abc"
 */
declare const AI_GENERATION_ID = "ai.generation_id";
/**
 * Type for {@link AI_GENERATION_ID} ai.generation_id
 */
type AI_GENERATION_ID_TYPE = string;
/**
 * The input messages sent to the model `ai.input_messages`
 *
 * Attribute Value Type: `string` {@link AI_INPUT_MESSAGES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_MESSAGES} `gen_ai.request.messages`
 *
 * @deprecated Use {@link GEN_AI_INPUT_MESSAGES} (gen_ai.input.messages) instead
 * @example "[{\"role\": \"user\", \"message\": \"hello\"}]"
 */
declare const AI_INPUT_MESSAGES = "ai.input_messages";
/**
 * Type for {@link AI_INPUT_MESSAGES} ai.input_messages
 */
type AI_INPUT_MESSAGES_TYPE = string;
/**
 * Boolean indicating if the model needs to perform a search. `ai.is_search_required`
 *
 * Attribute Value Type: `boolean` {@link AI_IS_SEARCH_REQUIRED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example false
 */
declare const AI_IS_SEARCH_REQUIRED = "ai.is_search_required";
/**
 * Type for {@link AI_IS_SEARCH_REQUIRED} ai.is_search_required
 */
type AI_IS_SEARCH_REQUIRED_TYPE = boolean;
/**
 * Extra metadata passed to an AI pipeline step. `ai.metadata`
 *
 * Attribute Value Type: `string` {@link AI_METADATA_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example "{\"user_id\": 123, \"session_id\": \"abc123\"}"
 */
declare const AI_METADATA = "ai.metadata";
/**
 * Type for {@link AI_METADATA} ai.metadata
 */
type AI_METADATA_TYPE = string;
/**
 * The vendor-specific ID of the model used. `ai.model_id`
 *
 * Attribute Value Type: `string` {@link AI_MODEL_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_RESPONSE_MODEL} `gen_ai.response.model`
 *
 * @deprecated Use {@link GEN_AI_RESPONSE_MODEL} (gen_ai.response.model) instead
 * @example "gpt-4"
 */
declare const AI_MODEL_ID = "ai.model_id";
/**
 * Type for {@link AI_MODEL_ID} ai.model_id
 */
type AI_MODEL_ID_TYPE = string;
/**
 * The provider of the model. `ai.model.provider`
 *
 * Attribute Value Type: `string` {@link AI_MODEL_PROVIDER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_PROVIDER_NAME} `gen_ai.provider.name`, {@link GEN_AI_SYSTEM} `gen_ai.system`
 *
 * @deprecated Use {@link GEN_AI_PROVIDER_NAME} (gen_ai.provider.name) instead
 * @example "openai"
 */
declare const AI_MODEL_PROVIDER = "ai.model.provider";
/**
 * Type for {@link AI_MODEL_PROVIDER} ai.model.provider
 */
type AI_MODEL_PROVIDER_TYPE = string;
/**
 * The name of the AI pipeline. `ai.pipeline.name`
 *
 * Attribute Value Type: `string` {@link AI_PIPELINE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_PIPELINE_NAME} `gen_ai.pipeline.name`
 *
 * @deprecated Use {@link GEN_AI_PIPELINE_NAME} (gen_ai.pipeline.name) instead
 * @example "Autofix Pipeline"
 */
declare const AI_PIPELINE_NAME = "ai.pipeline.name";
/**
 * Type for {@link AI_PIPELINE_NAME} ai.pipeline.name
 */
type AI_PIPELINE_NAME_TYPE = string;
/**
 * For an AI model call, the preamble parameter. Preambles are a part of the prompt used to adjust the model's overall behavior and conversation style. `ai.preamble`
 *
 * Attribute Value Type: `string` {@link AI_PREAMBLE_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_SYSTEM_INSTRUCTIONS} `gen_ai.system_instructions`
 *
 * @deprecated Use {@link GEN_AI_SYSTEM_INSTRUCTIONS} (gen_ai.system_instructions) instead
 * @example "You are now a clown."
 */
declare const AI_PREAMBLE = "ai.preamble";
/**
 * Type for {@link AI_PREAMBLE} ai.preamble
 */
type AI_PREAMBLE_TYPE = string;
/**
 * Used to reduce repetitiveness of generated tokens. Similar to frequency_penalty, except that this penalty is applied equally to all tokens that have already appeared, regardless of their exact frequencies. `ai.presence_penalty`
 *
 * Attribute Value Type: `number` {@link AI_PRESENCE_PENALTY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_PRESENCE_PENALTY} `gen_ai.request.presence_penalty`
 *
 * @deprecated Use {@link GEN_AI_REQUEST_PRESENCE_PENALTY} (gen_ai.request.presence_penalty) instead
 * @example 0.5
 */
declare const AI_PRESENCE_PENALTY = "ai.presence_penalty";
/**
 * Type for {@link AI_PRESENCE_PENALTY} ai.presence_penalty
 */
type AI_PRESENCE_PENALTY_TYPE = number;
/**
 * The number of tokens used to process just the prompt. `ai.prompt_tokens.used`
 *
 * Attribute Value Type: `number` {@link AI_PROMPT_TOKENS_USED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_PROMPT_TOKENS} `gen_ai.usage.prompt_tokens`, {@link GEN_AI_USAGE_INPUT_TOKENS} `gen_ai.usage.input_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_INPUT_TOKENS} (gen_ai.usage.input_tokens) instead
 * @example 20
 */
declare const AI_PROMPT_TOKENS_USED = "ai.prompt_tokens.used";
/**
 * Type for {@link AI_PROMPT_TOKENS_USED} ai.prompt_tokens.used
 */
type AI_PROMPT_TOKENS_USED_TYPE = number;
/**
 * When enabled, the user’s prompt will be sent to the model without any pre-processing. `ai.raw_prompting`
 *
 * Attribute Value Type: `boolean` {@link AI_RAW_PROMPTING_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example true
 */
declare const AI_RAW_PROMPTING = "ai.raw_prompting";
/**
 * Type for {@link AI_RAW_PROMPTING} ai.raw_prompting
 */
type AI_RAW_PROMPTING_TYPE = boolean;
/**
 * The response messages sent back by the AI model. `ai.responses`
 *
 * Attribute Value Type: `Array<string>` {@link AI_RESPONSES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_OUTPUT_MESSAGES} (gen_ai.output.messages) instead
 * @example ["hello","world"]
 */
declare const AI_RESPONSES = "ai.responses";
/**
 * Type for {@link AI_RESPONSES} ai.responses
 */
type AI_RESPONSES_TYPE = Array<string>;
/**
 * For an AI model call, the format of the response `ai.response_format`
 *
 * Attribute Value Type: `string` {@link AI_RESPONSE_FORMAT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example "json_object"
 */
declare const AI_RESPONSE_FORMAT = "ai.response_format";
/**
 * Type for {@link AI_RESPONSE_FORMAT} ai.response_format
 */
type AI_RESPONSE_FORMAT_TYPE = string;
/**
 * Queries used to search for relevant context or documents. `ai.search_queries`
 *
 * Attribute Value Type: `Array<string>` {@link AI_SEARCH_QUERIES_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example ["climate change effects","renewable energy"]
 */
declare const AI_SEARCH_QUERIES = "ai.search_queries";
/**
 * Type for {@link AI_SEARCH_QUERIES} ai.search_queries
 */
type AI_SEARCH_QUERIES_TYPE = Array<string>;
/**
 * Results returned from search queries for context. `ai.search_results`
 *
 * Attribute Value Type: `Array<string>` {@link AI_SEARCH_RESULTS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example ["search_result_1, search_result_2"]
 */
declare const AI_SEARCH_RESULTS = "ai.search_results";
/**
 * Type for {@link AI_SEARCH_RESULTS} ai.search_results
 */
type AI_SEARCH_RESULTS_TYPE = Array<string>;
/**
 * The seed, ideally models given the same seed and same other parameters will produce the exact same output. `ai.seed`
 *
 * Attribute Value Type: `string` {@link AI_SEED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_SEED} `gen_ai.request.seed`
 *
 * @deprecated Use {@link GEN_AI_REQUEST_SEED} (gen_ai.request.seed) instead
 * @example "1234567890"
 */
declare const AI_SEED = "ai.seed";
/**
 * Type for {@link AI_SEED} ai.seed
 */
type AI_SEED_TYPE = string;
/**
 * Whether the request was streamed back. `ai.streaming`
 *
 * Attribute Value Type: `boolean` {@link AI_STREAMING_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_RESPONSE_STREAMING} `gen_ai.response.streaming`
 *
 * @deprecated Use {@link GEN_AI_RESPONSE_STREAMING} (gen_ai.response.streaming) instead
 * @example true
 */
declare const AI_STREAMING = "ai.streaming";
/**
 * Type for {@link AI_STREAMING} ai.streaming
 */
type AI_STREAMING_TYPE = boolean;
/**
 * Tags that describe an AI pipeline step. `ai.tags`
 *
 * Attribute Value Type: `string` {@link AI_TAGS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example "{\"executed_function\": \"add_integers\"}"
 */
declare const AI_TAGS = "ai.tags";
/**
 * Type for {@link AI_TAGS} ai.tags
 */
type AI_TAGS_TYPE = string;
/**
 * For an AI model call, the temperature parameter. Temperature essentially means how random the output will be. `ai.temperature`
 *
 * Attribute Value Type: `number` {@link AI_TEMPERATURE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_TEMPERATURE} `gen_ai.request.temperature`
 *
 * @deprecated Use {@link GEN_AI_REQUEST_TEMPERATURE} (gen_ai.request.temperature) instead
 * @example 0.1
 */
declare const AI_TEMPERATURE = "ai.temperature";
/**
 * Type for {@link AI_TEMPERATURE} ai.temperature
 */
type AI_TEMPERATURE_TYPE = number;
/**
 * Raw text inputs provided to the model. `ai.texts`
 *
 * Attribute Value Type: `Array<string>` {@link AI_TEXTS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_INPUT_MESSAGES} `gen_ai.input.messages`
 *
 * @deprecated Use {@link GEN_AI_INPUT_MESSAGES} (gen_ai.input.messages) instead
 * @example ["Hello, how are you?","What is the capital of France?"]
 */
declare const AI_TEXTS = "ai.texts";
/**
 * Type for {@link AI_TEXTS} ai.texts
 */
type AI_TEXTS_TYPE = Array<string>;
/**
 * For an AI model call, the functions that are available `ai.tools`
 *
 * Attribute Value Type: `Array<string>` {@link AI_TOOLS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_TOOL_DEFINITIONS} (gen_ai.tool.definitions) instead
 * @example ["function_1","function_2"]
 */
declare const AI_TOOLS = "ai.tools";
/**
 * Type for {@link AI_TOOLS} ai.tools
 */
type AI_TOOLS_TYPE = Array<string>;
/**
 * For an AI model call, the tool calls that were made. `ai.tool_calls`
 *
 * Attribute Value Type: `Array<string>` {@link AI_TOOL_CALLS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_OUTPUT_MESSAGES} (gen_ai.output.messages) instead
 * @example ["tool_call_1","tool_call_2"]
 */
declare const AI_TOOL_CALLS = "ai.tool_calls";
/**
 * Type for {@link AI_TOOL_CALLS} ai.tool_calls
 */
type AI_TOOL_CALLS_TYPE = Array<string>;
/**
 * Limits the model to only consider the K most likely next tokens, where K is an integer (e.g., top_k=20 means only the 20 highest probability tokens are considered). `ai.top_k`
 *
 * Attribute Value Type: `number` {@link AI_TOP_K_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_TOP_K} `gen_ai.request.top_k`
 *
 * @deprecated Use {@link GEN_AI_REQUEST_TOP_K} (gen_ai.request.top_k) instead
 * @example 35
 */
declare const AI_TOP_K = "ai.top_k";
/**
 * Type for {@link AI_TOP_K} ai.top_k
 */
type AI_TOP_K_TYPE = number;
/**
 * Limits the model to only consider tokens whose cumulative probability mass adds up to p, where p is a float between 0 and 1 (e.g., top_p=0.7 means only tokens that sum up to 70% of the probability mass are considered). `ai.top_p`
 *
 * Attribute Value Type: `number` {@link AI_TOP_P_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_REQUEST_TOP_P} `gen_ai.request.top_p`
 *
 * @deprecated Use {@link GEN_AI_REQUEST_TOP_P} (gen_ai.request.top_p) instead
 * @example 0.7
 */
declare const AI_TOP_P = "ai.top_p";
/**
 * Type for {@link AI_TOP_P} ai.top_p
 */
type AI_TOP_P_TYPE = number;
/**
 * The total cost for the tokens used. `ai.total_cost`
 *
 * Attribute Value Type: `number` {@link AI_TOTAL_COST_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_COST_TOTAL_TOKENS} `gen_ai.cost.total_tokens`
 *
 * @deprecated Use {@link GEN_AI_COST_TOTAL_TOKENS} (gen_ai.cost.total_tokens) instead
 * @example 12.34
 */
declare const AI_TOTAL_COST = "ai.total_cost";
/**
 * Type for {@link AI_TOTAL_COST} ai.total_cost
 */
type AI_TOTAL_COST_TYPE = number;
/**
 * The total number of tokens used to process the prompt. `ai.total_tokens.used`
 *
 * Attribute Value Type: `number` {@link AI_TOTAL_TOKENS_USED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_TOTAL_TOKENS} `gen_ai.usage.total_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_TOTAL_TOKENS} (gen_ai.usage.total_tokens) instead
 * @example 30
 */
declare const AI_TOTAL_TOKENS_USED = "ai.total_tokens.used";
/**
 * Type for {@link AI_TOTAL_TOKENS_USED} ai.total_tokens.used
 */
type AI_TOTAL_TOKENS_USED_TYPE = number;
/**
 * Warning messages generated during model execution. `ai.warnings`
 *
 * Attribute Value Type: `Array<string>` {@link AI_WARNINGS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example ["Token limit exceeded"]
 */
declare const AI_WARNINGS = "ai.warnings";
/**
 * Type for {@link AI_WARNINGS} ai.warnings
 */
type AI_WARNINGS_TYPE = Array<string>;
/**
 * The version of the Angular framework `angular.version`
 *
 * Attribute Value Type: `string` {@link ANGULAR_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "17.1.0"
 */
declare const ANGULAR_VERSION = "angular.version";
/**
 * Type for {@link ANGULAR_VERSION} angular.version
 */
type ANGULAR_VERSION_TYPE = string;
/**
 * Internal build identifier, as it appears on the platform. `app.app_build`
 *
 * Attribute Value Type: `string` {@link APP_APP_BUILD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_BUILD} `app.build`
 *
 * @deprecated Use {@link APP_BUILD} (app.build) instead - Deprecated in favor of app.build
 * @example "1"
 */
declare const APP_APP_BUILD = "app.app_build";
/**
 * Type for {@link APP_APP_BUILD} app.app_build
 */
type APP_APP_BUILD_TYPE = string;
/**
 * Version-independent application identifier, often a dotted bundle ID. `app.app_identifier`
 *
 * Attribute Value Type: `string` {@link APP_APP_IDENTIFIER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_IDENTIFIER} `app.identifier`
 *
 * @deprecated Use {@link APP_IDENTIFIER} (app.identifier) instead - Deprecated in favor of app.identifier
 * @example "com.example.myapp"
 */
declare const APP_APP_IDENTIFIER = "app.app_identifier";
/**
 * Type for {@link APP_APP_IDENTIFIER} app.app_identifier
 */
type APP_APP_IDENTIFIER_TYPE = string;
/**
 * Human readable application name, as it appears on the platform. `app.app_name`
 *
 * Attribute Value Type: `string` {@link APP_APP_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_NAME} `app.name`
 *
 * @deprecated Use {@link APP_NAME} (app.name) instead - Deprecated in favor of app.name
 * @example "My App"
 */
declare const APP_APP_NAME = "app.app_name";
/**
 * Type for {@link APP_APP_NAME} app.app_name
 */
type APP_APP_NAME_TYPE = string;
/**
 * Formatted UTC timestamp when the user started the application. `app.app_start_time`
 *
 * Attribute Value Type: `string` {@link APP_APP_START_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_START_TIME} `app.start_time`
 *
 * @deprecated Use {@link APP_START_TIME} (app.start_time) instead - Deprecated in favor of app.start_time
 * @example "2025-01-01T00:00:00.000Z"
 */
declare const APP_APP_START_TIME = "app.app_start_time";
/**
 * Type for {@link APP_APP_START_TIME} app.app_start_time
 */
type APP_APP_START_TIME_TYPE = string;
/**
 * Human readable application version, as it appears on the platform. `app.app_version`
 *
 * Attribute Value Type: `string` {@link APP_APP_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VERSION} `app.version`
 *
 * @deprecated Use {@link APP_VERSION} (app.version) instead - Deprecated in favor of app.version
 * @example "1.0.0"
 */
declare const APP_APP_VERSION = "app.app_version";
/**
 * Type for {@link APP_APP_VERSION} app.app_version
 */
type APP_APP_VERSION_TYPE = string;
/**
 * Internal build identifier, as it appears on the platform. `app.build`
 *
 * Attribute Value Type: `string` {@link APP_BUILD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_APP_BUILD} `app.app_build`
 *
 * @example "1"
 */
declare const APP_BUILD = "app.build";
/**
 * Type for {@link APP_BUILD} app.build
 */
type APP_BUILD_TYPE = string;
/**
 * Version-independent application identifier, often a dotted bundle ID. `app.identifier`
 *
 * Attribute Value Type: `string` {@link APP_IDENTIFIER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_APP_IDENTIFIER} `app.app_identifier`
 *
 * @example "com.example.myapp"
 */
declare const APP_IDENTIFIER = "app.identifier";
/**
 * Type for {@link APP_IDENTIFIER} app.identifier
 */
type APP_IDENTIFIER_TYPE = string;
/**
 * Whether the application is currently in the foreground. `app.in_foreground`
 *
 * Attribute Value Type: `boolean` {@link APP_IN_FOREGROUND_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const APP_IN_FOREGROUND = "app.in_foreground";
/**
 * Type for {@link APP_IN_FOREGROUND} app.in_foreground
 */
type APP_IN_FOREGROUND_TYPE = boolean;
/**
 * Human readable application name, as it appears on the platform. `app.name`
 *
 * Attribute Value Type: `string` {@link APP_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_APP_NAME} `app.app_name`
 *
 * @example "My App"
 */
declare const APP_NAME = "app.name";
/**
 * Type for {@link APP_NAME} app.name
 */
type APP_NAME_TYPE = string;
/**
 * The duration of a cold app start in milliseconds `app_start_cold`
 *
 * Attribute Value Type: `number` {@link APP_START_COLD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_START_COLD_VALUE} `app.vitals.start.cold.value`
 *
 * @deprecated Use {@link APP_VITALS_START_COLD_VALUE} (app.vitals.start.cold.value) instead - Replaced by app.vitals.start.cold.value to align with the app.vitals.* namespace for mobile performance attributes
 * @example 1234.56
 */
declare const APP_START_COLD = "app_start_cold";
/**
 * Type for {@link APP_START_COLD} app_start_cold
 */
type APP_START_COLD_TYPE = number;
/**
 * Formatted UTC timestamp when the user started the application. `app.start_time`
 *
 * Attribute Value Type: `string` {@link APP_START_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_APP_START_TIME} `app.app_start_time`
 *
 * @example "2025-01-01T00:00:00.000Z"
 */
declare const APP_START_TIME = "app.start_time";
/**
 * Type for {@link APP_START_TIME} app.start_time
 */
type APP_START_TIME_TYPE = string;
/**
 * Mobile app start variant. Either cold or warm. `app_start_type`
 *
 * Attribute Value Type: `string` {@link APP_START_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_START_TYPE} `app.vitals.start.type`
 *
 * @deprecated Use {@link APP_VITALS_START_TYPE} (app.vitals.start.type) instead - Replaced by app.vitals.start.type to align with the app.vitals.* namespace for mobile performance attributes
 * @example "cold"
 */
declare const APP_START_TYPE = "app_start_type";
/**
 * Type for {@link APP_START_TYPE} app_start_type
 */
type APP_START_TYPE_TYPE = string;
/**
 * The duration of a warm app start in milliseconds `app_start_warm`
 *
 * Attribute Value Type: `number` {@link APP_START_WARM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_START_WARM_VALUE} `app.vitals.start.warm.value`
 *
 * @deprecated Use {@link APP_VITALS_START_WARM_VALUE} (app.vitals.start.warm.value) instead - Replaced by app.vitals.start.warm.value to align with the app.vitals.* namespace for mobile performance attributes
 * @example 1234.56
 */
declare const APP_START_WARM = "app_start_warm";
/**
 * Type for {@link APP_START_WARM} app_start_warm
 */
type APP_START_WARM_TYPE = number;
/**
 * Human readable application version, as it appears on the platform. `app.version`
 *
 * Attribute Value Type: `string` {@link APP_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_APP_VERSION} `app.app_version`
 *
 * @example "1.0.0"
 */
declare const APP_VERSION = "app.version";
/**
 * Type for {@link APP_VERSION} app.version
 */
type APP_VERSION_TYPE = string;
/**
 * The sum of all delayed frame durations in seconds during the lifetime of the span. For more information see [frames delay](https://develop.sentry.dev/sdk/performance/frames-delay/). `app.vitals.frames.delay.value`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_FRAMES_DELAY_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FRAMES_DELAY} `frames.delay`
 *
 * @example 5
 */
declare const APP_VITALS_FRAMES_DELAY_VALUE = "app.vitals.frames.delay.value";
/**
 * Type for {@link APP_VITALS_FRAMES_DELAY_VALUE} app.vitals.frames.delay.value
 */
type APP_VITALS_FRAMES_DELAY_VALUE_TYPE = number;
/**
 * The number of frozen frames rendered during the lifetime of the span. `app.vitals.frames.frozen.count`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_FRAMES_FROZEN_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FRAMES_FROZEN} `frames.frozen`
 *
 * @example 3
 */
declare const APP_VITALS_FRAMES_FROZEN_COUNT = "app.vitals.frames.frozen.count";
/**
 * Type for {@link APP_VITALS_FRAMES_FROZEN_COUNT} app.vitals.frames.frozen.count
 */
type APP_VITALS_FRAMES_FROZEN_COUNT_TYPE = number;
/**
 * The number of slow frames rendered during the lifetime of the span. `app.vitals.frames.slow.count`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_FRAMES_SLOW_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FRAMES_SLOW} `frames.slow`
 *
 * @example 1
 */
declare const APP_VITALS_FRAMES_SLOW_COUNT = "app.vitals.frames.slow.count";
/**
 * Type for {@link APP_VITALS_FRAMES_SLOW_COUNT} app.vitals.frames.slow.count
 */
type APP_VITALS_FRAMES_SLOW_COUNT_TYPE = number;
/**
 * The number of total frames rendered during the lifetime of the span. `app.vitals.frames.total.count`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_FRAMES_TOTAL_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FRAMES_TOTAL} `frames.total`
 *
 * @example 60
 */
declare const APP_VITALS_FRAMES_TOTAL_COUNT = "app.vitals.frames.total.count";
/**
 * Type for {@link APP_VITALS_FRAMES_TOTAL_COUNT} app.vitals.frames.total.count
 */
type APP_VITALS_FRAMES_TOTAL_COUNT_TYPE = number;
/**
 * The duration of a cold app start in milliseconds `app.vitals.start.cold.value`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_START_COLD_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_START_COLD} `app_start_cold`
 *
 * @example 1234.56
 */
declare const APP_VITALS_START_COLD_VALUE = "app.vitals.start.cold.value";
/**
 * Type for {@link APP_VITALS_START_COLD_VALUE} app.vitals.start.cold.value
 */
type APP_VITALS_START_COLD_VALUE_TYPE = number;
/**
 * Whether the app start was prewarmed. `app.vitals.start.prewarmed`
 *
 * Attribute Value Type: `boolean` {@link APP_VITALS_START_PREWARMED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const APP_VITALS_START_PREWARMED = "app.vitals.start.prewarmed";
/**
 * Type for {@link APP_VITALS_START_PREWARMED} app.vitals.start.prewarmed
 */
type APP_VITALS_START_PREWARMED_TYPE = boolean;
/**
 * The reason that triggered the app start. `app.vitals.start.reason`
 *
 * Attribute Value Type: `string` {@link APP_VITALS_START_REASON_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "push"
 */
declare const APP_VITALS_START_REASON = "app.vitals.start.reason";
/**
 * Type for {@link APP_VITALS_START_REASON} app.vitals.start.reason
 */
type APP_VITALS_START_REASON_TYPE = string;
/**
 * The screen that is rendered when the app start is complete. This is the screen the user first sees and can interact with after launch. The absence of this attribute on the app start span indicates a background app start where no UI was rendered. `app.vitals.start.screen`
 *
 * Attribute Value Type: `string` {@link APP_VITALS_START_SCREEN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "MainActivity"
 */
declare const APP_VITALS_START_SCREEN = "app.vitals.start.screen";
/**
 * Type for {@link APP_VITALS_START_SCREEN} app.vitals.start.screen
 */
type APP_VITALS_START_SCREEN_TYPE = string;
/**
 * The type of app start, for example `cold` or `warm` `app.vitals.start.type`
 *
 * Attribute Value Type: `string` {@link APP_VITALS_START_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_START_TYPE} `app_start_type`
 *
 * @example "cold"
 */
declare const APP_VITALS_START_TYPE = "app.vitals.start.type";
/**
 * Type for {@link APP_VITALS_START_TYPE} app.vitals.start.type
 */
type APP_VITALS_START_TYPE_TYPE = string;
/**
 * The duration of a warm app start in milliseconds `app.vitals.start.warm.value`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_START_WARM_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_START_WARM} `app_start_warm`
 *
 * @example 1234.56
 */
declare const APP_VITALS_START_WARM_VALUE = "app.vitals.start.warm.value";
/**
 * Type for {@link APP_VITALS_START_WARM_VALUE} app.vitals.start.warm.value
 */
type APP_VITALS_START_WARM_VALUE_TYPE = number;
/**
 * The duration of time to full display in milliseconds `app.vitals.ttfd.value`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_TTFD_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link TIME_TO_FULL_DISPLAY} `time_to_full_display`
 *
 * @example 1234.56
 */
declare const APP_VITALS_TTFD_VALUE = "app.vitals.ttfd.value";
/**
 * Type for {@link APP_VITALS_TTFD_VALUE} app.vitals.ttfd.value
 */
type APP_VITALS_TTFD_VALUE_TYPE = number;
/**
 * The duration of time to initial display in milliseconds `app.vitals.ttid.value`
 *
 * Attribute Value Type: `number` {@link APP_VITALS_TTID_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link TIME_TO_INITIAL_DISPLAY} `time_to_initial_display`
 *
 * @example 1234.56
 */
declare const APP_VITALS_TTID_VALUE = "app.vitals.ttid.value";
/**
 * Type for {@link APP_VITALS_TTID_VALUE} app.vitals.ttid.value
 */
type APP_VITALS_TTID_VALUE_TYPE = number;
/**
 * Total number of blocking (stop-the-world) garbage collections performed by the Android Runtime `art.gc.blocking_count`
 *
 * Attribute Value Type: `number` {@link ART_GC_BLOCKING_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const ART_GC_BLOCKING_COUNT = "art.gc.blocking_count";
/**
 * Type for {@link ART_GC_BLOCKING_COUNT} art.gc.blocking_count
 */
type ART_GC_BLOCKING_COUNT_TYPE = number;
/**
 * Total time spent in blocking (stop-the-world) garbage collections by the Android Runtime, in milliseconds `art.gc.blocking_time`
 *
 * Attribute Value Type: `number` {@link ART_GC_BLOCKING_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 11.873
 */
declare const ART_GC_BLOCKING_TIME = "art.gc.blocking_time";
/**
 * Type for {@link ART_GC_BLOCKING_TIME} art.gc.blocking_time
 */
type ART_GC_BLOCKING_TIME_TYPE = number;
/**
 * Total number of garbage collections triggered as a last resort before an OutOfMemoryError by the Android Runtime `art.gc.pre_oome_count`
 *
 * Attribute Value Type: `number` {@link ART_GC_PRE_OOME_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 0
 */
declare const ART_GC_PRE_OOME_COUNT = "art.gc.pre_oome_count";
/**
 * Type for {@link ART_GC_PRE_OOME_COUNT} art.gc.pre_oome_count
 */
type ART_GC_PRE_OOME_COUNT_TYPE = number;
/**
 * Total number of garbage collections performed by the Android Runtime `art.gc.total_count`
 *
 * Attribute Value Type: `number` {@link ART_GC_TOTAL_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const ART_GC_TOTAL_COUNT = "art.gc.total_count";
/**
 * Type for {@link ART_GC_TOTAL_COUNT} art.gc.total_count
 */
type ART_GC_TOTAL_COUNT_TYPE = number;
/**
 * Total time spent in garbage collection by the Android Runtime, in milliseconds `art.gc.total_time`
 *
 * Attribute Value Type: `number` {@link ART_GC_TOTAL_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 11.807
 */
declare const ART_GC_TOTAL_TIME = "art.gc.total_time";
/**
 * Type for {@link ART_GC_TOTAL_TIME} art.gc.total_time
 */
type ART_GC_TOTAL_TIME_TYPE = number;
/**
 * Total time threads spent waiting for garbage collection to complete in the Android Runtime, in milliseconds `art.gc.waiting_time`
 *
 * Attribute Value Type: `number` {@link ART_GC_WAITING_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 8.054
 */
declare const ART_GC_WAITING_TIME = "art.gc.waiting_time";
/**
 * Type for {@link ART_GC_WAITING_TIME} art.gc.waiting_time
 */
type ART_GC_WAITING_TIME_TYPE = number;
/**
 * Free memory available to the process as reported by the Android Runtime, in bytes `art.memory.free`
 *
 * Attribute Value Type: `number` {@link ART_MEMORY_FREE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 3181568
 */
declare const ART_MEMORY_FREE = "art.memory.free";
/**
 * Type for {@link ART_MEMORY_FREE} art.memory.free
 */
type ART_MEMORY_FREE_TYPE = number;
/**
 * Free memory available before a garbage collection would be triggered by the Android Runtime, in bytes `art.memory.free_until_gc`
 *
 * Attribute Value Type: `number` {@link ART_MEMORY_FREE_UNTIL_GC_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 3181568
 */
declare const ART_MEMORY_FREE_UNTIL_GC = "art.memory.free_until_gc";
/**
 * Type for {@link ART_MEMORY_FREE_UNTIL_GC} art.memory.free_until_gc
 */
type ART_MEMORY_FREE_UNTIL_GC_TYPE = number;
/**
 * Free memory available before an OutOfMemoryError would be thrown by the Android Runtime, in bytes `art.memory.free_until_oome`
 *
 * Attribute Value Type: `number` {@link ART_MEMORY_FREE_UNTIL_OOME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 196083712
 */
declare const ART_MEMORY_FREE_UNTIL_OOME = "art.memory.free_until_oome";
/**
 * Type for {@link ART_MEMORY_FREE_UNTIL_OOME} art.memory.free_until_oome
 */
type ART_MEMORY_FREE_UNTIL_OOME_TYPE = number;
/**
 * Maximum memory the process is allowed to use as reported by the Android Runtime, in bytes `art.memory.max`
 *
 * Attribute Value Type: `number` {@link ART_MEMORY_MAX_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 201326592
 */
declare const ART_MEMORY_MAX = "art.memory.max";
/**
 * Type for {@link ART_MEMORY_MAX} art.memory.max
 */
type ART_MEMORY_MAX_TYPE = number;
/**
 * Total memory currently allocated to the process by the Android Runtime, in bytes `art.memory.total`
 *
 * Attribute Value Type: `number` {@link ART_MEMORY_TOTAL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 7774208
 */
declare const ART_MEMORY_TOTAL = "art.memory.total";
/**
 * Type for {@link ART_MEMORY_TOTAL} art.memory.total
 */
type ART_MEMORY_TOTAL_TYPE = number;
/**
 * The name of the CloudWatch Logs log group `aws.cloudwatch.logs.log_group`
 *
 * Attribute Value Type: `string` {@link AWS_CLOUDWATCH_LOGS_LOG_GROUP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "/aws/lambda/my-function"
 */
declare const AWS_CLOUDWATCH_LOGS_LOG_GROUP = "aws.cloudwatch.logs.log_group";
/**
 * Type for {@link AWS_CLOUDWATCH_LOGS_LOG_GROUP} aws.cloudwatch.logs.log_group
 */
type AWS_CLOUDWATCH_LOGS_LOG_GROUP_TYPE = string;
/**
 * The name of the CloudWatch Logs log stream `aws.cloudwatch.logs.log_stream`
 *
 * Attribute Value Type: `string` {@link AWS_CLOUDWATCH_LOGS_LOG_STREAM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "2024/01/01/[$LATEST]abcdef1234567890"
 */
declare const AWS_CLOUDWATCH_LOGS_LOG_STREAM = "aws.cloudwatch.logs.log_stream";
/**
 * Type for {@link AWS_CLOUDWATCH_LOGS_LOG_STREAM} aws.cloudwatch.logs.log_stream
 */
type AWS_CLOUDWATCH_LOGS_LOG_STREAM_TYPE = string;
/**
 * The URL to the CloudWatch Logs log group `aws.cloudwatch.logs.url`
 *
 * Attribute Value Type: `string` {@link AWS_CLOUDWATCH_LOGS_URL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/my-log-group"
 */
declare const AWS_CLOUDWATCH_LOGS_URL = "aws.cloudwatch.logs.url";
/**
 * Type for {@link AWS_CLOUDWATCH_LOGS_URL} aws.cloudwatch.logs.url
 */
type AWS_CLOUDWATCH_LOGS_URL_TYPE = string;
/**
 * The JSON-serialized value of each item in the `AttributeDefinitions` request field. `aws.dynamodb.attribute_definitions`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["{ \"AttributeName\": \"string\", \"AttributeType\": \"string\" }"]
 */
declare const AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
/**
 * Type for {@link AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS} aws.dynamodb.attribute_definitions
 */
type AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS_TYPE = Array<string>;
/**
 * The value of the `ConsistentRead` request parameter. `aws.dynamodb.consistent_read`
 *
 * Attribute Value Type: `boolean` {@link AWS_DYNAMODB_CONSISTENT_READ_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example true
 */
declare const AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
/**
 * Type for {@link AWS_DYNAMODB_CONSISTENT_READ} aws.dynamodb.consistent_read
 */
type AWS_DYNAMODB_CONSISTENT_READ_TYPE = boolean;
/**
 * The JSON-serialized value of each item in the `ConsumedCapacity` response field. `aws.dynamodb.consumed_capacity`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_DYNAMODB_CONSUMED_CAPACITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["{ \"CapacityUnits\": number, \"GlobalSecondaryIndexes\": { \"string\" : { \"CapacityUnits\": number, \"ReadCapacityUnits\": number, \"WriteCapacityUnits\": number } }, \"LocalSecondaryIndexes\": { \"string\" : { \"CapacityUnits\": number, \"ReadCapacityUnits\": number, \"WriteCapacityUnits\": number } }, \"ReadCapacityUnits\": number, \"Table\": { \"CapacityUnits\": number, \"ReadCapacityUnits\": number, \"WriteCapacityUnits\": number }, \"TableName\": \"string\", \"WriteCapacityUnits\": number }"]
 */
declare const AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
/**
 * Type for {@link AWS_DYNAMODB_CONSUMED_CAPACITY} aws.dynamodb.consumed_capacity
 */
type AWS_DYNAMODB_CONSUMED_CAPACITY_TYPE = Array<string>;
/**
 * The value of the `Count` response parameter. `aws.dynamodb.count`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 10
 */
declare const AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
/**
 * Type for {@link AWS_DYNAMODB_COUNT} aws.dynamodb.count
 */
type AWS_DYNAMODB_COUNT_TYPE = number;
/**
 * The value of the `ExclusiveStartTableName` request parameter. `aws.dynamodb.exclusive_start_table`
 *
 * Attribute Value Type: `string` {@link AWS_DYNAMODB_EXCLUSIVE_START_TABLE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Users"
 */
declare const AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
/**
 * Type for {@link AWS_DYNAMODB_EXCLUSIVE_START_TABLE} aws.dynamodb.exclusive_start_table
 */
type AWS_DYNAMODB_EXCLUSIVE_START_TABLE_TYPE = string;
/**
 * The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field. `aws.dynamodb.global_secondary_indexes`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["{ \"IndexName\": \"string\", \"KeySchema\": [ { \"AttributeName\": \"string\", \"KeyType\": \"string\" } ], \"Projection\": { \"NonKeyAttributes\": [ \"string\" ], \"ProjectionType\": \"string\" }, \"ProvisionedThroughput\": { \"ReadCapacityUnits\": number, \"WriteCapacityUnits\": number } }"]
 */
declare const AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
/**
 * Type for {@link AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES} aws.dynamodb.global_secondary_indexes
 */
type AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES_TYPE = Array<string>;
/**
 * The JSON-serialized value of each item in the `GlobalSecondaryIndexUpdates` request field. `aws.dynamodb.global_secondary_index_updates`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["{ \"Create\": { \"IndexName\": \"string\", \"KeySchema\": [ { \"AttributeName\": \"string\", \"KeyType\": \"string\" } ], \"Projection\": { \"NonKeyAttributes\": [ \"string\" ], \"ProjectionType\": \"string\" }, \"ProvisionedThroughput\": { \"ReadCapacityUnits\": number, \"WriteCapacityUnits\": number } }"]
 */
declare const AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
/**
 * Type for {@link AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES} aws.dynamodb.global_secondary_index_updates
 */
type AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES_TYPE = Array<string>;
/**
 * The value of the `IndexName` request parameter. `aws.dynamodb.index_name`
 *
 * Attribute Value Type: `string` {@link AWS_DYNAMODB_INDEX_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "name_to_group"
 */
declare const AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
/**
 * Type for {@link AWS_DYNAMODB_INDEX_NAME} aws.dynamodb.index_name
 */
type AWS_DYNAMODB_INDEX_NAME_TYPE = string;
/**
 * The JSON-serialized value of the `ItemCollectionMetrics` response field. `aws.dynamodb.item_collection_metrics`
 *
 * Attribute Value Type: `string` {@link AWS_DYNAMODB_ITEM_COLLECTION_METRICS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "{ \"string\" : [ { \"ItemCollectionKey\": { \"string\" : { \"B\": blob, \"BOOL\": boolean, \"BS\": [ blob ], \"L\": [ \"AttributeValue\" ], \"M\": { \"string\" : \"AttributeValue\" }, \"N\": \"string\", \"NS\": [ \"string\" ], \"NULL\": boolean, \"S\": \"string\", \"SS\": [ \"string\" ] } }, \"SizeEstimateRangeGB\": [ number ] } ] }"
 */
declare const AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
/**
 * Type for {@link AWS_DYNAMODB_ITEM_COLLECTION_METRICS} aws.dynamodb.item_collection_metrics
 */
type AWS_DYNAMODB_ITEM_COLLECTION_METRICS_TYPE = string;
/**
 * The value of the `Limit` request parameter. `aws.dynamodb.limit`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_LIMIT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 10
 */
declare const AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
/**
 * Type for {@link AWS_DYNAMODB_LIMIT} aws.dynamodb.limit
 */
type AWS_DYNAMODB_LIMIT_TYPE = number;
/**
 * The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field. `aws.dynamodb.local_secondary_indexes`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["{ \"IndexArn\": \"string\", \"IndexName\": \"string\", \"IndexSizeBytes\": number, \"ItemCount\": number, \"KeySchema\": [ { \"AttributeName\": \"string\", \"KeyType\": \"string\" } ], \"Projection\": { \"NonKeyAttributes\": [ \"string\" ], \"ProjectionType\": \"string\" } }"]
 */
declare const AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
/**
 * Type for {@link AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES} aws.dynamodb.local_secondary_indexes
 */
type AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES_TYPE = Array<string>;
/**
 * The value of the `ProjectionExpression` request parameter. `aws.dynamodb.projection`
 *
 * Attribute Value Type: `string` {@link AWS_DYNAMODB_PROJECTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Title, Price, Color"
 */
declare const AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
/**
 * Type for {@link AWS_DYNAMODB_PROJECTION} aws.dynamodb.projection
 */
type AWS_DYNAMODB_PROJECTION_TYPE = string;
/**
 * The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter. `aws.dynamodb.provisioned_read_capacity`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_PROVISIONED_READ_CAPACITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 1
 */
declare const AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
/**
 * Type for {@link AWS_DYNAMODB_PROVISIONED_READ_CAPACITY} aws.dynamodb.provisioned_read_capacity
 */
type AWS_DYNAMODB_PROVISIONED_READ_CAPACITY_TYPE = number;
/**
 * The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter. `aws.dynamodb.provisioned_write_capacity`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 2
 */
declare const AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
/**
 * Type for {@link AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY} aws.dynamodb.provisioned_write_capacity
 */
type AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY_TYPE = number;
/**
 * The value of the `ScannedCount` response parameter. `aws.dynamodb.scanned_count`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_SCANNED_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 50
 */
declare const AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
/**
 * Type for {@link AWS_DYNAMODB_SCANNED_COUNT} aws.dynamodb.scanned_count
 */
type AWS_DYNAMODB_SCANNED_COUNT_TYPE = number;
/**
 * The value of the `ScanIndexForward` request parameter. `aws.dynamodb.scan_forward`
 *
 * Attribute Value Type: `boolean` {@link AWS_DYNAMODB_SCAN_FORWARD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example true
 */
declare const AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
/**
 * Type for {@link AWS_DYNAMODB_SCAN_FORWARD} aws.dynamodb.scan_forward
 */
type AWS_DYNAMODB_SCAN_FORWARD_TYPE = boolean;
/**
 * The value of the `Segment` request parameter. `aws.dynamodb.segment`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_SEGMENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 10
 */
declare const AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
/**
 * Type for {@link AWS_DYNAMODB_SEGMENT} aws.dynamodb.segment
 */
type AWS_DYNAMODB_SEGMENT_TYPE = number;
/**
 * The value of the `Select` request parameter. `aws.dynamodb.select`
 *
 * Attribute Value Type: `string` {@link AWS_DYNAMODB_SELECT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "ALL_ATTRIBUTES"
 */
declare const AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
/**
 * Type for {@link AWS_DYNAMODB_SELECT} aws.dynamodb.select
 */
type AWS_DYNAMODB_SELECT_TYPE = string;
/**
 * The number of items in the `TableNames` response parameter. `aws.dynamodb.table_count`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_TABLE_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 20
 */
declare const AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
/**
 * Type for {@link AWS_DYNAMODB_TABLE_COUNT} aws.dynamodb.table_count
 */
type AWS_DYNAMODB_TABLE_COUNT_TYPE = number;
/**
 * The keys in the `RequestItems` object field. `aws.dynamodb.table_names`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_DYNAMODB_TABLE_NAMES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["Users","Cats"]
 */
declare const AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
/**
 * Type for {@link AWS_DYNAMODB_TABLE_NAMES} aws.dynamodb.table_names
 */
type AWS_DYNAMODB_TABLE_NAMES_TYPE = Array<string>;
/**
 * The value of the `TotalSegments` request parameter. `aws.dynamodb.total_segments`
 *
 * Attribute Value Type: `number` {@link AWS_DYNAMODB_TOTAL_SEGMENTS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 100
 */
declare const AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
/**
 * Type for {@link AWS_DYNAMODB_TOTAL_SEGMENTS} aws.dynamodb.total_segments
 */
type AWS_DYNAMODB_TOTAL_SEGMENTS_TYPE = number;
/**
 * The AWS extended request ID as returned in the response headers. `aws.extended_request_id`
 *
 * Attribute Value Type: `string` {@link AWS_EXTENDED_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AWS_REQUEST_EXTENDED_ID} `aws.request.extended_id`
 *
 * @example "wzHcyEWfmOGDIE5QOhTAqFDoDWP3y8IUvpNINCwL9N4TEHbUw0/gZJ+VZTmCNCWR7fezEN3eCiQ="
 */
declare const AWS_EXTENDED_REQUEST_ID = "aws.extended_request_id";
/**
 * Type for {@link AWS_EXTENDED_REQUEST_ID} aws.extended_request_id
 */
type AWS_EXTENDED_REQUEST_ID_TYPE = string;
/**
 * The name of the AWS Kinesis stream the request refers to. `aws.kinesis.stream_name`
 *
 * Attribute Value Type: `string` {@link AWS_KINESIS_STREAM_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link _AWS_KINESIS_STREAM_NAME} `aws.kinesis.stream.name`
 *
 * @example "some-stream-name"
 */
declare const AWS_KINESIS_STREAM_NAME = "aws.kinesis.stream_name";
/**
 * Type for {@link AWS_KINESIS_STREAM_NAME} aws.kinesis.stream_name
 */
type AWS_KINESIS_STREAM_NAME_TYPE = string;
/**
 * The name of the AWS Kinesis stream the request refers to. `aws.kinesis.stream.name`
 *
 * Attribute Value Type: `string` {@link _AWS_KINESIS_STREAM_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AWS_KINESIS_STREAM_NAME} `aws.kinesis.stream_name`
 *
 * @deprecated Use {@link AWS_KINESIS_STREAM_NAME} (aws.kinesis.stream_name) instead - This attribute is being deprecated in favor of aws.kinesis.stream_name, which is the OTel-aligned replacement.
 * @example "some-stream-name"
 */
declare const _AWS_KINESIS_STREAM_NAME = "aws.kinesis.stream.name";
/**
 * Type for {@link _AWS_KINESIS_STREAM_NAME} aws.kinesis.stream.name
 */
type _AWS_KINESIS_STREAM_NAME_TYPE = string;
/**
 * The AWS request ID as received by the Lambda function runtime `aws.lambda.aws_request_id`
 *
 * Attribute Value Type: `string` {@link AWS_LAMBDA_AWS_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FAAS_INVOCATION_ID} `faas.invocation_id`, {@link FAAS_EXECUTION} `faas.execution`
 *
 * @deprecated Use {@link FAAS_INVOCATION_ID} (faas.invocation_id) instead - This attribute is being deprecated in favor of faas.invocation_id
 * @example "8476a536-e9f4-11e8-9739-2dfe598c3fcd"
 */
declare const AWS_LAMBDA_AWS_REQUEST_ID = "aws.lambda.aws_request_id";
/**
 * Type for {@link AWS_LAMBDA_AWS_REQUEST_ID} aws.lambda.aws_request_id
 */
type AWS_LAMBDA_AWS_REQUEST_ID_TYPE = string;
/**
 * The execution duration of the Lambda function invocation in milliseconds `aws.lambda.execution_duration_in_millis`
 *
 * Attribute Value Type: `number` {@link AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1234.56
 */
declare const AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS = "aws.lambda.execution_duration_in_millis";
/**
 * Type for {@link AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS} aws.lambda.execution_duration_in_millis
 */
type AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS_TYPE = number;
/**
 * The name of the Lambda function `aws.lambda.function_name`
 *
 * Attribute Value Type: `string` {@link AWS_LAMBDA_FUNCTION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FAAS_NAME} `faas.name`
 *
 * @deprecated Use {@link FAAS_NAME} (faas.name) instead - Use the OTel-aligned faas.name attribute instead
 * @example "my-function"
 */
declare const AWS_LAMBDA_FUNCTION_NAME = "aws.lambda.function_name";
/**
 * Type for {@link AWS_LAMBDA_FUNCTION_NAME} aws.lambda.function_name
 */
type AWS_LAMBDA_FUNCTION_NAME_TYPE = string;
/**
 * The version of the Lambda function `aws.lambda.function_version`
 *
 * Attribute Value Type: `string` {@link AWS_LAMBDA_FUNCTION_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FAAS_VERSION} `faas.version`
 *
 * @deprecated Use {@link FAAS_VERSION} (faas.version) instead - Use the OTel-aligned faas.version attribute instead
 * @example "$LATEST"
 */
declare const AWS_LAMBDA_FUNCTION_VERSION = "aws.lambda.function_version";
/**
 * Type for {@link AWS_LAMBDA_FUNCTION_VERSION} aws.lambda.function_version
 */
type AWS_LAMBDA_FUNCTION_VERSION_TYPE = string;
/**
 * The full ARN of the Lambda function that was invoked `aws.lambda.invoked_arn`
 *
 * Attribute Value Type: `string` {@link AWS_LAMBDA_INVOKED_ARN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AWS_LAMBDA_INVOKED_FUNCTION_ARN} `aws.lambda.invoked_function_arn`
 *
 * @example "arn:aws:lambda:us-east-1:123456789012:function:my-function"
 */
declare const AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
/**
 * Type for {@link AWS_LAMBDA_INVOKED_ARN} aws.lambda.invoked_arn
 */
type AWS_LAMBDA_INVOKED_ARN_TYPE = string;
/**
 * The full ARN of the Lambda function that was invoked `aws.lambda.invoked_function_arn`
 *
 * Attribute Value Type: `string` {@link AWS_LAMBDA_INVOKED_FUNCTION_ARN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AWS_LAMBDA_INVOKED_ARN} `aws.lambda.invoked_arn`
 *
 * @deprecated Use {@link AWS_LAMBDA_INVOKED_ARN} (aws.lambda.invoked_arn) instead - This attribute is being deprecated in favor of aws.lambda.invoked_arn
 * @example "arn:aws:lambda:us-east-1:123456789012:function:my-function"
 */
declare const AWS_LAMBDA_INVOKED_FUNCTION_ARN = "aws.lambda.invoked_function_arn";
/**
 * Type for {@link AWS_LAMBDA_INVOKED_FUNCTION_ARN} aws.lambda.invoked_function_arn
 */
type AWS_LAMBDA_INVOKED_FUNCTION_ARN_TYPE = string;
/**
 * The remaining time in milliseconds before the Lambda function times out `aws.lambda.remaining_time_in_millis`
 *
 * Attribute Value Type: `number` {@link AWS_LAMBDA_REMAINING_TIME_IN_MILLIS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 5000
 */
declare const AWS_LAMBDA_REMAINING_TIME_IN_MILLIS = "aws.lambda.remaining_time_in_millis";
/**
 * Type for {@link AWS_LAMBDA_REMAINING_TIME_IN_MILLIS} aws.lambda.remaining_time_in_millis
 */
type AWS_LAMBDA_REMAINING_TIME_IN_MILLIS_TYPE = number;
/**
 * The name(s) of the AWS log group(s) an application is writing to. `aws.log.group.names`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_LOG_GROUP_NAMES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["/aws/lambda/my-function","opentelemetry-service"]
 */
declare const AWS_LOG_GROUP_NAMES = "aws.log.group.names";
/**
 * Type for {@link AWS_LOG_GROUP_NAMES} aws.log.group.names
 */
type AWS_LOG_GROUP_NAMES_TYPE = Array<string>;
/**
 * The name(s) of the AWS log stream(s) an application is writing to. `aws.log.stream.names`
 *
 * Attribute Value Type: `Array<string>` {@link AWS_LOG_STREAM_NAMES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["logs/main/10838bed-421f-43ef-870a-f43feacbbb5b"]
 */
declare const AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
/**
 * Type for {@link AWS_LOG_STREAM_NAMES} aws.log.stream.names
 */
type AWS_LOG_STREAM_NAMES_TYPE = Array<string>;
/**
 * The AWS extended request ID as returned in the response headers. `aws.request.extended_id`
 *
 * Attribute Value Type: `string` {@link AWS_REQUEST_EXTENDED_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AWS_EXTENDED_REQUEST_ID} `aws.extended_request_id`
 *
 * @deprecated Use {@link AWS_EXTENDED_REQUEST_ID} (aws.extended_request_id) instead - This attribute is being deprecated in favor of aws.extended_request_id, which is the OTel-aligned replacement.
 * @example "wzHcyEWfmOGDIE5QOhTAqFDoDWP3y8IUvpNINCwL9N4TEHbUw0/gZJ+VZTmCNCWR7fezEN3eCiQ="
 */
declare const AWS_REQUEST_EXTENDED_ID = "aws.request.extended_id";
/**
 * Type for {@link AWS_REQUEST_EXTENDED_ID} aws.request.extended_id
 */
type AWS_REQUEST_EXTENDED_ID_TYPE = string;
/**
 * The AWS request ID as returned in the response headers. `aws.request_id`
 *
 * Attribute Value Type: `string` {@link AWS_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link _AWS_REQUEST_ID} `aws.request.id`
 *
 * @example "79b9da39-b7ae-508a-a6bc-864b2829c622"
 */
declare const AWS_REQUEST_ID = "aws.request_id";
/**
 * Type for {@link AWS_REQUEST_ID} aws.request_id
 */
type AWS_REQUEST_ID_TYPE = string;
/**
 * The AWS request ID as returned in the response headers. `aws.request.id`
 *
 * Attribute Value Type: `string` {@link _AWS_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AWS_REQUEST_ID} `aws.request_id`
 *
 * @deprecated Use {@link AWS_REQUEST_ID} (aws.request_id) instead - This attribute is being deprecated in favor of aws.request_id, which is the OTel-aligned replacement.
 * @example "79b9da39-b7ae-508a-a6bc-864b2829c622"
 */
declare const _AWS_REQUEST_ID = "aws.request.id";
/**
 * Type for {@link _AWS_REQUEST_ID} aws.request.id
 */
type _AWS_REQUEST_ID_TYPE = string;
/**
 * The S3 bucket name the request refers to. `aws.s3.bucket`
 *
 * Attribute Value Type: `string` {@link AWS_S3_BUCKET_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "ot-demo-test"
 */
declare const AWS_S3_BUCKET = "aws.s3.bucket";
/**
 * Type for {@link AWS_S3_BUCKET} aws.s3.bucket
 */
type AWS_S3_BUCKET_TYPE = string;
/**
 * The ARN of the Secret stored in Secrets Manager. `aws.secretsmanager.secret.arn`
 *
 * Attribute Value Type: `string` {@link AWS_SECRETSMANAGER_SECRET_ARN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-6RandomCharacters"
 */
declare const AWS_SECRETSMANAGER_SECRET_ARN = "aws.secretsmanager.secret.arn";
/**
 * Type for {@link AWS_SECRETSMANAGER_SECRET_ARN} aws.secretsmanager.secret.arn
 */
type AWS_SECRETSMANAGER_SECRET_ARN_TYPE = string;
/**
 * The ARN of the AWS SNS Topic. An Amazon SNS topic is a logical access point that acts as a communication channel. `aws.sns.topic.arn`
 *
 * Attribute Value Type: `string` {@link AWS_SNS_TOPIC_ARN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "arn:aws:sns:us-east-1:123456789012:mystack-mytopic-NZJ5JSMVGFIE"
 */
declare const AWS_SNS_TOPIC_ARN = "aws.sns.topic.arn";
/**
 * Type for {@link AWS_SNS_TOPIC_ARN} aws.sns.topic.arn
 */
type AWS_SNS_TOPIC_ARN_TYPE = string;
/**
 * The ARN of the AWS Step Functions Activity. `aws.step_functions.activity.arn`
 *
 * Attribute Value Type: `string` {@link AWS_STEP_FUNCTIONS_ACTIVITY_ARN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "arn:aws:states:us-east-1:123456789012:activity:get-greeting"
 */
declare const AWS_STEP_FUNCTIONS_ACTIVITY_ARN = "aws.step_functions.activity.arn";
/**
 * Type for {@link AWS_STEP_FUNCTIONS_ACTIVITY_ARN} aws.step_functions.activity.arn
 */
type AWS_STEP_FUNCTIONS_ACTIVITY_ARN_TYPE = string;
/**
 * The ARN of the AWS Step Functions State Machine. `aws.step_functions.state_machine.arn`
 *
 * Attribute Value Type: `string` {@link AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "arn:aws:states:us-east-1:123456789012:stateMachine:myStateMachine:1"
 */
declare const AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN = "aws.step_functions.state_machine.arn";
/**
 * Type for {@link AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN} aws.step_functions.state_machine.arn
 */
type AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN_TYPE = string;
/**
 * Whether the main thread was blocked by the span. `blocked_main_thread`
 *
 * Attribute Value Type: `boolean` {@link BLOCKED_MAIN_THREAD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const BLOCKED_MAIN_THREAD = "blocked_main_thread";
/**
 * Type for {@link BLOCKED_MAIN_THREAD} blocked_main_thread
 */
type BLOCKED_MAIN_THREAD_TYPE = boolean;
/**
 * The name of the browser. `browser.name`
 *
 * Attribute Value Type: `string` {@link BROWSER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_BROWSER_NAME} `sentry.browser.name`
 *
 * @example "Chrome"
 */
declare const BROWSER_NAME = "browser.name";
/**
 * Type for {@link BROWSER_NAME} browser.name
 */
type BROWSER_NAME_TYPE = string;
/**
 * The time between initiating a navigation to a page and the browser activating the page `browser.performance.navigation.activation_start`
 *
 * Attribute Value Type: `number` {@link BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link PERFORMANCE_ACTIVATIONSTART} `performance.activationStart`
 *
 * @example 1.983
 */
declare const BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START = "browser.performance.navigation.activation_start";
/**
 * Type for {@link BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START} browser.performance.navigation.activation_start
 */
type BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START_TYPE = number;
/**
 * The browser's performance.timeOrigin timestamp representing the time when the pageload was initiated `browser.performance.time_origin`
 *
 * Attribute Value Type: `number` {@link BROWSER_PERFORMANCE_TIME_ORIGIN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link PERFORMANCE_TIMEORIGIN} `performance.timeOrigin`
 *
 * @example 1776185678.886
 */
declare const BROWSER_PERFORMANCE_TIME_ORIGIN = "browser.performance.time_origin";
/**
 * Type for {@link BROWSER_PERFORMANCE_TIME_ORIGIN} browser.performance.time_origin
 */
type BROWSER_PERFORMANCE_TIME_ORIGIN_TYPE = number;
/**
 * A browser report sent via reporting API.. `browser.report.type`
 *
 * Attribute Value Type: `string` {@link BROWSER_REPORT_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "network-error"
 */
declare const BROWSER_REPORT_TYPE = "browser.report.type";
/**
 * Type for {@link BROWSER_REPORT_TYPE} browser.report.type
 */
type BROWSER_REPORT_TYPE_TYPE = string;
/**
 * How a script was called in the browser. `browser.script.invoker`
 *
 * Attribute Value Type: `string` {@link BROWSER_SCRIPT_INVOKER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Window.requestAnimationFrame"
 */
declare const BROWSER_SCRIPT_INVOKER = "browser.script.invoker";
/**
 * Type for {@link BROWSER_SCRIPT_INVOKER} browser.script.invoker
 */
type BROWSER_SCRIPT_INVOKER_TYPE = string;
/**
 * Browser script entry point type. `browser.script.invoker_type`
 *
 * Attribute Value Type: `string` {@link BROWSER_SCRIPT_INVOKER_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "event-listener"
 */
declare const BROWSER_SCRIPT_INVOKER_TYPE = "browser.script.invoker_type";
/**
 * Type for {@link BROWSER_SCRIPT_INVOKER_TYPE} browser.script.invoker_type
 */
type BROWSER_SCRIPT_INVOKER_TYPE_TYPE = string;
/**
 * A number representing the script character position of the script. `browser.script.source_char_position`
 *
 * Attribute Value Type: `number` {@link BROWSER_SCRIPT_SOURCE_CHAR_POSITION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 678
 */
declare const BROWSER_SCRIPT_SOURCE_CHAR_POSITION = "browser.script.source_char_position";
/**
 * Type for {@link BROWSER_SCRIPT_SOURCE_CHAR_POSITION} browser.script.source_char_position
 */
type BROWSER_SCRIPT_SOURCE_CHAR_POSITION_TYPE = number;
/**
 * The version of the browser. `browser.version`
 *
 * Attribute Value Type: `string` {@link BROWSER_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_BROWSER_VERSION} `sentry.browser.version`
 *
 * @example "120.0.6099.130"
 */
declare const BROWSER_VERSION = "browser.version";
/**
 * Type for {@link BROWSER_VERSION} browser.version
 */
type BROWSER_VERSION_TYPE = string;
/**
 * The event that caused the SDK to report CLS (pagehide or navigation) `browser.web_vital.cls.report_event`
 *
 * Attribute Value Type: `string` {@link BROWSER_WEB_VITAL_CLS_REPORT_EVENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "navigation"
 */
declare const BROWSER_WEB_VITAL_CLS_REPORT_EVENT = "browser.web_vital.cls.report_event";
/**
 * Type for {@link BROWSER_WEB_VITAL_CLS_REPORT_EVENT} browser.web_vital.cls.report_event
 */
type BROWSER_WEB_VITAL_CLS_REPORT_EVENT_TYPE = string;
/**
 * The HTML elements or components responsible for the layout shift. <key> is a numeric index from 1 to N `browser.web_vital.cls.source.<key>`
 *
 * Attribute Value Type: `string` {@link BROWSER_WEB_VITAL_CLS_SOURCE_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * Aliases: {@link CLS_SOURCE_KEY} `cls.source.<key>`
 *
 * @example "body > div#app"
 */
declare const BROWSER_WEB_VITAL_CLS_SOURCE_KEY = "browser.web_vital.cls.source.<key>";
/**
 * Base key for {@link BROWSER_WEB_VITAL_CLS_SOURCE_KEY}. Use with a dynamic suffix, e.g. `${BROWSER_WEB_VITAL_CLS_SOURCE_KEY_BASE}.${key}`.
 */
declare const BROWSER_WEB_VITAL_CLS_SOURCE_KEY_BASE = "browser.web_vital.cls.source";
/**
 * Type for {@link BROWSER_WEB_VITAL_CLS_SOURCE_KEY} browser.web_vital.cls.source.<key>
 */
type BROWSER_WEB_VITAL_CLS_SOURCE_KEY_TYPE = string;
/**
 * The value of the recorded Cumulative Layout Shift (CLS) web vital `browser.web_vital.cls.value`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_CLS_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link CLS} `cls`
 *
 * @example 0.2361
 */
declare const BROWSER_WEB_VITAL_CLS_VALUE = "browser.web_vital.cls.value";
/**
 * Type for {@link BROWSER_WEB_VITAL_CLS_VALUE} browser.web_vital.cls.value
 */
type BROWSER_WEB_VITAL_CLS_VALUE_TYPE = number;
/**
 * The time it takes for the browser to render the first piece of meaningful content on the screen `browser.web_vital.fcp.value`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_FCP_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FCP} `fcp`
 *
 * @example 547.6951
 */
declare const BROWSER_WEB_VITAL_FCP_VALUE = "browser.web_vital.fcp.value";
/**
 * Type for {@link BROWSER_WEB_VITAL_FCP_VALUE} browser.web_vital.fcp.value
 */
type BROWSER_WEB_VITAL_FCP_VALUE_TYPE = number;
/**
 * The time in milliseconds it takes for the browser to render the first pixel on the screen `browser.web_vital.fp.value`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_FP_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FP} `fp`
 *
 * @example 477.1926
 */
declare const BROWSER_WEB_VITAL_FP_VALUE = "browser.web_vital.fp.value";
/**
 * Type for {@link BROWSER_WEB_VITAL_FP_VALUE} browser.web_vital.fp.value
 */
type BROWSER_WEB_VITAL_FP_VALUE_TYPE = number;
/**
 * The value of the recorded Interaction to Next Paint (INP) web vital `browser.web_vital.inp.value`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_INP_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link INP} `inp`
 *
 * @example 200
 */
declare const BROWSER_WEB_VITAL_INP_VALUE = "browser.web_vital.inp.value";
/**
 * Type for {@link BROWSER_WEB_VITAL_INP_VALUE} browser.web_vital.inp.value
 */
type BROWSER_WEB_VITAL_INP_VALUE_TYPE = number;
/**
 * The HTML element selector or component name for which LCP was reported `browser.web_vital.lcp.element`
 *
 * Attribute Value Type: `string` {@link BROWSER_WEB_VITAL_LCP_ELEMENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP_ELEMENT} `lcp.element`
 *
 * @example "body > div#app > div#container > div"
 */
declare const BROWSER_WEB_VITAL_LCP_ELEMENT = "browser.web_vital.lcp.element";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_ELEMENT} browser.web_vital.lcp.element
 */
type BROWSER_WEB_VITAL_LCP_ELEMENT_TYPE = string;
/**
 * The id of the dom element responsible for the largest contentful paint `browser.web_vital.lcp.id`
 *
 * Attribute Value Type: `string` {@link BROWSER_WEB_VITAL_LCP_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP_ID} `lcp.id`
 *
 * @example "#gero"
 */
declare const BROWSER_WEB_VITAL_LCP_ID = "browser.web_vital.lcp.id";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_ID} browser.web_vital.lcp.id
 */
type BROWSER_WEB_VITAL_LCP_ID_TYPE = string;
/**
 * The time it took for the LCP element to be loaded `browser.web_vital.lcp.load_time`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_LCP_LOAD_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP_LOADTIME} `lcp.loadTime`
 *
 * @example 1402
 */
declare const BROWSER_WEB_VITAL_LCP_LOAD_TIME = "browser.web_vital.lcp.load_time";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_LOAD_TIME} browser.web_vital.lcp.load_time
 */
type BROWSER_WEB_VITAL_LCP_LOAD_TIME_TYPE = number;
/**
 * The time it took for the LCP element to be rendered `browser.web_vital.lcp.render_time`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_LCP_RENDER_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP_RENDERTIME} `lcp.renderTime`
 *
 * @example 1685
 */
declare const BROWSER_WEB_VITAL_LCP_RENDER_TIME = "browser.web_vital.lcp.render_time";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_RENDER_TIME} browser.web_vital.lcp.render_time
 */
type BROWSER_WEB_VITAL_LCP_RENDER_TIME_TYPE = number;
/**
 * The event that caused the SDK to report LCP (pagehide or navigation) `browser.web_vital.lcp.report_event`
 *
 * Attribute Value Type: `string` {@link BROWSER_WEB_VITAL_LCP_REPORT_EVENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "pagehide"
 */
declare const BROWSER_WEB_VITAL_LCP_REPORT_EVENT = "browser.web_vital.lcp.report_event";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_REPORT_EVENT} browser.web_vital.lcp.report_event
 */
type BROWSER_WEB_VITAL_LCP_REPORT_EVENT_TYPE = string;
/**
 * The size of the largest contentful paint element `browser.web_vital.lcp.size`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_LCP_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP_SIZE} `lcp.size`
 *
 * @example 1024
 */
declare const BROWSER_WEB_VITAL_LCP_SIZE = "browser.web_vital.lcp.size";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_SIZE} browser.web_vital.lcp.size
 */
type BROWSER_WEB_VITAL_LCP_SIZE_TYPE = number;
/**
 * The url of the dom element responsible for the largest contentful paint `browser.web_vital.lcp.url`
 *
 * Attribute Value Type: `string` {@link BROWSER_WEB_VITAL_LCP_URL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP_URL} `lcp.url`
 *
 * @example "https://example.com/static/img.png"
 */
declare const BROWSER_WEB_VITAL_LCP_URL = "browser.web_vital.lcp.url";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_URL} browser.web_vital.lcp.url
 */
type BROWSER_WEB_VITAL_LCP_URL_TYPE = string;
/**
 * The value of the recorded Largest Contentful Paint (LCP) web vital `browser.web_vital.lcp.value`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_LCP_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link LCP} `lcp`
 *
 * @example 2500
 */
declare const BROWSER_WEB_VITAL_LCP_VALUE = "browser.web_vital.lcp.value";
/**
 * Type for {@link BROWSER_WEB_VITAL_LCP_VALUE} browser.web_vital.lcp.value
 */
type BROWSER_WEB_VITAL_LCP_VALUE_TYPE = number;
/**
 * The time it takes for the server to process the initial request and send the first byte of a response to the user's browser `browser.web_vital.ttfb.request_time`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_TTFB_REQUEST_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link TTFB_REQUESTTIME} `ttfb.requestTime`
 *
 * @example 1554.5814
 */
declare const BROWSER_WEB_VITAL_TTFB_REQUEST_TIME = "browser.web_vital.ttfb.request_time";
/**
 * Type for {@link BROWSER_WEB_VITAL_TTFB_REQUEST_TIME} browser.web_vital.ttfb.request_time
 */
type BROWSER_WEB_VITAL_TTFB_REQUEST_TIME_TYPE = number;
/**
 * The value of the recorded Time To First Byte (TTFB) web vital in Milliseconds `browser.web_vital.ttfb.value`
 *
 * Attribute Value Type: `number` {@link BROWSER_WEB_VITAL_TTFB_VALUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link TTFB} `ttfb`
 *
 * @example 194.3322
 */
declare const BROWSER_WEB_VITAL_TTFB_VALUE = "browser.web_vital.ttfb.value";
/**
 * Type for {@link BROWSER_WEB_VITAL_TTFB_VALUE} browser.web_vital.ttfb.value
 */
type BROWSER_WEB_VITAL_TTFB_VALUE_TYPE = number;
/**
 * If the cache was hit during this span. `cache.hit`
 *
 * Attribute Value Type: `boolean` {@link CACHE_HIT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const CACHE_HIT = "cache.hit";
/**
 * Type for {@link CACHE_HIT} cache.hit
 */
type CACHE_HIT_TYPE = boolean;
/**
 * The size of the requested item in the cache. In bytes. `cache.item_size`
 *
 * Attribute Value Type: `number` {@link CACHE_ITEM_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 58
 */
declare const CACHE_ITEM_SIZE = "cache.item_size";
/**
 * Type for {@link CACHE_ITEM_SIZE} cache.item_size
 */
type CACHE_ITEM_SIZE_TYPE = number;
/**
 * The key of the cache accessed. `cache.key`
 *
 * Attribute Value Type: `Array<string>` {@link CACHE_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example ["my-cache-key","my-other-cache-key"]
 */
declare const CACHE_KEY = "cache.key";
/**
 * Type for {@link CACHE_KEY} cache.key
 */
type CACHE_KEY_TYPE = Array<string>;
/**
 * The operation being performed on the cache. `cache.operation`
 *
 * Attribute Value Type: `string` {@link CACHE_OPERATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "get"
 */
declare const CACHE_OPERATION = "cache.operation";
/**
 * Type for {@link CACHE_OPERATION} cache.operation
 */
type CACHE_OPERATION_TYPE = string;
/**
 * The ttl of the cache in seconds `cache.ttl`
 *
 * Attribute Value Type: `number` {@link CACHE_TTL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 120
 */
declare const CACHE_TTL = "cache.ttl";
/**
 * Type for {@link CACHE_TTL} cache.ttl
 */
type CACHE_TTL_TYPE = number;
/**
 * If the cache operation resulted in a write to the cache. `cache.write`
 *
 * Attribute Value Type: `boolean` {@link CACHE_WRITE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const CACHE_WRITE = "cache.write";
/**
 * Type for {@link CACHE_WRITE} cache.write
 */
type CACHE_WRITE_TYPE = boolean;
/**
 * The channel name that is being used. `channel`
 *
 * Attribute Value Type: `string` {@link CHANNEL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "mail"
 */
declare const CHANNEL = "channel";
/**
 * Type for {@link CHANNEL} channel
 */
type CHANNEL_TYPE = string;
/**
 * Client address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `client.address`
 *
 * Attribute Value Type: `string` {@link CLIENT_ADDRESS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_CLIENT_IP} `http.client_ip`
 *
 * @example "example.com"
 */
declare const CLIENT_ADDRESS = "client.address";
/**
 * Type for {@link CLIENT_ADDRESS} client.address
 */
type CLIENT_ADDRESS_TYPE = string;
/**
 * Client port number. `client.port`
 *
 * Attribute Value Type: `number` {@link CLIENT_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 5432
 */
declare const CLIENT_PORT = "client.port";
/**
 * Type for {@link CLIENT_PORT} client.port
 */
type CLIENT_PORT_TYPE = number;
/**
 * The duration of a Cloudflare D1 operation. `cloudflare.d1.duration`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_D1_DURATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 543
 */
declare const CLOUDFLARE_D1_DURATION = "cloudflare.d1.duration";
/**
 * Type for {@link CLOUDFLARE_D1_DURATION} cloudflare.d1.duration
 */
type CLOUDFLARE_D1_DURATION_TYPE = number;
/**
 * The type of query executed in a Cloudflare D1 operation `cloudflare.d1.query_type`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_D1_QUERY_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link DB_OPERATION_NAME} `db.operation.name`, {@link DB_OPERATION} `db.operation`
 *
 * @deprecated Use {@link DB_OPERATION_NAME} (db.operation.name) instead
 * @example "run"
 */
declare const CLOUDFLARE_D1_QUERY_TYPE = "cloudflare.d1.query_type";
/**
 * Type for {@link CLOUDFLARE_D1_QUERY_TYPE} cloudflare.d1.query_type
 */
type CLOUDFLARE_D1_QUERY_TYPE_TYPE = string;
/**
 * The number of rows read in a Cloudflare D1 operation. `cloudflare.d1.rows_read`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_D1_ROWS_READ_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12
 */
declare const CLOUDFLARE_D1_ROWS_READ = "cloudflare.d1.rows_read";
/**
 * Type for {@link CLOUDFLARE_D1_ROWS_READ} cloudflare.d1.rows_read
 */
type CLOUDFLARE_D1_ROWS_READ_TYPE = number;
/**
 * The number of rows written in a Cloudflare D1 operation. `cloudflare.d1.rows_written`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_D1_ROWS_WRITTEN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12
 */
declare const CLOUDFLARE_D1_ROWS_WRITTEN = "cloudflare.d1.rows_written";
/**
 * Type for {@link CLOUDFLARE_D1_ROWS_WRITTEN} cloudflare.d1.rows_written
 */
type CLOUDFLARE_D1_ROWS_WRITTEN_TYPE = number;
/**
 * The number of bound parameters passed to the SQL exec call. `cloudflare.durable_object.query.bindings`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2
 */
declare const CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS = "cloudflare.durable_object.query.bindings";
/**
 * Type for {@link CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS} cloudflare.durable_object.query.bindings
 */
type CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS_TYPE = number;
/**
 * The number of rows read by a Cloudflare Durable Object SQL operation. `cloudflare.durable_object.response.rows_read`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12
 */
declare const CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ = "cloudflare.durable_object.response.rows_read";
/**
 * Type for {@link CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ} cloudflare.durable_object.response.rows_read
 */
type CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ_TYPE = number;
/**
 * The number of rows written by a Cloudflare Durable Object SQL operation. `cloudflare.durable_object.response.rows_written`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN = "cloudflare.durable_object.response.rows_written";
/**
 * Type for {@link CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN} cloudflare.durable_object.response.rows_written
 */
type CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN_TYPE = number;
/**
 * The name of the Cloudflare R2 bucket binding `cloudflare.r2.bucket`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_R2_BUCKET_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "MY_BUCKET"
 */
declare const CLOUDFLARE_R2_BUCKET = "cloudflare.r2.bucket";
/**
 * Type for {@link CLOUDFLARE_R2_BUCKET} cloudflare.r2.bucket
 */
type CLOUDFLARE_R2_BUCKET_TYPE = string;
/**
 * The R2 API operation being performed `cloudflare.r2.operation`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_R2_OPERATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "GetObject"
 */
declare const CLOUDFLARE_R2_OPERATION = "cloudflare.r2.operation";
/**
 * Type for {@link CLOUDFLARE_R2_OPERATION} cloudflare.r2.operation
 */
type CLOUDFLARE_R2_OPERATION_TYPE = string;
/**
 * The delimiter used to group objects in an R2 list operation `cloudflare.r2.request.delimiter`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_R2_REQUEST_DELIMITER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "/"
 */
declare const CLOUDFLARE_R2_REQUEST_DELIMITER = "cloudflare.r2.request.delimiter";
/**
 * Type for {@link CLOUDFLARE_R2_REQUEST_DELIMITER} cloudflare.r2.request.delimiter
 */
type CLOUDFLARE_R2_REQUEST_DELIMITER_TYPE = string;
/**
 * The object key used in the R2 operation `cloudflare.r2.request.key`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_R2_REQUEST_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "my-file.txt"
 */
declare const CLOUDFLARE_R2_REQUEST_KEY = "cloudflare.r2.request.key";
/**
 * Type for {@link CLOUDFLARE_R2_REQUEST_KEY} cloudflare.r2.request.key
 */
type CLOUDFLARE_R2_REQUEST_KEY_TYPE = string;
/**
 * The part number in a multipart upload operation `cloudflare.r2.request.part_number`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_R2_REQUEST_PART_NUMBER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const CLOUDFLARE_R2_REQUEST_PART_NUMBER = "cloudflare.r2.request.part_number";
/**
 * Type for {@link CLOUDFLARE_R2_REQUEST_PART_NUMBER} cloudflare.r2.request.part_number
 */
type CLOUDFLARE_R2_REQUEST_PART_NUMBER_TYPE = number;
/**
 * The prefix used to filter objects in an R2 list operation `cloudflare.r2.request.prefix`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_R2_REQUEST_PREFIX_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "images/"
 */
declare const CLOUDFLARE_R2_REQUEST_PREFIX = "cloudflare.r2.request.prefix";
/**
 * Type for {@link CLOUDFLARE_R2_REQUEST_PREFIX} cloudflare.r2.request.prefix
 */
type CLOUDFLARE_R2_REQUEST_PREFIX_TYPE = string;
/**
 * The current attempt number for a Cloudflare Workflow step `cloudflare.workflow.attempt`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_WORKFLOW_ATTEMPT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const CLOUDFLARE_WORKFLOW_ATTEMPT = "cloudflare.workflow.attempt";
/**
 * Type for {@link CLOUDFLARE_WORKFLOW_ATTEMPT} cloudflare.workflow.attempt
 */
type CLOUDFLARE_WORKFLOW_ATTEMPT_TYPE = number;
/**
 * The backoff strategy for Cloudflare Workflow step retries `cloudflare.workflow.retries.backoff`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "exponential"
 */
declare const CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF = "cloudflare.workflow.retries.backoff";
/**
 * Type for {@link CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF} cloudflare.workflow.retries.backoff
 */
type CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF_TYPE = string;
/**
 * The delay between Cloudflare Workflow step retries `cloudflare.workflow.retries.delay`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_WORKFLOW_RETRIES_DELAY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "5 seconds"
 */
declare const CLOUDFLARE_WORKFLOW_RETRIES_DELAY = "cloudflare.workflow.retries.delay";
/**
 * Type for {@link CLOUDFLARE_WORKFLOW_RETRIES_DELAY} cloudflare.workflow.retries.delay
 */
type CLOUDFLARE_WORKFLOW_RETRIES_DELAY_TYPE = string;
/**
 * The maximum number of retries for a Cloudflare Workflow step `cloudflare.workflow.retries.limit`
 *
 * Attribute Value Type: `number` {@link CLOUDFLARE_WORKFLOW_RETRIES_LIMIT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 3
 */
declare const CLOUDFLARE_WORKFLOW_RETRIES_LIMIT = "cloudflare.workflow.retries.limit";
/**
 * Type for {@link CLOUDFLARE_WORKFLOW_RETRIES_LIMIT} cloudflare.workflow.retries.limit
 */
type CLOUDFLARE_WORKFLOW_RETRIES_LIMIT_TYPE = number;
/**
 * The timeout duration for a Cloudflare Workflow step `cloudflare.workflow.timeout`
 *
 * Attribute Value Type: `string` {@link CLOUDFLARE_WORKFLOW_TIMEOUT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1 minute"
 */
declare const CLOUDFLARE_WORKFLOW_TIMEOUT = "cloudflare.workflow.timeout";
/**
 * Type for {@link CLOUDFLARE_WORKFLOW_TIMEOUT} cloudflare.workflow.timeout
 */
type CLOUDFLARE_WORKFLOW_TIMEOUT_TYPE = string;
/**
 * The cloud account ID the resource is assigned to `cloud.account.id`
 *
 * Attribute Value Type: `string` {@link CLOUD_ACCOUNT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "123456789012"
 */
declare const CLOUD_ACCOUNT_ID = "cloud.account.id";
/**
 * Type for {@link CLOUD_ACCOUNT_ID} cloud.account.id
 */
type CLOUD_ACCOUNT_ID_TYPE = string;
/**
 * Cloud regions often have multiple, isolated locations known as zones to increase availability `cloud.availability_zone`
 *
 * Attribute Value Type: `string` {@link CLOUD_AVAILABILITY_ZONE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "us-east-1c"
 */
declare const CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
/**
 * Type for {@link CLOUD_AVAILABILITY_ZONE} cloud.availability_zone
 */
type CLOUD_AVAILABILITY_ZONE_TYPE = string;
/**
 * The cloud platform in use `cloud.platform`
 *
 * Attribute Value Type: `string` {@link CLOUD_PLATFORM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "aws_lambda"
 */
declare const CLOUD_PLATFORM = "cloud.platform";
/**
 * Type for {@link CLOUD_PLATFORM} cloud.platform
 */
type CLOUD_PLATFORM_TYPE = string;
/**
 * Name of the cloud provider `cloud.provider`
 *
 * Attribute Value Type: `string` {@link CLOUD_PROVIDER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "aws"
 */
declare const CLOUD_PROVIDER = "cloud.provider";
/**
 * Type for {@link CLOUD_PROVIDER} cloud.provider
 */
type CLOUD_PROVIDER_TYPE = string;
/**
 * The geographical region the resource is running `cloud.region`
 *
 * Attribute Value Type: `string` {@link CLOUD_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "us-east-1"
 */
declare const CLOUD_REGION = "cloud.region";
/**
 * Type for {@link CLOUD_REGION} cloud.region
 */
type CLOUD_REGION_TYPE = string;
/**
 * Cloud provider-specific native identifier of the monitored cloud resource `cloud.resource_id`
 *
 * Attribute Value Type: `string` {@link CLOUD_RESOURCE_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link FAAS_ID} `faas.id`
 *
 * @example "arn:aws:lambda:REGION:ACCOUNT_ID:function:my-function"
 */
declare const CLOUD_RESOURCE_ID = "cloud.resource_id";
/**
 * Type for {@link CLOUD_RESOURCE_ID} cloud.resource_id
 */
type CLOUD_RESOURCE_ID_TYPE = string;
/**
 * The value of the recorded Cumulative Layout Shift (CLS) web vital `cls`
 *
 * Attribute Value Type: `number` {@link CLS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_CLS_VALUE} `browser.web_vital.cls.value`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_CLS_VALUE} (browser.web_vital.cls.value) instead - The CLS web vital is now recorded as a browser.web_vital.cls.value attribute.
 * @example 0.2361
 */
declare const CLS = "cls";
/**
 * Type for {@link CLS} cls
 */
type CLS_TYPE = number;
/**
 * The HTML elements or components responsible for the layout shift. <key> is a numeric index from 1 to N `cls.source.<key>`
 *
 * Attribute Value Type: `string` {@link CLS_SOURCE_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * Aliases: {@link BROWSER_WEB_VITAL_CLS_SOURCE_KEY} `browser.web_vital.cls.source.<key>`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_CLS_SOURCE_KEY} (browser.web_vital.cls.source.<key>) instead - The CLS source is now recorded as a browser.web_vital.cls.source.<key> attribute.
 * @example "body > div#app"
 */
declare const CLS_SOURCE_KEY = "cls.source.<key>";
/**
 * Base key for {@link CLS_SOURCE_KEY}. Use with a dynamic suffix, e.g. `${CLS_SOURCE_KEY_BASE}.${key}`.
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_CLS_SOURCE_KEY_BASE} (browser.web_vital.cls.source) instead - The CLS source is now recorded as a browser.web_vital.cls.source.<key> attribute.
 */
declare const CLS_SOURCE_KEY_BASE = "cls.source";
/**
 * Type for {@link CLS_SOURCE_KEY} cls.source.<key>
 */
type CLS_SOURCE_KEY_TYPE = string;
/**
 * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path). `code.filepath`
 *
 * Attribute Value Type: `string` {@link CODE_FILEPATH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CODE_FILE_PATH} `code.file.path`
 *
 * @deprecated Use {@link CODE_FILE_PATH} (code.file.path) instead
 * @example "/app/myapplication/http/handler/server.py"
 */
declare const CODE_FILEPATH = "code.filepath";
/**
 * Type for {@link CODE_FILEPATH} code.filepath
 */
type CODE_FILEPATH_TYPE = string;
/**
 * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path). `code.file.path`
 *
 * Attribute Value Type: `string` {@link CODE_FILE_PATH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CODE_FILEPATH} `code.filepath`
 *
 * @example "/app/myapplication/http/handler/server.py"
 */
declare const CODE_FILE_PATH = "code.file.path";
/**
 * Type for {@link CODE_FILE_PATH} code.file.path
 */
type CODE_FILE_PATH_TYPE = string;
/**
 * The method or function name, or equivalent (usually rightmost part of the code unit's name). `code.function`
 *
 * Attribute Value Type: `string` {@link CODE_FUNCTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CODE_FUNCTION_NAME} `code.function.name`
 *
 * @example "server_request"
 */
declare const CODE_FUNCTION = "code.function";
/**
 * Type for {@link CODE_FUNCTION} code.function
 */
type CODE_FUNCTION_TYPE = string;
/**
 * The method or function fully-qualified name without arguments. `code.function.name`
 *
 * Attribute Value Type: `string` {@link CODE_FUNCTION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CODE_FUNCTION} `code.function`
 *
 * @example "server_request"
 */
declare const CODE_FUNCTION_NAME = "code.function.name";
/**
 * Type for {@link CODE_FUNCTION_NAME} code.function.name
 */
type CODE_FUNCTION_NAME_TYPE = string;
/**
 * The line number in code.filepath best representing the operation. It SHOULD point within the code unit named in code.function `code.lineno`
 *
 * Attribute Value Type: `number` {@link CODE_LINENO_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CODE_LINE_NUMBER} `code.line.number`
 *
 * @deprecated Use {@link CODE_LINE_NUMBER} (code.line.number) instead
 * @example 42
 */
declare const CODE_LINENO = "code.lineno";
/**
 * Type for {@link CODE_LINENO} code.lineno
 */
type CODE_LINENO_TYPE = number;
/**
 * The line number in code.filepath best representing the operation. It SHOULD point within the code unit named in code.function `code.line.number`
 *
 * Attribute Value Type: `number` {@link CODE_LINE_NUMBER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CODE_LINENO} `code.lineno`
 *
 * @example 42
 */
declare const CODE_LINE_NUMBER = "code.line.number";
/**
 * Type for {@link CODE_LINE_NUMBER} code.line.number
 */
type CODE_LINE_NUMBER_TYPE = number;
/**
 * The 'namespace' within which code.function is defined. Usually the qualified class or module name, such that code.namespace + some separator + code.function form a unique identifier for the code unit. `code.namespace`
 *
 * Attribute Value Type: `string` {@link CODE_NAMESPACE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "http.handler"
 */
declare const CODE_NAMESPACE = "code.namespace";
/**
 * Type for {@link CODE_NAMESPACE} code.namespace
 */
type CODE_NAMESPACE_TYPE = string;
/**
 * Specifies the type of the current connection (e.g. wifi, ethernet, cellular , etc). `connectionType`
 *
 * Attribute Value Type: `string` {@link CONNECTIONTYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NETWORK_CONNECTION_TYPE} `network.connection.type`, {@link DEVICE_CONNECTION_TYPE} `device.connection_type`
 *
 * @deprecated Use {@link NETWORK_CONNECTION_TYPE} (network.connection.type) instead - Old namespace-less attribute, to be replaced with network.connection.type for span-first future
 * @example "wifi"
 */
declare const CONNECTIONTYPE = "connectionType";
/**
 * Type for {@link CONNECTIONTYPE} connectionType
 */
type CONNECTIONTYPE_TYPE = string;
/**
 * Specifies the estimated effective round-trip time of the current connection, in milliseconds. `connection.rtt`
 *
 * Attribute Value Type: `number` {@link CONNECTION_RTT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NETWORK_CONNECTION_RTT} `network.connection.rtt`
 *
 * @deprecated Use {@link NETWORK_CONNECTION_RTT} (network.connection.rtt) instead - Old attribute name (no official namespace), to be replaced with network.connection.rtt for span-first future
 * @example 100
 */
declare const CONNECTION_RTT = "connection.rtt";
/**
 * Type for {@link CONNECTION_RTT} connection.rtt
 */
type CONNECTION_RTT_TYPE = number;
/**
 * The calendar system used by the culture. `culture.calendar`
 *
 * Attribute Value Type: `string` {@link CULTURE_CALENDAR_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "GregorianCalendar"
 */
declare const CULTURE_CALENDAR = "culture.calendar";
/**
 * Type for {@link CULTURE_CALENDAR} culture.calendar
 */
type CULTURE_CALENDAR_TYPE = string;
/**
 * Human readable name of the culture. `culture.display_name`
 *
 * Attribute Value Type: `string` {@link CULTURE_DISPLAY_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "English (United States)"
 */
declare const CULTURE_DISPLAY_NAME = "culture.display_name";
/**
 * Type for {@link CULTURE_DISPLAY_NAME} culture.display_name
 */
type CULTURE_DISPLAY_NAME_TYPE = string;
/**
 * Whether the culture uses 24-hour time format. `culture.is_24_hour_format`
 *
 * Attribute Value Type: `boolean` {@link CULTURE_IS_24_HOUR_FORMAT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const CULTURE_IS_24_HOUR_FORMAT = "culture.is_24_hour_format";
/**
 * Type for {@link CULTURE_IS_24_HOUR_FORMAT} culture.is_24_hour_format
 */
type CULTURE_IS_24_HOUR_FORMAT_TYPE = boolean;
/**
 * The locale identifier following RFC 4646. `culture.locale`
 *
 * Attribute Value Type: `string` {@link CULTURE_LOCALE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "en-US"
 */
declare const CULTURE_LOCALE = "culture.locale";
/**
 * Type for {@link CULTURE_LOCALE} culture.locale
 */
type CULTURE_LOCALE_TYPE = string;
/**
 * The timezone of the culture, as a geographic timezone identifier. `culture.timezone`
 *
 * Attribute Value Type: `string` {@link CULTURE_TIMEZONE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Europe/Vienna"
 */
declare const CULTURE_TIMEZONE = "culture.timezone";
/**
 * Type for {@link CULTURE_TIMEZONE} culture.timezone
 */
type CULTURE_TIMEZONE_TYPE = string;
/**
 * The name of a collection (table, container) within the database. `db.collection.name`
 *
 * Attribute Value Type: `string` {@link DB_COLLECTION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "users"
 */
declare const DB_COLLECTION_NAME = "db.collection.name";
/**
 * Type for {@link DB_COLLECTION_NAME} db.collection.name
 */
type DB_COLLECTION_NAME_TYPE = string;
/**
 * The name of the driver used for the database connection. `db.driver.name`
 *
 * Attribute Value Type: `string` {@link DB_DRIVER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "psycopg2"
 */
declare const DB_DRIVER_NAME = "db.driver.name";
/**
 * Type for {@link DB_DRIVER_NAME} db.driver.name
 */
type DB_DRIVER_NAME_TYPE = string;
/**
 * The name of the database being accessed. `db.name`
 *
 * Attribute Value Type: `string` {@link DB_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_NAMESPACE} `db.namespace`
 *
 * @deprecated Use {@link DB_NAMESPACE} (db.namespace) instead
 * @example "customers"
 */
declare const DB_NAME = "db.name";
/**
 * Type for {@link DB_NAME} db.name
 */
type DB_NAME_TYPE = string;
/**
 * The name of the database being accessed. `db.namespace`
 *
 * Attribute Value Type: `string` {@link DB_NAMESPACE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_NAME} `db.name`
 *
 * @example "customers"
 */
declare const DB_NAMESPACE = "db.namespace";
/**
 * Type for {@link DB_NAMESPACE} db.namespace
 */
type DB_NAMESPACE_TYPE = string;
/**
 * The name of the operation being executed. `db.operation`
 *
 * Attribute Value Type: `string` {@link DB_OPERATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_OPERATION_NAME} `db.operation.name`, {@link CLOUDFLARE_D1_QUERY_TYPE} `cloudflare.d1.query_type`
 *
 * @deprecated Use {@link DB_OPERATION_NAME} (db.operation.name) instead
 * @example "SELECT"
 */
declare const DB_OPERATION = "db.operation";
/**
 * Type for {@link DB_OPERATION} db.operation
 */
type DB_OPERATION_TYPE = string;
/**
 * The number of queries included in a batch operation. Operations are only considered batches when they contain two or more operations, and so db.operation.batch.size SHOULD never be 1. `db.operation.batch.size`
 *
 * Attribute Value Type: `number` {@link DB_OPERATION_BATCH_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 3
 */
declare const DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
/**
 * Type for {@link DB_OPERATION_BATCH_SIZE} db.operation.batch.size
 */
type DB_OPERATION_BATCH_SIZE_TYPE = number;
/**
 * The name of the operation being executed. `db.operation.name`
 *
 * Attribute Value Type: `string` {@link DB_OPERATION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_OPERATION} `db.operation`, {@link CLOUDFLARE_D1_QUERY_TYPE} `cloudflare.d1.query_type`
 *
 * @example "SELECT"
 */
declare const DB_OPERATION_NAME = "db.operation.name";
/**
 * Type for {@link DB_OPERATION_NAME} db.operation.name
 */
type DB_OPERATION_NAME_TYPE = string;
/**
 * A query parameter used in db.query.text, with <key> being the parameter name, and the attribute value being a string representation of the parameter value. `db.query.parameter.<key>`
 *
 * Attribute Value Type: `string` {@link DB_QUERY_PARAMETER_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "db.query.parameter.foo='123'"
 */
declare const DB_QUERY_PARAMETER_KEY = "db.query.parameter.<key>";
/**
 * Base key for {@link DB_QUERY_PARAMETER_KEY}. Use with a dynamic suffix, e.g. `${DB_QUERY_PARAMETER_KEY_BASE}.${key}`.
 */
declare const DB_QUERY_PARAMETER_KEY_BASE = "db.query.parameter";
/**
 * Type for {@link DB_QUERY_PARAMETER_KEY} db.query.parameter.<key>
 */
type DB_QUERY_PARAMETER_KEY_TYPE = string;
/**
 * A shortened representation of operation(s) in the full query. This attribute must be low-cardinality and should only contain the operation table names. `db.query.summary`
 *
 * Attribute Value Type: `string` {@link DB_QUERY_SUMMARY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "SELECT users"
 */
declare const DB_QUERY_SUMMARY = "db.query.summary";
/**
 * Type for {@link DB_QUERY_SUMMARY} db.query.summary
 */
type DB_QUERY_SUMMARY_TYPE = string;
/**
 * The database parameterized query being executed. Any parameter values (filters, insertion values, etc) should be replaced with parameter placeholders. If applicable, use `db.query.parameter.<key>` to add the parameter value. `db.query.text`
 *
 * Attribute Value Type: `string` {@link DB_QUERY_TEXT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_STATEMENT} `db.statement`
 *
 * @example "SELECT * FROM users WHERE id = $1"
 */
declare const DB_QUERY_TEXT = "db.query.text";
/**
 * Type for {@link DB_QUERY_TEXT} db.query.text
 */
type DB_QUERY_TEXT_TYPE = string;
/**
 * The redis connection name. `db.redis.connection`
 *
 * Attribute Value Type: `string` {@link DB_REDIS_CONNECTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "my-redis-instance"
 */
declare const DB_REDIS_CONNECTION = "db.redis.connection";
/**
 * Type for {@link DB_REDIS_CONNECTION} db.redis.connection
 */
type DB_REDIS_CONNECTION_TYPE = string;
/**
 * The key the Redis command is operating on. `db.redis.key`
 *
 * Attribute Value Type: `string` {@link DB_REDIS_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "user:2047:city"
 */
declare const DB_REDIS_KEY = "db.redis.key";
/**
 * Type for {@link DB_REDIS_KEY} db.redis.key
 */
type DB_REDIS_KEY_TYPE = string;
/**
 * The array of command parameters given to a redis command. `db.redis.parameters`
 *
 * Attribute Value Type: `Array<string>` {@link DB_REDIS_PARAMETERS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example ["test","*"]
 */
declare const DB_REDIS_PARAMETERS = "db.redis.parameters";
/**
 * Type for {@link DB_REDIS_PARAMETERS} db.redis.parameters
 */
type DB_REDIS_PARAMETERS_TYPE = Array<string>;
/**
 * Database response status code. The status code returned by the database. Usually it represents an error code, but may also represent partial success, warning, or differentiate between various types of successful outcomes. `db.response.status_code`
 *
 * Attribute Value Type: `string` {@link DB_RESPONSE_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "ORA-17002"
 */
declare const DB_RESPONSE_STATUS_CODE = "db.response.status_code";
/**
 * Type for {@link DB_RESPONSE_STATUS_CODE} db.response.status_code
 */
type DB_RESPONSE_STATUS_CODE_TYPE = string;
/**
 * The array of query bindings. `db.sql.bindings`
 *
 * Attribute Value Type: `Array<string>` {@link DB_SQL_BINDINGS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link DB_QUERY_PARAMETER_KEY} (db.query.parameter.<key>) instead - Instead of adding every binding in the db.sql.bindings attribute, add them as individual entires with db.query.parameter.<key>.
 * @example ["1","foo"]
 */
declare const DB_SQL_BINDINGS = "db.sql.bindings";
/**
 * Type for {@link DB_SQL_BINDINGS} db.sql.bindings
 */
type DB_SQL_BINDINGS_TYPE = Array<string>;
/**
 * The database statement being executed. `db.statement`
 *
 * Attribute Value Type: `string` {@link DB_STATEMENT_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_QUERY_TEXT} `db.query.text`
 *
 * @deprecated Use {@link DB_QUERY_TEXT} (db.query.text) instead
 * @example "SELECT * FROM users"
 */
declare const DB_STATEMENT = "db.statement";
/**
 * Type for {@link DB_STATEMENT} db.statement
 */
type DB_STATEMENT_TYPE = string;
/**
 * The name of a stored procedure being called. `db.stored_procedure.name`
 *
 * Attribute Value Type: `string` {@link DB_STORED_PROCEDURE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "GetUserById"
 */
declare const DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
/**
 * Type for {@link DB_STORED_PROCEDURE_NAME} db.stored_procedure.name
 */
type DB_STORED_PROCEDURE_NAME_TYPE = string;
/**
 * An identifier for the database management system (DBMS) product being used. See [OpenTelemetry docs](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/database/database-spans.md#notes-and-well-known-identifiers-for-dbsystem) for a list of well-known identifiers. `db.system`
 *
 * Attribute Value Type: `string` {@link DB_SYSTEM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_SYSTEM_NAME} `db.system.name`
 *
 * @deprecated Use {@link DB_SYSTEM_NAME} (db.system.name) instead
 * @example "postgresql"
 */
declare const DB_SYSTEM = "db.system";
/**
 * Type for {@link DB_SYSTEM} db.system
 */
type DB_SYSTEM_TYPE = string;
/**
 * An identifier for the database management system (DBMS) product being used. See [OpenTelemetry docs](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/database/database-spans.md#notes-and-well-known-identifiers-for-dbsystem) for a list of well-known identifiers. `db.system.name`
 *
 * Attribute Value Type: `string` {@link DB_SYSTEM_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DB_SYSTEM} `db.system`
 *
 * @example "postgresql"
 */
declare const DB_SYSTEM_NAME = "db.system.name";
/**
 * Type for {@link DB_SYSTEM_NAME} db.system.name
 */
type DB_SYSTEM_NAME_TYPE = string;
/**
 * The database user. `db.user`
 *
 * Attribute Value Type: `string` {@link DB_USER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "fancy_user"
 */
declare const DB_USER = "db.user";
/**
 * Type for {@link DB_USER} db.user
 */
type DB_USER_TYPE = string;
/**
 * The estimated total memory capacity of the device, only a rough estimation in gigabytes. `deviceMemory`
 *
 * Attribute Value Type: `string` {@link DEVICEMEMORY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link DEVICE_MEMORY_ESTIMATED_CAPACITY} `device.memory.estimated_capacity`
 *
 * @deprecated Use {@link DEVICE_MEMORY_ESTIMATED_CAPACITY} (device.memory.estimated_capacity) instead - Old namespace-less attribute, to be replaced with device.memory.estimated_capacity for span-first future
 * @example "8 GB"
 */
declare const DEVICEMEMORY = "deviceMemory";
/**
 * Type for {@link DEVICEMEMORY} deviceMemory
 */
type DEVICEMEMORY_TYPE = string;
/**
 * The CPU architectures of the device. `device.archs`
 *
 * Attribute Value Type: `Array<string>` {@link DEVICE_ARCHS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example ["arm64-v8a","armeabi-v7a","armeabi"]
 */
declare const DEVICE_ARCHS = "device.archs";
/**
 * Type for {@link DEVICE_ARCHS} device.archs
 */
type DEVICE_ARCHS_TYPE = Array<string>;
/**
 * The battery level of the device as a percentage (0-100). `device.battery_level`
 *
 * Attribute Value Type: `number` {@link DEVICE_BATTERY_LEVEL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 100
 */
declare const DEVICE_BATTERY_LEVEL = "device.battery_level";
/**
 * Type for {@link DEVICE_BATTERY_LEVEL} device.battery_level
 */
type DEVICE_BATTERY_LEVEL_TYPE = number;
/**
 * The battery temperature of the device in Celsius. `device.battery_temperature`
 *
 * Attribute Value Type: `number` {@link DEVICE_BATTERY_TEMPERATURE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 25
 */
declare const DEVICE_BATTERY_TEMPERATURE = "device.battery_temperature";
/**
 * Type for {@link DEVICE_BATTERY_TEMPERATURE} device.battery_temperature
 */
type DEVICE_BATTERY_TEMPERATURE_TYPE = number;
/**
 * A formatted UTC timestamp when the system was booted. `device.boot_time`
 *
 * Attribute Value Type: `string` {@link DEVICE_BOOT_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "2018-02-08T12:52:12Z"
 */
declare const DEVICE_BOOT_TIME = "device.boot_time";
/**
 * Type for {@link DEVICE_BOOT_TIME} device.boot_time
 */
type DEVICE_BOOT_TIME_TYPE = string;
/**
 * The brand of the device. `device.brand`
 *
 * Attribute Value Type: `string` {@link DEVICE_BRAND_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Apple"
 */
declare const DEVICE_BRAND = "device.brand";
/**
 * Type for {@link DEVICE_BRAND} device.brand
 */
type DEVICE_BRAND_TYPE = string;
/**
 * Whether the device was charging or not. `device.charging`
 *
 * Attribute Value Type: `boolean` {@link DEVICE_CHARGING_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example false
 */
declare const DEVICE_CHARGING = "device.charging";
/**
 * Type for {@link DEVICE_CHARGING} device.charging
 */
type DEVICE_CHARGING_TYPE = boolean;
/**
 * The chipset of the device. `device.chipset`
 *
 * Attribute Value Type: `string` {@link DEVICE_CHIPSET_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Qualcomm SM8550"
 */
declare const DEVICE_CHIPSET = "device.chipset";
/**
 * Type for {@link DEVICE_CHIPSET} device.chipset
 */
type DEVICE_CHIPSET_TYPE = string;
/**
 * The classification of the device. For example, `low`, `medium`, or `high`. Typically inferred by Relay - SDKs generally do not need to set this directly. `device.class`
 *
 * Attribute Value Type: `string` {@link DEVICE_CLASS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "medium"
 */
declare const DEVICE_CLASS = "device.class";
/**
 * Type for {@link DEVICE_CLASS} device.class
 */
type DEVICE_CLASS_TYPE = string;
/**
 * The internet connection type currently being used by the device. `device.connection_type`
 *
 * Attribute Value Type: `string` {@link DEVICE_CONNECTION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NETWORK_CONNECTION_TYPE} `network.connection.type`, {@link CONNECTIONTYPE} `connectionType`
 *
 * @deprecated Use {@link NETWORK_CONNECTION_TYPE} (network.connection.type) instead - This attribute is being deprecated in favor of network.connection.type
 * @example "wifi"
 */
declare const DEVICE_CONNECTION_TYPE = "device.connection_type";
/**
 * Type for {@link DEVICE_CONNECTION_TYPE} device.connection_type
 */
type DEVICE_CONNECTION_TYPE_TYPE = string;
/**
 * A description of the CPU of the device. `device.cpu_description`
 *
 * Attribute Value Type: `string` {@link DEVICE_CPU_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Intel(R) Core(TM)2 Quad CPU Q6600 @ 2.40GHz"
 */
declare const DEVICE_CPU_DESCRIPTION = "device.cpu_description";
/**
 * Type for {@link DEVICE_CPU_DESCRIPTION} device.cpu_description
 */
type DEVICE_CPU_DESCRIPTION_TYPE = string;
/**
 * External storage free size in bytes. `device.external_free_storage`
 *
 * Attribute Value Type: `number` {@link DEVICE_EXTERNAL_FREE_STORAGE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 67108864000
 */
declare const DEVICE_EXTERNAL_FREE_STORAGE = "device.external_free_storage";
/**
 * Type for {@link DEVICE_EXTERNAL_FREE_STORAGE} device.external_free_storage
 */
type DEVICE_EXTERNAL_FREE_STORAGE_TYPE = number;
/**
 * External storage total size in bytes. `device.external_storage_size`
 *
 * Attribute Value Type: `number` {@link DEVICE_EXTERNAL_STORAGE_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 134217728000
 */
declare const DEVICE_EXTERNAL_STORAGE_SIZE = "device.external_storage_size";
/**
 * Type for {@link DEVICE_EXTERNAL_STORAGE_SIZE} device.external_storage_size
 */
type DEVICE_EXTERNAL_STORAGE_SIZE_TYPE = number;
/**
 * The family of the device. `device.family`
 *
 * Attribute Value Type: `string` {@link DEVICE_FAMILY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "iPhone"
 */
declare const DEVICE_FAMILY = "device.family";
/**
 * Type for {@link DEVICE_FAMILY} device.family
 */
type DEVICE_FAMILY_TYPE = string;
/**
 * Free system memory in bytes. `device.free_memory`
 *
 * Attribute Value Type: `number` {@link DEVICE_FREE_MEMORY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2147483648
 */
declare const DEVICE_FREE_MEMORY = "device.free_memory";
/**
 * Type for {@link DEVICE_FREE_MEMORY} device.free_memory
 */
type DEVICE_FREE_MEMORY_TYPE = number;
/**
 * Free device storage in bytes. `device.free_storage`
 *
 * Attribute Value Type: `number` {@link DEVICE_FREE_STORAGE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 107374182400
 */
declare const DEVICE_FREE_STORAGE = "device.free_storage";
/**
 * Type for {@link DEVICE_FREE_STORAGE} device.free_storage
 */
type DEVICE_FREE_STORAGE_TYPE = number;
/**
 * Unique device identifier. `device.id`
 *
 * Attribute Value Type: `string` {@link DEVICE_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 */
declare const DEVICE_ID = "device.id";
/**
 * Type for {@link DEVICE_ID} device.id
 */
type DEVICE_ID_TYPE = string;
/**
 * The locale of the device. `device.locale`
 *
 * Attribute Value Type: `string` {@link DEVICE_LOCALE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "en-US"
 */
declare const DEVICE_LOCALE = "device.locale";
/**
 * Type for {@link DEVICE_LOCALE} device.locale
 */
type DEVICE_LOCALE_TYPE = string;
/**
 * Whether the device was low on memory. `device.low_memory`
 *
 * Attribute Value Type: `boolean` {@link DEVICE_LOW_MEMORY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example false
 */
declare const DEVICE_LOW_MEMORY = "device.low_memory";
/**
 * Type for {@link DEVICE_LOW_MEMORY} device.low_memory
 */
type DEVICE_LOW_MEMORY_TYPE = boolean;
/**
 * Whether the device is in Low Power Mode. `device.low_power_mode`
 *
 * Attribute Value Type: `boolean` {@link DEVICE_LOW_POWER_MODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const DEVICE_LOW_POWER_MODE = "device.low_power_mode";
/**
 * Type for {@link DEVICE_LOW_POWER_MODE} device.low_power_mode
 */
type DEVICE_LOW_POWER_MODE_TYPE = boolean;
/**
 * The manufacturer of the device. `device.manufacturer`
 *
 * Attribute Value Type: `string` {@link DEVICE_MANUFACTURER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Google"
 */
declare const DEVICE_MANUFACTURER = "device.manufacturer";
/**
 * Type for {@link DEVICE_MANUFACTURER} device.manufacturer
 */
type DEVICE_MANUFACTURER_TYPE = string;
/**
 * The estimated total memory capacity of the device, only a rough estimation in gigabytes. Browsers report estimations in buckets of powers of 2, mostly capped at 8 GB `device.memory.estimated_capacity`
 *
 * Attribute Value Type: `number` {@link DEVICE_MEMORY_ESTIMATED_CAPACITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link DEVICEMEMORY} `deviceMemory`
 *
 * @example 8
 */
declare const DEVICE_MEMORY_ESTIMATED_CAPACITY = "device.memory.estimated_capacity";
/**
 * Type for {@link DEVICE_MEMORY_ESTIMATED_CAPACITY} device.memory.estimated_capacity
 */
type DEVICE_MEMORY_ESTIMATED_CAPACITY_TYPE = number;
/**
 * Total system memory available in bytes. `device.memory_size`
 *
 * Attribute Value Type: `number` {@link DEVICE_MEMORY_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 17179869184
 */
declare const DEVICE_MEMORY_SIZE = "device.memory_size";
/**
 * Type for {@link DEVICE_MEMORY_SIZE} device.memory_size
 */
type DEVICE_MEMORY_SIZE_TYPE = number;
/**
 * The model of the device. `device.model`
 *
 * Attribute Value Type: `string` {@link DEVICE_MODEL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "iPhone 15 Pro Max"
 */
declare const DEVICE_MODEL = "device.model";
/**
 * Type for {@link DEVICE_MODEL} device.model
 */
type DEVICE_MODEL_TYPE = string;
/**
 * An internal hardware revision to identify the device exactly. `device.model_id`
 *
 * Attribute Value Type: `string` {@link DEVICE_MODEL_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "N861AP"
 */
declare const DEVICE_MODEL_ID = "device.model_id";
/**
 * Type for {@link DEVICE_MODEL_ID} device.model_id
 */
type DEVICE_MODEL_ID_TYPE = string;
/**
 * The name of the device. On mobile, this is the user-assigned device name. On servers and desktops, this is typically the hostname. `device.name`
 *
 * Attribute Value Type: `string` {@link DEVICE_NAME_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "localhost"
 */
declare const DEVICE_NAME = "device.name";
/**
 * Type for {@link DEVICE_NAME} device.name
 */
type DEVICE_NAME_TYPE = string;
/**
 * Whether the device was online or not. `device.online`
 *
 * Attribute Value Type: `boolean` {@link DEVICE_ONLINE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const DEVICE_ONLINE = "device.online";
/**
 * Type for {@link DEVICE_ONLINE} device.online
 */
type DEVICE_ONLINE_TYPE = boolean;
/**
 * The orientation of the device, either "portrait" or "landscape". `device.orientation`
 *
 * Attribute Value Type: `string` {@link DEVICE_ORIENTATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "portrait"
 */
declare const DEVICE_ORIENTATION = "device.orientation";
/**
 * Type for {@link DEVICE_ORIENTATION} device.orientation
 */
type DEVICE_ORIENTATION_TYPE = string;
/**
 * Number of "logical processors". `device.processor_count`
 *
 * Attribute Value Type: `number` {@link DEVICE_PROCESSOR_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link HARDWARECONCURRENCY} `hardwareConcurrency`
 *
 * @example 8
 */
declare const DEVICE_PROCESSOR_COUNT = "device.processor_count";
/**
 * Type for {@link DEVICE_PROCESSOR_COUNT} device.processor_count
 */
type DEVICE_PROCESSOR_COUNT_TYPE = number;
/**
 * Processor frequency in MHz. `device.processor_frequency`
 *
 * Attribute Value Type: `number` {@link DEVICE_PROCESSOR_FREQUENCY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2400
 */
declare const DEVICE_PROCESSOR_FREQUENCY = "device.processor_frequency";
/**
 * Type for {@link DEVICE_PROCESSOR_FREQUENCY} device.processor_frequency
 */
type DEVICE_PROCESSOR_FREQUENCY_TYPE = number;
/**
 * The screen density of the device. `device.screen_density`
 *
 * Attribute Value Type: `number` {@link DEVICE_SCREEN_DENSITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2.625
 */
declare const DEVICE_SCREEN_DENSITY = "device.screen_density";
/**
 * Type for {@link DEVICE_SCREEN_DENSITY} device.screen_density
 */
type DEVICE_SCREEN_DENSITY_TYPE = number;
/**
 * The screen density in dots-per-inch (DPI) of the device. `device.screen_dpi`
 *
 * Attribute Value Type: `number` {@link DEVICE_SCREEN_DPI_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 420
 */
declare const DEVICE_SCREEN_DPI = "device.screen_dpi";
/**
 * Type for {@link DEVICE_SCREEN_DPI} device.screen_dpi
 */
type DEVICE_SCREEN_DPI_TYPE = number;
/**
 * The height of the device screen in pixels. `device.screen_height_pixels`
 *
 * Attribute Value Type: `number` {@link DEVICE_SCREEN_HEIGHT_PIXELS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2400
 */
declare const DEVICE_SCREEN_HEIGHT_PIXELS = "device.screen_height_pixels";
/**
 * Type for {@link DEVICE_SCREEN_HEIGHT_PIXELS} device.screen_height_pixels
 */
type DEVICE_SCREEN_HEIGHT_PIXELS_TYPE = number;
/**
 * The width of the device screen in pixels. `device.screen_width_pixels`
 *
 * Attribute Value Type: `number` {@link DEVICE_SCREEN_WIDTH_PIXELS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1080
 */
declare const DEVICE_SCREEN_WIDTH_PIXELS = "device.screen_width_pixels";
/**
 * Type for {@link DEVICE_SCREEN_WIDTH_PIXELS} device.screen_width_pixels
 */
type DEVICE_SCREEN_WIDTH_PIXELS_TYPE = number;
/**
 * Whether the device is a simulator or an actual device. `device.simulator`
 *
 * Attribute Value Type: `boolean` {@link DEVICE_SIMULATOR_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example false
 */
declare const DEVICE_SIMULATOR = "device.simulator";
/**
 * Type for {@link DEVICE_SIMULATOR} device.simulator
 */
type DEVICE_SIMULATOR_TYPE = boolean;
/**
 * Total device storage in bytes. `device.storage_size`
 *
 * Attribute Value Type: `number` {@link DEVICE_STORAGE_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 274877906944
 */
declare const DEVICE_STORAGE_SIZE = "device.storage_size";
/**
 * Type for {@link DEVICE_STORAGE_SIZE} device.storage_size
 */
type DEVICE_STORAGE_SIZE_TYPE = number;
/**
 * The thermal state of the device. Based on Apple's `ProcessInfo.ThermalState` enum: `nominal`, `fair`, `serious`, or `critical`. `device.thermal_state`
 *
 * Attribute Value Type: `string` {@link DEVICE_THERMAL_STATE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "nominal"
 */
declare const DEVICE_THERMAL_STATE = "device.thermal_state";
/**
 * Type for {@link DEVICE_THERMAL_STATE} device.thermal_state
 */
type DEVICE_THERMAL_STATE_TYPE = string;
/**
 * The timezone of the device. `device.timezone`
 *
 * Attribute Value Type: `string` {@link DEVICE_TIMEZONE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Europe/Vienna"
 */
declare const DEVICE_TIMEZONE = "device.timezone";
/**
 * Type for {@link DEVICE_TIMEZONE} device.timezone
 */
type DEVICE_TIMEZONE_TYPE = string;
/**
 * Memory usable for the app in bytes. `device.usable_memory`
 *
 * Attribute Value Type: `number` {@link DEVICE_USABLE_MEMORY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2147483648
 */
declare const DEVICE_USABLE_MEMORY = "device.usable_memory";
/**
 * Type for {@link DEVICE_USABLE_MEMORY} device.usable_memory
 */
type DEVICE_USABLE_MEMORY_TYPE = number;
/**
 * The sentry dist. `dist`
 *
 * Attribute Value Type: `string` {@link DIST_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_DIST} `sentry.dist`
 *
 * @deprecated Use {@link SENTRY_DIST} (sentry.dist) instead - This attribute is being deprecated in favor of sentry.dist.
 * @example "1.0"
 */
declare const DIST = "dist";
/**
 * Type for {@link DIST} dist
 */
type DIST_TYPE = string;
/**
 * Specifies the estimated effective type of the current connection (e.g. slow-2g, 2g, 3g, 4g). `effectiveConnectionType`
 *
 * Attribute Value Type: `string` {@link EFFECTIVECONNECTIONTYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NETWORK_CONNECTION_EFFECTIVE_TYPE} `network.connection.effective_type`
 *
 * @deprecated Use {@link NETWORK_CONNECTION_EFFECTIVE_TYPE} (network.connection.effective_type) instead - Old namespace-less attribute, to be replaced with network.connection.effective_type for span-first future
 * @example "4g"
 */
declare const EFFECTIVECONNECTIONTYPE = "effectiveConnectionType";
/**
 * Type for {@link EFFECTIVECONNECTIONTYPE} effectiveConnectionType
 */
type EFFECTIVECONNECTIONTYPE_TYPE = string;
/**
 * The sentry environment. `environment`
 *
 * Attribute Value Type: `string` {@link ENVIRONMENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_ENVIRONMENT} `sentry.environment`
 *
 * @deprecated Use {@link SENTRY_ENVIRONMENT} (sentry.environment) instead
 * @example "production"
 */
declare const ENVIRONMENT = "environment";
/**
 * Type for {@link ENVIRONMENT} environment
 */
type ENVIRONMENT_TYPE = string;
/**
 * Describes a class of error the operation ended with. `error.type`
 *
 * Attribute Value Type: `string` {@link ERROR_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "timeout"
 */
declare const ERROR_TYPE = "error.type";
/**
 * Type for {@link ERROR_TYPE} error.type
 */
type ERROR_TYPE_TYPE = string;
/**
 * The unique identifier for this event (log record) `event.id`
 *
 * Attribute Value Type: `number` {@link EVENT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1234567890
 */
declare const EVENT_ID = "event.id";
/**
 * Type for {@link EVENT_ID} event.id
 */
type EVENT_ID_TYPE = number;
/**
 * The name that uniquely identifies this event (log record) `event.name`
 *
 * Attribute Value Type: `string` {@link EVENT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Process Payload"
 */
declare const EVENT_NAME = "event.name";
/**
 * Type for {@link EVENT_NAME} event.name
 */
type EVENT_NAME_TYPE = string;
/**
 * SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span. `exception.escaped`
 *
 * Attribute Value Type: `boolean` {@link EXCEPTION_ESCAPED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example true
 */
declare const EXCEPTION_ESCAPED = "exception.escaped";
/**
 * Type for {@link EXCEPTION_ESCAPED} exception.escaped
 */
type EXCEPTION_ESCAPED_TYPE = boolean;
/**
 * The error message. `exception.message`
 *
 * Attribute Value Type: `string` {@link EXCEPTION_MESSAGE_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "ENOENT: no such file or directory"
 */
declare const EXCEPTION_MESSAGE = "exception.message";
/**
 * Type for {@link EXCEPTION_MESSAGE} exception.message
 */
type EXCEPTION_MESSAGE_TYPE = string;
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG. `exception.stacktrace`
 *
 * Attribute Value Type: `string` {@link EXCEPTION_STACKTRACE_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Exception in thread \"main\" java.lang.RuntimeException: Test exception\n at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\n at com.example.GenerateTrace.main(GenerateTrace.java:5)"
 */
declare const EXCEPTION_STACKTRACE = "exception.stacktrace";
/**
 * Type for {@link EXCEPTION_STACKTRACE} exception.stacktrace
 */
type EXCEPTION_STACKTRACE_TYPE = string;
/**
 * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it. `exception.type`
 *
 * Attribute Value Type: `string` {@link EXCEPTION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "OSError"
 */
declare const EXCEPTION_TYPE = "exception.type";
/**
 * Type for {@link EXCEPTION_TYPE} exception.type
 */
type EXCEPTION_TYPE_TYPE = string;
/**
 * A boolean that is true if the serverless function is executed for the first time (aka cold-start). `faas.coldstart`
 *
 * Attribute Value Type: `boolean` {@link FAAS_COLDSTART_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example true
 */
declare const FAAS_COLDSTART = "faas.coldstart";
/**
 * Type for {@link FAAS_COLDSTART} faas.coldstart
 */
type FAAS_COLDSTART_TYPE = boolean;
/**
 * A string containing the schedule period as Cron Expression. `faas.cron`
 *
 * Attribute Value Type: `string` {@link FAAS_CRON_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "0/5 * * * ? *"
 */
declare const FAAS_CRON = "faas.cron";
/**
 * Type for {@link FAAS_CRON} faas.cron
 */
type FAAS_CRON_TYPE = string;
/**
 * The duration a function took to run, in milliseconds. `faas.duration_in_ms`
 *
 * Attribute Value Type: `number` {@link FAAS_DURATION_IN_MS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 120
 */
declare const FAAS_DURATION_IN_MS = "faas.duration_in_ms";
/**
 * Type for {@link FAAS_DURATION_IN_MS} faas.duration_in_ms
 */
type FAAS_DURATION_IN_MS_TYPE = number;
/**
 * The code that's run when the cloud provider invokes your function. `faas.entry_point`
 *
 * Attribute Value Type: `string` {@link FAAS_ENTRY_POINT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "my_main_function"
 */
declare const FAAS_ENTRY_POINT = "faas.entry_point";
/**
 * Type for {@link FAAS_ENTRY_POINT} faas.entry_point
 */
type FAAS_ENTRY_POINT_TYPE = string;
/**
 * The execution ID of the current function execution. `faas.execution`
 *
 * Attribute Value Type: `string` {@link FAAS_EXECUTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link FAAS_INVOCATION_ID} `faas.invocation_id`, {@link AWS_LAMBDA_AWS_REQUEST_ID} `aws.lambda.aws_request_id`
 *
 * @deprecated Use {@link FAAS_INVOCATION_ID} (faas.invocation_id) instead - This attribute is being deprecated in favor of faas.invocation_id, which is the OTel-aligned replacement.
 * @example "af9d5aa4-a685-4c5f-a22b-444f80b3cc28"
 */
declare const FAAS_EXECUTION = "faas.execution";
/**
 * Type for {@link FAAS_EXECUTION} faas.execution
 */
type FAAS_EXECUTION_TYPE = string;
/**
 * The unique ID of the single function that this runtime instance executes. `faas.id`
 *
 * Attribute Value Type: `string` {@link FAAS_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link CLOUD_RESOURCE_ID} `cloud.resource_id`
 *
 * @deprecated Use {@link CLOUD_RESOURCE_ID} (cloud.resource_id) instead - This attribute is being deprecated in favor of cloud.resource_id, which is the OTel-aligned replacement (renamed in OTel semantic conventions v1.19.0).
 * @example "arn:aws:lambda:REGION:ACCOUNT_ID:function:my-function"
 */
declare const FAAS_ID = "faas.id";
/**
 * Type for {@link FAAS_ID} faas.id
 */
type FAAS_ID_TYPE = string;
/**
 * The Service Account (GCP), IAM Execution Role (AWS), or Managed Identity (Azure) used by the serverless function when interacting with other cloud services `faas.identity`
 *
 * Attribute Value Type: `string` {@link FAAS_IDENTITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "name@project.iam.gserviceaccount.com (GCP), arn:aws:iam::123456789012:role/role-name (AWS), 00000000-0000-0000-0000-000000000000 (Azure)"
 */
declare const FAAS_IDENTITY = "faas.identity";
/**
 * Type for {@link FAAS_IDENTITY} faas.identity
 */
type FAAS_IDENTITY_TYPE = string;
/**
 * The invocation ID of the current function invocation. `faas.invocation_id`
 *
 * Attribute Value Type: `string` {@link FAAS_INVOCATION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AWS_LAMBDA_AWS_REQUEST_ID} `aws.lambda.aws_request_id`, {@link FAAS_EXECUTION} `faas.execution`
 *
 * @example "af9d5aa4-a685-4c5f-a22b-444f80b3cc28"
 */
declare const FAAS_INVOCATION_ID = "faas.invocation_id";
/**
 * Type for {@link FAAS_INVOCATION_ID} faas.invocation_id
 */
type FAAS_INVOCATION_ID_TYPE = string;
/**
 * The name of the invoked function. `faas.invoked_name`
 *
 * Attribute Value Type: `string` {@link FAAS_INVOKED_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "my-function"
 */
declare const FAAS_INVOKED_NAME = "faas.invoked_name";
/**
 * Type for {@link FAAS_INVOKED_NAME} faas.invoked_name
 */
type FAAS_INVOKED_NAME_TYPE = string;
/**
 * The cloud provider of the invoked function. `faas.invoked_provider`
 *
 * Attribute Value Type: `string` {@link FAAS_INVOKED_PROVIDER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "aws"
 */
declare const FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
/**
 * Type for {@link FAAS_INVOKED_PROVIDER} faas.invoked_provider
 */
type FAAS_INVOKED_PROVIDER_TYPE = string;
/**
 * The cloud region of the invoked function. `faas.invoked_region`
 *
 * Attribute Value Type: `string` {@link FAAS_INVOKED_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "eu-central-1"
 */
declare const FAAS_INVOKED_REGION = "faas.invoked_region";
/**
 * Type for {@link FAAS_INVOKED_REGION} faas.invoked_region
 */
type FAAS_INVOKED_REGION_TYPE = string;
/**
 * The name of the serverless function `faas.name`
 *
 * Attribute Value Type: `string` {@link FAAS_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AWS_LAMBDA_FUNCTION_NAME} `aws.lambda.function_name`
 *
 * @example "my_function"
 */
declare const FAAS_NAME = "faas.name";
/**
 * Type for {@link FAAS_NAME} faas.name
 */
type FAAS_NAME_TYPE = string;
/**
 * A string containing the function invocation time in the ISO 8601 format expressed in UTC. `faas.time`
 *
 * Attribute Value Type: `string` {@link FAAS_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "2020-01-23T13:47:06Z"
 */
declare const FAAS_TIME = "faas.time";
/**
 * Type for {@link FAAS_TIME} faas.time
 */
type FAAS_TIME_TYPE = string;
/**
 * Type of the trigger which caused this function invocation. `faas.trigger`
 *
 * Attribute Value Type: `string` {@link FAAS_TRIGGER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "timer"
 */
declare const FAAS_TRIGGER = "faas.trigger";
/**
 * Type for {@link FAAS_TRIGGER} faas.trigger
 */
type FAAS_TRIGGER_TYPE = string;
/**
 * The version of the function that was invoked `faas.version`
 *
 * Attribute Value Type: `string` {@link FAAS_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AWS_LAMBDA_FUNCTION_VERSION} `aws.lambda.function_version`
 *
 * @example "$LATEST"
 */
declare const FAAS_VERSION = "faas.version";
/**
 * Type for {@link FAAS_VERSION} faas.version
 */
type FAAS_VERSION_TYPE = string;
/**
 * The time it takes for the browser to render the first piece of meaningful content on the screen `fcp`
 *
 * Attribute Value Type: `number` {@link FCP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_FCP_VALUE} `browser.web_vital.fcp.value`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_FCP_VALUE} (browser.web_vital.fcp.value) instead - This attribute is being deprecated in favor of browser.web_vital.fcp.value
 * @example 547.6951
 */
declare const FCP = "fcp";
/**
 * Type for {@link FCP} fcp
 */
type FCP_TYPE = number;
/**
 * An instance of a feature flag evaluation. The value of this attribute is the boolean representing the evaluation result. The <key> suffix is the name of the feature flag. `flag.evaluation.<key>`
 *
 * Attribute Value Type: `boolean` {@link FLAG_EVALUATION_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "flag.evaluation.is_new_ui=true"
 */
declare const FLAG_EVALUATION_KEY = "flag.evaluation.<key>";
/**
 * Base key for {@link FLAG_EVALUATION_KEY}. Use with a dynamic suffix, e.g. `${FLAG_EVALUATION_KEY_BASE}.${key}`.
 */
declare const FLAG_EVALUATION_KEY_BASE = "flag.evaluation";
/**
 * Type for {@link FLAG_EVALUATION_KEY} flag.evaluation.<key>
 */
type FLAG_EVALUATION_KEY_TYPE = boolean;
/**
 * The time it takes for the browser to render the first pixel on the screen `fp`
 *
 * Attribute Value Type: `number` {@link FP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_FP_VALUE} `browser.web_vital.fp.value`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_FP_VALUE} (browser.web_vital.fp.value) instead - This attribute is being deprecated in favor of browser.web_vital.fp.value
 * @example 477.1926
 */
declare const FP = "fp";
/**
 * Type for {@link FP} fp
 */
type FP_TYPE = number;
/**
 * The sum of all delayed frame durations in seconds during the lifetime of the span. For more information see [frames delay](https://develop.sentry.dev/sdk/performance/frames-delay/). `frames.delay`
 *
 * Attribute Value Type: `number` {@link FRAMES_DELAY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_FRAMES_DELAY_VALUE} `app.vitals.frames.delay.value`
 *
 * @deprecated Use {@link APP_VITALS_FRAMES_DELAY_VALUE} (app.vitals.frames.delay.value) instead - Replaced by app.vitals.frames.delay.value to align with the app.vitals.* namespace for mobile performance attributes
 * @example 5
 */
declare const FRAMES_DELAY = "frames.delay";
/**
 * Type for {@link FRAMES_DELAY} frames.delay
 */
type FRAMES_DELAY_TYPE = number;
/**
 * The number of frozen frames rendered during the lifetime of the span. `frames.frozen`
 *
 * Attribute Value Type: `number` {@link FRAMES_FROZEN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_FRAMES_FROZEN_COUNT} `app.vitals.frames.frozen.count`
 *
 * @deprecated Use {@link APP_VITALS_FRAMES_FROZEN_COUNT} (app.vitals.frames.frozen.count) instead - Replaced by app.vitals.frames.frozen.count to align with the app.vitals.* namespace for mobile performance attributes
 * @example 3
 */
declare const FRAMES_FROZEN = "frames.frozen";
/**
 * Type for {@link FRAMES_FROZEN} frames.frozen
 */
type FRAMES_FROZEN_TYPE = number;
/**
 * The rate of frozen frames, or `app_vitals.frames.frozen.count` divided by `app_vitals.frames.total.count`. This is computed by Relay. `frames_frozen_rate`
 *
 * Attribute Value Type: `number` {@link FRAMES_FROZEN_RATE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const FRAMES_FROZEN_RATE = "frames_frozen_rate";
/**
 * Type for {@link FRAMES_FROZEN_RATE} frames_frozen_rate
 */
type FRAMES_FROZEN_RATE_TYPE = number;
/**
 * The number of slow frames rendered during the lifetime of the span. `frames.slow`
 *
 * Attribute Value Type: `number` {@link FRAMES_SLOW_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_FRAMES_SLOW_COUNT} `app.vitals.frames.slow.count`
 *
 * @deprecated Use {@link APP_VITALS_FRAMES_SLOW_COUNT} (app.vitals.frames.slow.count) instead - Replaced by app.vitals.frames.slow.count to align with the app.vitals.* namespace for mobile performance attributes
 * @example 1
 */
declare const FRAMES_SLOW = "frames.slow";
/**
 * Type for {@link FRAMES_SLOW} frames.slow
 */
type FRAMES_SLOW_TYPE = number;
/**
 * The rate of slow frames, or `app_vitals.frames.slow.count` divided by `app_vitals.frames.total.count`. This is computed by Relay. `frames_slow_rate`
 *
 * Attribute Value Type: `number` {@link FRAMES_SLOW_RATE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const FRAMES_SLOW_RATE = "frames_slow_rate";
/**
 * Type for {@link FRAMES_SLOW_RATE} frames_slow_rate
 */
type FRAMES_SLOW_RATE_TYPE = number;
/**
 * The number of total frames rendered during the lifetime of the span. `frames.total`
 *
 * Attribute Value Type: `number` {@link FRAMES_TOTAL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_FRAMES_TOTAL_COUNT} `app.vitals.frames.total.count`
 *
 * @deprecated Use {@link APP_VITALS_FRAMES_TOTAL_COUNT} (app.vitals.frames.total.count) instead - Replaced by app.vitals.frames.total.count to align with the app.vitals.* namespace for mobile performance attributes
 * @example 60
 */
declare const FRAMES_TOTAL = "frames.total";
/**
 * Type for {@link FRAMES_TOTAL} frames.total
 */
type FRAMES_TOTAL_TYPE = number;
/**
 * The error message of a file system error. `fs_error`
 *
 * Attribute Value Type: `string` {@link FS_ERROR_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link ERROR_TYPE} (error.type) instead - This attribute is not part of the OpenTelemetry specification and error.type fits much better.
 * @example "ENOENT: no such file or directory"
 */
declare const FS_ERROR = "fs_error";
/**
 * Type for {@link FS_ERROR} fs_error
 */
type FS_ERROR_TYPE = string;
/**
 * The event ID from the legacy GCP Cloud Function context (1st gen) `gcp.function.context.event_id`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_EVENT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1234567890"
 */
declare const GCP_FUNCTION_CONTEXT_EVENT_ID = "gcp.function.context.event_id";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_EVENT_ID} gcp.function.context.event_id
 */
type GCP_FUNCTION_CONTEXT_EVENT_ID_TYPE = string;
/**
 * The type of the GCP Cloud Function event `gcp.function.context.event_type`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_EVENT_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "google.pubsub.topic.publish"
 */
declare const GCP_FUNCTION_CONTEXT_EVENT_TYPE = "gcp.function.context.event_type";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_EVENT_TYPE} gcp.function.context.event_type
 */
type GCP_FUNCTION_CONTEXT_EVENT_TYPE_TYPE = string;
/**
 * The unique event ID from the GCP CloudEvents context (2nd gen Cloud Functions) `gcp.function.context.id`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1234567890"
 */
declare const GCP_FUNCTION_CONTEXT_ID = "gcp.function.context.id";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_ID} gcp.function.context.id
 */
type GCP_FUNCTION_CONTEXT_ID_TYPE = string;
/**
 * The resource that triggered the GCP Cloud Function event `gcp.function.context.resource`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_RESOURCE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "projects/my-project/topics/my-topic"
 */
declare const GCP_FUNCTION_CONTEXT_RESOURCE = "gcp.function.context.resource";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_RESOURCE} gcp.function.context.resource
 */
type GCP_FUNCTION_CONTEXT_RESOURCE_TYPE = string;
/**
 * The source of the GCP Cloud Function event `gcp.function.context.source`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_SOURCE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "//pubsub.googleapis.com/projects/my-project/topics/my-topic"
 */
declare const GCP_FUNCTION_CONTEXT_SOURCE = "gcp.function.context.source";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_SOURCE} gcp.function.context.source
 */
type GCP_FUNCTION_CONTEXT_SOURCE_TYPE = string;
/**
 * The CloudEvents specification version of the GCP Cloud Function event `gcp.function.context.specversion`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_SPECVERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1.0"
 */
declare const GCP_FUNCTION_CONTEXT_SPECVERSION = "gcp.function.context.specversion";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_SPECVERSION} gcp.function.context.specversion
 */
type GCP_FUNCTION_CONTEXT_SPECVERSION_TYPE = string;
/**
 * The timestamp of the GCP Cloud Function event `gcp.function.context.time`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "2024-01-01T00:00:00.000Z"
 */
declare const GCP_FUNCTION_CONTEXT_TIME = "gcp.function.context.time";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_TIME} gcp.function.context.time
 */
type GCP_FUNCTION_CONTEXT_TIME_TYPE = string;
/**
 * The legacy timestamp of the GCP Cloud Function event `gcp.function.context.timestamp`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_TIMESTAMP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "2024-01-01T00:00:00.000Z"
 */
declare const GCP_FUNCTION_CONTEXT_TIMESTAMP = "gcp.function.context.timestamp";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_TIMESTAMP} gcp.function.context.timestamp
 */
type GCP_FUNCTION_CONTEXT_TIMESTAMP_TYPE = string;
/**
 * The type of the GCP Cloud Function event context `gcp.function.context.type`
 *
 * Attribute Value Type: `string` {@link GCP_FUNCTION_CONTEXT_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "cloud_functions.context"
 */
declare const GCP_FUNCTION_CONTEXT_TYPE = "gcp.function.context.type";
/**
 * Type for {@link GCP_FUNCTION_CONTEXT_TYPE} gcp.function.context.type
 */
type GCP_FUNCTION_CONTEXT_TYPE_TYPE = string;
/**
 * The ID of the project in GCP that this resource is associated with `gcp.project.id`
 *
 * Attribute Value Type: `string` {@link GCP_PROJECT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "my-project-123"
 */
declare const GCP_PROJECT_ID = "gcp.project.id";
/**
 * Type for {@link GCP_PROJECT_ID} gcp.project.id
 */
type GCP_PROJECT_ID_TYPE = string;
/**
 * The name of the agent being used. `gen_ai.agent.name`
 *
 * Attribute Value Type: `string` {@link GEN_AI_AGENT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "ResearchAssistant"
 */
declare const GEN_AI_AGENT_NAME = "gen_ai.agent.name";
/**
 * Type for {@link GEN_AI_AGENT_NAME} gen_ai.agent.name
 */
type GEN_AI_AGENT_NAME_TYPE = string;
/**
 * The fraction of the model context window utilized by this generation. `gen_ai.context.utilization`
 *
 * Attribute Value Type: `number` {@link GEN_AI_CONTEXT_UTILIZATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 0.75
 */
declare const GEN_AI_CONTEXT_UTILIZATION = "gen_ai.context.utilization";
/**
 * Type for {@link GEN_AI_CONTEXT_UTILIZATION} gen_ai.context.utilization
 */
type GEN_AI_CONTEXT_UTILIZATION_TYPE = number;
/**
 * The maximum context window size supported by the model for this generation. `gen_ai.context.window_size`
 *
 * Attribute Value Type: `number` {@link GEN_AI_CONTEXT_WINDOW_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 128000
 */
declare const GEN_AI_CONTEXT_WINDOW_SIZE = "gen_ai.context.window_size";
/**
 * Type for {@link GEN_AI_CONTEXT_WINDOW_SIZE} gen_ai.context.window_size
 */
type GEN_AI_CONTEXT_WINDOW_SIZE_TYPE = number;
/**
 * The unique identifier for a conversation (session, thread), used to store and correlate messages within this conversation. `gen_ai.conversation.id`
 *
 * Attribute Value Type: `string` {@link GEN_AI_CONVERSATION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "conv_5j66UpCpwteGg4YSxUnt7lPY"
 */
declare const GEN_AI_CONVERSATION_ID = "gen_ai.conversation.id";
/**
 * Type for {@link GEN_AI_CONVERSATION_ID} gen_ai.conversation.id
 */
type GEN_AI_CONVERSATION_ID_TYPE = string;
/**
 * The cost of input tokens written to cache in USD. `gen_ai.cost.cache_creation.input_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12.34
 */
declare const GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS = "gen_ai.cost.cache_creation.input_tokens";
/**
 * Type for {@link GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS} gen_ai.cost.cache_creation.input_tokens
 */
type GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS_TYPE = number;
/**
 * The cost of cached input tokens in USD. `gen_ai.cost.cache_read.input_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_COST_CACHE_READ_INPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12.34
 */
declare const GEN_AI_COST_CACHE_READ_INPUT_TOKENS = "gen_ai.cost.cache_read.input_tokens";
/**
 * Type for {@link GEN_AI_COST_CACHE_READ_INPUT_TOKENS} gen_ai.cost.cache_read.input_tokens
 */
type GEN_AI_COST_CACHE_READ_INPUT_TOKENS_TYPE = number;
/**
 * The total cost of all input tokens in USD (includes cached and cache creation tokens). `gen_ai.cost.input_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_COST_INPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 123.45
 */
declare const GEN_AI_COST_INPUT_TOKENS = "gen_ai.cost.input_tokens";
/**
 * Type for {@link GEN_AI_COST_INPUT_TOKENS} gen_ai.cost.input_tokens
 */
type GEN_AI_COST_INPUT_TOKENS_TYPE = number;
/**
 * The total cost of all output tokens in USD (includes reasoning tokens). `gen_ai.cost.output_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_COST_OUTPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 123.45
 */
declare const GEN_AI_COST_OUTPUT_TOKENS = "gen_ai.cost.output_tokens";
/**
 * Type for {@link GEN_AI_COST_OUTPUT_TOKENS} gen_ai.cost.output_tokens
 */
type GEN_AI_COST_OUTPUT_TOKENS_TYPE = number;
/**
 * The cost of reasoning output tokens in USD. `gen_ai.cost.reasoning.output_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_COST_REASONING_OUTPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12.34
 */
declare const GEN_AI_COST_REASONING_OUTPUT_TOKENS = "gen_ai.cost.reasoning.output_tokens";
/**
 * Type for {@link GEN_AI_COST_REASONING_OUTPUT_TOKENS} gen_ai.cost.reasoning.output_tokens
 */
type GEN_AI_COST_REASONING_OUTPUT_TOKENS_TYPE = number;
/**
 * The total cost for the tokens used. `gen_ai.cost.total_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_COST_TOTAL_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AI_TOTAL_COST} `ai.total_cost`
 *
 * @example 12.34
 */
declare const GEN_AI_COST_TOTAL_TOKENS = "gen_ai.cost.total_tokens";
/**
 * Type for {@link GEN_AI_COST_TOTAL_TOKENS} gen_ai.cost.total_tokens
 */
type GEN_AI_COST_TOTAL_TOKENS_TYPE = number;
/**
 * The input to the embeddings model. `gen_ai.embeddings.input`
 *
 * Attribute Value Type: `string` {@link GEN_AI_EMBEDDINGS_INPUT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "What's the weather in Paris?"
 */
declare const GEN_AI_EMBEDDINGS_INPUT = "gen_ai.embeddings.input";
/**
 * Type for {@link GEN_AI_EMBEDDINGS_INPUT} gen_ai.embeddings.input
 */
type GEN_AI_EMBEDDINGS_INPUT_TYPE = string;
/**
 * Framework-specific tracing label for the execution of a function or other unit of execution in a generative AI system. `gen_ai.function_id`
 *
 * Attribute Value Type: `string` {@link GEN_AI_FUNCTION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "my-awesome-function"
 */
declare const GEN_AI_FUNCTION_ID = "gen_ai.function_id";
/**
 * Type for {@link GEN_AI_FUNCTION_ID} gen_ai.function_id
 */
type GEN_AI_FUNCTION_ID_TYPE = string;
/**
 * The messages passed to the model. It has to be a stringified version of an array of objects. The `role` attribute of each object must be `"user"`, `"assistant"`, `"tool"`, or `"system"`. For messages of the role `"tool"`, the `content` can be a string or an arbitrary object with information about the tool call. For other messages the `content` can be either a string or a list of objects in the format `{type: "text", text:"..."}`. `gen_ai.input.messages`
 *
 * Attribute Value Type: `string` {@link GEN_AI_INPUT_MESSAGES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_TEXTS} `ai.texts`
 *
 * @example "[{\"role\": \"user\", \"parts\": [{\"type\": \"text\", \"content\": \"Weather in Paris?\"}]}, {\"role\": \"assistant\", \"parts\": [{\"type\": \"tool_call\", \"id\": \"call_VSPygqKTWdrhaFErNvMV18Yl\", \"name\": \"get_weather\", \"arguments\": {\"location\": \"Paris\"}}]}, {\"role\": \"tool\", \"parts\": [{\"type\": \"tool_call_response\", \"id\": \"call_VSPygqKTWdrhaFErNvMV18Yl\", \"result\": \"rainy, 57°F\"}]}]"
 */
declare const GEN_AI_INPUT_MESSAGES = "gen_ai.input.messages";
/**
 * Type for {@link GEN_AI_INPUT_MESSAGES} gen_ai.input.messages
 */
type GEN_AI_INPUT_MESSAGES_TYPE = string;
/**
 * The name of the operation being performed. It has the following list of well-known values: 'chat', 'create_agent', 'embeddings', 'execute_tool', 'generate_content', 'invoke_agent', 'text_completion'. If one of them applies, then that value MUST be used. Otherwise a custom value MAY be used. `gen_ai.operation.name`
 *
 * Attribute Value Type: `string` {@link GEN_AI_OPERATION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "chat"
 */
declare const GEN_AI_OPERATION_NAME = "gen_ai.operation.name";
/**
 * Type for {@link GEN_AI_OPERATION_NAME} gen_ai.operation.name
 */
type GEN_AI_OPERATION_NAME_TYPE = string;
/**
 * The type of AI operation. Must be one of 'agent' (invoke_agent and create_agent spans), 'ai_client' (any LLM call), 'tool' (execute_tool spans), 'handoff' (handoff spans), 'other' (input and output processors, skill loading, guardrails etc.) . Added during ingestion based on span.op and gen_ai.operation.type. Used to filter and aggregate data in the UI `gen_ai.operation.type`
 *
 * Attribute Value Type: `string` {@link GEN_AI_OPERATION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "tool"
 */
declare const GEN_AI_OPERATION_TYPE = "gen_ai.operation.type";
/**
 * Type for {@link GEN_AI_OPERATION_TYPE} gen_ai.operation.type
 */
type GEN_AI_OPERATION_TYPE_TYPE = string;
/**
 * The model's response messages. It has to be a stringified version of an array of message objects, which can include text responses and tool calls. `gen_ai.output.messages`
 *
 * Attribute Value Type: `string` {@link GEN_AI_OUTPUT_MESSAGES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "[{\"role\": \"assistant\", \"parts\": [{\"type\": \"text\", \"content\": \"The weather in Paris is currently rainy with a temperature of 57°F.\"}], \"finish_reason\": \"stop\"}]"
 */
declare const GEN_AI_OUTPUT_MESSAGES = "gen_ai.output.messages";
/**
 * Type for {@link GEN_AI_OUTPUT_MESSAGES} gen_ai.output.messages
 */
type GEN_AI_OUTPUT_MESSAGES_TYPE = string;
/**
 * Name of the AI pipeline or chain being executed. `gen_ai.pipeline.name`
 *
 * Attribute Value Type: `string` {@link GEN_AI_PIPELINE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AI_PIPELINE_NAME} `ai.pipeline.name`
 *
 * @example "Autofix Pipeline"
 */
declare const GEN_AI_PIPELINE_NAME = "gen_ai.pipeline.name";
/**
 * Type for {@link GEN_AI_PIPELINE_NAME} gen_ai.pipeline.name
 */
type GEN_AI_PIPELINE_NAME_TYPE = string;
/**
 * The input messages sent to the model `gen_ai.prompt`
 *
 * Attribute Value Type: `string` {@link GEN_AI_PROMPT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated  - Deprecated from OTEL, use gen_ai.input.messages with the new format instead.
 * @example "[{\"role\": \"user\", \"message\": \"hello\"}]"
 */
declare const GEN_AI_PROMPT = "gen_ai.prompt";
/**
 * Type for {@link GEN_AI_PROMPT} gen_ai.prompt
 */
type GEN_AI_PROMPT_TYPE = string;
/**
 * The name of the prompt that uniquely identifies it. `gen_ai.prompt.name`
 *
 * Attribute Value Type: `string` {@link GEN_AI_PROMPT_NAME_TYPE}
 *
 * Apply Scrubbing: manual - Prompt names may reveal user behavior patterns or sensitive operations
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link MCP_PROMPT_NAME} `mcp.prompt.name`
 *
 * @example "summarize_text"
 */
declare const GEN_AI_PROMPT_NAME = "gen_ai.prompt.name";
/**
 * Type for {@link GEN_AI_PROMPT_NAME} gen_ai.prompt.name
 */
type GEN_AI_PROMPT_NAME_TYPE = string;
/**
 * The Generative AI provider as identified by the client or server instrumentation. `gen_ai.provider.name`
 *
 * Attribute Value Type: `string` {@link GEN_AI_PROVIDER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_MODEL_PROVIDER} `ai.model.provider`, {@link GEN_AI_SYSTEM} `gen_ai.system`
 *
 * @example "openai"
 */
declare const GEN_AI_PROVIDER_NAME = "gen_ai.provider.name";
/**
 * Type for {@link GEN_AI_PROVIDER_NAME} gen_ai.provider.name
 */
type GEN_AI_PROVIDER_NAME_TYPE = string;
/**
 * The available tools for the model. It has to be a stringified version of an array of objects. `gen_ai.request.available_tools`
 *
 * Attribute Value Type: `string` {@link GEN_AI_REQUEST_AVAILABLE_TOOLS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_TOOL_DEFINITIONS} (gen_ai.tool.definitions) instead
 * @example "[{\"name\": \"get_weather\", \"description\": \"Get the weather for a given location\"}, {\"name\": \"get_news\", \"description\": \"Get the news for a given topic\"}]"
 */
declare const GEN_AI_REQUEST_AVAILABLE_TOOLS = "gen_ai.request.available_tools";
/**
 * Type for {@link GEN_AI_REQUEST_AVAILABLE_TOOLS} gen_ai.request.available_tools
 */
type GEN_AI_REQUEST_AVAILABLE_TOOLS_TYPE = string;
/**
 * Used to reduce repetitiveness of generated tokens. The higher the value, the stronger a penalty is applied to previously present tokens, proportional to how many times they have already appeared in the prompt or prior generation. `gen_ai.request.frequency_penalty`
 *
 * Attribute Value Type: `number` {@link GEN_AI_REQUEST_FREQUENCY_PENALTY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_FREQUENCY_PENALTY} `ai.frequency_penalty`
 *
 * @example 0.5
 */
declare const GEN_AI_REQUEST_FREQUENCY_PENALTY = "gen_ai.request.frequency_penalty";
/**
 * Type for {@link GEN_AI_REQUEST_FREQUENCY_PENALTY} gen_ai.request.frequency_penalty
 */
type GEN_AI_REQUEST_FREQUENCY_PENALTY_TYPE = number;
/**
 * The maximum number of tokens to generate in the response. `gen_ai.request.max_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_REQUEST_MAX_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 2048
 */
declare const GEN_AI_REQUEST_MAX_TOKENS = "gen_ai.request.max_tokens";
/**
 * Type for {@link GEN_AI_REQUEST_MAX_TOKENS} gen_ai.request.max_tokens
 */
type GEN_AI_REQUEST_MAX_TOKENS_TYPE = number;
/**
 * The messages passed to the model. It has to be a stringified version of an array of objects. The `role` attribute of each object must be `"user"`, `"assistant"`, `"tool"`, or `"system"`. For messages of the role `"tool"`, the `content` can be a string or an arbitrary object with information about the tool call. For other messages the `content` can be either a string or a list of objects in the format `{type: "text", text:"..."}`. `gen_ai.request.messages`
 *
 * Attribute Value Type: `string` {@link GEN_AI_REQUEST_MESSAGES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AI_INPUT_MESSAGES} `ai.input_messages`
 *
 * @deprecated Use {@link GEN_AI_INPUT_MESSAGES} (gen_ai.input.messages) instead
 * @example "[{\"role\": \"system\", \"content\": \"Generate a random number.\"}, {\"role\": \"user\", \"content\": [{\"text\": \"Generate a random number between 0 and 10.\", \"type\": \"text\"}]}, {\"role\": \"tool\", \"content\": {\"toolCallId\": \"1\", \"toolName\": \"Weather\", \"output\": \"rainy\"}}]"
 */
declare const GEN_AI_REQUEST_MESSAGES = "gen_ai.request.messages";
/**
 * Type for {@link GEN_AI_REQUEST_MESSAGES} gen_ai.request.messages
 */
type GEN_AI_REQUEST_MESSAGES_TYPE = string;
/**
 * The model identifier being used for the request. `gen_ai.request.model`
 *
 * Attribute Value Type: `string` {@link GEN_AI_REQUEST_MODEL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "gpt-4-turbo-preview"
 */
declare const GEN_AI_REQUEST_MODEL = "gen_ai.request.model";
/**
 * Type for {@link GEN_AI_REQUEST_MODEL} gen_ai.request.model
 */
type GEN_AI_REQUEST_MODEL_TYPE = string;
/**
 * Used to reduce repetitiveness of generated tokens. Similar to frequency_penalty, except that this penalty is applied equally to all tokens that have already appeared, regardless of their exact frequencies. `gen_ai.request.presence_penalty`
 *
 * Attribute Value Type: `number` {@link GEN_AI_REQUEST_PRESENCE_PENALTY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_PRESENCE_PENALTY} `ai.presence_penalty`
 *
 * @example 0.5
 */
declare const GEN_AI_REQUEST_PRESENCE_PENALTY = "gen_ai.request.presence_penalty";
/**
 * Type for {@link GEN_AI_REQUEST_PRESENCE_PENALTY} gen_ai.request.presence_penalty
 */
type GEN_AI_REQUEST_PRESENCE_PENALTY_TYPE = number;
/**
 * Constrains the effort on reasoning for reasoning models. Supported values vary by provider. `gen_ai.request.reasoning_effort`
 *
 * Attribute Value Type: `string` {@link GEN_AI_REQUEST_REASONING_EFFORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "high"
 */
declare const GEN_AI_REQUEST_REASONING_EFFORT = "gen_ai.request.reasoning_effort";
/**
 * Type for {@link GEN_AI_REQUEST_REASONING_EFFORT} gen_ai.request.reasoning_effort
 */
type GEN_AI_REQUEST_REASONING_EFFORT_TYPE = string;
/**
 * The seed, ideally models given the same seed and same other parameters will produce the exact same output. `gen_ai.request.seed`
 *
 * Attribute Value Type: `string` {@link GEN_AI_REQUEST_SEED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_SEED} `ai.seed`
 *
 * @example "1234567890"
 */
declare const GEN_AI_REQUEST_SEED = "gen_ai.request.seed";
/**
 * Type for {@link GEN_AI_REQUEST_SEED} gen_ai.request.seed
 */
type GEN_AI_REQUEST_SEED_TYPE = string;
/**
 * List of sequences that the model will use to stop generating further tokens. `gen_ai.request.stop_sequences`
 *
 * Attribute Value Type: `Array<string>` {@link GEN_AI_REQUEST_STOP_SEQUENCES_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["forest","lived"]
 */
declare const GEN_AI_REQUEST_STOP_SEQUENCES = "gen_ai.request.stop_sequences";
/**
 * Type for {@link GEN_AI_REQUEST_STOP_SEQUENCES} gen_ai.request.stop_sequences
 */
type GEN_AI_REQUEST_STOP_SEQUENCES_TYPE = Array<string>;
/**
 * For an AI model call, the temperature parameter. Temperature essentially means how random the output will be. `gen_ai.request.temperature`
 *
 * Attribute Value Type: `number` {@link GEN_AI_REQUEST_TEMPERATURE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_TEMPERATURE} `ai.temperature`
 *
 * @example 0.1
 */
declare const GEN_AI_REQUEST_TEMPERATURE = "gen_ai.request.temperature";
/**
 * Type for {@link GEN_AI_REQUEST_TEMPERATURE} gen_ai.request.temperature
 */
type GEN_AI_REQUEST_TEMPERATURE_TYPE = number;
/**
 * Limits the model to only consider the K most likely next tokens, where K is an integer (e.g., top_k=20 means only the 20 highest probability tokens are considered). `gen_ai.request.top_k`
 *
 * Attribute Value Type: `number` {@link GEN_AI_REQUEST_TOP_K_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_TOP_K} `ai.top_k`
 *
 * @example 35
 */
declare const GEN_AI_REQUEST_TOP_K = "gen_ai.request.top_k";
/**
 * Type for {@link GEN_AI_REQUEST_TOP_K} gen_ai.request.top_k
 */
type GEN_AI_REQUEST_TOP_K_TYPE = number;
/**
 * Limits the model to only consider tokens whose cumulative probability mass adds up to p, where p is a float between 0 and 1 (e.g., top_p=0.7 means only tokens that sum up to 70% of the probability mass are considered). `gen_ai.request.top_p`
 *
 * Attribute Value Type: `number` {@link GEN_AI_REQUEST_TOP_P_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_TOP_P} `ai.top_p`
 *
 * @example 0.7
 */
declare const GEN_AI_REQUEST_TOP_P = "gen_ai.request.top_p";
/**
 * Type for {@link GEN_AI_REQUEST_TOP_P} gen_ai.request.top_p
 */
type GEN_AI_REQUEST_TOP_P_TYPE = number;
/**
 * The reason why the model stopped generating. `gen_ai.response.finish_reasons`
 *
 * Attribute Value Type: `string` {@link GEN_AI_RESPONSE_FINISH_REASONS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_FINISH_REASON} `ai.finish_reason`
 *
 * @example "COMPLETE"
 */
declare const GEN_AI_RESPONSE_FINISH_REASONS = "gen_ai.response.finish_reasons";
/**
 * Type for {@link GEN_AI_RESPONSE_FINISH_REASONS} gen_ai.response.finish_reasons
 */
type GEN_AI_RESPONSE_FINISH_REASONS_TYPE = string;
/**
 * Unique identifier for the completion. `gen_ai.response.id`
 *
 * Attribute Value Type: `string` {@link GEN_AI_RESPONSE_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_GENERATION_ID} `ai.generation_id`
 *
 * @example "gen_123abc"
 */
declare const GEN_AI_RESPONSE_ID = "gen_ai.response.id";
/**
 * Type for {@link GEN_AI_RESPONSE_ID} gen_ai.response.id
 */
type GEN_AI_RESPONSE_ID_TYPE = string;
/**
 * The vendor-specific ID of the model used. `gen_ai.response.model`
 *
 * Attribute Value Type: `string` {@link GEN_AI_RESPONSE_MODEL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_MODEL_ID} `ai.model_id`
 *
 * @example "gpt-4"
 */
declare const GEN_AI_RESPONSE_MODEL = "gen_ai.response.model";
/**
 * Type for {@link GEN_AI_RESPONSE_MODEL} gen_ai.response.model
 */
type GEN_AI_RESPONSE_MODEL_TYPE = string;
/**
 * Whether or not the AI model call's response was streamed back asynchronously `gen_ai.response.streaming`
 *
 * Attribute Value Type: `boolean` {@link GEN_AI_RESPONSE_STREAMING_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AI_STREAMING} `ai.streaming`
 *
 * @example true
 */
declare const GEN_AI_RESPONSE_STREAMING = "gen_ai.response.streaming";
/**
 * Type for {@link GEN_AI_RESPONSE_STREAMING} gen_ai.response.streaming
 */
type GEN_AI_RESPONSE_STREAMING_TYPE = boolean;
/**
 * The model's response text messages. It has to be a stringified version of an array of response text messages. `gen_ai.response.text`
 *
 * Attribute Value Type: `string` {@link GEN_AI_RESPONSE_TEXT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_OUTPUT_MESSAGES} (gen_ai.output.messages) instead
 * @example "[\"The weather in Paris is rainy and overcast, with temperatures around 57°F\", \"The weather in London is sunny and warm, with temperatures around 65°F\"]"
 */
declare const GEN_AI_RESPONSE_TEXT = "gen_ai.response.text";
/**
 * Type for {@link GEN_AI_RESPONSE_TEXT} gen_ai.response.text
 */
type GEN_AI_RESPONSE_TEXT_TYPE = string;
/**
 * Time in seconds when the first response content chunk arrived in streaming responses. `gen_ai.response.time_to_first_chunk`
 *
 * Attribute Value Type: `number` {@link GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN} `gen_ai.response.time_to_first_token`
 *
 * @example 0.6853435
 */
declare const GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK = "gen_ai.response.time_to_first_chunk";
/**
 * Type for {@link GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK} gen_ai.response.time_to_first_chunk
 */
type GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK_TYPE = number;
/**
 * Time in seconds when the first response content chunk arrived in streaming responses. `gen_ai.response.time_to_first_token`
 *
 * Attribute Value Type: `number` {@link GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK} `gen_ai.response.time_to_first_chunk`
 *
 * @deprecated Use {@link GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK} (gen_ai.response.time_to_first_chunk) instead
 * @example 0.6853435
 */
declare const GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN = "gen_ai.response.time_to_first_token";
/**
 * Type for {@link GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN} gen_ai.response.time_to_first_token
 */
type GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN_TYPE = number;
/**
 * The total output tokens per seconds throughput `gen_ai.response.tokens_per_second`
 *
 * Attribute Value Type: `number` {@link GEN_AI_RESPONSE_TOKENS_PER_SECOND_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 12345.67
 */
declare const GEN_AI_RESPONSE_TOKENS_PER_SECOND = "gen_ai.response.tokens_per_second";
/**
 * Type for {@link GEN_AI_RESPONSE_TOKENS_PER_SECOND} gen_ai.response.tokens_per_second
 */
type GEN_AI_RESPONSE_TOKENS_PER_SECOND_TYPE = number;
/**
 * The tool calls in the model's response. It has to be a stringified version of an array of objects. `gen_ai.response.tool_calls`
 *
 * Attribute Value Type: `string` {@link GEN_AI_RESPONSE_TOOL_CALLS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_OUTPUT_MESSAGES} (gen_ai.output.messages) instead
 * @example "[{\"name\": \"get_weather\", \"arguments\": {\"location\": \"Paris\"}}]"
 */
declare const GEN_AI_RESPONSE_TOOL_CALLS = "gen_ai.response.tool_calls";
/**
 * Type for {@link GEN_AI_RESPONSE_TOOL_CALLS} gen_ai.response.tool_calls
 */
type GEN_AI_RESPONSE_TOOL_CALLS_TYPE = string;
/**
 * The provider of the model. `gen_ai.system`
 *
 * Attribute Value Type: `string` {@link GEN_AI_SYSTEM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_MODEL_PROVIDER} `ai.model.provider`, {@link GEN_AI_PROVIDER_NAME} `gen_ai.provider.name`
 *
 * @deprecated Use {@link GEN_AI_PROVIDER_NAME} (gen_ai.provider.name) instead
 * @example "openai"
 */
declare const GEN_AI_SYSTEM = "gen_ai.system";
/**
 * Type for {@link GEN_AI_SYSTEM} gen_ai.system
 */
type GEN_AI_SYSTEM_TYPE = string;
/**
 * The system instructions passed to the model. `gen_ai.system_instructions`
 *
 * Attribute Value Type: `string` {@link GEN_AI_SYSTEM_INSTRUCTIONS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_PREAMBLE} `ai.preamble`
 *
 * @example "You are a helpful assistant"
 */
declare const GEN_AI_SYSTEM_INSTRUCTIONS = "gen_ai.system_instructions";
/**
 * Type for {@link GEN_AI_SYSTEM_INSTRUCTIONS} gen_ai.system_instructions
 */
type GEN_AI_SYSTEM_INSTRUCTIONS_TYPE = string;
/**
 * The system instructions passed to the model. `gen_ai.system.message`
 *
 * Attribute Value Type: `string` {@link GEN_AI_SYSTEM_MESSAGE_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link GEN_AI_SYSTEM_INSTRUCTIONS} (gen_ai.system_instructions) instead
 * @example "You are a helpful assistant"
 */
declare const GEN_AI_SYSTEM_MESSAGE = "gen_ai.system.message";
/**
 * Type for {@link GEN_AI_SYSTEM_MESSAGE} gen_ai.system.message
 */
type GEN_AI_SYSTEM_MESSAGE_TYPE = string;
/**
 * The arguments of the tool call. It has to be a stringified version of the arguments to the tool. `gen_ai.tool.call.arguments`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_CALL_ARGUMENTS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_INPUT} `gen_ai.tool.input`
 *
 * @example "{\"location\": \"Paris\"}"
 */
declare const GEN_AI_TOOL_CALL_ARGUMENTS = "gen_ai.tool.call.arguments";
/**
 * Type for {@link GEN_AI_TOOL_CALL_ARGUMENTS} gen_ai.tool.call.arguments
 */
type GEN_AI_TOOL_CALL_ARGUMENTS_TYPE = string;
/**
 * The result of the tool call. It has to be a stringified version of the result of the tool. `gen_ai.tool.call.result`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_CALL_RESULT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_OUTPUT} `gen_ai.tool.output`, {@link GEN_AI_TOOL_MESSAGE} `gen_ai.tool.message`, {@link MCP_TOOL_RESULT_CONTENT} `mcp.tool.result.content`
 *
 * @example "rainy, 57°F"
 */
declare const GEN_AI_TOOL_CALL_RESULT = "gen_ai.tool.call.result";
/**
 * Type for {@link GEN_AI_TOOL_CALL_RESULT} gen_ai.tool.call.result
 */
type GEN_AI_TOOL_CALL_RESULT_TYPE = string;
/**
 * The list of source system tool definitions available to the GenAI agent or model. `gen_ai.tool.definitions`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_DEFINITIONS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "[{\"type\": \"function\", \"name\": \"get_current_weather\", \"description\": \"Get the current weather in a given location\", \"parameters\": {\"type\": \"object\", \"properties\": {\"location\": {\"type\": \"string\", \"description\": \"The city and state, e.g. San Francisco, CA\"}, \"unit\": {\"type\": \"string\", \"enum\": [\"celsius\", \"fahrenheit\"]}}, \"required\": [\"location\", \"unit\"]}}]"
 */
declare const GEN_AI_TOOL_DEFINITIONS = "gen_ai.tool.definitions";
/**
 * Type for {@link GEN_AI_TOOL_DEFINITIONS} gen_ai.tool.definitions
 */
type GEN_AI_TOOL_DEFINITIONS_TYPE = string;
/**
 * The description of the tool being used. `gen_ai.tool.description`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Searches the web for current information about a topic"
 */
declare const GEN_AI_TOOL_DESCRIPTION = "gen_ai.tool.description";
/**
 * Type for {@link GEN_AI_TOOL_DESCRIPTION} gen_ai.tool.description
 */
type GEN_AI_TOOL_DESCRIPTION_TYPE = string;
/**
 * The input of the tool being used. It has to be a stringified version of the input to the tool. `gen_ai.tool.input`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_INPUT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_CALL_ARGUMENTS} `gen_ai.tool.call.arguments`
 *
 * @deprecated Use {@link GEN_AI_TOOL_CALL_ARGUMENTS} (gen_ai.tool.call.arguments) instead
 * @example "{\"location\": \"Paris\"}"
 */
declare const GEN_AI_TOOL_INPUT = "gen_ai.tool.input";
/**
 * Type for {@link GEN_AI_TOOL_INPUT} gen_ai.tool.input
 */
type GEN_AI_TOOL_INPUT_TYPE = string;
/**
 * The response from a tool or function call passed to the model. `gen_ai.tool.message`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_MESSAGE_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_CALL_RESULT} `gen_ai.tool.call.result`, {@link GEN_AI_TOOL_OUTPUT} `gen_ai.tool.output`, {@link MCP_TOOL_RESULT_CONTENT} `mcp.tool.result.content`
 *
 * @deprecated Use {@link GEN_AI_TOOL_CALL_RESULT} (gen_ai.tool.call.result) instead
 * @example "rainy, 57°F"
 */
declare const GEN_AI_TOOL_MESSAGE = "gen_ai.tool.message";
/**
 * Type for {@link GEN_AI_TOOL_MESSAGE} gen_ai.tool.message
 */
type GEN_AI_TOOL_MESSAGE_TYPE = string;
/**
 * Name of the tool utilized by the agent. `gen_ai.tool.name`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_FUNCTION_CALL} `ai.function_call`, {@link MCP_TOOL_NAME} `mcp.tool.name`
 *
 * @example "Flights"
 */
declare const GEN_AI_TOOL_NAME = "gen_ai.tool.name";
/**
 * Type for {@link GEN_AI_TOOL_NAME} gen_ai.tool.name
 */
type GEN_AI_TOOL_NAME_TYPE = string;
/**
 * The output of the tool being used. It has to be a stringified version of the output of the tool. `gen_ai.tool.output`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_OUTPUT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_CALL_RESULT} `gen_ai.tool.call.result`, {@link GEN_AI_TOOL_MESSAGE} `gen_ai.tool.message`, {@link MCP_TOOL_RESULT_CONTENT} `mcp.tool.result.content`
 *
 * @deprecated Use {@link GEN_AI_TOOL_CALL_RESULT} (gen_ai.tool.call.result) instead
 * @example "rainy, 57°F"
 */
declare const GEN_AI_TOOL_OUTPUT = "gen_ai.tool.output";
/**
 * Type for {@link GEN_AI_TOOL_OUTPUT} gen_ai.tool.output
 */
type GEN_AI_TOOL_OUTPUT_TYPE = string;
/**
 * The type of tool being used. `gen_ai.tool.type`
 *
 * Attribute Value Type: `string` {@link GEN_AI_TOOL_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated  - The gen_ai.tool.type attribute is deprecated and should no longer be set.
 * @example "function"
 */
declare const GEN_AI_TOOL_TYPE = "gen_ai.tool.type";
/**
 * Type for {@link GEN_AI_TOOL_TYPE} gen_ai.tool.type
 */
type GEN_AI_TOOL_TYPE_TYPE = string;
/**
 * The number of tokens written to the cache when processing the AI input (prompt). `gen_ai.usage.cache_creation.input_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE} `gen_ai.usage.input_tokens.cache_write`
 *
 * @example 100
 */
declare const GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS = "gen_ai.usage.cache_creation.input_tokens";
/**
 * Type for {@link GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS} gen_ai.usage.cache_creation.input_tokens
 */
type GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS_TYPE = number;
/**
 * The number of cached tokens used to process the AI input (prompt). `gen_ai.usage.cache_read.input_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_INPUT_TOKENS_CACHED} `gen_ai.usage.input_tokens.cached`
 *
 * @example 50
 */
declare const GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS = "gen_ai.usage.cache_read.input_tokens";
/**
 * Type for {@link GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS} gen_ai.usage.cache_read.input_tokens
 */
type GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS_TYPE = number;
/**
 * The number of tokens used in the GenAI response (completion). `gen_ai.usage.completion_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_COMPLETION_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_COMPLETION_TOKENS_USED} `ai.completion_tokens.used`, {@link GEN_AI_USAGE_OUTPUT_TOKENS} `gen_ai.usage.output_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_OUTPUT_TOKENS} (gen_ai.usage.output_tokens) instead
 * @example 10
 */
declare const GEN_AI_USAGE_COMPLETION_TOKENS = "gen_ai.usage.completion_tokens";
/**
 * Type for {@link GEN_AI_USAGE_COMPLETION_TOKENS} gen_ai.usage.completion_tokens
 */
type GEN_AI_USAGE_COMPLETION_TOKENS_TYPE = number;
/**
 * The number of tokens used to process the AI input (prompt) including cached input tokens. `gen_ai.usage.input_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_INPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_PROMPT_TOKENS_USED} `ai.prompt_tokens.used`, {@link GEN_AI_USAGE_PROMPT_TOKENS} `gen_ai.usage.prompt_tokens`
 *
 * @example 10
 */
declare const GEN_AI_USAGE_INPUT_TOKENS = "gen_ai.usage.input_tokens";
/**
 * Type for {@link GEN_AI_USAGE_INPUT_TOKENS} gen_ai.usage.input_tokens
 */
type GEN_AI_USAGE_INPUT_TOKENS_TYPE = number;
/**
 * The number of cached tokens used to process the AI input (prompt). `gen_ai.usage.input_tokens.cached`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_INPUT_TOKENS_CACHED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS} `gen_ai.usage.cache_read.input_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS} (gen_ai.usage.cache_read.input_tokens) instead
 * @example 50
 */
declare const GEN_AI_USAGE_INPUT_TOKENS_CACHED = "gen_ai.usage.input_tokens.cached";
/**
 * Type for {@link GEN_AI_USAGE_INPUT_TOKENS_CACHED} gen_ai.usage.input_tokens.cached
 */
type GEN_AI_USAGE_INPUT_TOKENS_CACHED_TYPE = number;
/**
 * The number of tokens written to the cache when processing the AI input (prompt). `gen_ai.usage.input_tokens.cache_write`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS} `gen_ai.usage.cache_creation.input_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS} (gen_ai.usage.cache_creation.input_tokens) instead
 * @example 100
 */
declare const GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE = "gen_ai.usage.input_tokens.cache_write";
/**
 * Type for {@link GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE} gen_ai.usage.input_tokens.cache_write
 */
type GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE_TYPE = number;
/**
 * The number of tokens used for creating the AI output (including reasoning tokens). `gen_ai.usage.output_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_OUTPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_COMPLETION_TOKENS_USED} `ai.completion_tokens.used`, {@link GEN_AI_USAGE_COMPLETION_TOKENS} `gen_ai.usage.completion_tokens`
 *
 * @example 10
 */
declare const GEN_AI_USAGE_OUTPUT_TOKENS = "gen_ai.usage.output_tokens";
/**
 * Type for {@link GEN_AI_USAGE_OUTPUT_TOKENS} gen_ai.usage.output_tokens
 */
type GEN_AI_USAGE_OUTPUT_TOKENS_TYPE = number;
/**
 * The number of tokens used for reasoning to create the AI output. `gen_ai.usage.output_tokens.reasoning`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_OUTPUT_TOKENS_REASONING_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_REASONING_OUTPUT_TOKENS} `gen_ai.usage.reasoning.output_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_REASONING_OUTPUT_TOKENS} (gen_ai.usage.reasoning.output_tokens) instead
 * @example 75
 */
declare const GEN_AI_USAGE_OUTPUT_TOKENS_REASONING = "gen_ai.usage.output_tokens.reasoning";
/**
 * Type for {@link GEN_AI_USAGE_OUTPUT_TOKENS_REASONING} gen_ai.usage.output_tokens.reasoning
 */
type GEN_AI_USAGE_OUTPUT_TOKENS_REASONING_TYPE = number;
/**
 * The number of tokens used in the GenAI input (prompt). `gen_ai.usage.prompt_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_PROMPT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link AI_PROMPT_TOKENS_USED} `ai.prompt_tokens.used`, {@link GEN_AI_USAGE_INPUT_TOKENS} `gen_ai.usage.input_tokens`
 *
 * @deprecated Use {@link GEN_AI_USAGE_INPUT_TOKENS} (gen_ai.usage.input_tokens) instead
 * @example 20
 */
declare const GEN_AI_USAGE_PROMPT_TOKENS = "gen_ai.usage.prompt_tokens";
/**
 * Type for {@link GEN_AI_USAGE_PROMPT_TOKENS} gen_ai.usage.prompt_tokens
 */
type GEN_AI_USAGE_PROMPT_TOKENS_TYPE = number;
/**
 * The number of tokens used for reasoning to create the AI output. `gen_ai.usage.reasoning.output_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_REASONING_OUTPUT_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_USAGE_OUTPUT_TOKENS_REASONING} `gen_ai.usage.output_tokens.reasoning`
 *
 * @example 75
 */
declare const GEN_AI_USAGE_REASONING_OUTPUT_TOKENS = "gen_ai.usage.reasoning.output_tokens";
/**
 * Type for {@link GEN_AI_USAGE_REASONING_OUTPUT_TOKENS} gen_ai.usage.reasoning.output_tokens
 */
type GEN_AI_USAGE_REASONING_OUTPUT_TOKENS_TYPE = number;
/**
 * The total number of tokens used to process the prompt. (input tokens plus output todkens) `gen_ai.usage.total_tokens`
 *
 * Attribute Value Type: `number` {@link GEN_AI_USAGE_TOTAL_TOKENS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link AI_TOTAL_TOKENS_USED} `ai.total_tokens.used`
 *
 * @example 20
 */
declare const GEN_AI_USAGE_TOTAL_TOKENS = "gen_ai.usage.total_tokens";
/**
 * Type for {@link GEN_AI_USAGE_TOTAL_TOKENS} gen_ai.usage.total_tokens
 */
type GEN_AI_USAGE_TOTAL_TOKENS_TYPE = number;
/**
 * The GraphQL document being executed. `graphql.document`
 *
 * Attribute Value Type: `string` {@link GRAPHQL_DOCUMENT_TYPE}
 *
 * Apply Scrubbing: auto - The document may contain sensitive information in arguments or variables. Instrumentation should redact sensitive information when possible.
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "query findBookById { bookById(id: ?) { name } }"
 */
declare const GRAPHQL_DOCUMENT = "graphql.document";
/**
 * Type for {@link GRAPHQL_DOCUMENT} graphql.document
 */
type GRAPHQL_DOCUMENT_TYPE = string;
/**
 * The name of the operation being executed. `graphql.operation.name`
 *
 * Attribute Value Type: `string` {@link GRAPHQL_OPERATION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "findBookById"
 */
declare const GRAPHQL_OPERATION_NAME = "graphql.operation.name";
/**
 * Type for {@link GRAPHQL_OPERATION_NAME} graphql.operation.name
 */
type GRAPHQL_OPERATION_NAME_TYPE = string;
/**
 * The type of the operation being executed. `graphql.operation.type`
 *
 * Attribute Value Type: `string` {@link GRAPHQL_OPERATION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "query"
 */
declare const GRAPHQL_OPERATION_TYPE = "graphql.operation.type";
/**
 * Type for {@link GRAPHQL_OPERATION_TYPE} graphql.operation.type
 */
type GRAPHQL_OPERATION_TYPE_TYPE = string;
/**
 * The number of logical CPU cores available. `hardwareConcurrency`
 *
 * Attribute Value Type: `string` {@link HARDWARECONCURRENCY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link DEVICE_PROCESSOR_COUNT} `device.processor_count`
 *
 * @deprecated Use {@link DEVICE_PROCESSOR_COUNT} (device.processor_count) instead - Old namespace-less attribute, to be replaced with device.processor_count for span-first future
 * @example "14"
 */
declare const HARDWARECONCURRENCY = "hardwareConcurrency";
/**
 * Type for {@link HARDWARECONCURRENCY} hardwareConcurrency
 */
type HARDWARECONCURRENCY_TYPE = string;
/**
 * Client address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `http.client_ip`
 *
 * Attribute Value Type: `string` {@link HTTP_CLIENT_IP_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link CLIENT_ADDRESS} `client.address`
 *
 * @deprecated Use {@link CLIENT_ADDRESS} (client.address) instead
 * @example "example.com"
 */
declare const HTTP_CLIENT_IP = "http.client_ip";
/**
 * Type for {@link HTTP_CLIENT_IP} http.client_ip
 */
type HTTP_CLIENT_IP_TYPE = string;
/**
 * The decoded body size of the response (in bytes). `http.decoded_response_content_length`
 *
 * Attribute Value Type: `number` {@link HTTP_DECODED_RESPONSE_CONTENT_LENGTH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 456
 */
declare const HTTP_DECODED_RESPONSE_CONTENT_LENGTH = "http.decoded_response_content_length";
/**
 * Type for {@link HTTP_DECODED_RESPONSE_CONTENT_LENGTH} http.decoded_response_content_length
 */
type HTTP_DECODED_RESPONSE_CONTENT_LENGTH_TYPE = number;
/**
 * The actual version of the protocol used for network communication. `http.flavor`
 *
 * Attribute Value Type: `string` {@link HTTP_FLAVOR_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_PROTOCOL_VERSION} `network.protocol.version`, {@link NET_PROTOCOL_VERSION} `net.protocol.version`
 *
 * @deprecated Use {@link NETWORK_PROTOCOL_VERSION} (network.protocol.version) instead
 * @example "1.1"
 */
declare const HTTP_FLAVOR = "http.flavor";
/**
 * Type for {@link HTTP_FLAVOR} http.flavor
 */
type HTTP_FLAVOR_TYPE = string;
/**
 * The fragments present in the URI. Note that this contains the leading # character, while the `url.fragment` attribute does not. `http.fragment`
 *
 * Attribute Value Type: `string` {@link HTTP_FRAGMENT_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "#details"
 */
declare const HTTP_FRAGMENT = "http.fragment";
/**
 * Type for {@link HTTP_FRAGMENT} http.fragment
 */
type HTTP_FRAGMENT_TYPE = string;
/**
 * The domain name. `http.host`
 *
 * Attribute Value Type: `string` {@link HTTP_HOST_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SERVER_ADDRESS} `server.address`, {@link CLIENT_ADDRESS} `client.address`, {@link HTTP_SERVER_NAME} `http.server_name`, {@link NET_HOST_NAME} `net.host.name`, {@link SERVER_NAME} `server_name`
 *
 * @deprecated Use {@link SERVER_ADDRESS} (server.address) instead - Deprecated, use one of `server.address` or `client.address`, depending on the usage
 * @example "example.com"
 */
declare const HTTP_HOST = "http.host";
/**
 * Type for {@link HTTP_HOST} http.host
 */
type HTTP_HOST_TYPE = string;
/**
 * The HTTP method used. `http.method`
 *
 * Attribute Value Type: `string` {@link HTTP_METHOD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_REQUEST_METHOD} `http.request.method`, {@link _HTTP_REQUEST_METHOD} `http.request_method`, {@link METHOD} `method`
 *
 * @deprecated Use {@link HTTP_REQUEST_METHOD} (http.request.method) instead
 * @example "GET"
 */
declare const HTTP_METHOD = "http.method";
/**
 * Type for {@link HTTP_METHOD} http.method
 */
type HTTP_METHOD_TYPE = string;
/**
 * The query string present in the URL. Note that this contains the leading ? character, while the `url.query` attribute does not. `http.query`
 *
 * Attribute Value Type: `string` {@link HTTP_QUERY_TYPE}
 *
 * Apply Scrubbing: auto - Query string values can contain sensitive information. Clients should attempt to scrub parameters that might contain sensitive information.
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "?foo=bar&bar=baz"
 */
declare const HTTP_QUERY = "http.query";
/**
 * Type for {@link HTTP_QUERY} http.query
 */
type HTTP_QUERY_TYPE = string;
/**
 * HTTP request body data. Can be given as string or structural data of any format. `http.request.body.data`
 *
 * Attribute Value Type: `string` {@link HTTP_REQUEST_BODY_DATA_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "[{\"role\": \"user\", \"message\": \"hello\"}]"
 */
declare const HTTP_REQUEST_BODY_DATA = "http.request.body.data";
/**
 * Type for {@link HTTP_REQUEST_BODY_DATA} http.request.body.data
 */
type HTTP_REQUEST_BODY_DATA_TYPE = string;
/**
 * The UNIX timestamp representing the time immediately after the browser finishes establishing the connection to the server to retrieve the resource. The timestamp value includes the time interval to establish the transport connection, as well as other time intervals such as TLS handshake and SOCKS authentication. `http.request.connection_end`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_CONNECTION_END_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.15
 */
declare const HTTP_REQUEST_CONNECTION_END = "http.request.connection_end";
/**
 * Type for {@link HTTP_REQUEST_CONNECTION_END} http.request.connection_end
 */
type HTTP_REQUEST_CONNECTION_END_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately before the user agent starts establishing the connection to the server to retrieve the resource. `http.request.connect_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_CONNECT_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.111
 */
declare const HTTP_REQUEST_CONNECT_START = "http.request.connect_start";
/**
 * Type for {@link HTTP_REQUEST_CONNECT_START} http.request.connect_start
 */
type HTTP_REQUEST_CONNECT_START_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately after the browser finishes the domain-name lookup for the resource. `http.request.domain_lookup_end`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_DOMAIN_LOOKUP_END_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.201
 */
declare const HTTP_REQUEST_DOMAIN_LOOKUP_END = "http.request.domain_lookup_end";
/**
 * Type for {@link HTTP_REQUEST_DOMAIN_LOOKUP_END} http.request.domain_lookup_end
 */
type HTTP_REQUEST_DOMAIN_LOOKUP_END_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately before the browser starts the domain name lookup for the resource. `http.request.domain_lookup_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_DOMAIN_LOOKUP_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.322
 */
declare const HTTP_REQUEST_DOMAIN_LOOKUP_START = "http.request.domain_lookup_start";
/**
 * Type for {@link HTTP_REQUEST_DOMAIN_LOOKUP_START} http.request.domain_lookup_start
 */
type HTTP_REQUEST_DOMAIN_LOOKUP_START_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately before the browser starts to fetch the resource. `http.request.fetch_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_FETCH_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.389
 */
declare const HTTP_REQUEST_FETCH_START = "http.request.fetch_start";
/**
 * Type for {@link HTTP_REQUEST_FETCH_START} http.request.fetch_start
 */
type HTTP_REQUEST_FETCH_START_TYPE = number;
/**
 * HTTP request headers, <key> being the normalized HTTP Header name (lowercase), the value being the header values. `http.request.header.<key>`
 *
 * Attribute Value Type: `Array<string>` {@link HTTP_REQUEST_HEADER_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "http.request.header.custom-header=['foo', 'bar']"
 */
declare const HTTP_REQUEST_HEADER_KEY = "http.request.header.<key>";
/**
 * Base key for {@link HTTP_REQUEST_HEADER_KEY}. Use with a dynamic suffix, e.g. `${HTTP_REQUEST_HEADER_KEY_BASE}.${key}`.
 */
declare const HTTP_REQUEST_HEADER_KEY_BASE = "http.request.header";
/**
 * Type for {@link HTTP_REQUEST_HEADER_KEY} http.request.header.<key>
 */
type HTTP_REQUEST_HEADER_KEY_TYPE = Array<string>;
/**
 * The HTTP method used. `http.request.method`
 *
 * Attribute Value Type: `string` {@link HTTP_REQUEST_METHOD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link METHOD} `method`, {@link HTTP_METHOD} `http.method`, {@link _HTTP_REQUEST_METHOD} `http.request_method`
 *
 * @example "GET"
 */
declare const HTTP_REQUEST_METHOD = "http.request.method";
/**
 * Type for {@link HTTP_REQUEST_METHOD} http.request.method
 */
type HTTP_REQUEST_METHOD_TYPE = string;
/**
 * The HTTP method used. `http.request_method`
 *
 * Attribute Value Type: `string` {@link _HTTP_REQUEST_METHOD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link METHOD} `method`, {@link HTTP_METHOD} `http.method`, {@link HTTP_REQUEST_METHOD} `http.request.method`
 *
 * @deprecated Use {@link HTTP_REQUEST_METHOD} (http.request.method) instead
 * @example "GET"
 */
declare const _HTTP_REQUEST_METHOD = "http.request_method";
/**
 * Type for {@link _HTTP_REQUEST_METHOD} http.request_method
 */
type _HTTP_REQUEST_METHOD_TYPE = string;
/**
 * The UNIX timestamp representing the timestamp immediately after receiving the last byte of the response of the last redirect `http.request.redirect_end`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_REDIRECT_END_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829558.502
 */
declare const HTTP_REQUEST_REDIRECT_END = "http.request.redirect_end";
/**
 * Type for {@link HTTP_REQUEST_REDIRECT_END} http.request.redirect_end
 */
type HTTP_REQUEST_REDIRECT_END_TYPE = number;
/**
 * The UNIX timestamp representing the start time of the fetch which that initiates the redirect. `http.request.redirect_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_REDIRECT_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.495
 */
declare const HTTP_REQUEST_REDIRECT_START = "http.request.redirect_start";
/**
 * Type for {@link HTTP_REQUEST_REDIRECT_START} http.request.redirect_start
 */
type HTTP_REQUEST_REDIRECT_START_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately before the browser starts requesting the resource from the server, cache, or local resource. If the transport connection fails and the browser retires the request, the value returned will be the start of the retry request. `http.request.request_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_REQUEST_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.51
 */
declare const HTTP_REQUEST_REQUEST_START = "http.request.request_start";
/**
 * Type for {@link HTTP_REQUEST_REQUEST_START} http.request.request_start
 */
type HTTP_REQUEST_REQUEST_START_TYPE = number;
/**
 * The ordinal number of request resending attempt (for any reason, including redirects). `http.request.resend_count`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_RESEND_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2
 */
declare const HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
/**
 * Type for {@link HTTP_REQUEST_RESEND_COUNT} http.request.resend_count
 */
type HTTP_REQUEST_RESEND_COUNT_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately after the browser receives the last byte of the resource or immediately before the transport connection is closed, whichever comes first. `http.request.response_end`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_RESPONSE_END_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.89
 */
declare const HTTP_REQUEST_RESPONSE_END = "http.request.response_end";
/**
 * Type for {@link HTTP_REQUEST_RESPONSE_END} http.request.response_end
 */
type HTTP_REQUEST_RESPONSE_END_TYPE = number;
/**
 * The UNIX timestamp representing the time immediately before the browser starts requesting the resource from the server, cache, or local resource. If the transport connection fails and the browser retires the request, the value returned will be the start of the retry request. `http.request.response_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_RESPONSE_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.7
 */
declare const HTTP_REQUEST_RESPONSE_START = "http.request.response_start";
/**
 * Type for {@link HTTP_REQUEST_RESPONSE_START} http.request.response_start
 */
type HTTP_REQUEST_RESPONSE_START_TYPE = number;
/**
 * Indicates that a URL has the same origin as the current page's origin in the browser. `http.request.same_origin`
 *
 * Attribute Value Type: `boolean` {@link HTTP_REQUEST_SAME_ORIGIN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link URL_SAME_ORIGIN} `url.same_origin`
 *
 * @example true
 */
declare const HTTP_REQUEST_SAME_ORIGIN = "http.request.same_origin";
/**
 * Type for {@link HTTP_REQUEST_SAME_ORIGIN} http.request.same_origin
 */
type HTTP_REQUEST_SAME_ORIGIN_TYPE = boolean;
/**
 * The UNIX timestamp representing the time immediately before the browser starts the handshake process to secure the current connection. If a secure connection is not used, the property returns zero. `http.request.secure_connection_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_SECURE_CONNECTION_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829555.73
 */
declare const HTTP_REQUEST_SECURE_CONNECTION_START = "http.request.secure_connection_start";
/**
 * Type for {@link HTTP_REQUEST_SECURE_CONNECTION_START} http.request.secure_connection_start
 */
type HTTP_REQUEST_SECURE_CONNECTION_START_TYPE = number;
/**
 * The time in seconds from the browser's timeorigin to when the first byte of the request's response was received. See https://web.dev/articles/ttfb#measure-resource-requests `http.request.time_to_first_byte`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_TIME_TO_FIRST_BYTE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1.032
 */
declare const HTTP_REQUEST_TIME_TO_FIRST_BYTE = "http.request.time_to_first_byte";
/**
 * Type for {@link HTTP_REQUEST_TIME_TO_FIRST_BYTE} http.request.time_to_first_byte
 */
type HTTP_REQUEST_TIME_TO_FIRST_BYTE_TYPE = number;
/**
 * The UNIX timestamp representing the timestamp immediately before dispatching the FetchEvent if a Service Worker thread is already running, or immediately before starting the Service Worker thread if it is not already running. `http.request.worker_start`
 *
 * Attribute Value Type: `number` {@link HTTP_REQUEST_WORKER_START_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732829553.68
 */
declare const HTTP_REQUEST_WORKER_START = "http.request.worker_start";
/**
 * Type for {@link HTTP_REQUEST_WORKER_START} http.request.worker_start
 */
type HTTP_REQUEST_WORKER_START_TYPE = number;
/**
 * The encoded body size of the response (in bytes). `http.response.body.size`
 *
 * Attribute Value Type: `number` {@link HTTP_RESPONSE_BODY_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_RESPONSE_CONTENT_LENGTH} `http.response_content_length`, {@link HTTP_RESPONSE_HEADER_CONTENT_LENGTH} `http.response.header.content-length`
 *
 * @example 123
 */
declare const HTTP_RESPONSE_BODY_SIZE = "http.response.body.size";
/**
 * Type for {@link HTTP_RESPONSE_BODY_SIZE} http.response.body.size
 */
type HTTP_RESPONSE_BODY_SIZE_TYPE = number;
/**
 * The encoded body size of the response (in bytes). `http.response_content_length`
 *
 * Attribute Value Type: `number` {@link HTTP_RESPONSE_CONTENT_LENGTH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_RESPONSE_BODY_SIZE} `http.response.body.size`, {@link HTTP_RESPONSE_HEADER_CONTENT_LENGTH} `http.response.header.content-length`
 *
 * @deprecated Use {@link HTTP_RESPONSE_BODY_SIZE} (http.response.body.size) instead
 * @example 123
 */
declare const HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
/**
 * Type for {@link HTTP_RESPONSE_CONTENT_LENGTH} http.response_content_length
 */
type HTTP_RESPONSE_CONTENT_LENGTH_TYPE = number;
/**
 * The size of the message body sent to the recipient (in bytes) `http.response.header.content-length`
 *
 * Attribute Value Type: `string` {@link HTTP_RESPONSE_HEADER_CONTENT_LENGTH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_RESPONSE_CONTENT_LENGTH} `http.response_content_length`, {@link HTTP_RESPONSE_BODY_SIZE} `http.response.body.size`
 *
 * @example "http.response.header.custom-header=['foo', 'bar']"
 */
declare const HTTP_RESPONSE_HEADER_CONTENT_LENGTH = "http.response.header.content-length";
/**
 * Type for {@link HTTP_RESPONSE_HEADER_CONTENT_LENGTH} http.response.header.content-length
 */
type HTTP_RESPONSE_HEADER_CONTENT_LENGTH_TYPE = string;
/**
 * HTTP response headers, <key> being the normalized HTTP Header name (lowercase), the value being the header values. `http.response.header.<key>`
 *
 * Attribute Value Type: `Array<string>` {@link HTTP_RESPONSE_HEADER_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "http.response.header.custom-header=['foo', 'bar']"
 */
declare const HTTP_RESPONSE_HEADER_KEY = "http.response.header.<key>";
/**
 * Base key for {@link HTTP_RESPONSE_HEADER_KEY}. Use with a dynamic suffix, e.g. `${HTTP_RESPONSE_HEADER_KEY_BASE}.${key}`.
 */
declare const HTTP_RESPONSE_HEADER_KEY_BASE = "http.response.header";
/**
 * Type for {@link HTTP_RESPONSE_HEADER_KEY} http.response.header.<key>
 */
type HTTP_RESPONSE_HEADER_KEY_TYPE = Array<string>;
/**
 * The transfer size of the response (in bytes). `http.response.size`
 *
 * Attribute Value Type: `number` {@link HTTP_RESPONSE_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_RESPONSE_TRANSFER_SIZE} `http.response_transfer_size`
 *
 * @example 456
 */
declare const HTTP_RESPONSE_SIZE = "http.response.size";
/**
 * Type for {@link HTTP_RESPONSE_SIZE} http.response.size
 */
type HTTP_RESPONSE_SIZE_TYPE = number;
/**
 * The status code of the HTTP response. `http.response.status_code`
 *
 * Attribute Value Type: `number` {@link HTTP_RESPONSE_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_STATUS_CODE} `http.status_code`
 *
 * @example 404
 */
declare const HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
/**
 * Type for {@link HTTP_RESPONSE_STATUS_CODE} http.response.status_code
 */
type HTTP_RESPONSE_STATUS_CODE_TYPE = number;
/**
 * The transfer size of the response (in bytes). `http.response_transfer_size`
 *
 * Attribute Value Type: `number` {@link HTTP_RESPONSE_TRANSFER_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link HTTP_RESPONSE_SIZE} `http.response.size`
 *
 * @deprecated Use {@link HTTP_RESPONSE_SIZE} (http.response.size) instead
 * @example 456
 */
declare const HTTP_RESPONSE_TRANSFER_SIZE = "http.response_transfer_size";
/**
 * Type for {@link HTTP_RESPONSE_TRANSFER_SIZE} http.response_transfer_size
 */
type HTTP_RESPONSE_TRANSFER_SIZE_TYPE = number;
/**
 * The matched route, that is, the path template in the format used by the respective server framework. `http.route`
 *
 * Attribute Value Type: `string` {@link HTTP_ROUTE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link URL_TEMPLATE} `url.template`
 *
 * @example "/users/:id"
 */
declare const HTTP_ROUTE = "http.route";
/**
 * Type for {@link HTTP_ROUTE} http.route
 */
type HTTP_ROUTE_TYPE = string;
/**
 * The URI scheme component identifying the used protocol. `http.scheme`
 *
 * Attribute Value Type: `string` {@link HTTP_SCHEME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link URL_SCHEME} `url.scheme`
 *
 * @deprecated Use {@link URL_SCHEME} (url.scheme) instead
 * @example "https"
 */
declare const HTTP_SCHEME = "http.scheme";
/**
 * Type for {@link HTTP_SCHEME} http.scheme
 */
type HTTP_SCHEME_TYPE = string;
/**
 * The server domain name `http.server_name`
 *
 * Attribute Value Type: `string` {@link HTTP_SERVER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SERVER_ADDRESS} `server.address`, {@link NET_HOST_NAME} `net.host.name`, {@link HTTP_HOST} `http.host`, {@link SERVER_NAME} `server_name`
 *
 * @deprecated Use {@link SERVER_ADDRESS} (server.address) instead
 * @example "example.com"
 */
declare const HTTP_SERVER_NAME = "http.server_name";
/**
 * Type for {@link HTTP_SERVER_NAME} http.server_name
 */
type HTTP_SERVER_NAME_TYPE = string;
/**
 * The time in milliseconds the request spent in the server queue before processing began. Measured from the X-Request-Start header set by reverse proxies (e.g., Nginx, HAProxy, Heroku) to when the application started handling the request. `http.server.request.time_in_queue`
 *
 * Attribute Value Type: `number` {@link HTTP_SERVER_REQUEST_TIME_IN_QUEUE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 50
 */
declare const HTTP_SERVER_REQUEST_TIME_IN_QUEUE = "http.server.request.time_in_queue";
/**
 * Type for {@link HTTP_SERVER_REQUEST_TIME_IN_QUEUE} http.server.request.time_in_queue
 */
type HTTP_SERVER_REQUEST_TIME_IN_QUEUE_TYPE = number;
/**
 * The status code of the HTTP response. `http.status_code`
 *
 * Attribute Value Type: `number` {@link HTTP_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_RESPONSE_STATUS_CODE} `http.response.status_code`
 *
 * @deprecated Use {@link HTTP_RESPONSE_STATUS_CODE} (http.response.status_code) instead
 * @example 404
 */
declare const HTTP_STATUS_CODE = "http.status_code";
/**
 * Type for {@link HTTP_STATUS_CODE} http.status_code
 */
type HTTP_STATUS_CODE_TYPE = number;
/**
 * The pathname and query string of the URL. `http.target`
 *
 * Attribute Value Type: `string` {@link HTTP_TARGET_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link URL_PATH} (url.path) instead - This attribute is being deprecated in favor of url.path and url.query
 * @example "/test?foo=bar#buzz"
 */
declare const HTTP_TARGET = "http.target";
/**
 * Type for {@link HTTP_TARGET} http.target
 */
type HTTP_TARGET_TYPE = string;
/**
 * The URL of the resource that was fetched. `http.url`
 *
 * Attribute Value Type: `string` {@link HTTP_URL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link URL_FULL} `url.full`, {@link URL} `url`
 *
 * @deprecated Use {@link URL_FULL} (url.full) instead
 * @example "https://example.com/test?foo=bar#buzz"
 */
declare const HTTP_URL = "http.url";
/**
 * Type for {@link HTTP_URL} http.url
 */
type HTTP_URL_TYPE = string;
/**
 * Value of the HTTP User-Agent header sent by the client. `http.user_agent`
 *
 * Attribute Value Type: `string` {@link HTTP_USER_AGENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link USER_AGENT_ORIGINAL} `user_agent.original`
 *
 * @deprecated Use {@link USER_AGENT_ORIGINAL} (user_agent.original) instead
 * @example "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
 */
declare const HTTP_USER_AGENT = "http.user_agent";
/**
 * Type for {@link HTTP_USER_AGENT} http.user_agent
 */
type HTTP_USER_AGENT_TYPE = string;
/**
 * A unique identifier for the span. `id`
 *
 * Attribute Value Type: `string` {@link ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "f47ac10b58cc4372a5670e02b2c3d479"
 */
declare const ID = "id";
/**
 * Type for {@link ID} id
 */
type ID_TYPE = string;
/**
 * The value of the recorded Interaction to Next Paint (INP) web vital `inp`
 *
 * Attribute Value Type: `number` {@link INP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_INP_VALUE} `browser.web_vital.inp.value`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_INP_VALUE} (browser.web_vital.inp.value) instead - The INP web vital is now recorded as a browser.web_vital.inp.value attribute.
 * @example 200
 */
declare const INP = "inp";
/**
 * Type for {@link INP} inp
 */
type INP_TYPE = number;
/**
 * The version of the JSON-RPC protocol used. `jsonrpc.protocol.version`
 *
 * Attribute Value Type: `string` {@link JSONRPC_PROTOCOL_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "2.0"
 */
declare const JSONRPC_PROTOCOL_VERSION = "jsonrpc.protocol.version";
/**
 * Type for {@link JSONRPC_PROTOCOL_VERSION} jsonrpc.protocol.version
 */
type JSONRPC_PROTOCOL_VERSION_TYPE = string;
/**
 * The JSON-RPC request identifier. Unique within the session. `jsonrpc.request.id`
 *
 * Attribute Value Type: `string` {@link JSONRPC_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link MCP_REQUEST_ID} `mcp.request.id`
 *
 * @example "1"
 */
declare const JSONRPC_REQUEST_ID = "jsonrpc.request.id";
/**
 * Type for {@link JSONRPC_REQUEST_ID} jsonrpc.request.id
 */
type JSONRPC_REQUEST_ID_TYPE = string;
/**
 * Name of the garbage collector action. `jvm.gc.action`
 *
 * Attribute Value Type: `string` {@link JVM_GC_ACTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "end of minor GC"
 */
declare const JVM_GC_ACTION = "jvm.gc.action";
/**
 * Type for {@link JVM_GC_ACTION} jvm.gc.action
 */
type JVM_GC_ACTION_TYPE = string;
/**
 * Name of the garbage collector. `jvm.gc.name`
 *
 * Attribute Value Type: `string` {@link JVM_GC_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "G1 Young Generation"
 */
declare const JVM_GC_NAME = "jvm.gc.name";
/**
 * Type for {@link JVM_GC_NAME} jvm.gc.name
 */
type JVM_GC_NAME_TYPE = string;
/**
 * Name of the memory pool. `jvm.memory.pool.name`
 *
 * Attribute Value Type: `string` {@link JVM_MEMORY_POOL_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "G1 Old Gen"
 */
declare const JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
/**
 * Type for {@link JVM_MEMORY_POOL_NAME} jvm.memory.pool.name
 */
type JVM_MEMORY_POOL_NAME_TYPE = string;
/**
 * Name of the memory pool. `jvm.memory.type`
 *
 * Attribute Value Type: `string` {@link JVM_MEMORY_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "G1 Old Gen"
 */
declare const JVM_MEMORY_TYPE = "jvm.memory.type";
/**
 * Type for {@link JVM_MEMORY_TYPE} jvm.memory.type
 */
type JVM_MEMORY_TYPE_TYPE = string;
/**
 * Whether the thread is daemon or not. `jvm.thread.daemon`
 *
 * Attribute Value Type: `boolean` {@link JVM_THREAD_DAEMON_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example true
 */
declare const JVM_THREAD_DAEMON = "jvm.thread.daemon";
/**
 * Type for {@link JVM_THREAD_DAEMON} jvm.thread.daemon
 */
type JVM_THREAD_DAEMON_TYPE = boolean;
/**
 * State of the thread. `jvm.thread.state`
 *
 * Attribute Value Type: `string` {@link JVM_THREAD_STATE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "blocked"
 */
declare const JVM_THREAD_STATE = "jvm.thread.state";
/**
 * Type for {@link JVM_THREAD_STATE} jvm.thread.state
 */
type JVM_THREAD_STATE_TYPE = string;
/**
 * The name of the Koa middleware or matched route that handled the request. `koa.name`
 *
 * Attribute Value Type: `string` {@link KOA_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated  - No single replacement. SDKs should use http.route for router layers and code.function.name for middleware layers instead.
 * @example "/users/:id"
 */
declare const KOA_NAME = "koa.name";
/**
 * Type for {@link KOA_NAME} koa.name
 */
type KOA_NAME_TYPE = string;
/**
 * The type of the Koa layer that handled the request. `koa.type`
 *
 * Attribute Value Type: `string` {@link KOA_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "router"
 */
declare const KOA_TYPE = "koa.type";
/**
 * Type for {@link KOA_TYPE} koa.type
 */
type KOA_TYPE_TYPE = string;
/**
 * The value of the recorded Largest Contentful Paint (LCP) web vital `lcp`
 *
 * Attribute Value Type: `number` {@link LCP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_VALUE} `browser.web_vital.lcp.value`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_VALUE} (browser.web_vital.lcp.value) instead - The LCP web vital is now recorded as a browser.web_vital.lcp.value attribute.
 * @example 2500
 */
declare const LCP = "lcp";
/**
 * Type for {@link LCP} lcp
 */
type LCP_TYPE = number;
/**
 * The dom element responsible for the largest contentful paint. `lcp.element`
 *
 * Attribute Value Type: `string` {@link LCP_ELEMENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_ELEMENT} `browser.web_vital.lcp.element`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_ELEMENT} (browser.web_vital.lcp.element) instead - The LCP element is now recorded as a browser.web_vital.lcp.element attribute.
 * @example "img"
 */
declare const LCP_ELEMENT = "lcp.element";
/**
 * Type for {@link LCP_ELEMENT} lcp.element
 */
type LCP_ELEMENT_TYPE = string;
/**
 * The id of the dom element responsible for the largest contentful paint. `lcp.id`
 *
 * Attribute Value Type: `string` {@link LCP_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_ID} `browser.web_vital.lcp.id`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_ID} (browser.web_vital.lcp.id) instead - The LCP id is now recorded as a browser.web_vital.lcp.id attribute.
 * @example "#hero"
 */
declare const LCP_ID = "lcp.id";
/**
 * Type for {@link LCP_ID} lcp.id
 */
type LCP_ID_TYPE = string;
/**
 * The time it took for the LCP element to be loaded `lcp.loadTime`
 *
 * Attribute Value Type: `number` {@link LCP_LOADTIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_LOAD_TIME} `browser.web_vital.lcp.load_time`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_LOAD_TIME} (browser.web_vital.lcp.load_time) instead - The LCP load time is now recorded as a browser.web_vital.lcp.load_time attribute.
 * @example 1402
 */
declare const LCP_LOADTIME = "lcp.loadTime";
/**
 * Type for {@link LCP_LOADTIME} lcp.loadTime
 */
type LCP_LOADTIME_TYPE = number;
/**
 * The time it took for the LCP element to be rendered `lcp.renderTime`
 *
 * Attribute Value Type: `number` {@link LCP_RENDERTIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_RENDER_TIME} `browser.web_vital.lcp.render_time`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_RENDER_TIME} (browser.web_vital.lcp.render_time) instead - The LCP render time is now recorded as a browser.web_vital.lcp.render_time attribute.
 * @example 1685
 */
declare const LCP_RENDERTIME = "lcp.renderTime";
/**
 * Type for {@link LCP_RENDERTIME} lcp.renderTime
 */
type LCP_RENDERTIME_TYPE = number;
/**
 * The size of the largest contentful paint element. `lcp.size`
 *
 * Attribute Value Type: `number` {@link LCP_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_SIZE} `browser.web_vital.lcp.size`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_SIZE} (browser.web_vital.lcp.size) instead - The LCP size is now recorded as a browser.web_vital.lcp.size attribute.
 * @example 1234
 */
declare const LCP_SIZE = "lcp.size";
/**
 * Type for {@link LCP_SIZE} lcp.size
 */
type LCP_SIZE_TYPE = number;
/**
 * The url of the dom element responsible for the largest contentful paint. `lcp.url`
 *
 * Attribute Value Type: `string` {@link LCP_URL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_LCP_URL} `browser.web_vital.lcp.url`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_LCP_URL} (browser.web_vital.lcp.url) instead - The LCP url is now recorded as a browser.web_vital.lcp.url attribute.
 * @example "https://example.com"
 */
declare const LCP_URL = "lcp.url";
/**
 * Type for {@link LCP_URL} lcp.url
 */
type LCP_URL_TYPE = string;
/**
 * The name of the logger that generated this event. `logger.name`
 *
 * Attribute Value Type: `string` {@link LOGGER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "myLogger"
 */
declare const LOGGER_NAME = "logger.name";
/**
 * Type for {@link LOGGER_NAME} logger.name
 */
type LOGGER_NAME_TYPE = string;
/**
 * Reason for the cancellation of an MCP operation. `mcp.cancelled.reason`
 *
 * Attribute Value Type: `string` {@link MCP_CANCELLED_REASON_TYPE}
 *
 * Apply Scrubbing: manual - Cancellation reasons may contain user-specific or sensitive information
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "User cancelled the request"
 */
declare const MCP_CANCELLED_REASON = "mcp.cancelled.reason";
/**
 * Type for {@link MCP_CANCELLED_REASON} mcp.cancelled.reason
 */
type MCP_CANCELLED_REASON_TYPE = string;
/**
 * Request ID of the cancelled MCP operation. `mcp.cancelled.request_id`
 *
 * Attribute Value Type: `string` {@link MCP_CANCELLED_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "123"
 */
declare const MCP_CANCELLED_REQUEST_ID = "mcp.cancelled.request_id";
/**
 * Type for {@link MCP_CANCELLED_REQUEST_ID} mcp.cancelled.request_id
 */
type MCP_CANCELLED_REQUEST_ID_TYPE = string;
/**
 * Name of the MCP client application. `mcp.client.name`
 *
 * Attribute Value Type: `string` {@link MCP_CLIENT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "claude-desktop"
 */
declare const MCP_CLIENT_NAME = "mcp.client.name";
/**
 * Type for {@link MCP_CLIENT_NAME} mcp.client.name
 */
type MCP_CLIENT_NAME_TYPE = string;
/**
 * Display title of the MCP client application. `mcp.client.title`
 *
 * Attribute Value Type: `string` {@link MCP_CLIENT_TITLE_TYPE}
 *
 * Apply Scrubbing: manual - Client titles may reveal user-specific application configurations or custom setups
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Claude Desktop"
 */
declare const MCP_CLIENT_TITLE = "mcp.client.title";
/**
 * Type for {@link MCP_CLIENT_TITLE} mcp.client.title
 */
type MCP_CLIENT_TITLE_TYPE = string;
/**
 * Version of the MCP client application. `mcp.client.version`
 *
 * Attribute Value Type: `string` {@link MCP_CLIENT_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1.0.0"
 */
declare const MCP_CLIENT_VERSION = "mcp.client.version";
/**
 * Type for {@link MCP_CLIENT_VERSION} mcp.client.version
 */
type MCP_CLIENT_VERSION_TYPE = string;
/**
 * Lifecycle phase indicator for MCP operations. `mcp.lifecycle.phase`
 *
 * Attribute Value Type: `string` {@link MCP_LIFECYCLE_PHASE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "initialization_complete"
 */
declare const MCP_LIFECYCLE_PHASE = "mcp.lifecycle.phase";
/**
 * Type for {@link MCP_LIFECYCLE_PHASE} mcp.lifecycle.phase
 */
type MCP_LIFECYCLE_PHASE_TYPE = string;
/**
 * Data type of the logged message content. `mcp.logging.data_type`
 *
 * Attribute Value Type: `string` {@link MCP_LOGGING_DATA_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "string"
 */
declare const MCP_LOGGING_DATA_TYPE = "mcp.logging.data_type";
/**
 * Type for {@link MCP_LOGGING_DATA_TYPE} mcp.logging.data_type
 */
type MCP_LOGGING_DATA_TYPE_TYPE = string;
/**
 * Log level for MCP logging operations. `mcp.logging.level`
 *
 * Attribute Value Type: `string` {@link MCP_LOGGING_LEVEL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "info"
 */
declare const MCP_LOGGING_LEVEL = "mcp.logging.level";
/**
 * Type for {@link MCP_LOGGING_LEVEL} mcp.logging.level
 */
type MCP_LOGGING_LEVEL_TYPE = string;
/**
 * Logger name for MCP logging operations. `mcp.logging.logger`
 *
 * Attribute Value Type: `string` {@link MCP_LOGGING_LOGGER_TYPE}
 *
 * Apply Scrubbing: manual - Logger names may be user-defined and could contain sensitive information
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "mcp_server"
 */
declare const MCP_LOGGING_LOGGER = "mcp.logging.logger";
/**
 * Type for {@link MCP_LOGGING_LOGGER} mcp.logging.logger
 */
type MCP_LOGGING_LOGGER_TYPE = string;
/**
 * Log message content from MCP logging operations. `mcp.logging.message`
 *
 * Attribute Value Type: `string` {@link MCP_LOGGING_MESSAGE_TYPE}
 *
 * Apply Scrubbing: auto - Log messages can contain user data
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Tool execution completed successfully"
 */
declare const MCP_LOGGING_MESSAGE = "mcp.logging.message";
/**
 * Type for {@link MCP_LOGGING_MESSAGE} mcp.logging.message
 */
type MCP_LOGGING_MESSAGE_TYPE = string;
/**
 * The name of the MCP request or notification method being called. `mcp.method.name`
 *
 * Attribute Value Type: `string` {@link MCP_METHOD_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "tools/call"
 */
declare const MCP_METHOD_NAME = "mcp.method.name";
/**
 * Type for {@link MCP_METHOD_NAME} mcp.method.name
 */
type MCP_METHOD_NAME_TYPE = string;
/**
 * Current progress value of an MCP operation. `mcp.progress.current`
 *
 * Attribute Value Type: `number` {@link MCP_PROGRESS_CURRENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 50
 */
declare const MCP_PROGRESS_CURRENT = "mcp.progress.current";
/**
 * Type for {@link MCP_PROGRESS_CURRENT} mcp.progress.current
 */
type MCP_PROGRESS_CURRENT_TYPE = number;
/**
 * Progress message describing the current state of an MCP operation. `mcp.progress.message`
 *
 * Attribute Value Type: `string` {@link MCP_PROGRESS_MESSAGE_TYPE}
 *
 * Apply Scrubbing: manual - Progress messages may contain user-specific or sensitive information
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Processing 50 of 100 items"
 */
declare const MCP_PROGRESS_MESSAGE = "mcp.progress.message";
/**
 * Type for {@link MCP_PROGRESS_MESSAGE} mcp.progress.message
 */
type MCP_PROGRESS_MESSAGE_TYPE = string;
/**
 * Calculated progress percentage of an MCP operation. Computed from current/total * 100. `mcp.progress.percentage`
 *
 * Attribute Value Type: `number` {@link MCP_PROGRESS_PERCENTAGE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 50
 */
declare const MCP_PROGRESS_PERCENTAGE = "mcp.progress.percentage";
/**
 * Type for {@link MCP_PROGRESS_PERCENTAGE} mcp.progress.percentage
 */
type MCP_PROGRESS_PERCENTAGE_TYPE = number;
/**
 * Token for tracking progress of an MCP operation. `mcp.progress.token`
 *
 * Attribute Value Type: `string` {@link MCP_PROGRESS_TOKEN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "progress-token-123"
 */
declare const MCP_PROGRESS_TOKEN = "mcp.progress.token";
/**
 * Type for {@link MCP_PROGRESS_TOKEN} mcp.progress.token
 */
type MCP_PROGRESS_TOKEN_TYPE = string;
/**
 * Total progress target value of an MCP operation. `mcp.progress.total`
 *
 * Attribute Value Type: `number` {@link MCP_PROGRESS_TOTAL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 100
 */
declare const MCP_PROGRESS_TOTAL = "mcp.progress.total";
/**
 * Type for {@link MCP_PROGRESS_TOTAL} mcp.progress.total
 */
type MCP_PROGRESS_TOTAL_TYPE = number;
/**
 * Name of the MCP prompt template being used. `mcp.prompt.name`
 *
 * Attribute Value Type: `string` {@link MCP_PROMPT_NAME_TYPE}
 *
 * Apply Scrubbing: manual - Prompt names may reveal user behavior patterns or sensitive operations
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_PROMPT_NAME} `gen_ai.prompt.name`
 *
 * @deprecated Use {@link GEN_AI_PROMPT_NAME} (gen_ai.prompt.name) instead - OTel uses gen_ai.prompt.name for MCP prompt names
 * @example "summarize"
 */
declare const MCP_PROMPT_NAME = "mcp.prompt.name";
/**
 * Type for {@link MCP_PROMPT_NAME} mcp.prompt.name
 */
type MCP_PROMPT_NAME_TYPE = string;
/**
 * Description of the prompt result. `mcp.prompt.result.description`
 *
 * Attribute Value Type: `string` {@link MCP_PROMPT_RESULT_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "A summary of the requested information"
 */
declare const MCP_PROMPT_RESULT_DESCRIPTION = "mcp.prompt.result.description";
/**
 * Type for {@link MCP_PROMPT_RESULT_DESCRIPTION} mcp.prompt.result.description
 */
type MCP_PROMPT_RESULT_DESCRIPTION_TYPE = string;
/**
 * Content of the message in the prompt result. Used for single message results only. `mcp.prompt.result.message_content`
 *
 * Attribute Value Type: `string` {@link MCP_PROMPT_RESULT_MESSAGE_CONTENT_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Please provide a summary of the document"
 */
declare const MCP_PROMPT_RESULT_MESSAGE_CONTENT = "mcp.prompt.result.message_content";
/**
 * Type for {@link MCP_PROMPT_RESULT_MESSAGE_CONTENT} mcp.prompt.result.message_content
 */
type MCP_PROMPT_RESULT_MESSAGE_CONTENT_TYPE = string;
/**
 * Number of messages in the prompt result. `mcp.prompt.result.message_count`
 *
 * Attribute Value Type: `number` {@link MCP_PROMPT_RESULT_MESSAGE_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 3
 */
declare const MCP_PROMPT_RESULT_MESSAGE_COUNT = "mcp.prompt.result.message_count";
/**
 * Type for {@link MCP_PROMPT_RESULT_MESSAGE_COUNT} mcp.prompt.result.message_count
 */
type MCP_PROMPT_RESULT_MESSAGE_COUNT_TYPE = number;
/**
 * Role of the message in the prompt result. Used for single message results only. `mcp.prompt.result.message_role`
 *
 * Attribute Value Type: `string` {@link MCP_PROMPT_RESULT_MESSAGE_ROLE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "user"
 */
declare const MCP_PROMPT_RESULT_MESSAGE_ROLE = "mcp.prompt.result.message_role";
/**
 * Type for {@link MCP_PROMPT_RESULT_MESSAGE_ROLE} mcp.prompt.result.message_role
 */
type MCP_PROMPT_RESULT_MESSAGE_ROLE_TYPE = string;
/**
 * Protocol readiness indicator for MCP session. Non-zero value indicates the protocol is ready. `mcp.protocol.ready`
 *
 * Attribute Value Type: `number` {@link MCP_PROTOCOL_READY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const MCP_PROTOCOL_READY = "mcp.protocol.ready";
/**
 * Type for {@link MCP_PROTOCOL_READY} mcp.protocol.ready
 */
type MCP_PROTOCOL_READY_TYPE = number;
/**
 * MCP protocol version used in the session. `mcp.protocol.version`
 *
 * Attribute Value Type: `string` {@link MCP_PROTOCOL_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "2024-11-05"
 */
declare const MCP_PROTOCOL_VERSION = "mcp.protocol.version";
/**
 * Type for {@link MCP_PROTOCOL_VERSION} mcp.protocol.version
 */
type MCP_PROTOCOL_VERSION_TYPE = string;
/**
 * MCP request argument with dynamic key suffix. The <key> is replaced with the actual argument name. The value is a JSON-stringified representation of the argument value. `mcp.request.argument.<key>`
 *
 * Attribute Value Type: `string` {@link MCP_REQUEST_ARGUMENT_KEY_TYPE}
 *
 * Apply Scrubbing: auto - Arguments contain user input
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "mcp.request.argument.query='weather in Paris'"
 */
declare const MCP_REQUEST_ARGUMENT_KEY = "mcp.request.argument.<key>";
/**
 * Base key for {@link MCP_REQUEST_ARGUMENT_KEY}. Use with a dynamic suffix, e.g. `${MCP_REQUEST_ARGUMENT_KEY_BASE}.${key}`.
 */
declare const MCP_REQUEST_ARGUMENT_KEY_BASE = "mcp.request.argument";
/**
 * Type for {@link MCP_REQUEST_ARGUMENT_KEY} mcp.request.argument.<key>
 */
type MCP_REQUEST_ARGUMENT_KEY_TYPE = string;
/**
 * Name argument from prompts/get MCP request. `mcp.request.argument.name`
 *
 * Attribute Value Type: `string` {@link MCP_REQUEST_ARGUMENT_NAME_TYPE}
 *
 * Apply Scrubbing: auto - Prompt names can contain user input
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "summarize"
 */
declare const MCP_REQUEST_ARGUMENT_NAME = "mcp.request.argument.name";
/**
 * Type for {@link MCP_REQUEST_ARGUMENT_NAME} mcp.request.argument.name
 */
type MCP_REQUEST_ARGUMENT_NAME_TYPE = string;
/**
 * URI argument from resources/read MCP request. `mcp.request.argument.uri`
 *
 * Attribute Value Type: `string` {@link MCP_REQUEST_ARGUMENT_URI_TYPE}
 *
 * Apply Scrubbing: auto - URIs can contain user file paths
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "file:///path/to/resource"
 */
declare const MCP_REQUEST_ARGUMENT_URI = "mcp.request.argument.uri";
/**
 * Type for {@link MCP_REQUEST_ARGUMENT_URI} mcp.request.argument.uri
 */
type MCP_REQUEST_ARGUMENT_URI_TYPE = string;
/**
 * JSON-RPC request identifier for the MCP request. Unique within the MCP session. `mcp.request.id`
 *
 * Attribute Value Type: `string` {@link MCP_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link JSONRPC_REQUEST_ID} `jsonrpc.request.id`
 *
 * @deprecated Use {@link JSONRPC_REQUEST_ID} (jsonrpc.request.id) instead - OTel models MCP as JSON-RPC, uses jsonrpc.request.id
 * @example "1"
 */
declare const MCP_REQUEST_ID = "mcp.request.id";
/**
 * Type for {@link MCP_REQUEST_ID} mcp.request.id
 */
type MCP_REQUEST_ID_TYPE = string;
/**
 * Protocol of the resource URI being accessed, extracted from the URI. `mcp.resource.protocol`
 *
 * Attribute Value Type: `string` {@link MCP_RESOURCE_PROTOCOL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NETWORK_PROTOCOL_NAME} `network.protocol.name`, {@link NET_PROTOCOL_NAME} `net.protocol.name`
 *
 * @deprecated Use {@link NETWORK_PROTOCOL_NAME} (network.protocol.name) instead - OTel uses the generic network.protocol.name attribute
 * @example "file"
 */
declare const MCP_RESOURCE_PROTOCOL = "mcp.resource.protocol";
/**
 * Type for {@link MCP_RESOURCE_PROTOCOL} mcp.resource.protocol
 */
type MCP_RESOURCE_PROTOCOL_TYPE = string;
/**
 * The resource URI being accessed in an MCP operation. `mcp.resource.uri`
 *
 * Attribute Value Type: `string` {@link MCP_RESOURCE_URI_TYPE}
 *
 * Apply Scrubbing: auto - URIs can contain sensitive file paths
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "file:///path/to/file.txt"
 */
declare const MCP_RESOURCE_URI = "mcp.resource.uri";
/**
 * Type for {@link MCP_RESOURCE_URI} mcp.resource.uri
 */
type MCP_RESOURCE_URI_TYPE = string;
/**
 * Name of the MCP server application. `mcp.server.name`
 *
 * Attribute Value Type: `string` {@link MCP_SERVER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "sentry-mcp-server"
 */
declare const MCP_SERVER_NAME = "mcp.server.name";
/**
 * Type for {@link MCP_SERVER_NAME} mcp.server.name
 */
type MCP_SERVER_NAME_TYPE = string;
/**
 * Display title of the MCP server application. `mcp.server.title`
 *
 * Attribute Value Type: `string` {@link MCP_SERVER_TITLE_TYPE}
 *
 * Apply Scrubbing: manual - Server titles may reveal user-specific application configurations or custom setups
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Sentry MCP Server"
 */
declare const MCP_SERVER_TITLE = "mcp.server.title";
/**
 * Type for {@link MCP_SERVER_TITLE} mcp.server.title
 */
type MCP_SERVER_TITLE_TYPE = string;
/**
 * Version of the MCP server application. `mcp.server.version`
 *
 * Attribute Value Type: `string` {@link MCP_SERVER_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "0.1.0"
 */
declare const MCP_SERVER_VERSION = "mcp.server.version";
/**
 * Type for {@link MCP_SERVER_VERSION} mcp.server.version
 */
type MCP_SERVER_VERSION_TYPE = string;
/**
 * Identifier for the MCP session. `mcp.session.id`
 *
 * Attribute Value Type: `string` {@link MCP_SESSION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
declare const MCP_SESSION_ID = "mcp.session.id";
/**
 * Type for {@link MCP_SESSION_ID} mcp.session.id
 */
type MCP_SESSION_ID_TYPE = string;
/**
 * Name of the MCP tool being called. `mcp.tool.name`
 *
 * Attribute Value Type: `string` {@link MCP_TOOL_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_NAME} `gen_ai.tool.name`, {@link AI_FUNCTION_CALL} `ai.function_call`
 *
 * @deprecated Use {@link GEN_AI_TOOL_NAME} (gen_ai.tool.name) instead - OTel uses gen_ai.tool.name for MCP tool names
 * @example "calculator"
 */
declare const MCP_TOOL_NAME = "mcp.tool.name";
/**
 * Type for {@link MCP_TOOL_NAME} mcp.tool.name
 */
type MCP_TOOL_NAME_TYPE = string;
/**
 * The content of the tool result. `mcp.tool.result.content`
 *
 * Attribute Value Type: `string` {@link MCP_TOOL_RESULT_CONTENT_TYPE}
 *
 * Apply Scrubbing: auto - Tool results can contain user data
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link GEN_AI_TOOL_CALL_RESULT} `gen_ai.tool.call.result`, {@link GEN_AI_TOOL_MESSAGE} `gen_ai.tool.message`, {@link GEN_AI_TOOL_OUTPUT} `gen_ai.tool.output`
 *
 * @deprecated Use {@link GEN_AI_TOOL_CALL_RESULT} (gen_ai.tool.call.result) instead - OTel uses gen_ai.tool.call.result for MCP tool results
 * @example "{\"output\": \"rainy\", \"toolCallId\": \"1\"}"
 */
declare const MCP_TOOL_RESULT_CONTENT = "mcp.tool.result.content";
/**
 * Type for {@link MCP_TOOL_RESULT_CONTENT} mcp.tool.result.content
 */
type MCP_TOOL_RESULT_CONTENT_TYPE = string;
/**
 * Number of content items in the tool result. `mcp.tool.result.content_count`
 *
 * Attribute Value Type: `number` {@link MCP_TOOL_RESULT_CONTENT_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1
 */
declare const MCP_TOOL_RESULT_CONTENT_COUNT = "mcp.tool.result.content_count";
/**
 * Type for {@link MCP_TOOL_RESULT_CONTENT_COUNT} mcp.tool.result.content_count
 */
type MCP_TOOL_RESULT_CONTENT_COUNT_TYPE = number;
/**
 * Whether a tool execution resulted in an error. `mcp.tool.result.is_error`
 *
 * Attribute Value Type: `boolean` {@link MCP_TOOL_RESULT_IS_ERROR_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link ERROR_TYPE} (error.type) instead - OTel uses error.type set to 'tool_error' when isError is true. Cannot be automatically backfilled due to type mismatch (boolean vs string).
 * @example false
 */
declare const MCP_TOOL_RESULT_IS_ERROR = "mcp.tool.result.is_error";
/**
 * Type for {@link MCP_TOOL_RESULT_IS_ERROR} mcp.tool.result.is_error
 */
type MCP_TOOL_RESULT_IS_ERROR_TYPE = boolean;
/**
 * Transport method used for MCP communication. `mcp.transport`
 *
 * Attribute Value Type: `string` {@link MCP_TRANSPORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NETWORK_TRANSPORT} `network.transport`, {@link NET_TRANSPORT} `net.transport`
 *
 * @deprecated Use {@link NETWORK_TRANSPORT} (network.transport) instead - OTel uses the generic network.transport attribute
 * @example "stdio"
 */
declare const MCP_TRANSPORT = "mcp.transport";
/**
 * Type for {@link MCP_TRANSPORT} mcp.transport
 */
type MCP_TRANSPORT_TYPE = string;
/**
 * Attributes from the Mapped Diagnostic Context (MDC) present at the moment the log record was created. The MDC is supported by all the most popular logging solutions in the Java ecosystem, and it's usually implemented as a thread-local map that stores context for e.g. a specific request. `mdc.<key>`
 *
 * Attribute Value Type: `string` {@link MDC_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "mdc.some_key='some_value'"
 */
declare const MDC_KEY = "mdc.<key>";
/**
 * Base key for {@link MDC_KEY}. Use with a dynamic suffix, e.g. `${MDC_KEY_BASE}.${key}`.
 */
declare const MDC_KEY_BASE = "mdc";
/**
 * Type for {@link MDC_KEY} mdc.<key>
 */
type MDC_KEY_TYPE = string;
/**
 * The number of messages sent, received, or processed in the scope of the batching operation. `messaging.batch.message_count`
 *
 * Attribute Value Type: `number` {@link MESSAGING_BATCH_MESSAGE_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 10
 */
declare const MESSAGING_BATCH_MESSAGE_COUNT = "messaging.batch.message_count";
/**
 * Type for {@link MESSAGING_BATCH_MESSAGE_COUNT} messaging.batch.message_count
 */
type MESSAGING_BATCH_MESSAGE_COUNT_TYPE = number;
/**
 * The message destination name. `messaging.destination`
 *
 * Attribute Value Type: `string` {@link MESSAGING_DESTINATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link MESSAGING_DESTINATION_NAME} `messaging.destination.name`
 *
 * @deprecated Use {@link MESSAGING_DESTINATION_NAME} (messaging.destination.name) instead - This attribute is being deprecated in favor of messaging.destination.name, which is the OTel-aligned replacement.
 * @example "BestTopic"
 */
declare const MESSAGING_DESTINATION = "messaging.destination";
/**
 * Type for {@link MESSAGING_DESTINATION} messaging.destination
 */
type MESSAGING_DESTINATION_TYPE = string;
/**
 * The message destination connection. `messaging.destination.connection`
 *
 * Attribute Value Type: `string` {@link MESSAGING_DESTINATION_CONNECTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "BestTopic"
 */
declare const MESSAGING_DESTINATION_CONNECTION = "messaging.destination.connection";
/**
 * Type for {@link MESSAGING_DESTINATION_CONNECTION} messaging.destination.connection
 */
type MESSAGING_DESTINATION_CONNECTION_TYPE = string;
/**
 * The message destination name. `messaging.destination.name`
 *
 * Attribute Value Type: `string` {@link MESSAGING_DESTINATION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link MESSAGING_DESTINATION} `messaging.destination`
 *
 * @example "BestTopic"
 */
declare const MESSAGING_DESTINATION_NAME = "messaging.destination.name";
/**
 * Type for {@link MESSAGING_DESTINATION_NAME} messaging.destination.name
 */
type MESSAGING_DESTINATION_NAME_TYPE = string;
/**
 * The size of the message body in bytes. `messaging.message.body.size`
 *
 * Attribute Value Type: `number` {@link MESSAGING_MESSAGE_BODY_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 839
 */
declare const MESSAGING_MESSAGE_BODY_SIZE = "messaging.message.body.size";
/**
 * Type for {@link MESSAGING_MESSAGE_BODY_SIZE} messaging.message.body.size
 */
type MESSAGING_MESSAGE_BODY_SIZE_TYPE = number;
/**
 * The conversation ID identifying the conversation to which the message belongs, represented as a string. Sometimes called "Correlation ID". `messaging.message.conversation_id`
 *
 * Attribute Value Type: `string` {@link MESSAGING_MESSAGE_CONVERSATION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "MyConversationId"
 */
declare const MESSAGING_MESSAGE_CONVERSATION_ID = "messaging.message.conversation_id";
/**
 * Type for {@link MESSAGING_MESSAGE_CONVERSATION_ID} messaging.message.conversation_id
 */
type MESSAGING_MESSAGE_CONVERSATION_ID_TYPE = string;
/**
 * The size of the message body and metadata in bytes. `messaging.message.envelope.size`
 *
 * Attribute Value Type: `number` {@link MESSAGING_MESSAGE_ENVELOPE_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 1045
 */
declare const MESSAGING_MESSAGE_ENVELOPE_SIZE = "messaging.message.envelope.size";
/**
 * Type for {@link MESSAGING_MESSAGE_ENVELOPE_SIZE} messaging.message.envelope.size
 */
type MESSAGING_MESSAGE_ENVELOPE_SIZE_TYPE = number;
/**
 * A value used by the messaging system as an identifier for the message, represented as a string. `messaging.message.id`
 *
 * Attribute Value Type: `string` {@link MESSAGING_MESSAGE_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "f47ac10b58cc4372a5670e02b2c3d479"
 */
declare const MESSAGING_MESSAGE_ID = "messaging.message.id";
/**
 * Type for {@link MESSAGING_MESSAGE_ID} messaging.message.id
 */
type MESSAGING_MESSAGE_ID_TYPE = string;
/**
 * The latency between when the message was published and received. `messaging.message.receive.latency`
 *
 * Attribute Value Type: `number` {@link MESSAGING_MESSAGE_RECEIVE_LATENCY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1732847252
 */
declare const MESSAGING_MESSAGE_RECEIVE_LATENCY = "messaging.message.receive.latency";
/**
 * Type for {@link MESSAGING_MESSAGE_RECEIVE_LATENCY} messaging.message.receive.latency
 */
type MESSAGING_MESSAGE_RECEIVE_LATENCY_TYPE = number;
/**
 * The amount of attempts to send the message. `messaging.message.retry.count`
 *
 * Attribute Value Type: `number` {@link MESSAGING_MESSAGE_RETRY_COUNT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 2
 */
declare const MESSAGING_MESSAGE_RETRY_COUNT = "messaging.message.retry.count";
/**
 * Type for {@link MESSAGING_MESSAGE_RETRY_COUNT} messaging.message.retry.count
 */
type MESSAGING_MESSAGE_RETRY_COUNT_TYPE = number;
/**
 * The name of the messaging operation being performed `messaging.operation.name`
 *
 * Attribute Value Type: `string` {@link MESSAGING_OPERATION_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "send"
 */
declare const MESSAGING_OPERATION_NAME = "messaging.operation.name";
/**
 * Type for {@link MESSAGING_OPERATION_NAME} messaging.operation.name
 */
type MESSAGING_OPERATION_NAME_TYPE = string;
/**
 * A string identifying the type of the messaging operation `messaging.operation.type`
 *
 * Attribute Value Type: `string` {@link MESSAGING_OPERATION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "create"
 */
declare const MESSAGING_OPERATION_TYPE = "messaging.operation.type";
/**
 * Type for {@link MESSAGING_OPERATION_TYPE} messaging.operation.type
 */
type MESSAGING_OPERATION_TYPE_TYPE = string;
/**
 * RabbitMQ message routing key. `messaging.rabbitmq.destination.routing_key`
 *
 * Attribute Value Type: `string` {@link MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "myKey"
 */
declare const MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY = "messaging.rabbitmq.destination.routing_key";
/**
 * Type for {@link MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY} messaging.rabbitmq.destination.routing_key
 */
type MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY_TYPE = string;
/**
 * The messaging system as identified by the client instrumentation. `messaging.system`
 *
 * Attribute Value Type: `string` {@link MESSAGING_SYSTEM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "activemq"
 */
declare const MESSAGING_SYSTEM = "messaging.system";
/**
 * Type for {@link MESSAGING_SYSTEM} messaging.system
 */
type MESSAGING_SYSTEM_TYPE = string;
/**
 * The HTTP method used. `method`
 *
 * Attribute Value Type: `string` {@link METHOD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link HTTP_REQUEST_METHOD} `http.request.method`, {@link _HTTP_REQUEST_METHOD} `http.request_method`, {@link HTTP_METHOD} `http.method`
 *
 * @deprecated Use {@link HTTP_REQUEST_METHOD} (http.request.method) instead
 * @example "GET"
 */
declare const METHOD = "method";
/**
 * Type for {@link METHOD} method
 */
type METHOD_TYPE = string;
/**
 * The name of the middleware. `middleware.name`
 *
 * Attribute Value Type: `string` {@link MIDDLEWARE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "AuthenticationMiddleware"
 */
declare const MIDDLEWARE_NAME = "middleware.name";
/**
 * Type for {@link MIDDLEWARE_NAME} middleware.name
 */
type MIDDLEWARE_NAME_TYPE = string;
/**
 * The origin of the navigation (usually client side router navigations). Should preferrably parameterized template (like url.template) or a URL path otherwise. `navigation.origin`
 *
 * Attribute Value Type: `string` {@link NAVIGATION_ORIGIN_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_SVELTEKIT_NAVIGATION_FROM} `sentry.sveltekit.navigation.from`
 *
 * @example "/users/:id"
 */
declare const NAVIGATION_ORIGIN = "navigation.origin";
/**
 * Type for {@link NAVIGATION_ORIGIN} navigation.origin
 */
type NAVIGATION_ORIGIN_TYPE = string;
/**
 * The identifier of the matched client-side route, as assigned by the routing framework (e.g., vue-router name, react-router id). `navigation.route.id`
 *
 * Attribute Value Type: `string` {@link NAVIGATION_ROUTE_ID_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "AboutView"
 */
declare const NAVIGATION_ROUTE_ID = "navigation.route.id";
/**
 * Type for {@link NAVIGATION_ROUTE_ID} navigation.route.id
 */
type NAVIGATION_ROUTE_ID_TYPE = string;
/**
 * The type of navigation done by a client-side router. `navigation.type`
 *
 * Attribute Value Type: `string` {@link NAVIGATION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_SVELTEKIT_NAVIGATION_TYPE} `sentry.sveltekit.navigation.type`
 *
 * @example "router.push"
 */
declare const NAVIGATION_TYPE = "navigation.type";
/**
 * Type for {@link NAVIGATION_TYPE} navigation.type
 */
type NAVIGATION_TYPE_TYPE = string;
/**
 * The elapsed number of milliseconds between the start of the resource fetch and when it was completed or aborted by the user agent. `nel.elapsed_time`
 *
 * Attribute Value Type: `number` {@link NEL_ELAPSED_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 100
 */
declare const NEL_ELAPSED_TIME = "nel.elapsed_time";
/**
 * Type for {@link NEL_ELAPSED_TIME} nel.elapsed_time
 */
type NEL_ELAPSED_TIME_TYPE = number;
/**
 * If request failed, the phase of its network error. If request succeeded, "application". `nel.phase`
 *
 * Attribute Value Type: `string` {@link NEL_PHASE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "application"
 */
declare const NEL_PHASE = "nel.phase";
/**
 * Type for {@link NEL_PHASE} nel.phase
 */
type NEL_PHASE_TYPE = string;
/**
 * request's referrer, as determined by the referrer policy associated with its client. `nel.referrer`
 *
 * Attribute Value Type: `string` {@link NEL_REFERRER_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "https://example.com/foo?bar=baz"
 */
declare const NEL_REFERRER = "nel.referrer";
/**
 * Type for {@link NEL_REFERRER} nel.referrer
 */
type NEL_REFERRER_TYPE = string;
/**
 * The sampling function used to determine if the request should be sampled. `nel.sampling_function`
 *
 * Attribute Value Type: `number` {@link NEL_SAMPLING_FUNCTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 0.5
 */
declare const NEL_SAMPLING_FUNCTION = "nel.sampling_function";
/**
 * Type for {@link NEL_SAMPLING_FUNCTION} nel.sampling_function
 */
type NEL_SAMPLING_FUNCTION_TYPE = number;
/**
 * If request failed, the type of its network error. If request succeeded, "ok". `nel.type`
 *
 * Attribute Value Type: `string` {@link NEL_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "dns.unreachable"
 */
declare const NEL_TYPE = "nel.type";
/**
 * Type for {@link NEL_TYPE} nel.type
 */
type NEL_TYPE_TYPE = string;
/**
 * Specifies the effective type of the current connection (e.g. slow-2g, 2g, 3g, 4g). `network.connection.effective_type`
 *
 * Attribute Value Type: `string` {@link NETWORK_CONNECTION_EFFECTIVE_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link EFFECTIVECONNECTIONTYPE} `effectiveConnectionType`
 *
 * @example "4g"
 */
declare const NETWORK_CONNECTION_EFFECTIVE_TYPE = "network.connection.effective_type";
/**
 * Type for {@link NETWORK_CONNECTION_EFFECTIVE_TYPE} network.connection.effective_type
 */
type NETWORK_CONNECTION_EFFECTIVE_TYPE_TYPE = string;
/**
 * Specifies the estimated effective round-trip time of the current connection, in milliseconds. `network.connection.rtt`
 *
 * Attribute Value Type: `number` {@link NETWORK_CONNECTION_RTT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link CONNECTION_RTT} `connection.rtt`
 *
 * @example 100
 */
declare const NETWORK_CONNECTION_RTT = "network.connection.rtt";
/**
 * Type for {@link NETWORK_CONNECTION_RTT} network.connection.rtt
 */
type NETWORK_CONNECTION_RTT_TYPE = number;
/**
 * Specifies the type of the current connection (e.g. wifi, ethernet, cellular , etc). `network.connection.type`
 *
 * Attribute Value Type: `string` {@link NETWORK_CONNECTION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link DEVICE_CONNECTION_TYPE} `device.connection_type`, {@link CONNECTIONTYPE} `connectionType`
 *
 * @example "wifi"
 */
declare const NETWORK_CONNECTION_TYPE = "network.connection.type";
/**
 * Type for {@link NETWORK_CONNECTION_TYPE} network.connection.type
 */
type NETWORK_CONNECTION_TYPE_TYPE = string;
/**
 * Local address of the network connection - IP address or Unix domain socket name. `network.local.address`
 *
 * Attribute Value Type: `string` {@link NETWORK_LOCAL_ADDRESS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NET_HOST_IP} `net.host.ip`, {@link NET_SOCK_HOST_ADDR} `net.sock.host.addr`
 *
 * @example "10.1.2.80"
 */
declare const NETWORK_LOCAL_ADDRESS = "network.local.address";
/**
 * Type for {@link NETWORK_LOCAL_ADDRESS} network.local.address
 */
type NETWORK_LOCAL_ADDRESS_TYPE = string;
/**
 * Local port number of the network connection. `network.local.port`
 *
 * Attribute Value Type: `number` {@link NETWORK_LOCAL_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NET_SOCK_HOST_PORT} `net.sock.host.port`
 *
 * @example 65400
 */
declare const NETWORK_LOCAL_PORT = "network.local.port";
/**
 * Type for {@link NETWORK_LOCAL_PORT} network.local.port
 */
type NETWORK_LOCAL_PORT_TYPE = number;
/**
 * Peer address of the network connection - IP address or Unix domain socket name. `network.peer.address`
 *
 * Attribute Value Type: `string` {@link NETWORK_PEER_ADDRESS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NET_PEER_IP} `net.peer.ip`, {@link NET_SOCK_PEER_ADDR} `net.sock.peer.addr`
 *
 * @example "10.1.2.80"
 */
declare const NETWORK_PEER_ADDRESS = "network.peer.address";
/**
 * Type for {@link NETWORK_PEER_ADDRESS} network.peer.address
 */
type NETWORK_PEER_ADDRESS_TYPE = string;
/**
 * Peer port number of the network connection. `network.peer.port`
 *
 * Attribute Value Type: `number` {@link NETWORK_PEER_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 65400
 */
declare const NETWORK_PEER_PORT = "network.peer.port";
/**
 * Type for {@link NETWORK_PEER_PORT} network.peer.port
 */
type NETWORK_PEER_PORT_TYPE = number;
/**
 * OSI application layer or non-OSI equivalent. `network.protocol.name`
 *
 * Attribute Value Type: `string` {@link NETWORK_PROTOCOL_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NET_PROTOCOL_NAME} `net.protocol.name`, {@link MCP_RESOURCE_PROTOCOL} `mcp.resource.protocol`
 *
 * @example "http"
 */
declare const NETWORK_PROTOCOL_NAME = "network.protocol.name";
/**
 * Type for {@link NETWORK_PROTOCOL_NAME} network.protocol.name
 */
type NETWORK_PROTOCOL_NAME_TYPE = string;
/**
 * The actual version of the protocol used for network communication. `network.protocol.version`
 *
 * Attribute Value Type: `string` {@link NETWORK_PROTOCOL_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_FLAVOR} `http.flavor`, {@link NET_PROTOCOL_VERSION} `net.protocol.version`
 *
 * @example "1.1"
 */
declare const NETWORK_PROTOCOL_VERSION = "network.protocol.version";
/**
 * Type for {@link NETWORK_PROTOCOL_VERSION} network.protocol.version
 */
type NETWORK_PROTOCOL_VERSION_TYPE = string;
/**
 * OSI transport layer or inter-process communication method. `network.transport`
 *
 * Attribute Value Type: `string` {@link NETWORK_TRANSPORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NET_TRANSPORT} `net.transport`, {@link MCP_TRANSPORT} `mcp.transport`
 *
 * @example "tcp"
 */
declare const NETWORK_TRANSPORT = "network.transport";
/**
 * Type for {@link NETWORK_TRANSPORT} network.transport
 */
type NETWORK_TRANSPORT_TYPE = string;
/**
 * OSI network layer or non-OSI equivalent. `network.type`
 *
 * Attribute Value Type: `string` {@link NETWORK_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "ipv4"
 */
declare const NETWORK_TYPE = "network.type";
/**
 * Type for {@link NETWORK_TYPE} network.type
 */
type NETWORK_TYPE_TYPE = string;
/**
 * Local address of the network connection - IP address or Unix domain socket name. `net.host.ip`
 *
 * Attribute Value Type: `string` {@link NET_HOST_IP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_LOCAL_ADDRESS} `network.local.address`, {@link NET_SOCK_HOST_ADDR} `net.sock.host.addr`
 *
 * @deprecated Use {@link NETWORK_LOCAL_ADDRESS} (network.local.address) instead
 * @example "192.168.0.1"
 */
declare const NET_HOST_IP = "net.host.ip";
/**
 * Type for {@link NET_HOST_IP} net.host.ip
 */
type NET_HOST_IP_TYPE = string;
/**
 * Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `net.host.name`
 *
 * Attribute Value Type: `string` {@link NET_HOST_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SERVER_ADDRESS} `server.address`, {@link HTTP_SERVER_NAME} `http.server_name`, {@link HTTP_HOST} `http.host`, {@link SERVER_NAME} `server_name`
 *
 * @deprecated Use {@link SERVER_ADDRESS} (server.address) instead
 * @example "example.com"
 */
declare const NET_HOST_NAME = "net.host.name";
/**
 * Type for {@link NET_HOST_NAME} net.host.name
 */
type NET_HOST_NAME_TYPE = string;
/**
 * Server port number. `net.host.port`
 *
 * Attribute Value Type: `number` {@link NET_HOST_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SERVER_PORT} `server.port`
 *
 * @deprecated Use {@link SERVER_PORT} (server.port) instead
 * @example 1337
 */
declare const NET_HOST_PORT = "net.host.port";
/**
 * Type for {@link NET_HOST_PORT} net.host.port
 */
type NET_HOST_PORT_TYPE = number;
/**
 * Peer address of the network connection - IP address or Unix domain socket name. `net.peer.ip`
 *
 * Attribute Value Type: `string` {@link NET_PEER_IP_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_PEER_ADDRESS} `network.peer.address`, {@link NET_SOCK_PEER_ADDR} `net.sock.peer.addr`
 *
 * @deprecated Use {@link NETWORK_PEER_ADDRESS} (network.peer.address) instead
 * @example "192.168.0.1"
 */
declare const NET_PEER_IP = "net.peer.ip";
/**
 * Type for {@link NET_PEER_IP} net.peer.ip
 */
type NET_PEER_IP_TYPE = string;
/**
 * Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `net.peer.name`
 *
 * Attribute Value Type: `string` {@link NET_PEER_NAME_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link SERVER_ADDRESS} (server.address) instead - Deprecated, use server.address on client spans and client.address on server spans.
 * @example "example.com"
 */
declare const NET_PEER_NAME = "net.peer.name";
/**
 * Type for {@link NET_PEER_NAME} net.peer.name
 */
type NET_PEER_NAME_TYPE = string;
/**
 * Peer port number. `net.peer.port`
 *
 * Attribute Value Type: `number` {@link NET_PEER_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link SERVER_PORT} (server.port) instead - Deprecated, use server.port on client spans and client.port on server spans.
 * @example 1337
 */
declare const NET_PEER_PORT = "net.peer.port";
/**
 * Type for {@link NET_PEER_PORT} net.peer.port
 */
type NET_PEER_PORT_TYPE = number;
/**
 * OSI application layer or non-OSI equivalent. `net.protocol.name`
 *
 * Attribute Value Type: `string` {@link NET_PROTOCOL_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_PROTOCOL_NAME} `network.protocol.name`, {@link MCP_RESOURCE_PROTOCOL} `mcp.resource.protocol`
 *
 * @deprecated Use {@link NETWORK_PROTOCOL_NAME} (network.protocol.name) instead
 * @example "http"
 */
declare const NET_PROTOCOL_NAME = "net.protocol.name";
/**
 * Type for {@link NET_PROTOCOL_NAME} net.protocol.name
 */
type NET_PROTOCOL_NAME_TYPE = string;
/**
 * The actual version of the protocol used for network communication. `net.protocol.version`
 *
 * Attribute Value Type: `string` {@link NET_PROTOCOL_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_PROTOCOL_VERSION} `network.protocol.version`, {@link HTTP_FLAVOR} `http.flavor`
 *
 * @deprecated Use {@link NETWORK_PROTOCOL_VERSION} (network.protocol.version) instead
 * @example "1.1"
 */
declare const NET_PROTOCOL_VERSION = "net.protocol.version";
/**
 * Type for {@link NET_PROTOCOL_VERSION} net.protocol.version
 */
type NET_PROTOCOL_VERSION_TYPE = string;
/**
 * OSI transport and network layer `net.sock.family`
 *
 * Attribute Value Type: `string` {@link NET_SOCK_FAMILY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link NETWORK_TRANSPORT} (network.transport) instead - Deprecated, use network.transport and network.type.
 * @example "inet"
 */
declare const NET_SOCK_FAMILY = "net.sock.family";
/**
 * Type for {@link NET_SOCK_FAMILY} net.sock.family
 */
type NET_SOCK_FAMILY_TYPE = string;
/**
 * Local address of the network connection mapping to Unix domain socket name. `net.sock.host.addr`
 *
 * Attribute Value Type: `string` {@link NET_SOCK_HOST_ADDR_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_LOCAL_ADDRESS} `network.local.address`, {@link NET_HOST_IP} `net.host.ip`
 *
 * @deprecated Use {@link NETWORK_LOCAL_ADDRESS} (network.local.address) instead
 * @example "/var/my.sock"
 */
declare const NET_SOCK_HOST_ADDR = "net.sock.host.addr";
/**
 * Type for {@link NET_SOCK_HOST_ADDR} net.sock.host.addr
 */
type NET_SOCK_HOST_ADDR_TYPE = string;
/**
 * Local port number of the network connection. `net.sock.host.port`
 *
 * Attribute Value Type: `number` {@link NET_SOCK_HOST_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_LOCAL_PORT} `network.local.port`
 *
 * @deprecated Use {@link NETWORK_LOCAL_PORT} (network.local.port) instead
 * @example 8080
 */
declare const NET_SOCK_HOST_PORT = "net.sock.host.port";
/**
 * Type for {@link NET_SOCK_HOST_PORT} net.sock.host.port
 */
type NET_SOCK_HOST_PORT_TYPE = number;
/**
 * Peer address of the network connection - IP address `net.sock.peer.addr`
 *
 * Attribute Value Type: `string` {@link NET_SOCK_PEER_ADDR_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_PEER_ADDRESS} `network.peer.address`, {@link NET_PEER_IP} `net.peer.ip`
 *
 * @deprecated Use {@link NETWORK_PEER_ADDRESS} (network.peer.address) instead
 * @example "192.168.0.1"
 */
declare const NET_SOCK_PEER_ADDR = "net.sock.peer.addr";
/**
 * Type for {@link NET_SOCK_PEER_ADDR} net.sock.peer.addr
 */
type NET_SOCK_PEER_ADDR_TYPE = string;
/**
 * Peer address of the network connection - Unix domain socket name `net.sock.peer.name`
 *
 * Attribute Value Type: `string` {@link NET_SOCK_PEER_NAME_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated  - Deprecated from OTEL, no replacement at this time
 * @example "/var/my.sock"
 */
declare const NET_SOCK_PEER_NAME = "net.sock.peer.name";
/**
 * Type for {@link NET_SOCK_PEER_NAME} net.sock.peer.name
 */
type NET_SOCK_PEER_NAME_TYPE = string;
/**
 * Peer port number of the network connection. `net.sock.peer.port`
 *
 * Attribute Value Type: `number` {@link NET_SOCK_PEER_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link NETWORK_PEER_PORT} (network.peer.port) instead
 * @example 8080
 */
declare const NET_SOCK_PEER_PORT = "net.sock.peer.port";
/**
 * Type for {@link NET_SOCK_PEER_PORT} net.sock.peer.port
 */
type NET_SOCK_PEER_PORT_TYPE = number;
/**
 * OSI transport layer or inter-process communication method. `net.transport`
 *
 * Attribute Value Type: `string` {@link NET_TRANSPORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NETWORK_TRANSPORT} `network.transport`, {@link MCP_TRANSPORT} `mcp.transport`
 *
 * @deprecated Use {@link NETWORK_TRANSPORT} (network.transport) instead
 * @example "tcp"
 */
declare const NET_TRANSPORT = "net.transport";
/**
 * Type for {@link NET_TRANSPORT} net.transport
 */
type NET_TRANSPORT_TYPE = string;
/**
 * The build ID of the operating system. `os.build`
 *
 * Attribute Value Type: `string` {@link OS_BUILD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link OS_BUILD_ID} `os.build_id`
 *
 * @deprecated Use {@link OS_BUILD_ID} (os.build_id) instead
 * @example "1234567890"
 */
declare const OS_BUILD = "os.build";
/**
 * Type for {@link OS_BUILD} os.build
 */
type OS_BUILD_TYPE = string;
/**
 * The build ID of the operating system. `os.build_id`
 *
 * Attribute Value Type: `string` {@link OS_BUILD_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link OS_BUILD} `os.build`
 *
 * @example "1234567890"
 */
declare const OS_BUILD_ID = "os.build_id";
/**
 * Type for {@link OS_BUILD_ID} os.build_id
 */
type OS_BUILD_ID_TYPE = string;
/**
 * Human readable (not intended to be parsed) OS version information, like e.g. reported by ver or lsb_release -a commands. `os.description`
 *
 * Attribute Value Type: `string` {@link OS_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Ubuntu 18.04.1 LTS"
 */
declare const OS_DESCRIPTION = "os.description";
/**
 * Type for {@link OS_DESCRIPTION} os.description
 */
type OS_DESCRIPTION_TYPE = string;
/**
 * An independent kernel version string. Typically the entire output of the `uname` syscall. `os.kernel_version`
 *
 * Attribute Value Type: `string` {@link OS_KERNEL_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "20.2.0"
 */
declare const OS_KERNEL_VERSION = "os.kernel_version";
/**
 * Type for {@link OS_KERNEL_VERSION} os.kernel_version
 */
type OS_KERNEL_VERSION_TYPE = string;
/**
 * Human readable operating system name. `os.name`
 *
 * Attribute Value Type: `string` {@link OS_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "Ubuntu"
 */
declare const OS_NAME = "os.name";
/**
 * Type for {@link OS_NAME} os.name
 */
type OS_NAME_TYPE = string;
/**
 * An unprocessed description string obtained by the operating system. For some well-known runtimes, Sentry will attempt to parse `name` and `version` from this string, if they are not explicitly given. `os.raw_description`
 *
 * Attribute Value Type: `string` {@link OS_RAW_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Ubuntu 22.04.4 LTS (Jammy Jellyfish)"
 */
declare const OS_RAW_DESCRIPTION = "os.raw_description";
/**
 * Type for {@link OS_RAW_DESCRIPTION} os.raw_description
 */
type OS_RAW_DESCRIPTION_TYPE = string;
/**
 * Whether the operating system has been jailbroken or rooted. `os.rooted`
 *
 * Attribute Value Type: `boolean` {@link OS_ROOTED_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const OS_ROOTED = "os.rooted";
/**
 * Type for {@link OS_ROOTED} os.rooted
 */
type OS_ROOTED_TYPE = boolean;
/**
 * Whether the OS runs in dark mode or light mode. `os.theme`
 *
 * Attribute Value Type: `string` {@link OS_THEME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "dark"
 */
declare const OS_THEME = "os.theme";
/**
 * Type for {@link OS_THEME} os.theme
 */
type OS_THEME_TYPE = string;
/**
 * The operating system type. `os.type`
 *
 * Attribute Value Type: `string` {@link OS_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "linux"
 */
declare const OS_TYPE = "os.type";
/**
 * Type for {@link OS_TYPE} os.type
 */
type OS_TYPE_TYPE = string;
/**
 * The version of the operating system. `os.version`
 *
 * Attribute Value Type: `string` {@link OS_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "18.04.2"
 */
declare const OS_VERSION = "os.version";
/**
 * Type for {@link OS_VERSION} os.version
 */
type OS_VERSION_TYPE = string;
/**
 * The span kind (https://opentelemetry.io/docs/concepts/signals/traces/#span-kind). Deprecated, use `sentry.kind` instead. `otel.kind`
 *
 * Attribute Value Type: `string` {@link OTEL_KIND_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_KIND} `sentry.kind`
 *
 * @deprecated Use {@link SENTRY_KIND} (sentry.kind) instead - Deprecated in favor of sentry.kind
 * @example "SERVER"
 */
declare const OTEL_KIND = "otel.kind";
/**
 * Type for {@link OTEL_KIND} otel.kind
 */
type OTEL_KIND_TYPE = string;
/**
 * The name of the instrumentation scope - (InstrumentationScope.Name in OTLP). `otel.scope.name`
 *
 * Attribute Value Type: `string` {@link OTEL_SCOPE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "io.opentelemetry.contrib.mongodb"
 */
declare const OTEL_SCOPE_NAME = "otel.scope.name";
/**
 * Type for {@link OTEL_SCOPE_NAME} otel.scope.name
 */
type OTEL_SCOPE_NAME_TYPE = string;
/**
 * The version of the instrumentation scope - (InstrumentationScope.Version in OTLP). `otel.scope.version`
 *
 * Attribute Value Type: `string` {@link OTEL_SCOPE_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "2.4.5"
 */
declare const OTEL_SCOPE_VERSION = "otel.scope.version";
/**
 * Type for {@link OTEL_SCOPE_VERSION} otel.scope.version
 */
type OTEL_SCOPE_VERSION_TYPE = string;
/**
 * Name of the code, either “OK” or “ERROR”. MUST NOT be set if the status code is UNSET. `otel.status_code`
 *
 * Attribute Value Type: `string` {@link OTEL_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "OK"
 */
declare const OTEL_STATUS_CODE = "otel.status_code";
/**
 * Type for {@link OTEL_STATUS_CODE} otel.status_code
 */
type OTEL_STATUS_CODE_TYPE = string;
/**
 * Description of the Status if it has a value, otherwise not set. `otel.status_description`
 *
 * Attribute Value Type: `string` {@link OTEL_STATUS_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "resource not found"
 */
declare const OTEL_STATUS_DESCRIPTION = "otel.status_description";
/**
 * Type for {@link OTEL_STATUS_DESCRIPTION} otel.status_description
 */
type OTEL_STATUS_DESCRIPTION_TYPE = string;
/**
 * Decoded parameters extracted from a URL path. Usually added by client-side routing frameworks like vue-router. `params.<key>`
 *
 * Attribute Value Type: `string` {@link PARAMS_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * Aliases: {@link URL_PATH_PARAMETER_KEY} `url.path.parameter.<key>`
 *
 * @example "params.id='123'"
 */
declare const PARAMS_KEY = "params.<key>";
/**
 * Base key for {@link PARAMS_KEY}. Use with a dynamic suffix, e.g. `${PARAMS_KEY_BASE}.${key}`.
 */
declare const PARAMS_KEY_BASE = "params";
/**
 * Type for {@link PARAMS_KEY} params.<key>
 */
type PARAMS_KEY_TYPE = string;
/**
 * The time between initiating a navigation to a page and the browser activating the page `performance.activationStart`
 *
 * Attribute Value Type: `number` {@link PERFORMANCE_ACTIVATIONSTART_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START} `browser.performance.navigation.activation_start`
 *
 * @deprecated Use {@link BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START} (browser.performance.navigation.activation_start) instead - The activationStart is now recorded as the browser.performance.navigation.activation_start attribute.
 * @example 1.983
 */
declare const PERFORMANCE_ACTIVATIONSTART = "performance.activationStart";
/**
 * Type for {@link PERFORMANCE_ACTIVATIONSTART} performance.activationStart
 */
type PERFORMANCE_ACTIVATIONSTART_TYPE = number;
/**
 * The browser's performance.timeOrigin timestamp representing the time when the pageload was initiated `performance.timeOrigin`
 *
 * Attribute Value Type: `number` {@link PERFORMANCE_TIMEORIGIN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_PERFORMANCE_TIME_ORIGIN} `browser.performance.time_origin`
 *
 * @deprecated Use {@link BROWSER_PERFORMANCE_TIME_ORIGIN} (browser.performance.time_origin) instead - The timeOrigin is now recorded as the browser.performance.time_origin attribute.
 * @example 1776185678.886
 */
declare const PERFORMANCE_TIMEORIGIN = "performance.timeOrigin";
/**
 * Type for {@link PERFORMANCE_TIMEORIGIN} performance.timeOrigin
 */
type PERFORMANCE_TIMEORIGIN_TYPE = number;
/**
 * Also used by mobile SDKs to indicate the previous route in the application. `previous_route`
 *
 * Attribute Value Type: `string` {@link PREVIOUS_ROUTE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "HomeScreen"
 */
declare const PREVIOUS_ROUTE = "previous_route";
/**
 * Type for {@link PREVIOUS_ROUTE} previous_route
 */
type PREVIOUS_ROUTE_TYPE = string;
/**
 * All the command arguments (including the command/executable itself) as received by the process. `process.command_args`
 *
 * Attribute Value Type: `Array<string>` {@link PROCESS_COMMAND_ARGS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["cmd/otecol","--config=config.yaml"]
 */
declare const PROCESS_COMMAND_ARGS = "process.command_args";
/**
 * Type for {@link PROCESS_COMMAND_ARGS} process.command_args
 */
type PROCESS_COMMAND_ARGS_TYPE = Array<string>;
/**
 * The name of the executable that started the process. `process.executable.name`
 *
 * Attribute Value Type: `string` {@link PROCESS_EXECUTABLE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "getsentry"
 */
declare const PROCESS_EXECUTABLE_NAME = "process.executable.name";
/**
 * Type for {@link PROCESS_EXECUTABLE_NAME} process.executable.name
 */
type PROCESS_EXECUTABLE_NAME_TYPE = string;
/**
 * The process ID of the running process. `process.pid`
 *
 * Attribute Value Type: `number` {@link PROCESS_PID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 12345
 */
declare const PROCESS_PID = "process.pid";
/**
 * Type for {@link PROCESS_PID} process.pid
 */
type PROCESS_PID_TYPE = number;
/**
 * An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment. Equivalent to `raw_description` in the Sentry runtime context. `process.runtime.description`
 *
 * Attribute Value Type: `string` {@link PROCESS_RUNTIME_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link RUNTIME_RAW_DESCRIPTION} `runtime.raw_description`
 *
 * @example "Eclipse OpenJ9 VM openj9-0.21.0"
 */
declare const PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
/**
 * Type for {@link PROCESS_RUNTIME_DESCRIPTION} process.runtime.description
 */
type PROCESS_RUNTIME_DESCRIPTION_TYPE = string;
/**
 * The name of the runtime engine. `process.runtime.engine.name`
 *
 * Attribute Value Type: `string` {@link PROCESS_RUNTIME_ENGINE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "v8"
 */
declare const PROCESS_RUNTIME_ENGINE_NAME = "process.runtime.engine.name";
/**
 * Type for {@link PROCESS_RUNTIME_ENGINE_NAME} process.runtime.engine.name
 */
type PROCESS_RUNTIME_ENGINE_NAME_TYPE = string;
/**
 * The version of the runtime engine. `process.runtime.engine.version`
 *
 * Attribute Value Type: `string` {@link PROCESS_RUNTIME_ENGINE_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "12.9.202.13-rusty"
 */
declare const PROCESS_RUNTIME_ENGINE_VERSION = "process.runtime.engine.version";
/**
 * Type for {@link PROCESS_RUNTIME_ENGINE_VERSION} process.runtime.engine.version
 */
type PROCESS_RUNTIME_ENGINE_VERSION_TYPE = string;
/**
 * The name of the runtime. Equivalent to `name` in the Sentry runtime context. `process.runtime.name`
 *
 * Attribute Value Type: `string` {@link PROCESS_RUNTIME_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link RUNTIME_NAME} `runtime.name`
 *
 * @example "node"
 */
declare const PROCESS_RUNTIME_NAME = "process.runtime.name";
/**
 * Type for {@link PROCESS_RUNTIME_NAME} process.runtime.name
 */
type PROCESS_RUNTIME_NAME_TYPE = string;
/**
 * The version of the runtime of this process, as returned by the runtime without modification. Equivalent to `version` in the Sentry runtime context. `process.runtime.version`
 *
 * Attribute Value Type: `string` {@link PROCESS_RUNTIME_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link RUNTIME_VERSION} `runtime.version`
 *
 * @example "18.04.2"
 */
declare const PROCESS_RUNTIME_VERSION = "process.runtime.version";
/**
 * Type for {@link PROCESS_RUNTIME_VERSION} process.runtime.version
 */
type PROCESS_RUNTIME_VERSION_TYPE = string;
/**
 * An item in a query string. Usually added by client-side routing frameworks like vue-router. `query.<key>`
 *
 * Attribute Value Type: `string` {@link QUERY_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @deprecated Use {@link URL_QUERY} (url.query) instead - Instead of sending items individually in query.<key>, they should be sent all together with url.query.
 * @example "query.id='123'"
 */
declare const QUERY_KEY = "query.<key>";
/**
 * Base key for {@link QUERY_KEY}. Use with a dynamic suffix, e.g. `${QUERY_KEY_BASE}.${key}`.
 *
 * @deprecated Use {@link URL_QUERY} (url.query) instead - Instead of sending items individually in query.<key>, they should be sent all together with url.query.
 */
declare const QUERY_KEY_BASE = "query";
/**
 * Type for {@link QUERY_KEY} query.<key>
 */
type QUERY_KEY_TYPE = string;
/**
 * The version of the React framework `react.version`
 *
 * Attribute Value Type: `string` {@link REACT_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "18.2.0"
 */
declare const REACT_VERSION = "react.version";
/**
 * Type for {@link REACT_VERSION} react.version
 */
type REACT_VERSION_TYPE = string;
/**
 * The sentry release. `release`
 *
 * Attribute Value Type: `string` {@link RELEASE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_RELEASE} `sentry.release`
 *
 * @deprecated Use {@link SENTRY_RELEASE} (sentry.release) instead
 * @example "production"
 */
declare const RELEASE = "release";
/**
 * Type for {@link RELEASE} release
 */
type RELEASE_TYPE = string;
/**
 * Remix form data, <key> being the form data key, the value being the form data value. `remix.action_form_data.<key>`
 *
 * Attribute Value Type: `string` {@link REMIX_ACTION_FORM_DATA_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "http.response.header.text='test'"
 */
declare const REMIX_ACTION_FORM_DATA_KEY = "remix.action_form_data.<key>";
/**
 * Base key for {@link REMIX_ACTION_FORM_DATA_KEY}. Use with a dynamic suffix, e.g. `${REMIX_ACTION_FORM_DATA_KEY_BASE}.${key}`.
 */
declare const REMIX_ACTION_FORM_DATA_KEY_BASE = "remix.action_form_data";
/**
 * Type for {@link REMIX_ACTION_FORM_DATA_KEY} remix.action_form_data.<key>
 */
type REMIX_ACTION_FORM_DATA_KEY_TYPE = string;
/**
 * The id of the sentry replay. `replay_id`
 *
 * Attribute Value Type: `string` {@link REPLAY_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_REPLAY_ID} `sentry.replay_id`
 *
 * @deprecated Use {@link SENTRY_REPLAY_ID} (sentry.replay_id) instead
 * @example "123e4567e89b12d3a456426614174000"
 */
declare const REPLAY_ID = "replay_id";
/**
 * Type for {@link REPLAY_ID} replay_id
 */
type REPLAY_ID_TYPE = string;
/**
 * The software deployment environment name. `resource.deployment.environment`
 *
 * Attribute Value Type: `string` {@link RESOURCE_DEPLOYMENT_ENVIRONMENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link SENTRY_ENVIRONMENT} (sentry.environment) instead
 * @example "production"
 */
declare const RESOURCE_DEPLOYMENT_ENVIRONMENT = "resource.deployment.environment";
/**
 * Type for {@link RESOURCE_DEPLOYMENT_ENVIRONMENT} resource.deployment.environment
 */
type RESOURCE_DEPLOYMENT_ENVIRONMENT_TYPE = string;
/**
 * The software deployment environment name. `resource.deployment.environment.name`
 *
 * Attribute Value Type: `string` {@link RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @deprecated Use {@link SENTRY_ENVIRONMENT} (sentry.environment) instead
 * @example "production"
 */
declare const RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME = "resource.deployment.environment.name";
/**
 * Type for {@link RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME} resource.deployment.environment.name
 */
type RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME_TYPE = string;
/**
 * The render blocking status of the resource. `resource.render_blocking_status`
 *
 * Attribute Value Type: `string` {@link RESOURCE_RENDER_BLOCKING_STATUS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "non-blocking"
 */
declare const RESOURCE_RENDER_BLOCKING_STATUS = "resource.render_blocking_status";
/**
 * Type for {@link RESOURCE_RENDER_BLOCKING_STATUS} resource.render_blocking_status
 */
type RESOURCE_RENDER_BLOCKING_STATUS_TYPE = string;
/**
 * The matched route, that is, the path template in the format used by the respective server framework. Also used by mobile SDKs to indicate the current route in the application. `route`
 *
 * Attribute Value Type: `string` {@link ROUTE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link HTTP_ROUTE} `http.route`
 *
 * @deprecated Use {@link HTTP_ROUTE} (http.route) instead
 * @example "App\\Controller::indexAction"
 */
declare const ROUTE = "route";
/**
 * Type for {@link ROUTE} route
 */
type ROUTE_TYPE = string;
/**
 * The numeric status code of the gRPC request. `rpc.grpc.status_code`
 *
 * Attribute Value Type: `number` {@link RPC_GRPC_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 2
 */
declare const RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
/**
 * Type for {@link RPC_GRPC_STATUS_CODE} rpc.grpc.status_code
 */
type RPC_GRPC_STATUS_CODE_TYPE = number;
/**
 * The fully-qualified logical name of the method from the RPC interface perspective. `rpc.method`
 *
 * Attribute Value Type: `string` {@link RPC_METHOD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "com.example.ExampleService/exampleMethod"
 */
declare const RPC_METHOD = "rpc.method";
/**
 * Type for {@link RPC_METHOD} rpc.method
 */
type RPC_METHOD_TYPE = string;
/**
 * Status code of the RPC returned by the RPC server or generated by the client. `rpc.response.status_code`
 *
 * Attribute Value Type: `string` {@link RPC_RESPONSE_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "DEADLINE_EXCEEDED"
 */
declare const RPC_RESPONSE_STATUS_CODE = "rpc.response.status_code";
/**
 * Type for {@link RPC_RESPONSE_STATUS_CODE} rpc.response.status_code
 */
type RPC_RESPONSE_STATUS_CODE_TYPE = string;
/**
 * The full (logical) name of the service being called, including its package name, if applicable. `rpc.service`
 *
 * Attribute Value Type: `string` {@link RPC_SERVICE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "myService.BestService"
 */
declare const RPC_SERVICE = "rpc.service";
/**
 * Type for {@link RPC_SERVICE} rpc.service
 */
type RPC_SERVICE_TYPE = string;
/**
 * A string identifying the remoting system. `rpc.system`
 *
 * Attribute Value Type: `string` {@link RPC_SYSTEM_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link RPC_SYSTEM_NAME} `rpc.system.name`
 *
 * @deprecated Use {@link RPC_SYSTEM_NAME} (rpc.system.name) instead - This attribute is being deprecated in favor of rpc.system.name, which is the OTel-aligned replacement.
 * @example "aws-api"
 */
declare const RPC_SYSTEM = "rpc.system";
/**
 * Type for {@link RPC_SYSTEM} rpc.system
 */
type RPC_SYSTEM_TYPE = string;
/**
 * A string identifying the remoting system. `rpc.system.name`
 *
 * Attribute Value Type: `string` {@link RPC_SYSTEM_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link RPC_SYSTEM} `rpc.system`
 *
 * @example "aws-api"
 */
declare const RPC_SYSTEM_NAME = "rpc.system.name";
/**
 * Type for {@link RPC_SYSTEM_NAME} rpc.system.name
 */
type RPC_SYSTEM_NAME_TYPE = string;
/**
 * The application build string, when it is separate from the version. `runtime.build`
 *
 * Attribute Value Type: `string` {@link RUNTIME_BUILD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated  - The runtime.* namespace is deprecated in favor of process.runtime.*. No direct OTel equivalent exists for this attribute.
 * @example "stable"
 */
declare const RUNTIME_BUILD = "runtime.build";
/**
 * Type for {@link RUNTIME_BUILD} runtime.build
 */
type RUNTIME_BUILD_TYPE = string;
/**
 * The name of the runtime. For example node, CPython, or rustc. `runtime.name`
 *
 * Attribute Value Type: `string` {@link RUNTIME_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link PROCESS_RUNTIME_NAME} `process.runtime.name`
 *
 * @deprecated Use {@link PROCESS_RUNTIME_NAME} (process.runtime.name) instead - Prefer OTel-aligned process.runtime.name
 * @example "node"
 */
declare const RUNTIME_NAME = "runtime.name";
/**
 * Type for {@link RUNTIME_NAME} runtime.name
 */
type RUNTIME_NAME_TYPE = string;
/**
 * Unprocessed description string as obtained from the runtime. Used to extract name and version for well-known runtimes. `runtime.raw_description`
 *
 * Attribute Value Type: `string` {@link RUNTIME_RAW_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link PROCESS_RUNTIME_DESCRIPTION} `process.runtime.description`
 *
 * @deprecated Use {@link PROCESS_RUNTIME_DESCRIPTION} (process.runtime.description) instead - Prefer OTel-aligned process.runtime.description
 * @example "Eclipse OpenJ9 VM openj9-0.21.0"
 */
declare const RUNTIME_RAW_DESCRIPTION = "runtime.raw_description";
/**
 * Type for {@link RUNTIME_RAW_DESCRIPTION} runtime.raw_description
 */
type RUNTIME_RAW_DESCRIPTION_TYPE = string;
/**
 * The version of the runtime. `runtime.version`
 *
 * Attribute Value Type: `string` {@link RUNTIME_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link PROCESS_RUNTIME_VERSION} `process.runtime.version`
 *
 * @deprecated Use {@link PROCESS_RUNTIME_VERSION} (process.runtime.version) instead - Prefer OTel-aligned process.runtime.version
 * @example "18.04.2"
 */
declare const RUNTIME_VERSION = "runtime.version";
/**
 * Type for {@link RUNTIME_VERSION} runtime.version
 */
type RUNTIME_VERSION_TYPE = string;
/**
 * The weighted performance score for a web vital. This is defined as `score.weight.<key>` * `score.ratio.<key>`. `score.<key>`
 *
 * Attribute Value Type: `number` {@link SCORE_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "score.cls=0.1723"
 */
declare const SCORE_KEY = "score.<key>";
/**
 * Base key for {@link SCORE_KEY}. Use with a dynamic suffix, e.g. `${SCORE_KEY_BASE}.${key}`.
 */
declare const SCORE_KEY_BASE = "score";
/**
 * Type for {@link SCORE_KEY} score.<key>
 */
type SCORE_KEY_TYPE = number;
/**
 * The score for a web vital, normalized to a number between 0 and 1. `score.ratio.<key>`
 *
 * Attribute Value Type: `number` {@link SCORE_RATIO_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "score.ratio.inp=0.7748"
 */
declare const SCORE_RATIO_KEY = "score.ratio.<key>";
/**
 * Base key for {@link SCORE_RATIO_KEY}. Use with a dynamic suffix, e.g. `${SCORE_RATIO_KEY_BASE}.${key}`.
 */
declare const SCORE_RATIO_KEY_BASE = "score.ratio";
/**
 * Type for {@link SCORE_RATIO_KEY} score.ratio.<key>
 */
type SCORE_RATIO_KEY_TYPE = number;
/**
 * The total performance score of a span. This is the sum of individual weighted web vital scores (see `score.<key>`). `score.total`
 *
 * Attribute Value Type: `number` {@link SCORE_TOTAL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const SCORE_TOTAL = "score.total";
/**
 * Type for {@link SCORE_TOTAL} score.total
 */
type SCORE_TOTAL_TYPE = number;
/**
 * The relative weight of a web vital in a span's performance score. `score.weight.<key>`
 *
 * Attribute Value Type: `number` {@link SCORE_WEIGHT_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "score.weight.fcp=0.25"
 */
declare const SCORE_WEIGHT_KEY = "score.weight.<key>";
/**
 * Base key for {@link SCORE_WEIGHT_KEY}. Use with a dynamic suffix, e.g. `${SCORE_WEIGHT_KEY_BASE}.${key}`.
 */
declare const SCORE_WEIGHT_KEY_BASE = "score.weight";
/**
 * Type for {@link SCORE_WEIGHT_KEY} score.weight.<key>
 */
type SCORE_WEIGHT_KEY_TYPE = number;
/**
 * Used as a generic attribute representing the action depending on the type of span. For instance, this is the database query operation for DB spans, and the request method for HTTP spans. `sentry.action`
 *
 * Attribute Value Type: `string` {@link SENTRY_ACTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "SELECT"
 */
declare const SENTRY_ACTION = "sentry.action";
/**
 * Type for {@link SENTRY_ACTION} sentry.action
 */
type SENTRY_ACTION_TYPE = string;
/**
 * The name of the browser. `sentry.browser.name`
 *
 * Attribute Value Type: `string` {@link SENTRY_BROWSER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_NAME} `browser.name`
 *
 * @deprecated Use {@link BROWSER_NAME} (browser.name) instead
 * @example "Chrome"
 */
declare const SENTRY_BROWSER_NAME = "sentry.browser.name";
/**
 * Type for {@link SENTRY_BROWSER_NAME} sentry.browser.name
 */
type SENTRY_BROWSER_NAME_TYPE = string;
/**
 * The version of the browser. `sentry.browser.version`
 *
 * Attribute Value Type: `string` {@link SENTRY_BROWSER_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_VERSION} `browser.version`
 *
 * @deprecated Use {@link BROWSER_VERSION} (browser.version) instead
 * @example "120.0.6099.130"
 */
declare const SENTRY_BROWSER_VERSION = "sentry.browser.version";
/**
 * Type for {@link SENTRY_BROWSER_VERSION} sentry.browser.version
 */
type SENTRY_BROWSER_VERSION_TYPE = string;
/**
 * The reason why a span ended early. `sentry.cancellation_reason`
 *
 * Attribute Value Type: `string` {@link SENTRY_CANCELLATION_REASON_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "document.hidden"
 */
declare const SENTRY_CANCELLATION_REASON = "sentry.cancellation_reason";
/**
 * Type for {@link SENTRY_CANCELLATION_REASON} sentry.cancellation_reason
 */
type SENTRY_CANCELLATION_REASON_TYPE = string;
/**
 * The high-level category of a span, derived from the span operation or span attributes. This categorizes spans by their general purpose (e.g., database, HTTP, UI). Known values include: 'ai', 'ai.pipeline', 'app', 'browser', 'cache', 'console', 'db', 'event', 'file', 'function.aws', 'function.azure', 'function.gcp', 'function.nextjs', 'function.remix', 'graphql', 'grpc', 'http', 'measure', 'middleware', 'navigation', 'pageload', 'queue', 'resource', 'rpc', 'serialize', 'subprocess', 'template', 'topic', 'ui', 'ui.angular', 'ui.ember', 'ui.react', 'ui.svelte', 'ui.vue', 'view', 'websocket'. `sentry.category`
 *
 * Attribute Value Type: `string` {@link SENTRY_CATEGORY_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "db"
 */
declare const SENTRY_CATEGORY = "sentry.category";
/**
 * Type for {@link SENTRY_CATEGORY} sentry.category
 */
type SENTRY_CATEGORY_TYPE = string;
/**
 * Rate at which a span was sampled in the SDK. `sentry.client_sample_rate`
 *
 * Attribute Value Type: `number` {@link SENTRY_CLIENT_SAMPLE_RATE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 0.5
 */
declare const SENTRY_CLIENT_SAMPLE_RATE = "sentry.client_sample_rate";
/**
 * Type for {@link SENTRY_CLIENT_SAMPLE_RATE} sentry.client_sample_rate
 */
type SENTRY_CLIENT_SAMPLE_RATE_TYPE = number;
/**
 * The human-readable description of a span. `sentry.description`
 *
 * Attribute Value Type: `string` {@link SENTRY_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "index view query"
 */
declare const SENTRY_DESCRIPTION = "sentry.description";
/**
 * Type for {@link SENTRY_DESCRIPTION} sentry.description
 */
type SENTRY_DESCRIPTION_TYPE = string;
/**
 * The sentry dist. `sentry.dist`
 *
 * Attribute Value Type: `string` {@link SENTRY_DIST_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link DIST} `dist`
 *
 * @example "1.0"
 */
declare const SENTRY_DIST = "sentry.dist";
/**
 * Type for {@link SENTRY_DIST} sentry.dist
 */
type SENTRY_DIST_TYPE = string;
/**
 * Used as a generic attribute representing the domain depending on the type of span. For instance, this is the collection/table name for database spans, and the server address for HTTP spans. `sentry.domain`
 *
 * Attribute Value Type: `string` {@link SENTRY_DOMAIN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "example.com"
 */
declare const SENTRY_DOMAIN = "sentry.domain";
/**
 * Type for {@link SENTRY_DOMAIN} sentry.domain
 */
type SENTRY_DOMAIN_TYPE = string;
/**
 * The environment from the dynamic sampling context. `sentry.dsc.environment`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_ENVIRONMENT_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "prod"
 */
declare const SENTRY_DSC_ENVIRONMENT = "sentry.dsc.environment";
/**
 * Type for {@link SENTRY_DSC_ENVIRONMENT} sentry.dsc.environment
 */
type SENTRY_DSC_ENVIRONMENT_TYPE = string;
/**
 * The ID of the project where the trace originated (i.e. the project of the SDK that started the trace). Propagated through the dynamic sampling context and set by Relay during ingestion. `sentry.dsc.project_id`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_PROJECT_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "12345"
 */
declare const SENTRY_DSC_PROJECT_ID = "sentry.dsc.project_id";
/**
 * Type for {@link SENTRY_DSC_PROJECT_ID} sentry.dsc.project_id
 */
type SENTRY_DSC_PROJECT_ID_TYPE = string;
/**
 * The public key from the dynamic sampling context. `sentry.dsc.public_key`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_PUBLIC_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "c51734c603c4430eb57cb0a5728a479d"
 */
declare const SENTRY_DSC_PUBLIC_KEY = "sentry.dsc.public_key";
/**
 * Type for {@link SENTRY_DSC_PUBLIC_KEY} sentry.dsc.public_key
 */
type SENTRY_DSC_PUBLIC_KEY_TYPE = string;
/**
 * The release identifier from the dynamic sampling context. `sentry.dsc.release`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_RELEASE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "frontend@e8211be71b214afab5b85de4b4c54be3714952bb"
 */
declare const SENTRY_DSC_RELEASE = "sentry.dsc.release";
/**
 * Type for {@link SENTRY_DSC_RELEASE} sentry.dsc.release
 */
type SENTRY_DSC_RELEASE_TYPE = string;
/**
 * Whether the event was sampled according to the dynamic sampling context. `sentry.dsc.sampled`
 *
 * Attribute Value Type: `boolean` {@link SENTRY_DSC_SAMPLED_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example true
 */
declare const SENTRY_DSC_SAMPLED = "sentry.dsc.sampled";
/**
 * Type for {@link SENTRY_DSC_SAMPLED} sentry.dsc.sampled
 */
type SENTRY_DSC_SAMPLED_TYPE = boolean;
/**
 * The sample rate from the dynamic sampling context. `sentry.dsc.sample_rate`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_SAMPLE_RATE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "1.0"
 */
declare const SENTRY_DSC_SAMPLE_RATE = "sentry.dsc.sample_rate";
/**
 * Type for {@link SENTRY_DSC_SAMPLE_RATE} sentry.dsc.sample_rate
 */
type SENTRY_DSC_SAMPLE_RATE_TYPE = string;
/**
 * The trace ID from the dynamic sampling context. `sentry.dsc.trace_id`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_TRACE_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "047372980460430cbc78d9779df33a46"
 */
declare const SENTRY_DSC_TRACE_ID = "sentry.dsc.trace_id";
/**
 * Type for {@link SENTRY_DSC_TRACE_ID} sentry.dsc.trace_id
 */
type SENTRY_DSC_TRACE_ID_TYPE = string;
/**
 * The transaction name from the dynamic sampling context. `sentry.dsc.transaction`
 *
 * Attribute Value Type: `string` {@link SENTRY_DSC_TRANSACTION_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: internal
 *
 * @example "/issues/errors-outages/"
 */
declare const SENTRY_DSC_TRANSACTION = "sentry.dsc.transaction";
/**
 * Type for {@link SENTRY_DSC_TRANSACTION} sentry.dsc.transaction
 */
type SENTRY_DSC_TRANSACTION_TYPE = string;
/**
 * The sentry environment. `sentry.environment`
 *
 * Attribute Value Type: `string` {@link SENTRY_ENVIRONMENT_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link ENVIRONMENT} `environment`
 *
 * @example "production"
 */
declare const SENTRY_ENVIRONMENT = "sentry.environment";
/**
 * Type for {@link SENTRY_ENVIRONMENT} sentry.environment
 */
type SENTRY_ENVIRONMENT_TYPE = string;
/**
 * The exclusive time duration of the span in milliseconds. `sentry.exclusive_time`
 *
 * Attribute Value Type: `number` {@link SENTRY_EXCLUSIVE_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1234
 */
declare const SENTRY_EXCLUSIVE_TIME = "sentry.exclusive_time";
/**
 * Type for {@link SENTRY_EXCLUSIVE_TIME} sentry.exclusive_time
 */
type SENTRY_EXCLUSIVE_TIME_TYPE = number;
/**
 * Indicates the type of graphql operation, emitted by the Javascript SDK. `sentry.graphql.operation`
 *
 * Attribute Value Type: `string` {@link SENTRY_GRAPHQL_OPERATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "getUserById"
 */
declare const SENTRY_GRAPHQL_OPERATION = "sentry.graphql.operation";
/**
 * Type for {@link SENTRY_GRAPHQL_OPERATION} sentry.graphql.operation
 */
type SENTRY_GRAPHQL_OPERATION_TYPE = string;
/**
 * Stores the hash of `sentry.normalized_description`. This is primarily used for grouping spans in the product end. `sentry.group`
 *
 * Attribute Value Type: `string` {@link SENTRY_GROUP_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const SENTRY_GROUP = "sentry.group";
/**
 * Type for {@link SENTRY_GROUP} sentry.group
 */
type SENTRY_GROUP_TYPE = string;
/**
 * If an http request was a prefetch request. `sentry.http.prefetch`
 *
 * Attribute Value Type: `boolean` {@link SENTRY_HTTP_PREFETCH_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const SENTRY_HTTP_PREFETCH = "sentry.http.prefetch";
/**
 * Type for {@link SENTRY_HTTP_PREFETCH} sentry.http.prefetch
 */
type SENTRY_HTTP_PREFETCH_TYPE = boolean;
/**
 * The reason why an idle span ended early. `sentry.idle_span_finish_reason`
 *
 * Attribute Value Type: `string` {@link SENTRY_IDLE_SPAN_FINISH_REASON_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "idleTimeout"
 */
declare const SENTRY_IDLE_SPAN_FINISH_REASON = "sentry.idle_span_finish_reason";
/**
 * Type for {@link SENTRY_IDLE_SPAN_FINISH_REASON} sentry.idle_span_finish_reason
 */
type SENTRY_IDLE_SPAN_FINISH_REASON_TYPE = string;
/**
 * Indicates whether a span's parent is remote. `sentry.is_remote`
 *
 * Attribute Value Type: `boolean` {@link SENTRY_IS_REMOTE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const SENTRY_IS_REMOTE = "sentry.is_remote";
/**
 * Type for {@link SENTRY_IS_REMOTE} sentry.is_remote
 */
type SENTRY_IS_REMOTE_TYPE = boolean;
/**
 * Used to clarify the relationship between parents and children, or to distinguish between spans, e.g. a `server` and `client` span with the same name. `sentry.kind`
 *
 * Attribute Value Type: `string` {@link SENTRY_KIND_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link OTEL_KIND} `otel.kind`
 *
 * @example "server"
 */
declare const SENTRY_KIND = "sentry.kind";
/**
 * Type for {@link SENTRY_KIND} sentry.kind
 */
type SENTRY_KIND_TYPE = string;
/**
 * Whether the span or event occurred on the main thread. Computed by Relay and should not be set by SDKs. `sentry.main_thread`
 *
 * Attribute Value Type: `boolean` {@link SENTRY_MAIN_THREAD_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const SENTRY_MAIN_THREAD = "sentry.main_thread";
/**
 * Type for {@link SENTRY_MAIN_THREAD} sentry.main_thread
 */
type SENTRY_MAIN_THREAD_TYPE = boolean;
/**
 * A parameter used in the message template. <key> can either be the number that represent the parameter's position in the template string (sentry.message.parameter.0, sentry.message.parameter.1, etc) or the parameter's name (sentry.message.parameter.item_id, sentry.message.parameter.user_id, etc) `sentry.message.parameter.<key>`
 *
 * Attribute Value Type: `string` {@link SENTRY_MESSAGE_PARAMETER_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "sentry.message.parameter.0='123'"
 */
declare const SENTRY_MESSAGE_PARAMETER_KEY = "sentry.message.parameter.<key>";
/**
 * Type for {@link SENTRY_MESSAGE_PARAMETER_KEY} sentry.message.parameter.<key>
 */
type SENTRY_MESSAGE_PARAMETER_KEY_TYPE = string;
/**
 * The parameterized template string. `sentry.message.template`
 *
 * Attribute Value Type: `string` {@link SENTRY_MESSAGE_TEMPLATE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "Hello, {name}!"
 */
declare const SENTRY_MESSAGE_TEMPLATE = "sentry.message.template";
/**
 * Type for {@link SENTRY_MESSAGE_TEMPLATE} sentry.message.template
 */
type SENTRY_MESSAGE_TEMPLATE_TYPE = string;
/**
 * The provenance of a metric.  For example, this can be set to indicate if a metric was generated by Relay from a span. `sentry.metric.source`
 *
 * Attribute Value Type: `string` {@link SENTRY_METRIC_SOURCE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "span"
 */
declare const SENTRY_METRIC_SOURCE = "sentry.metric.source";
/**
 * Type for {@link SENTRY_METRIC_SOURCE} sentry.metric.source
 */
type SENTRY_METRIC_SOURCE_TYPE = string;
/**
 * Whether the application is using a mobile SDK. Computed by Relay and should not be set by SDKs. `sentry.mobile`
 *
 * Attribute Value Type: `boolean` {@link SENTRY_MOBILE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const SENTRY_MOBILE = "sentry.mobile";
/**
 * Type for {@link SENTRY_MOBILE} sentry.mobile
 */
type SENTRY_MOBILE_TYPE = boolean;
/**
 * A module that was loaded in the process. The key is the name of the module. `sentry.module.<key>`
 *
 * Attribute Value Type: `string` {@link SENTRY_MODULE_KEY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * @example "sentry.module.brianium/paratest='v7.7.0'"
 */
declare const SENTRY_MODULE_KEY = "sentry.module.<key>";
/**
 * Base key for {@link SENTRY_MODULE_KEY}. Use with a dynamic suffix, e.g. `${SENTRY_MODULE_KEY_BASE}.${key}`.
 */
declare const SENTRY_MODULE_KEY_BASE = "sentry.module";
/**
 * Type for {@link SENTRY_MODULE_KEY} sentry.module.<key>
 */
type SENTRY_MODULE_KEY_TYPE = string;
/**
 * A parameterized route for a function in Next.js that contributes to Server-Side Rendering. Should be present on spans that track such functions when the file location of the function is known. `sentry.nextjs.ssr.function.route`
 *
 * Attribute Value Type: `string` {@link SENTRY_NEXTJS_SSR_FUNCTION_ROUTE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "/posts/[id]/layout"
 */
declare const SENTRY_NEXTJS_SSR_FUNCTION_ROUTE = "sentry.nextjs.ssr.function.route";
/**
 * Type for {@link SENTRY_NEXTJS_SSR_FUNCTION_ROUTE} sentry.nextjs.ssr.function.route
 */
type SENTRY_NEXTJS_SSR_FUNCTION_ROUTE_TYPE = string;
/**
 * A descriptor for a for a function in Next.js that contributes to Server-Side Rendering. Should be present on spans that track such functions. `sentry.nextjs.ssr.function.type`
 *
 * Attribute Value Type: `string` {@link SENTRY_NEXTJS_SSR_FUNCTION_TYPE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "generateMetadata"
 */
declare const SENTRY_NEXTJS_SSR_FUNCTION_TYPE = "sentry.nextjs.ssr.function.type";
/**
 * Type for {@link SENTRY_NEXTJS_SSR_FUNCTION_TYPE} sentry.nextjs.ssr.function.type
 */
type SENTRY_NEXTJS_SSR_FUNCTION_TYPE_TYPE = string;
/**
 * The normalized version of `db.query.text`. `sentry.normalized_db_query`
 *
 * Attribute Value Type: `string` {@link SENTRY_NORMALIZED_DB_QUERY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "SELECT .. FROM sentry_project WHERE (project_id = %s)"
 */
declare const SENTRY_NORMALIZED_DB_QUERY = "sentry.normalized_db_query";
/**
 * Type for {@link SENTRY_NORMALIZED_DB_QUERY} sentry.normalized_db_query
 */
type SENTRY_NORMALIZED_DB_QUERY_TYPE = string;
/**
 * The hash of `sentry.normalized_db_query`. `sentry.normalized_db_query.hash`
 *
 * Attribute Value Type: `string` {@link SENTRY_NORMALIZED_DB_QUERY_HASH_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const SENTRY_NORMALIZED_DB_QUERY_HASH = "sentry.normalized_db_query.hash";
/**
 * Type for {@link SENTRY_NORMALIZED_DB_QUERY_HASH} sentry.normalized_db_query.hash
 */
type SENTRY_NORMALIZED_DB_QUERY_HASH_TYPE = string;
/**
 * Used as a generic attribute representing the normalized `sentry.description`. This refers to the legacy use case of `sentry.description` where it holds relevant data depending on the type of span (e.g. database query, resource url, http request description, etc). `sentry.normalized_description`
 *
 * Attribute Value Type: `string` {@link SENTRY_NORMALIZED_DESCRIPTION_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "SELECT .. FROM sentry_project WHERE (project_id = %s)"
 */
declare const SENTRY_NORMALIZED_DESCRIPTION = "sentry.normalized_description";
/**
 * Type for {@link SENTRY_NORMALIZED_DESCRIPTION} sentry.normalized_description
 */
type SENTRY_NORMALIZED_DESCRIPTION_TYPE = string;
/**
 * The timestamp at which an envelope was received by Relay, in nanoseconds. `sentry.observed_timestamp_nanos`
 *
 * Attribute Value Type: `string` {@link SENTRY_OBSERVED_TIMESTAMP_NANOS_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1544712660300000000"
 */
declare const SENTRY_OBSERVED_TIMESTAMP_NANOS = "sentry.observed_timestamp_nanos";
/**
 * Type for {@link SENTRY_OBSERVED_TIMESTAMP_NANOS} sentry.observed_timestamp_nanos
 */
type SENTRY_OBSERVED_TIMESTAMP_NANOS_TYPE = string;
/**
 * The operation of a span. `sentry.op`
 *
 * Attribute Value Type: `string` {@link SENTRY_OP_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "http.client"
 */
declare const SENTRY_OP = "sentry.op";
/**
 * Type for {@link SENTRY_OP} sentry.op
 */
type SENTRY_OP_TYPE = string;
/**
 * The origin of the instrumentation (e.g. span, log, etc.) `sentry.origin`
 *
 * Attribute Value Type: `string` {@link SENTRY_ORIGIN_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "auto.http.otel.fastify"
 */
declare const SENTRY_ORIGIN = "sentry.origin";
/**
 * Type for {@link SENTRY_ORIGIN} sentry.origin
 */
type SENTRY_ORIGIN_TYPE = string;
/**
 * The sdk platform that generated the event. `sentry.platform`
 *
 * Attribute Value Type: `string` {@link SENTRY_PLATFORM_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "php"
 */
declare const SENTRY_PLATFORM = "sentry.platform";
/**
 * Type for {@link SENTRY_PLATFORM} sentry.platform
 */
type SENTRY_PLATFORM_TYPE = string;
/**
 * The id of the currently running profiler (continuous profiling) `sentry.profiler_id`
 *
 * Attribute Value Type: `string` {@link SENTRY_PROFILER_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "18779b64dd35d1a538e7ce2dd2d3fad3"
 */
declare const SENTRY_PROFILER_ID = "sentry.profiler_id";
/**
 * Type for {@link SENTRY_PROFILER_ID} sentry.profiler_id
 */
type SENTRY_PROFILER_ID_TYPE = string;
/**
 * The ID of the Sentry profile the span is associated with. This is only meaningful for transaction-based profiling. `sentry.profile_id`
 *
 * Attribute Value Type: `string` {@link SENTRY_PROFILE_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "123e4567e89b12d3a456426614174000"
 */
declare const SENTRY_PROFILE_ID = "sentry.profile_id";
/**
 * Type for {@link SENTRY_PROFILE_ID} sentry.profile_id
 */
type SENTRY_PROFILE_ID_TYPE = string;
/**
 * The sentry release. `sentry.release`
 *
 * Attribute Value Type: `string` {@link SENTRY_RELEASE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SERVICE_VERSION} `service.version`, {@link RELEASE} `release`
 *
 * @example "7.0.0"
 */
declare const SENTRY_RELEASE = "sentry.release";
/**
 * Type for {@link SENTRY_RELEASE} sentry.release
 */
type SENTRY_RELEASE_TYPE = string;
/**
 * The id of the sentry replay. `sentry.replay_id`
 *
 * Attribute Value Type: `string` {@link SENTRY_REPLAY_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link REPLAY_ID} `replay_id`
 *
 * @example "123e4567e89b12d3a456426614174000"
 */
declare const SENTRY_REPLAY_ID = "sentry.replay_id";
/**
 * Type for {@link SENTRY_REPLAY_ID} sentry.replay_id
 */
type SENTRY_REPLAY_ID_TYPE = string;
/**
 * A sentinel attribute on log events indicating whether the current Session Replay is being buffered (onErrorSampleRate). `sentry.replay_is_buffering`
 *
 * Attribute Value Type: `boolean` {@link SENTRY_REPLAY_IS_BUFFERING_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const SENTRY_REPLAY_IS_BUFFERING = "sentry.replay_is_buffering";
/**
 * Type for {@link SENTRY_REPLAY_IS_BUFFERING} sentry.replay_is_buffering
 */
type SENTRY_REPLAY_IS_BUFFERING_TYPE = boolean;
/**
 * (Deprecated) The event that caused the SDK to report CLS or LCP (pagehide or navigation) `sentry.report_event`
 *
 * Attribute Value Type: `string` {@link SENTRY_REPORT_EVENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated  - The report event is now recorded as a browser.web_vital.lcp.report_event or browser.web_vital.cls.report_event attribute. No backfill required.
 * @example "pagehide"
 */
declare const SENTRY_REPORT_EVENT = "sentry.report_event";
/**
 * Type for {@link SENTRY_REPORT_EVENT} sentry.report_event
 */
type SENTRY_REPORT_EVENT_TYPE = string;
/**
 * A list of names identifying enabled integrations. The list shouldhave all enabled integrations, including default integrations. Defaultintegrations are included because different SDK releases may contain differentdefault integrations. `sentry.sdk.integrations`
 *
 * Attribute Value Type: `Array<string>` {@link SENTRY_SDK_INTEGRATIONS_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example ["InboundFilters","FunctionToString","BrowserApiErrors","Breadcrumbs"]
 */
declare const SENTRY_SDK_INTEGRATIONS = "sentry.sdk.integrations";
/**
 * Type for {@link SENTRY_SDK_INTEGRATIONS} sentry.sdk.integrations
 */
type SENTRY_SDK_INTEGRATIONS_TYPE = Array<string>;
/**
 * The sentry sdk name. `sentry.sdk.name`
 *
 * Attribute Value Type: `string` {@link SENTRY_SDK_NAME_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "@sentry/react"
 */
declare const SENTRY_SDK_NAME = "sentry.sdk.name";
/**
 * Type for {@link SENTRY_SDK_NAME} sentry.sdk.name
 */
type SENTRY_SDK_NAME_TYPE = string;
/**
 * The sentry sdk version. `sentry.sdk.version`
 *
 * Attribute Value Type: `string` {@link SENTRY_SDK_VERSION_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "7.0.0"
 */
declare const SENTRY_SDK_VERSION = "sentry.sdk.version";
/**
 * Type for {@link SENTRY_SDK_VERSION} sentry.sdk.version
 */
type SENTRY_SDK_VERSION_TYPE = string;
/**
 * The segment ID of a span `sentry.segment.id`
 *
 * Attribute Value Type: `string` {@link SENTRY_SEGMENT_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link _SENTRY_SEGMENT_ID} `sentry.segment_id`
 *
 * @example "051581bf3cb55c13"
 */
declare const SENTRY_SEGMENT_ID = "sentry.segment.id";
/**
 * Type for {@link SENTRY_SEGMENT_ID} sentry.segment.id
 */
type SENTRY_SEGMENT_ID_TYPE = string;
/**
 * The segment ID of a span `sentry.segment_id`
 *
 * Attribute Value Type: `string` {@link _SENTRY_SEGMENT_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_SEGMENT_ID} `sentry.segment.id`
 *
 * @deprecated Use {@link SENTRY_SEGMENT_ID} (sentry.segment.id) instead
 * @example "051581bf3cb55c13"
 */
declare const _SENTRY_SEGMENT_ID = "sentry.segment_id";
/**
 * Type for {@link _SENTRY_SEGMENT_ID} sentry.segment_id
 */
type _SENTRY_SEGMENT_ID_TYPE = string;
/**
 * The segment name of a span `sentry.segment.name`
 *
 * Attribute Value Type: `string` {@link SENTRY_SEGMENT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_TRANSACTION} `sentry.transaction`, {@link TRANSACTION} `transaction`
 *
 * @example "GET /user"
 */
declare const SENTRY_SEGMENT_NAME = "sentry.segment.name";
/**
 * Type for {@link SENTRY_SEGMENT_NAME} sentry.segment.name
 */
type SENTRY_SEGMENT_NAME_TYPE = string;
/**
 * Rate at which a span was sampled in Relay. `sentry.server_sample_rate`
 *
 * Attribute Value Type: `number` {@link SENTRY_SERVER_SAMPLE_RATE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 0.5
 */
declare const SENTRY_SERVER_SAMPLE_RATE = "sentry.server_sample_rate";
/**
 * Type for {@link SENTRY_SERVER_SAMPLE_RATE} sentry.server_sample_rate
 */
type SENTRY_SERVER_SAMPLE_RATE_TYPE = number;
/**
 * The source of a span, also referred to as transaction source. Known values are:  `'custom'`, `'url'`, `'route'`, `'component'`, `'view'`, `'task'`. '`source`' describes a parametrized route, while `'url'` describes the full URL, potentially containing identifiers. `sentry.source`
 *
 * Attribute Value Type: `string` {@link SENTRY_SOURCE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link SENTRY_SPAN_SOURCE} (sentry.span.source) instead - This attribute is being deprecated in favor of sentry.span.source
 * @example "route"
 */
declare const SENTRY_SOURCE = "sentry.source";
/**
 * Type for {@link SENTRY_SOURCE} sentry.source
 */
type SENTRY_SOURCE_TYPE = string;
/**
 * The source of a span, also referred to as transaction source. Known values are:  `'custom'`, `'url'`, `'route'`, `'component'`, `'view'`, `'task'`. '`source`' describes a parametrized route, while `'url'` describes the full URL, potentially containing identifiers. `sentry.span.source`
 *
 * Attribute Value Type: `string` {@link SENTRY_SPAN_SOURCE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "route"
 */
declare const SENTRY_SPAN_SOURCE = "sentry.span.source";
/**
 * Type for {@link SENTRY_SPAN_SOURCE} sentry.span.source
 */
type SENTRY_SPAN_SOURCE_TYPE = string;
/**
 * The span's status (either "ok" or "error"). Older SDKs may set this to a more specific error, but this behaviour is deprecated. `sentry.status`
 *
 * Attribute Value Type: `string` {@link SENTRY_STATUS_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "ok"
 */
declare const SENTRY_STATUS = "sentry.status";
/**
 * Type for {@link SENTRY_STATUS} sentry.status
 */
type SENTRY_STATUS_TYPE = string;
/**
 * The HTTP status code used in Sentry Insights. Typically set by Sentry during ingestion, rather than by clients. `sentry.status_code`
 *
 * Attribute Value Type: `number` {@link SENTRY_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 200
 */
declare const SENTRY_STATUS_CODE = "sentry.status_code";
/**
 * Type for {@link SENTRY_STATUS_CODE} sentry.status_code
 */
type SENTRY_STATUS_CODE_TYPE = number;
/**
 * The from OTLP extracted status message. `sentry.status.message`
 *
 * Attribute Value Type: `string` {@link SENTRY_STATUS_MESSAGE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "foobar"
 */
declare const SENTRY_STATUS_MESSAGE = "sentry.status.message";
/**
 * Type for {@link SENTRY_STATUS_MESSAGE} sentry.status.message
 */
type SENTRY_STATUS_MESSAGE_TYPE = string;
/**
 * the navigation origin (sveltekit router) `sentry.sveltekit.navigation.from`
 *
 * Attribute Value Type: `string` {@link SENTRY_SVELTEKIT_NAVIGATION_FROM_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NAVIGATION_ORIGIN} `navigation.origin`
 *
 * @deprecated Use {@link NAVIGATION_ORIGIN} (navigation.origin) instead - Use the more generic attribute instead
 * @example "/home"
 */
declare const SENTRY_SVELTEKIT_NAVIGATION_FROM = "sentry.sveltekit.navigation.from";
/**
 * Type for {@link SENTRY_SVELTEKIT_NAVIGATION_FROM} sentry.sveltekit.navigation.from
 */
type SENTRY_SVELTEKIT_NAVIGATION_FROM_TYPE = string;
/**
 * the navigation destination `sentry.sveltekit.navigation.to`
 *
 * Attribute Value Type: `string` {@link SENTRY_SVELTEKIT_NAVIGATION_TO_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated  - the navigation destination is already covered by url.* attributes
 * @example "/users/:id"
 */
declare const SENTRY_SVELTEKIT_NAVIGATION_TO = "sentry.sveltekit.navigation.to";
/**
 * Type for {@link SENTRY_SVELTEKIT_NAVIGATION_TO} sentry.sveltekit.navigation.to
 */
type SENTRY_SVELTEKIT_NAVIGATION_TO_TYPE = string;
/**
 * The type of navigation event emitted from the sveltekit client router `sentry.sveltekit.navigation.type`
 *
 * Attribute Value Type: `string` {@link SENTRY_SVELTEKIT_NAVIGATION_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link NAVIGATION_TYPE} `navigation.type`
 *
 * @deprecated Use {@link NAVIGATION_TYPE} (navigation.type) instead - Use the more generic attribute instead
 * @example "link"
 */
declare const SENTRY_SVELTEKIT_NAVIGATION_TYPE = "sentry.sveltekit.navigation.type";
/**
 * Type for {@link SENTRY_SVELTEKIT_NAVIGATION_TYPE} sentry.sveltekit.navigation.type
 */
type SENTRY_SVELTEKIT_NAVIGATION_TYPE_TYPE = string;
/**
 * Current “managed” thread ID. `sentry.thread.id`
 *
 * Attribute Value Type: `number` {@link SENTRY_THREAD_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated Use {@link THREAD_ID} (thread.id) instead - This attribute is being deprecated in favor of the OTel-standard thread.id
 * @example 56
 */
declare const SENTRY_THREAD_ID = "sentry.thread.id";
/**
 * Type for {@link SENTRY_THREAD_ID} sentry.thread.id
 */
type SENTRY_THREAD_ID_TYPE = number;
/**
 * A sequencing counter for deterministic ordering of logs or metrics when timestamps share the same integer millisecond. Starts at 0 on SDK initialization, increments by 1 for each captured item, and resets to 0 when the integer millisecond of the current item differs from the previous one. `sentry.timestamp.sequence`
 *
 * Attribute Value Type: `number` {@link SENTRY_TIMESTAMP_SEQUENCE_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 0
 */
declare const SENTRY_TIMESTAMP_SEQUENCE = "sentry.timestamp.sequence";
/**
 * Type for {@link SENTRY_TIMESTAMP_SEQUENCE} sentry.timestamp.sequence
 */
type SENTRY_TIMESTAMP_SEQUENCE_TYPE = number;
/**
 * Indicates the chosen trace lifecycle mode of the SDK (stream or static) `sentry.trace_lifecycle`
 *
 * Attribute Value Type: `string` {@link SENTRY_TRACE_LIFECYCLE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "stream"
 */
declare const SENTRY_TRACE_LIFECYCLE = "sentry.trace_lifecycle";
/**
 * Type for {@link SENTRY_TRACE_LIFECYCLE} sentry.trace_lifecycle
 */
type SENTRY_TRACE_LIFECYCLE_TYPE = string;
/**
 * The span id of the span that was active when the log was collected. This should not be set if there was no active span. `sentry.trace.parent_span_id`
 *
 * Attribute Value Type: `string` {@link SENTRY_TRACE_PARENT_SPAN_ID_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @deprecated
 * @example "b0e6f15b45c36b12"
 */
declare const SENTRY_TRACE_PARENT_SPAN_ID = "sentry.trace.parent_span_id";
/**
 * Type for {@link SENTRY_TRACE_PARENT_SPAN_ID} sentry.trace.parent_span_id
 */
type SENTRY_TRACE_PARENT_SPAN_ID_TYPE = string;
/**
 * The segment's status (either "ok" or "error"). Older SDKs may set this to a more specific error, but this behaviour is deprecated. `sentry.trace.status`
 *
 * Attribute Value Type: `string` {@link SENTRY_TRACE_STATUS_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "ok"
 */
declare const SENTRY_TRACE_STATUS = "sentry.trace.status";
/**
 * Type for {@link SENTRY_TRACE_STATUS} sentry.trace.status
 */
type SENTRY_TRACE_STATUS_TYPE = string;
/**
 * The sentry transaction (segment name). `sentry.transaction`
 *
 * Attribute Value Type: `string` {@link SENTRY_TRANSACTION_TYPE}
 *
 * Apply Scrubbing: never
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_SEGMENT_NAME} `sentry.segment.name`, {@link TRANSACTION} `transaction`
 *
 * @deprecated Use {@link SENTRY_SEGMENT_NAME} (sentry.segment.name) instead - This attribute is being deprecated in favor of sentry.segment.name
 * @example "GET /"
 */
declare const SENTRY_TRANSACTION = "sentry.transaction";
/**
 * Type for {@link SENTRY_TRANSACTION} sentry.transaction
 */
type SENTRY_TRANSACTION_TYPE = string;
/**
 * User email address. `sentry.user.email`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_EMAIL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_EMAIL} `user.email`
 *
 * @deprecated Use {@link USER_EMAIL} (user.email) instead
 */
declare const SENTRY_USER_EMAIL = "sentry.user.email";
/**
 * Type for {@link SENTRY_USER_EMAIL} sentry.user.email
 */
type SENTRY_USER_EMAIL_TYPE = string;
/**
 * Human readable city name. `sentry.user.geo.city`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_GEO_CITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_GEO_CITY} `user.geo.city`
 *
 * @deprecated Use {@link USER_GEO_CITY} (user.geo.city) instead
 */
declare const SENTRY_USER_GEO_CITY = "sentry.user.geo.city";
/**
 * Type for {@link SENTRY_USER_GEO_CITY} sentry.user.geo.city
 */
type SENTRY_USER_GEO_CITY_TYPE = string;
/**
 * Two-letter country code (ISO 3166-1 alpha-2). `sentry.user.geo.country_code`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_GEO_COUNTRY_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_GEO_COUNTRY_CODE} `user.geo.country_code`
 *
 * @deprecated Use {@link USER_GEO_COUNTRY_CODE} (user.geo.country_code) instead
 */
declare const SENTRY_USER_GEO_COUNTRY_CODE = "sentry.user.geo.country_code";
/**
 * Type for {@link SENTRY_USER_GEO_COUNTRY_CODE} sentry.user.geo.country_code
 */
type SENTRY_USER_GEO_COUNTRY_CODE_TYPE = string;
/**
 * Human readable region name or code. `sentry.user.geo.region`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_GEO_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_GEO_REGION} `user.geo.region`
 *
 * @deprecated Use {@link USER_GEO_REGION} (user.geo.region) instead
 */
declare const SENTRY_USER_GEO_REGION = "sentry.user.geo.region";
/**
 * Type for {@link SENTRY_USER_GEO_REGION} sentry.user.geo.region
 */
type SENTRY_USER_GEO_REGION_TYPE = string;
/**
 * Human readable subdivision name. `sentry.user.geo.subdivision`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_GEO_SUBDIVISION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_GEO_SUBDIVISION} `user.geo.subdivision`
 *
 * @deprecated Use {@link USER_GEO_SUBDIVISION} (user.geo.subdivision) instead
 */
declare const SENTRY_USER_GEO_SUBDIVISION = "sentry.user.geo.subdivision";
/**
 * Type for {@link SENTRY_USER_GEO_SUBDIVISION} sentry.user.geo.subdivision
 */
type SENTRY_USER_GEO_SUBDIVISION_TYPE = string;
/**
 * Unique identifier of the user. `sentry.user.id`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_ID_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_ID} `user.id`
 *
 * @deprecated Use {@link USER_ID} (user.id) instead
 */
declare const SENTRY_USER_ID = "sentry.user.id";
/**
 * Type for {@link SENTRY_USER_ID} sentry.user.id
 */
type SENTRY_USER_ID_TYPE = string;
/**
 * The IP address of the user. `sentry.user.ip`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_IP_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_IP_ADDRESS} `user.ip_address`
 *
 * @deprecated Use {@link USER_IP_ADDRESS} (user.ip_address) instead
 */
declare const SENTRY_USER_IP = "sentry.user.ip";
/**
 * Type for {@link SENTRY_USER_IP} sentry.user.ip
 */
type SENTRY_USER_IP_TYPE = string;
/**
 * Short name or login/username of the user. `sentry.user.username`
 *
 * Attribute Value Type: `string` {@link SENTRY_USER_USERNAME_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link USER_NAME} `user.name`
 *
 * @deprecated Use {@link USER_NAME} (user.name) instead
 */
declare const SENTRY_USER_USERNAME = "sentry.user.username";
/**
 * Type for {@link SENTRY_USER_USERNAME} sentry.user.username
 */
type SENTRY_USER_USERNAME_TYPE = string;
/**
 * Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `server.address`
 *
 * Attribute Value Type: `string` {@link SERVER_ADDRESS_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_SERVER_NAME} `http.server_name`, {@link NET_HOST_NAME} `net.host.name`, {@link HTTP_HOST} `http.host`, {@link SERVER_NAME} `server_name`
 *
 * @example "example.com"
 */
declare const SERVER_ADDRESS = "server.address";
/**
 * Type for {@link SERVER_ADDRESS} server.address
 */
type SERVER_ADDRESS_TYPE = string;
/**
 * Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `server_name`
 *
 * Attribute Value Type: `string` {@link SERVER_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SERVER_ADDRESS} `server.address`, {@link HTTP_SERVER_NAME} `http.server_name`, {@link NET_HOST_NAME} `net.host.name`, {@link HTTP_HOST} `http.host`
 *
 * @deprecated Use {@link SERVER_ADDRESS} (server.address) instead - This attribute is being deprecated in favor of server.address, which is the OTel-aligned replacement.
 * @example "example.com"
 */
declare const SERVER_NAME = "server_name";
/**
 * Type for {@link SERVER_NAME} server_name
 */
type SERVER_NAME_TYPE = string;
/**
 * Server port number. `server.port`
 *
 * Attribute Value Type: `number` {@link SERVER_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link NET_HOST_PORT} `net.host.port`
 *
 * @example 1337
 */
declare const SERVER_PORT = "server.port";
/**
 * Type for {@link SERVER_PORT} server.port
 */
type SERVER_PORT_TYPE = number;
/**
 * Logical name of the service. `service.name`
 *
 * Attribute Value Type: `string` {@link SERVICE_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "omegastar"
 */
declare const SERVICE_NAME = "service.name";
/**
 * Type for {@link SERVICE_NAME} service.name
 */
type SERVICE_NAME_TYPE = string;
/**
 * The version string of the service API or implementation. The format is not defined by these conventions. `service.version`
 *
 * Attribute Value Type: `string` {@link SERVICE_VERSION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SENTRY_RELEASE} `sentry.release`
 *
 * @example "5.0.0"
 */
declare const SERVICE_VERSION = "service.version";
/**
 * Type for {@link SERVICE_VERSION} service.version
 */
type SERVICE_VERSION_TYPE = string;
/**
 * A unique id identifying the active session at the time of setting this attribute `session.id`
 *
 * Attribute Value Type: `string` {@link SESSION_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "00112233-4455-6677-8899-aabbccddeeff"
 */
declare const SESSION_ID = "session.id";
/**
 * Type for {@link SESSION_ID} session.id
 */
type SESSION_ID_TYPE = string;
/**
 * The fraction of time the app was stalled. Only applies to React Native. This is computed by Relay. `stall_percentage`
 *
 * Attribute Value Type: `number` {@link STALL_PERCENTAGE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const STALL_PERCENTAGE = "stall_percentage";
/**
 * Type for {@link STALL_PERCENTAGE} stall_percentage
 */
type STALL_PERCENTAGE_TYPE = number;
/**
 * The combined duration of all stalls in milliseconds. Only applies to React Native. This is computed by Relay. `stall_total_time`
 *
 * Attribute Value Type: `number` {@link STALL_TOTAL_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 */
declare const STALL_TOTAL_TIME = "stall_total_time";
/**
 * Type for {@link STALL_TOTAL_TIME} stall_total_time
 */
type STALL_TOTAL_TIME_TYPE = number;
/**
 * The type of state management library `state.type`
 *
 * Attribute Value Type: `string` {@link STATE_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "redux"
 */
declare const STATE_TYPE = "state.type";
/**
 * Type for {@link STATE_TYPE} state.type
 */
type STATE_TYPE_TYPE = string;
/**
 * Current “managed” thread ID. `thread.id`
 *
 * Attribute Value Type: `number` {@link THREAD_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 56
 */
declare const THREAD_ID = "thread.id";
/**
 * Type for {@link THREAD_ID} thread.id
 */
type THREAD_ID_TYPE = number;
/**
 * Current thread name. `thread.name`
 *
 * Attribute Value Type: `string` {@link THREAD_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "main"
 */
declare const THREAD_NAME = "thread.name";
/**
 * Type for {@link THREAD_NAME} thread.name
 */
type THREAD_NAME_TYPE = string;
/**
 * The log tag provided by the timber logging framework. `timber.tag`
 *
 * Attribute Value Type: `string` {@link TIMBER_TAG_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "MyTag"
 */
declare const TIMBER_TAG = "timber.tag";
/**
 * Type for {@link TIMBER_TAG} timber.tag
 */
type TIMBER_TAG_TYPE = string;
/**
 * The duration of time to full display in milliseconds `time_to_full_display`
 *
 * Attribute Value Type: `number` {@link TIME_TO_FULL_DISPLAY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_TTFD_VALUE} `app.vitals.ttfd.value`
 *
 * @deprecated Use {@link APP_VITALS_TTFD_VALUE} (app.vitals.ttfd.value) instead - Replaced by app.vitals.ttfd.value to align with the app.vitals.* namespace for mobile performance attributes
 * @example 1234.56
 */
declare const TIME_TO_FULL_DISPLAY = "time_to_full_display";
/**
 * Type for {@link TIME_TO_FULL_DISPLAY} time_to_full_display
 */
type TIME_TO_FULL_DISPLAY_TYPE = number;
/**
 * The duration of time to initial display in milliseconds `time_to_initial_display`
 *
 * Attribute Value Type: `number` {@link TIME_TO_INITIAL_DISPLAY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link APP_VITALS_TTID_VALUE} `app.vitals.ttid.value`
 *
 * @deprecated Use {@link APP_VITALS_TTID_VALUE} (app.vitals.ttid.value) instead - Replaced by app.vitals.ttid.value to align with the app.vitals.* namespace for mobile performance attributes
 * @example 1234.56
 */
declare const TIME_TO_INITIAL_DISPLAY = "time_to_initial_display";
/**
 * Type for {@link TIME_TO_INITIAL_DISPLAY} time_to_initial_display
 */
type TIME_TO_INITIAL_DISPLAY_TYPE = number;
/**
 * The sentry transaction (segment name). `transaction`
 *
 * Attribute Value Type: `string` {@link TRANSACTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_SEGMENT_NAME} `sentry.segment.name`, {@link SENTRY_TRANSACTION} `sentry.transaction`
 *
 * @deprecated Use {@link SENTRY_SEGMENT_NAME} (sentry.segment.name) instead
 * @example "GET /"
 */
declare const TRANSACTION = "transaction";
/**
 * Type for {@link TRANSACTION} transaction
 */
type TRANSACTION_TYPE = string;
/**
 * The path of the tRPC procedure being called `trpc.procedure_path`
 *
 * Attribute Value Type: `string` {@link TRPC_PROCEDURE_PATH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "user.getById"
 */
declare const TRPC_PROCEDURE_PATH = "trpc.procedure_path";
/**
 * Type for {@link TRPC_PROCEDURE_PATH} trpc.procedure_path
 */
type TRPC_PROCEDURE_PATH_TYPE = string;
/**
 * The type of the tRPC procedure `trpc.procedure_type`
 *
 * Attribute Value Type: `string` {@link TRPC_PROCEDURE_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "query"
 */
declare const TRPC_PROCEDURE_TYPE = "trpc.procedure_type";
/**
 * Type for {@link TRPC_PROCEDURE_TYPE} trpc.procedure_type
 */
type TRPC_PROCEDURE_TYPE_TYPE = string;
/**
 * The value of the recorded Time To First Byte (TTFB) web vital in milliseconds `ttfb`
 *
 * Attribute Value Type: `number` {@link TTFB_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_TTFB_VALUE} `browser.web_vital.ttfb.value`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_TTFB_VALUE} (browser.web_vital.ttfb.value) instead - This attribute is being deprecated in favor of browser.web_vital.ttfb.value
 * @example 194
 */
declare const TTFB = "ttfb";
/**
 * Type for {@link TTFB} ttfb
 */
type TTFB_TYPE = number;
/**
 * The time it takes for the server to process the initial request and send the first byte of a response to the user's browser `ttfb.requestTime`
 *
 * Attribute Value Type: `number` {@link TTFB_REQUESTTIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link BROWSER_WEB_VITAL_TTFB_REQUEST_TIME} `browser.web_vital.ttfb.request_time`
 *
 * @deprecated Use {@link BROWSER_WEB_VITAL_TTFB_REQUEST_TIME} (browser.web_vital.ttfb.request_time) instead - This attribute is being deprecated in favor of browser.web_vital.ttfb.request_time
 * @example 1554.5814
 */
declare const TTFB_REQUESTTIME = "ttfb.requestTime";
/**
 * Type for {@link TTFB_REQUESTTIME} ttfb.requestTime
 */
type TTFB_REQUESTTIME_TYPE = number;
/**
 * More granular type of the operation happening. `type`
 *
 * Attribute Value Type: `string` {@link TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "fetch"
 */
declare const TYPE = "type";
/**
 * Type for {@link TYPE} type
 */
type TYPE_TYPE = string;
/**
 * The name of the associated component. `ui.component_name`
 *
 * Attribute Value Type: `string` {@link UI_COMPONENT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "HomeButton"
 */
declare const UI_COMPONENT_NAME = "ui.component_name";
/**
 * Type for {@link UI_COMPONENT_NAME} ui.component_name
 */
type UI_COMPONENT_NAME_TYPE = string;
/**
 * Whether the span execution contributed to the TTFD (time to fully drawn) metric. `ui.contributes_to_ttfd`
 *
 * Attribute Value Type: `boolean` {@link UI_CONTRIBUTES_TO_TTFD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const UI_CONTRIBUTES_TO_TTFD = "ui.contributes_to_ttfd";
/**
 * Type for {@link UI_CONTRIBUTES_TO_TTFD} ui.contributes_to_ttfd
 */
type UI_CONTRIBUTES_TO_TTFD_TYPE = boolean;
/**
 * Whether the span execution contributed to the TTID (time to initial display) metric. `ui.contributes_to_ttid`
 *
 * Attribute Value Type: `boolean` {@link UI_CONTRIBUTES_TO_TTID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example true
 */
declare const UI_CONTRIBUTES_TO_TTID = "ui.contributes_to_ttid";
/**
 * Type for {@link UI_CONTRIBUTES_TO_TTID} ui.contributes_to_ttid
 */
type UI_CONTRIBUTES_TO_TTID_TYPE = boolean;
/**
 * The height of the UI element (for Html in pixels) `ui.element.height`
 *
 * Attribute Value Type: `number` {@link UI_ELEMENT_HEIGHT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 256
 */
declare const UI_ELEMENT_HEIGHT = "ui.element.height";
/**
 * Type for {@link UI_ELEMENT_HEIGHT} ui.element.height
 */
type UI_ELEMENT_HEIGHT_TYPE = number;
/**
 * The id of the UI element `ui.element.id`
 *
 * Attribute Value Type: `string` {@link UI_ELEMENT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "btn-login"
 */
declare const UI_ELEMENT_ID = "ui.element.id";
/**
 * Type for {@link UI_ELEMENT_ID} ui.element.id
 */
type UI_ELEMENT_ID_TYPE = string;
/**
 * The identifier used to measure the UI element timing `ui.element.identifier`
 *
 * Attribute Value Type: `string` {@link UI_ELEMENT_IDENTIFIER_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "heroImage"
 */
declare const UI_ELEMENT_IDENTIFIER = "ui.element.identifier";
/**
 * Type for {@link UI_ELEMENT_IDENTIFIER} ui.element.identifier
 */
type UI_ELEMENT_IDENTIFIER_TYPE = string;
/**
 * The loading time of a UI element (from time origin to finished loading) `ui.element.load_time`
 *
 * Attribute Value Type: `number` {@link UI_ELEMENT_LOAD_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 998.2234
 */
declare const UI_ELEMENT_LOAD_TIME = "ui.element.load_time";
/**
 * Type for {@link UI_ELEMENT_LOAD_TIME} ui.element.load_time
 */
type UI_ELEMENT_LOAD_TIME_TYPE = number;
/**
 * The type of element paint. Can either be 'image-paint' or 'text-paint' `ui.element.paint_type`
 *
 * Attribute Value Type: `string` {@link UI_ELEMENT_PAINT_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "image-paint"
 */
declare const UI_ELEMENT_PAINT_TYPE = "ui.element.paint_type";
/**
 * Type for {@link UI_ELEMENT_PAINT_TYPE} ui.element.paint_type
 */
type UI_ELEMENT_PAINT_TYPE_TYPE = string;
/**
 * The rendering time of the UI element (from time origin to finished rendering) `ui.element.render_time`
 *
 * Attribute Value Type: `number` {@link UI_ELEMENT_RENDER_TIME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1023.1124
 */
declare const UI_ELEMENT_RENDER_TIME = "ui.element.render_time";
/**
 * Type for {@link UI_ELEMENT_RENDER_TIME} ui.element.render_time
 */
type UI_ELEMENT_RENDER_TIME_TYPE = number;
/**
 * type of the UI element `ui.element.type`
 *
 * Attribute Value Type: `string` {@link UI_ELEMENT_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "img"
 */
declare const UI_ELEMENT_TYPE = "ui.element.type";
/**
 * Type for {@link UI_ELEMENT_TYPE} ui.element.type
 */
type UI_ELEMENT_TYPE_TYPE = string;
/**
 * The URL of the UI element (e.g. an img src) `ui.element.url`
 *
 * Attribute Value Type: `string` {@link UI_ELEMENT_URL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "https://assets.myapp.com/hero.png"
 */
declare const UI_ELEMENT_URL = "ui.element.url";
/**
 * Type for {@link UI_ELEMENT_URL} ui.element.url
 */
type UI_ELEMENT_URL_TYPE = string;
/**
 * The width of the UI element (for HTML in pixels) `ui.element.width`
 *
 * Attribute Value Type: `number` {@link UI_ELEMENT_WIDTH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 512
 */
declare const UI_ELEMENT_WIDTH = "ui.element.width";
/**
 * Type for {@link UI_ELEMENT_WIDTH} ui.element.width
 */
type UI_ELEMENT_WIDTH_TYPE = number;
/**
 * The URL of the resource that was fetched. `url`
 *
 * Attribute Value Type: `string` {@link URL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link URL_FULL} `url.full`, {@link HTTP_URL} `http.url`
 *
 * @deprecated Use {@link URL_FULL} (url.full) instead
 * @example "https://example.com/test?foo=bar#buzz"
 */
declare const URL = "url";
/**
 * Type for {@link URL} url
 */
type URL_TYPE = string;
/**
 * Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name. `url.domain`
 *
 * Attribute Value Type: `string` {@link URL_DOMAIN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "example.com"
 */
declare const URL_DOMAIN = "url.domain";
/**
 * Type for {@link URL_DOMAIN} url.domain
 */
type URL_DOMAIN_TYPE = string;
/**
 * The fragments present in the URI. Note that this does not contain the leading # character, while the `http.fragment` attribute does. `url.fragment`
 *
 * Attribute Value Type: `string` {@link URL_FRAGMENT_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "details"
 */
declare const URL_FRAGMENT = "url.fragment";
/**
 * Type for {@link URL_FRAGMENT} url.fragment
 */
type URL_FRAGMENT_TYPE = string;
/**
 * The URL of the resource that was fetched. `url.full`
 *
 * Attribute Value Type: `string` {@link URL_FULL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_URL} `http.url`, {@link URL} `url`
 *
 * @example "https://example.com/test?foo=bar#buzz"
 */
declare const URL_FULL = "url.full";
/**
 * Type for {@link URL_FULL} url.full
 */
type URL_FULL_TYPE = string;
/**
 * The URI path component. `url.path`
 *
 * Attribute Value Type: `string` {@link URL_PATH_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "/foo"
 */
declare const URL_PATH = "url.path";
/**
 * Type for {@link URL_PATH} url.path
 */
type URL_PATH_TYPE = string;
/**
 * Decoded parameters extracted from a URL path. Usually added by client-side routing frameworks like vue-router. `url.path.parameter.<key>`
 *
 * Attribute Value Type: `string` {@link URL_PATH_PARAMETER_KEY_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Has Dynamic Suffix: true
 *
 * Aliases: {@link PARAMS_KEY} `params.<key>`
 *
 * @example "url.path.parameter.id='123'"
 */
declare const URL_PATH_PARAMETER_KEY = "url.path.parameter.<key>";
/**
 * Base key for {@link URL_PATH_PARAMETER_KEY}. Use with a dynamic suffix, e.g. `${URL_PATH_PARAMETER_KEY_BASE}.${key}`.
 */
declare const URL_PATH_PARAMETER_KEY_BASE = "url.path.parameter";
/**
 * Type for {@link URL_PATH_PARAMETER_KEY} url.path.parameter.<key>
 */
type URL_PATH_PARAMETER_KEY_TYPE = string;
/**
 * Server port number. `url.port`
 *
 * Attribute Value Type: `number` {@link URL_PORT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example 1337
 */
declare const URL_PORT = "url.port";
/**
 * Type for {@link URL_PORT} url.port
 */
type URL_PORT_TYPE = number;
/**
 * The query string present in the URL. Note that this does not contain the leading ? character, while the `http.query` attribute does. `url.query`
 *
 * Attribute Value Type: `string` {@link URL_QUERY_TYPE}
 *
 * Apply Scrubbing: auto - Query string values can contain sensitive information. Clients should attempt to scrub parameters that might contain sensitive information.
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "foo=bar&bar=baz"
 */
declare const URL_QUERY = "url.query";
/**
 * Type for {@link URL_QUERY} url.query
 */
type URL_QUERY_TYPE = string;
/**
 * Indicates that a URL has the same origin as the current page's origin in the browser. `url.same_origin`
 *
 * Attribute Value Type: `boolean` {@link URL_SAME_ORIGIN_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link HTTP_REQUEST_SAME_ORIGIN} `http.request.same_origin`
 *
 * @deprecated Use {@link HTTP_REQUEST_SAME_ORIGIN} (http.request.same_origin) instead - This attribute is being deprecated in favor of http.request.same_origin.
 * @example true
 */
declare const URL_SAME_ORIGIN = "url.same_origin";
/**
 * Type for {@link URL_SAME_ORIGIN} url.same_origin
 */
type URL_SAME_ORIGIN_TYPE = boolean;
/**
 * The URI scheme component identifying the used protocol. `url.scheme`
 *
 * Attribute Value Type: `string` {@link URL_SCHEME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_SCHEME} `http.scheme`
 *
 * @example "https"
 */
declare const URL_SCHEME = "url.scheme";
/**
 * Type for {@link URL_SCHEME} url.scheme
 */
type URL_SCHEME_TYPE = string;
/**
 * The low-cardinality template of an absolute path reference. `url.template`
 *
 * Attribute Value Type: `string` {@link URL_TEMPLATE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_ROUTE} `http.route`
 *
 * @example "/users/:id"
 */
declare const URL_TEMPLATE = "url.template";
/**
 * Type for {@link URL_TEMPLATE} url.template
 */
type URL_TEMPLATE_TYPE = string;
/**
 * Value of the HTTP User-Agent header sent by the client. `user_agent.original`
 *
 * Attribute Value Type: `string` {@link USER_AGENT_ORIGINAL_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link HTTP_USER_AGENT} `http.user_agent`
 *
 * @example "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
 */
declare const USER_AGENT_ORIGINAL = "user_agent.original";
/**
 * Type for {@link USER_AGENT_ORIGINAL} user_agent.original
 */
type USER_AGENT_ORIGINAL_TYPE = string;
/**
 * User email address. `user.email`
 *
 * Attribute Value Type: `string` {@link USER_EMAIL_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_EMAIL} `sentry.user.email`
 *
 * @example "test@example.com"
 */
declare const USER_EMAIL = "user.email";
/**
 * Type for {@link USER_EMAIL} user.email
 */
type USER_EMAIL_TYPE = string;
/**
 * User's full name. `user.full_name`
 *
 * Attribute Value Type: `string` {@link USER_FULL_NAME_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "John Smith"
 */
declare const USER_FULL_NAME = "user.full_name";
/**
 * Type for {@link USER_FULL_NAME} user.full_name
 */
type USER_FULL_NAME_TYPE = string;
/**
 * Human readable city name. `user.geo.city`
 *
 * Attribute Value Type: `string` {@link USER_GEO_CITY_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_GEO_CITY} `sentry.user.geo.city`
 *
 * @example "Toronto"
 */
declare const USER_GEO_CITY = "user.geo.city";
/**
 * Type for {@link USER_GEO_CITY} user.geo.city
 */
type USER_GEO_CITY_TYPE = string;
/**
 * Two-letter country code (ISO 3166-1 alpha-2). `user.geo.country_code`
 *
 * Attribute Value Type: `string` {@link USER_GEO_COUNTRY_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_GEO_COUNTRY_CODE} `sentry.user.geo.country_code`
 *
 * @example "CA"
 */
declare const USER_GEO_COUNTRY_CODE = "user.geo.country_code";
/**
 * Type for {@link USER_GEO_COUNTRY_CODE} user.geo.country_code
 */
type USER_GEO_COUNTRY_CODE_TYPE = string;
/**
 * Human readable region name or code. `user.geo.region`
 *
 * Attribute Value Type: `string` {@link USER_GEO_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_GEO_REGION} `sentry.user.geo.region`
 *
 * @example "Canada"
 */
declare const USER_GEO_REGION = "user.geo.region";
/**
 * Type for {@link USER_GEO_REGION} user.geo.region
 */
type USER_GEO_REGION_TYPE = string;
/**
 * Human readable subdivision name. `user.geo.subdivision`
 *
 * Attribute Value Type: `string` {@link USER_GEO_SUBDIVISION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_GEO_SUBDIVISION} `sentry.user.geo.subdivision`
 *
 * @example "Ontario"
 */
declare const USER_GEO_SUBDIVISION = "user.geo.subdivision";
/**
 * Type for {@link USER_GEO_SUBDIVISION} user.geo.subdivision
 */
type USER_GEO_SUBDIVISION_TYPE = string;
/**
 * Unique user hash to correlate information for a user in anonymized form. `user.hash`
 *
 * Attribute Value Type: `string` {@link USER_HASH_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example "8ae4c2993e0f4f3b8b2d1b1f3b5e8f4d"
 */
declare const USER_HASH = "user.hash";
/**
 * Type for {@link USER_HASH} user.hash
 */
type USER_HASH_TYPE = string;
/**
 * Unique identifier of the user. `user.id`
 *
 * Attribute Value Type: `string` {@link USER_ID_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_ID} `sentry.user.id`
 *
 * @example "S-1-5-21-202424912787-2692429404-2351956786-1000"
 */
declare const USER_ID = "user.id";
/**
 * Type for {@link USER_ID} user.id
 */
type USER_ID_TYPE = string;
/**
 * The IP address of the user. `user.ip_address`
 *
 * Attribute Value Type: `string` {@link USER_IP_ADDRESS_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_IP} `sentry.user.ip`
 *
 * @example "192.168.1.1"
 */
declare const USER_IP_ADDRESS = "user.ip_address";
/**
 * Type for {@link USER_IP_ADDRESS} user.ip_address
 */
type USER_IP_ADDRESS_TYPE = string;
/**
 * Short name or login/username of the user. `user.name`
 *
 * Attribute Value Type: `string` {@link USER_NAME_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * Aliases: {@link SENTRY_USER_USERNAME} `sentry.user.username`
 *
 * @example "j.smith"
 */
declare const USER_NAME = "user.name";
/**
 * Type for {@link USER_NAME} user.name
 */
type USER_NAME_TYPE = string;
/**
 * Array of user roles at the time of the event. `user.roles`
 *
 * Attribute Value Type: `Array<string>` {@link USER_ROLES_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: Yes
 * Visibility: public
 *
 * @example ["admin","editor"]
 */
declare const USER_ROLES = "user.roles";
/**
 * Type for {@link USER_ROLES} user.roles
 */
type USER_ROLES_TYPE = Array<string>;
/**
 * Git branch name for Vercel project `vercel.branch`
 *
 * Attribute Value Type: `string` {@link VERCEL_BRANCH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "main"
 */
declare const VERCEL_BRANCH = "vercel.branch";
/**
 * Type for {@link VERCEL_BRANCH} vercel.branch
 */
type VERCEL_BRANCH_TYPE = string;
/**
 * Identifier for the Vercel build (only present on build logs) `vercel.build_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_BUILD_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "bld_cotnkcr76"
 */
declare const VERCEL_BUILD_ID = "vercel.build_id";
/**
 * Type for {@link VERCEL_BUILD_ID} vercel.build_id
 */
type VERCEL_BUILD_ID_TYPE = string;
/**
 * Identifier for the Vercel deployment `vercel.deployment_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_DEPLOYMENT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "dpl_233NRGRjVZX1caZrXWtz5g1TAksD"
 */
declare const VERCEL_DEPLOYMENT_ID = "vercel.deployment_id";
/**
 * Type for {@link VERCEL_DEPLOYMENT_ID} vercel.deployment_id
 */
type VERCEL_DEPLOYMENT_ID_TYPE = string;
/**
 * Origin of the external content in Vercel (only on external logs) `vercel.destination`
 *
 * Attribute Value Type: `string` {@link VERCEL_DESTINATION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "https://vitals.vercel-insights.com/v1"
 */
declare const VERCEL_DESTINATION = "vercel.destination";
/**
 * Type for {@link VERCEL_DESTINATION} vercel.destination
 */
type VERCEL_DESTINATION_TYPE = string;
/**
 * Type of edge runtime in Vercel `vercel.edge_type`
 *
 * Attribute Value Type: `string` {@link VERCEL_EDGE_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "edge-function"
 */
declare const VERCEL_EDGE_TYPE = "vercel.edge_type";
/**
 * Type for {@link VERCEL_EDGE_TYPE} vercel.edge_type
 */
type VERCEL_EDGE_TYPE_TYPE = string;
/**
 * Entrypoint for the request in Vercel `vercel.entrypoint`
 *
 * Attribute Value Type: `string` {@link VERCEL_ENTRYPOINT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "api/index.js"
 */
declare const VERCEL_ENTRYPOINT = "vercel.entrypoint";
/**
 * Type for {@link VERCEL_ENTRYPOINT} vercel.entrypoint
 */
type VERCEL_ENTRYPOINT_TYPE = string;
/**
 * Region where the request is executed `vercel.execution_region`
 *
 * Attribute Value Type: `string` {@link VERCEL_EXECUTION_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "sfo1"
 */
declare const VERCEL_EXECUTION_REGION = "vercel.execution_region";
/**
 * Type for {@link VERCEL_EXECUTION_REGION} vercel.execution_region
 */
type VERCEL_EXECUTION_REGION_TYPE = string;
/**
 * Unique identifier for the log entry in Vercel `vercel.id`
 *
 * Attribute Value Type: `string` {@link VERCEL_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "1573817187330377061717300000"
 */
declare const VERCEL_ID = "vercel.id";
/**
 * Type for {@link VERCEL_ID} vercel.id
 */
type VERCEL_ID_TYPE = string;
/**
 * JA3 fingerprint digest of Vercel request `vercel.ja3_digest`
 *
 * Attribute Value Type: `string` {@link VERCEL_JA3_DIGEST_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0"
 */
declare const VERCEL_JA3_DIGEST = "vercel.ja3_digest";
/**
 * Type for {@link VERCEL_JA3_DIGEST} vercel.ja3_digest
 */
type VERCEL_JA3_DIGEST_TYPE = string;
/**
 * JA4 fingerprint digest `vercel.ja4_digest`
 *
 * Attribute Value Type: `string` {@link VERCEL_JA4_DIGEST_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "t13d1516h2_8daaf6152771_02713d6af862"
 */
declare const VERCEL_JA4_DIGEST = "vercel.ja4_digest";
/**
 * Type for {@link VERCEL_JA4_DIGEST} vercel.ja4_digest
 */
type VERCEL_JA4_DIGEST_TYPE = string;
/**
 * Vercel log output type `vercel.log_type`
 *
 * Attribute Value Type: `string` {@link VERCEL_LOG_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "stdout"
 */
declare const VERCEL_LOG_TYPE = "vercel.log_type";
/**
 * Type for {@link VERCEL_LOG_TYPE} vercel.log_type
 */
type VERCEL_LOG_TYPE_TYPE = string;
/**
 * Function or dynamic path of the request in Vercel. `vercel.path`
 *
 * Attribute Value Type: `string` {@link VERCEL_PATH_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "/dynamic/[route].json"
 */
declare const VERCEL_PATH = "vercel.path";
/**
 * Type for {@link VERCEL_PATH} vercel.path
 */
type VERCEL_PATH_TYPE = string;
/**
 * Identifier for the Vercel project `vercel.project_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROJECT_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "gdufoJxB6b9b1fEqr1jUtFkyavUU"
 */
declare const VERCEL_PROJECT_ID = "vercel.project_id";
/**
 * Type for {@link VERCEL_PROJECT_ID} vercel.project_id
 */
type VERCEL_PROJECT_ID_TYPE = string;
/**
 * Name of the Vercel project `vercel.project_name`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROJECT_NAME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "my-app"
 */
declare const VERCEL_PROJECT_NAME = "vercel.project_name";
/**
 * Type for {@link VERCEL_PROJECT_NAME} vercel.project_name
 */
type VERCEL_PROJECT_NAME_TYPE = string;
/**
 * Original request ID when request is served from cache `vercel.proxy.cache_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_CACHE_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "pdx1::v8g4b-1744143786684-93dafbc0f70d"
 */
declare const VERCEL_PROXY_CACHE_ID = "vercel.proxy.cache_id";
/**
 * Type for {@link VERCEL_PROXY_CACHE_ID} vercel.proxy.cache_id
 */
type VERCEL_PROXY_CACHE_ID_TYPE = string;
/**
 * Client IP address `vercel.proxy.client_ip`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_CLIENT_IP_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "120.75.16.101"
 */
declare const VERCEL_PROXY_CLIENT_IP = "vercel.proxy.client_ip";
/**
 * Type for {@link VERCEL_PROXY_CLIENT_IP} vercel.proxy.client_ip
 */
type VERCEL_PROXY_CLIENT_IP_TYPE = string;
/**
 * Hostname of the request `vercel.proxy.host`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_HOST_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "test.vercel.app"
 */
declare const VERCEL_PROXY_HOST = "vercel.proxy.host";
/**
 * Type for {@link VERCEL_PROXY_HOST} vercel.proxy.host
 */
type VERCEL_PROXY_HOST_TYPE = string;
/**
 * Region where lambda function executed `vercel.proxy.lambda_region`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_LAMBDA_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "sfo1"
 */
declare const VERCEL_PROXY_LAMBDA_REGION = "vercel.proxy.lambda_region";
/**
 * Type for {@link VERCEL_PROXY_LAMBDA_REGION} vercel.proxy.lambda_region
 */
type VERCEL_PROXY_LAMBDA_REGION_TYPE = string;
/**
 * HTTP method of the request `vercel.proxy.method`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_METHOD_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "GET"
 */
declare const VERCEL_PROXY_METHOD = "vercel.proxy.method";
/**
 * Type for {@link VERCEL_PROXY_METHOD} vercel.proxy.method
 */
type VERCEL_PROXY_METHOD_TYPE = string;
/**
 * Request path with query parameters `vercel.proxy.path`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_PATH_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "/dynamic/some-value.json?route=some-value"
 */
declare const VERCEL_PROXY_PATH = "vercel.proxy.path";
/**
 * Type for {@link VERCEL_PROXY_PATH} vercel.proxy.path
 */
type VERCEL_PROXY_PATH_TYPE = string;
/**
 * How the request was served based on its path and project configuration `vercel.proxy.path_type`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_PATH_TYPE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "func"
 */
declare const VERCEL_PROXY_PATH_TYPE = "vercel.proxy.path_type";
/**
 * Type for {@link VERCEL_PROXY_PATH_TYPE} vercel.proxy.path_type
 */
type VERCEL_PROXY_PATH_TYPE_TYPE = string;
/**
 * Variant of the path type `vercel.proxy.path_type_variant`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_PATH_TYPE_VARIANT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "api"
 */
declare const VERCEL_PROXY_PATH_TYPE_VARIANT = "vercel.proxy.path_type_variant";
/**
 * Type for {@link VERCEL_PROXY_PATH_TYPE_VARIANT} vercel.proxy.path_type_variant
 */
type VERCEL_PROXY_PATH_TYPE_VARIANT_TYPE = string;
/**
 * Referer of the request `vercel.proxy.referer`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_REFERER_TYPE}
 *
 * Apply Scrubbing: auto
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "*.vercel.app"
 */
declare const VERCEL_PROXY_REFERER = "vercel.proxy.referer";
/**
 * Type for {@link VERCEL_PROXY_REFERER} vercel.proxy.referer
 */
type VERCEL_PROXY_REFERER_TYPE = string;
/**
 * Region where the request is processed `vercel.proxy.region`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_REGION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "sfo1"
 */
declare const VERCEL_PROXY_REGION = "vercel.proxy.region";
/**
 * Type for {@link VERCEL_PROXY_REGION} vercel.proxy.region
 */
type VERCEL_PROXY_REGION_TYPE = string;
/**
 * Size of the response in bytes `vercel.proxy.response_byte_size`
 *
 * Attribute Value Type: `number` {@link VERCEL_PROXY_RESPONSE_BYTE_SIZE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1024
 */
declare const VERCEL_PROXY_RESPONSE_BYTE_SIZE = "vercel.proxy.response_byte_size";
/**
 * Type for {@link VERCEL_PROXY_RESPONSE_BYTE_SIZE} vercel.proxy.response_byte_size
 */
type VERCEL_PROXY_RESPONSE_BYTE_SIZE_TYPE = number;
/**
 * Protocol of the request `vercel.proxy.scheme`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_SCHEME_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "https"
 */
declare const VERCEL_PROXY_SCHEME = "vercel.proxy.scheme";
/**
 * Type for {@link VERCEL_PROXY_SCHEME} vercel.proxy.scheme
 */
type VERCEL_PROXY_SCHEME_TYPE = string;
/**
 * HTTP status code of the proxy request `vercel.proxy.status_code`
 *
 * Attribute Value Type: `number` {@link VERCEL_PROXY_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 200
 */
declare const VERCEL_PROXY_STATUS_CODE = "vercel.proxy.status_code";
/**
 * Type for {@link VERCEL_PROXY_STATUS_CODE} vercel.proxy.status_code
 */
type VERCEL_PROXY_STATUS_CODE_TYPE = number;
/**
 * Unix timestamp when the proxy request was made `vercel.proxy.timestamp`
 *
 * Attribute Value Type: `number` {@link VERCEL_PROXY_TIMESTAMP_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 1573817250172
 */
declare const VERCEL_PROXY_TIMESTAMP = "vercel.proxy.timestamp";
/**
 * Type for {@link VERCEL_PROXY_TIMESTAMP} vercel.proxy.timestamp
 */
type VERCEL_PROXY_TIMESTAMP_TYPE = number;
/**
 * User agent strings of the request `vercel.proxy.user_agent`
 *
 * Attribute Value Type: `Array<string>` {@link VERCEL_PROXY_USER_AGENT_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example ["Mozilla/5.0..."]
 */
declare const VERCEL_PROXY_USER_AGENT = "vercel.proxy.user_agent";
/**
 * Type for {@link VERCEL_PROXY_USER_AGENT} vercel.proxy.user_agent
 */
type VERCEL_PROXY_USER_AGENT_TYPE = Array<string>;
/**
 * Cache status sent to the browser `vercel.proxy.vercel_cache`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_VERCEL_CACHE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "REVALIDATED"
 */
declare const VERCEL_PROXY_VERCEL_CACHE = "vercel.proxy.vercel_cache";
/**
 * Type for {@link VERCEL_PROXY_VERCEL_CACHE} vercel.proxy.vercel_cache
 */
type VERCEL_PROXY_VERCEL_CACHE_TYPE = string;
/**
 * Vercel-specific identifier `vercel.proxy.vercel_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_VERCEL_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "sfo1::abc123"
 */
declare const VERCEL_PROXY_VERCEL_ID = "vercel.proxy.vercel_id";
/**
 * Type for {@link VERCEL_PROXY_VERCEL_ID} vercel.proxy.vercel_id
 */
type VERCEL_PROXY_VERCEL_ID_TYPE = string;
/**
 * Action taken by firewall rules `vercel.proxy.waf_action`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_WAF_ACTION_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "deny"
 */
declare const VERCEL_PROXY_WAF_ACTION = "vercel.proxy.waf_action";
/**
 * Type for {@link VERCEL_PROXY_WAF_ACTION} vercel.proxy.waf_action
 */
type VERCEL_PROXY_WAF_ACTION_TYPE = string;
/**
 * ID of the firewall rule that matched `vercel.proxy.waf_rule_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_PROXY_WAF_RULE_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "rule_gAHz8jtSB1Gy"
 */
declare const VERCEL_PROXY_WAF_RULE_ID = "vercel.proxy.waf_rule_id";
/**
 * Type for {@link VERCEL_PROXY_WAF_RULE_ID} vercel.proxy.waf_rule_id
 */
type VERCEL_PROXY_WAF_RULE_ID_TYPE = string;
/**
 * Identifier of the Vercel request `vercel.request_id`
 *
 * Attribute Value Type: `string` {@link VERCEL_REQUEST_ID_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "643af4e3-975a-4cc7-9e7a-1eda11539d90"
 */
declare const VERCEL_REQUEST_ID = "vercel.request_id";
/**
 * Type for {@link VERCEL_REQUEST_ID} vercel.request_id
 */
type VERCEL_REQUEST_ID_TYPE = string;
/**
 * Origin of the Vercel log (build, edge, lambda, static, external, or firewall) `vercel.source`
 *
 * Attribute Value Type: `string` {@link VERCEL_SOURCE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example "build"
 */
declare const VERCEL_SOURCE = "vercel.source";
/**
 * Type for {@link VERCEL_SOURCE} vercel.source
 */
type VERCEL_SOURCE_TYPE = string;
/**
 * HTTP status code of the request (-1 means no response returned and the lambda crashed) `vercel.status_code`
 *
 * Attribute Value Type: `number` {@link VERCEL_STATUS_CODE_TYPE}
 *
 * Apply Scrubbing: manual
 *
 * Attribute defined in OTEL: No
 * Visibility: public
 *
 * @example 200
 */
declare const VERCEL_STATUS_CODE = "vercel.status_code";
/**
 * Type for {@link VERCEL_STATUS_CODE} vercel.status_code
 */
type VERCEL_STATUS_CODE_TYPE = number;
type AttributeType = 'string' | 'boolean' | 'integer' | 'double' | 'string[]' | 'boolean[]' | 'integer[]' | 'double[]' | 'any';
type ApplyScrubbing = 'auto' | 'manual' | 'never';
type AttributeVisibility = 'public' | 'internal';
interface ApplyScrubbingInfo {
    /** How PII scrubbing should be applied to the attribute value */
    key: ApplyScrubbing;
    /** Reason why this scrubbing mode applies */
    reason?: string;
}
interface DeprecationInfo {
    /** What this attribute was replaced with */
    replacement?: string;
    /** Reason for deprecation */
    reason?: string;
}
interface ChangelogEntry {
    /** The sentry-conventions release version */
    version: string;
    /** GitHub PR numbers */
    prs?: number[];
    /** Optional description of what changed */
    description?: string;
}
interface AttributeMetadata {
    /** A description of the attribute */
    brief: string;
    /** The type of the attribute value */
    type: AttributeType;
    /** How PII scrubbing should be applied to the attribute value */
    applyScrubbing: ApplyScrubbingInfo;
    /** Whether the attribute is defined in OpenTelemetry Semantic Conventions */
    isInOtel: boolean;
    /** Whether the attribute is public or internal to Sentry */
    visibility: AttributeVisibility;
    /** If an attribute has a dynamic suffix */
    hasDynamicSuffix?: boolean;
    /** An example value of the attribute */
    example?: AttributeValue;
    /** If an attribute was deprecated, and what it was replaced with */
    deprecation?: DeprecationInfo;
    /** If there are attributes that alias to this attribute */
    aliases?: AttributeName[];
    /** Changelog entries tracking how this attribute has changed across versions */
    changelog?: ChangelogEntry[];
    /** A list of freeform notes providing additional context about how this attribute behaves, common pitfalls, or query-time nuances */
    additionalContext?: string[];
}
declare const ATTRIBUTE_TYPE: Record<string, AttributeType>;
type AttributeName = typeof AI_CITATIONS | typeof AI_COMPLETION_TOKENS_USED | typeof AI_DOCUMENTS | typeof AI_FINISH_REASON | typeof AI_FREQUENCY_PENALTY | typeof AI_FUNCTION_CALL | typeof AI_GENERATION_ID | typeof AI_INPUT_MESSAGES | typeof AI_IS_SEARCH_REQUIRED | typeof AI_METADATA | typeof AI_MODEL_ID | typeof AI_MODEL_PROVIDER | typeof AI_PIPELINE_NAME | typeof AI_PREAMBLE | typeof AI_PRESENCE_PENALTY | typeof AI_PROMPT_TOKENS_USED | typeof AI_RAW_PROMPTING | typeof AI_RESPONSES | typeof AI_RESPONSE_FORMAT | typeof AI_SEARCH_QUERIES | typeof AI_SEARCH_RESULTS | typeof AI_SEED | typeof AI_STREAMING | typeof AI_TAGS | typeof AI_TEMPERATURE | typeof AI_TEXTS | typeof AI_TOOLS | typeof AI_TOOL_CALLS | typeof AI_TOP_K | typeof AI_TOP_P | typeof AI_TOTAL_COST | typeof AI_TOTAL_TOKENS_USED | typeof AI_WARNINGS | typeof ANGULAR_VERSION | typeof APP_APP_BUILD | typeof APP_APP_IDENTIFIER | typeof APP_APP_NAME | typeof APP_APP_START_TIME | typeof APP_APP_VERSION | typeof APP_BUILD | typeof APP_IDENTIFIER | typeof APP_IN_FOREGROUND | typeof APP_NAME | typeof APP_START_COLD | typeof APP_START_TIME | typeof APP_START_TYPE | typeof APP_START_WARM | typeof APP_VERSION | typeof APP_VITALS_FRAMES_DELAY_VALUE | typeof APP_VITALS_FRAMES_FROZEN_COUNT | typeof APP_VITALS_FRAMES_SLOW_COUNT | typeof APP_VITALS_FRAMES_TOTAL_COUNT | typeof APP_VITALS_START_COLD_VALUE | typeof APP_VITALS_START_PREWARMED | typeof APP_VITALS_START_REASON | typeof APP_VITALS_START_SCREEN | typeof APP_VITALS_START_TYPE | typeof APP_VITALS_START_WARM_VALUE | typeof APP_VITALS_TTFD_VALUE | typeof APP_VITALS_TTID_VALUE | typeof ART_GC_BLOCKING_COUNT | typeof ART_GC_BLOCKING_TIME | typeof ART_GC_PRE_OOME_COUNT | typeof ART_GC_TOTAL_COUNT | typeof ART_GC_TOTAL_TIME | typeof ART_GC_WAITING_TIME | typeof ART_MEMORY_FREE | typeof ART_MEMORY_FREE_UNTIL_GC | typeof ART_MEMORY_FREE_UNTIL_OOME | typeof ART_MEMORY_MAX | typeof ART_MEMORY_TOTAL | typeof AWS_CLOUDWATCH_LOGS_LOG_GROUP | typeof AWS_CLOUDWATCH_LOGS_LOG_STREAM | typeof AWS_CLOUDWATCH_LOGS_URL | typeof AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS | typeof AWS_DYNAMODB_CONSISTENT_READ | typeof AWS_DYNAMODB_CONSUMED_CAPACITY | typeof AWS_DYNAMODB_COUNT | typeof AWS_DYNAMODB_EXCLUSIVE_START_TABLE | typeof AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES | typeof AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES | typeof AWS_DYNAMODB_INDEX_NAME | typeof AWS_DYNAMODB_ITEM_COLLECTION_METRICS | typeof AWS_DYNAMODB_LIMIT | typeof AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES | typeof AWS_DYNAMODB_PROJECTION | typeof AWS_DYNAMODB_PROVISIONED_READ_CAPACITY | typeof AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY | typeof AWS_DYNAMODB_SCANNED_COUNT | typeof AWS_DYNAMODB_SCAN_FORWARD | typeof AWS_DYNAMODB_SEGMENT | typeof AWS_DYNAMODB_SELECT | typeof AWS_DYNAMODB_TABLE_COUNT | typeof AWS_DYNAMODB_TABLE_NAMES | typeof AWS_DYNAMODB_TOTAL_SEGMENTS | typeof AWS_EXTENDED_REQUEST_ID | typeof AWS_KINESIS_STREAM_NAME | typeof _AWS_KINESIS_STREAM_NAME | typeof AWS_LAMBDA_AWS_REQUEST_ID | typeof AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS | typeof AWS_LAMBDA_FUNCTION_NAME | typeof AWS_LAMBDA_FUNCTION_VERSION | typeof AWS_LAMBDA_INVOKED_ARN | typeof AWS_LAMBDA_INVOKED_FUNCTION_ARN | typeof AWS_LAMBDA_REMAINING_TIME_IN_MILLIS | typeof AWS_LOG_GROUP_NAMES | typeof AWS_LOG_STREAM_NAMES | typeof AWS_REQUEST_EXTENDED_ID | typeof AWS_REQUEST_ID | typeof _AWS_REQUEST_ID | typeof AWS_S3_BUCKET | typeof AWS_SECRETSMANAGER_SECRET_ARN | typeof AWS_SNS_TOPIC_ARN | typeof AWS_STEP_FUNCTIONS_ACTIVITY_ARN | typeof AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN | typeof BLOCKED_MAIN_THREAD | typeof BROWSER_NAME | typeof BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START | typeof BROWSER_PERFORMANCE_TIME_ORIGIN | typeof BROWSER_REPORT_TYPE | typeof BROWSER_SCRIPT_INVOKER | typeof BROWSER_SCRIPT_INVOKER_TYPE | typeof BROWSER_SCRIPT_SOURCE_CHAR_POSITION | typeof BROWSER_VERSION | typeof BROWSER_WEB_VITAL_CLS_REPORT_EVENT | typeof BROWSER_WEB_VITAL_CLS_SOURCE_KEY | typeof BROWSER_WEB_VITAL_CLS_VALUE | typeof BROWSER_WEB_VITAL_FCP_VALUE | typeof BROWSER_WEB_VITAL_FP_VALUE | typeof BROWSER_WEB_VITAL_INP_VALUE | typeof BROWSER_WEB_VITAL_LCP_ELEMENT | typeof BROWSER_WEB_VITAL_LCP_ID | typeof BROWSER_WEB_VITAL_LCP_LOAD_TIME | typeof BROWSER_WEB_VITAL_LCP_RENDER_TIME | typeof BROWSER_WEB_VITAL_LCP_REPORT_EVENT | typeof BROWSER_WEB_VITAL_LCP_SIZE | typeof BROWSER_WEB_VITAL_LCP_URL | typeof BROWSER_WEB_VITAL_LCP_VALUE | typeof BROWSER_WEB_VITAL_TTFB_REQUEST_TIME | typeof BROWSER_WEB_VITAL_TTFB_VALUE | typeof CACHE_HIT | typeof CACHE_ITEM_SIZE | typeof CACHE_KEY | typeof CACHE_OPERATION | typeof CACHE_TTL | typeof CACHE_WRITE | typeof CHANNEL | typeof CLIENT_ADDRESS | typeof CLIENT_PORT | typeof CLOUDFLARE_D1_DURATION | typeof CLOUDFLARE_D1_QUERY_TYPE | typeof CLOUDFLARE_D1_ROWS_READ | typeof CLOUDFLARE_D1_ROWS_WRITTEN | typeof CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS | typeof CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ | typeof CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN | typeof CLOUDFLARE_R2_BUCKET | typeof CLOUDFLARE_R2_OPERATION | typeof CLOUDFLARE_R2_REQUEST_DELIMITER | typeof CLOUDFLARE_R2_REQUEST_KEY | typeof CLOUDFLARE_R2_REQUEST_PART_NUMBER | typeof CLOUDFLARE_R2_REQUEST_PREFIX | typeof CLOUDFLARE_WORKFLOW_ATTEMPT | typeof CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF | typeof CLOUDFLARE_WORKFLOW_RETRIES_DELAY | typeof CLOUDFLARE_WORKFLOW_RETRIES_LIMIT | typeof CLOUDFLARE_WORKFLOW_TIMEOUT | typeof CLOUD_ACCOUNT_ID | typeof CLOUD_AVAILABILITY_ZONE | typeof CLOUD_PLATFORM | typeof CLOUD_PROVIDER | typeof CLOUD_REGION | typeof CLOUD_RESOURCE_ID | typeof CLS | typeof CLS_SOURCE_KEY | typeof CODE_FILEPATH | typeof CODE_FILE_PATH | typeof CODE_FUNCTION | typeof CODE_FUNCTION_NAME | typeof CODE_LINENO | typeof CODE_LINE_NUMBER | typeof CODE_NAMESPACE | typeof CONNECTIONTYPE | typeof CONNECTION_RTT | typeof CULTURE_CALENDAR | typeof CULTURE_DISPLAY_NAME | typeof CULTURE_IS_24_HOUR_FORMAT | typeof CULTURE_LOCALE | typeof CULTURE_TIMEZONE | typeof DB_COLLECTION_NAME | typeof DB_DRIVER_NAME | typeof DB_NAME | typeof DB_NAMESPACE | typeof DB_OPERATION | typeof DB_OPERATION_BATCH_SIZE | typeof DB_OPERATION_NAME | typeof DB_QUERY_PARAMETER_KEY | typeof DB_QUERY_SUMMARY | typeof DB_QUERY_TEXT | typeof DB_REDIS_CONNECTION | typeof DB_REDIS_KEY | typeof DB_REDIS_PARAMETERS | typeof DB_RESPONSE_STATUS_CODE | typeof DB_SQL_BINDINGS | typeof DB_STATEMENT | typeof DB_STORED_PROCEDURE_NAME | typeof DB_SYSTEM | typeof DB_SYSTEM_NAME | typeof DB_USER | typeof DEVICEMEMORY | typeof DEVICE_ARCHS | typeof DEVICE_BATTERY_LEVEL | typeof DEVICE_BATTERY_TEMPERATURE | typeof DEVICE_BOOT_TIME | typeof DEVICE_BRAND | typeof DEVICE_CHARGING | typeof DEVICE_CHIPSET | typeof DEVICE_CLASS | typeof DEVICE_CONNECTION_TYPE | typeof DEVICE_CPU_DESCRIPTION | typeof DEVICE_EXTERNAL_FREE_STORAGE | typeof DEVICE_EXTERNAL_STORAGE_SIZE | typeof DEVICE_FAMILY | typeof DEVICE_FREE_MEMORY | typeof DEVICE_FREE_STORAGE | typeof DEVICE_ID | typeof DEVICE_LOCALE | typeof DEVICE_LOW_MEMORY | typeof DEVICE_LOW_POWER_MODE | typeof DEVICE_MANUFACTURER | typeof DEVICE_MEMORY_ESTIMATED_CAPACITY | typeof DEVICE_MEMORY_SIZE | typeof DEVICE_MODEL | typeof DEVICE_MODEL_ID | typeof DEVICE_NAME | typeof DEVICE_ONLINE | typeof DEVICE_ORIENTATION | typeof DEVICE_PROCESSOR_COUNT | typeof DEVICE_PROCESSOR_FREQUENCY | typeof DEVICE_SCREEN_DENSITY | typeof DEVICE_SCREEN_DPI | typeof DEVICE_SCREEN_HEIGHT_PIXELS | typeof DEVICE_SCREEN_WIDTH_PIXELS | typeof DEVICE_SIMULATOR | typeof DEVICE_STORAGE_SIZE | typeof DEVICE_THERMAL_STATE | typeof DEVICE_TIMEZONE | typeof DEVICE_USABLE_MEMORY | typeof DIST | typeof EFFECTIVECONNECTIONTYPE | typeof ENVIRONMENT | typeof ERROR_TYPE | typeof EVENT_ID | typeof EVENT_NAME | typeof EXCEPTION_ESCAPED | typeof EXCEPTION_MESSAGE | typeof EXCEPTION_STACKTRACE | typeof EXCEPTION_TYPE | typeof FAAS_COLDSTART | typeof FAAS_CRON | typeof FAAS_DURATION_IN_MS | typeof FAAS_ENTRY_POINT | typeof FAAS_EXECUTION | typeof FAAS_ID | typeof FAAS_IDENTITY | typeof FAAS_INVOCATION_ID | typeof FAAS_INVOKED_NAME | typeof FAAS_INVOKED_PROVIDER | typeof FAAS_INVOKED_REGION | typeof FAAS_NAME | typeof FAAS_TIME | typeof FAAS_TRIGGER | typeof FAAS_VERSION | typeof FCP | typeof FLAG_EVALUATION_KEY | typeof FP | typeof FRAMES_DELAY | typeof FRAMES_FROZEN | typeof FRAMES_FROZEN_RATE | typeof FRAMES_SLOW | typeof FRAMES_SLOW_RATE | typeof FRAMES_TOTAL | typeof FS_ERROR | typeof GCP_FUNCTION_CONTEXT_EVENT_ID | typeof GCP_FUNCTION_CONTEXT_EVENT_TYPE | typeof GCP_FUNCTION_CONTEXT_ID | typeof GCP_FUNCTION_CONTEXT_RESOURCE | typeof GCP_FUNCTION_CONTEXT_SOURCE | typeof GCP_FUNCTION_CONTEXT_SPECVERSION | typeof GCP_FUNCTION_CONTEXT_TIME | typeof GCP_FUNCTION_CONTEXT_TIMESTAMP | typeof GCP_FUNCTION_CONTEXT_TYPE | typeof GCP_PROJECT_ID | typeof GEN_AI_AGENT_NAME | typeof GEN_AI_CONTEXT_UTILIZATION | typeof GEN_AI_CONTEXT_WINDOW_SIZE | typeof GEN_AI_CONVERSATION_ID | typeof GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS | typeof GEN_AI_COST_CACHE_READ_INPUT_TOKENS | typeof GEN_AI_COST_INPUT_TOKENS | typeof GEN_AI_COST_OUTPUT_TOKENS | typeof GEN_AI_COST_REASONING_OUTPUT_TOKENS | typeof GEN_AI_COST_TOTAL_TOKENS | typeof GEN_AI_EMBEDDINGS_INPUT | typeof GEN_AI_FUNCTION_ID | typeof GEN_AI_INPUT_MESSAGES | typeof GEN_AI_OPERATION_NAME | typeof GEN_AI_OPERATION_TYPE | typeof GEN_AI_OUTPUT_MESSAGES | typeof GEN_AI_PIPELINE_NAME | typeof GEN_AI_PROMPT | typeof GEN_AI_PROMPT_NAME | typeof GEN_AI_PROVIDER_NAME | typeof GEN_AI_REQUEST_AVAILABLE_TOOLS | typeof GEN_AI_REQUEST_FREQUENCY_PENALTY | typeof GEN_AI_REQUEST_MAX_TOKENS | typeof GEN_AI_REQUEST_MESSAGES | typeof GEN_AI_REQUEST_MODEL | typeof GEN_AI_REQUEST_PRESENCE_PENALTY | typeof GEN_AI_REQUEST_REASONING_EFFORT | typeof GEN_AI_REQUEST_SEED | typeof GEN_AI_REQUEST_STOP_SEQUENCES | typeof GEN_AI_REQUEST_TEMPERATURE | typeof GEN_AI_REQUEST_TOP_K | typeof GEN_AI_REQUEST_TOP_P | typeof GEN_AI_RESPONSE_FINISH_REASONS | typeof GEN_AI_RESPONSE_ID | typeof GEN_AI_RESPONSE_MODEL | typeof GEN_AI_RESPONSE_STREAMING | typeof GEN_AI_RESPONSE_TEXT | typeof GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK | typeof GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN | typeof GEN_AI_RESPONSE_TOKENS_PER_SECOND | typeof GEN_AI_RESPONSE_TOOL_CALLS | typeof GEN_AI_SYSTEM | typeof GEN_AI_SYSTEM_INSTRUCTIONS | typeof GEN_AI_SYSTEM_MESSAGE | typeof GEN_AI_TOOL_CALL_ARGUMENTS | typeof GEN_AI_TOOL_CALL_RESULT | typeof GEN_AI_TOOL_DEFINITIONS | typeof GEN_AI_TOOL_DESCRIPTION | typeof GEN_AI_TOOL_INPUT | typeof GEN_AI_TOOL_MESSAGE | typeof GEN_AI_TOOL_NAME | typeof GEN_AI_TOOL_OUTPUT | typeof GEN_AI_TOOL_TYPE | typeof GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS | typeof GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS | typeof GEN_AI_USAGE_COMPLETION_TOKENS | typeof GEN_AI_USAGE_INPUT_TOKENS | typeof GEN_AI_USAGE_INPUT_TOKENS_CACHED | typeof GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE | typeof GEN_AI_USAGE_OUTPUT_TOKENS | typeof GEN_AI_USAGE_OUTPUT_TOKENS_REASONING | typeof GEN_AI_USAGE_PROMPT_TOKENS | typeof GEN_AI_USAGE_REASONING_OUTPUT_TOKENS | typeof GEN_AI_USAGE_TOTAL_TOKENS | typeof GRAPHQL_DOCUMENT | typeof GRAPHQL_OPERATION_NAME | typeof GRAPHQL_OPERATION_TYPE | typeof HARDWARECONCURRENCY | typeof HTTP_CLIENT_IP | typeof HTTP_DECODED_RESPONSE_CONTENT_LENGTH | typeof HTTP_FLAVOR | typeof HTTP_FRAGMENT | typeof HTTP_HOST | typeof HTTP_METHOD | typeof HTTP_QUERY | typeof HTTP_REQUEST_BODY_DATA | typeof HTTP_REQUEST_CONNECTION_END | typeof HTTP_REQUEST_CONNECT_START | typeof HTTP_REQUEST_DOMAIN_LOOKUP_END | typeof HTTP_REQUEST_DOMAIN_LOOKUP_START | typeof HTTP_REQUEST_FETCH_START | typeof HTTP_REQUEST_HEADER_KEY | typeof HTTP_REQUEST_METHOD | typeof _HTTP_REQUEST_METHOD | typeof HTTP_REQUEST_REDIRECT_END | typeof HTTP_REQUEST_REDIRECT_START | typeof HTTP_REQUEST_REQUEST_START | typeof HTTP_REQUEST_RESEND_COUNT | typeof HTTP_REQUEST_RESPONSE_END | typeof HTTP_REQUEST_RESPONSE_START | typeof HTTP_REQUEST_SAME_ORIGIN | typeof HTTP_REQUEST_SECURE_CONNECTION_START | typeof HTTP_REQUEST_TIME_TO_FIRST_BYTE | typeof HTTP_REQUEST_WORKER_START | typeof HTTP_RESPONSE_BODY_SIZE | typeof HTTP_RESPONSE_CONTENT_LENGTH | typeof HTTP_RESPONSE_HEADER_CONTENT_LENGTH | typeof HTTP_RESPONSE_HEADER_KEY | typeof HTTP_RESPONSE_SIZE | typeof HTTP_RESPONSE_STATUS_CODE | typeof HTTP_RESPONSE_TRANSFER_SIZE | typeof HTTP_ROUTE | typeof HTTP_SCHEME | typeof HTTP_SERVER_NAME | typeof HTTP_SERVER_REQUEST_TIME_IN_QUEUE | typeof HTTP_STATUS_CODE | typeof HTTP_TARGET | typeof HTTP_URL | typeof HTTP_USER_AGENT | typeof ID | typeof INP | typeof JSONRPC_PROTOCOL_VERSION | typeof JSONRPC_REQUEST_ID | typeof JVM_GC_ACTION | typeof JVM_GC_NAME | typeof JVM_MEMORY_POOL_NAME | typeof JVM_MEMORY_TYPE | typeof JVM_THREAD_DAEMON | typeof JVM_THREAD_STATE | typeof KOA_NAME | typeof KOA_TYPE | typeof LCP | typeof LCP_ELEMENT | typeof LCP_ID | typeof LCP_LOADTIME | typeof LCP_RENDERTIME | typeof LCP_SIZE | typeof LCP_URL | typeof LOGGER_NAME | typeof MCP_CANCELLED_REASON | typeof MCP_CANCELLED_REQUEST_ID | typeof MCP_CLIENT_NAME | typeof MCP_CLIENT_TITLE | typeof MCP_CLIENT_VERSION | typeof MCP_LIFECYCLE_PHASE | typeof MCP_LOGGING_DATA_TYPE | typeof MCP_LOGGING_LEVEL | typeof MCP_LOGGING_LOGGER | typeof MCP_LOGGING_MESSAGE | typeof MCP_METHOD_NAME | typeof MCP_PROGRESS_CURRENT | typeof MCP_PROGRESS_MESSAGE | typeof MCP_PROGRESS_PERCENTAGE | typeof MCP_PROGRESS_TOKEN | typeof MCP_PROGRESS_TOTAL | typeof MCP_PROMPT_NAME | typeof MCP_PROMPT_RESULT_DESCRIPTION | typeof MCP_PROMPT_RESULT_MESSAGE_CONTENT | typeof MCP_PROMPT_RESULT_MESSAGE_COUNT | typeof MCP_PROMPT_RESULT_MESSAGE_ROLE | typeof MCP_PROTOCOL_READY | typeof MCP_PROTOCOL_VERSION | typeof MCP_REQUEST_ARGUMENT_KEY | typeof MCP_REQUEST_ARGUMENT_NAME | typeof MCP_REQUEST_ARGUMENT_URI | typeof MCP_REQUEST_ID | typeof MCP_RESOURCE_PROTOCOL | typeof MCP_RESOURCE_URI | typeof MCP_SERVER_NAME | typeof MCP_SERVER_TITLE | typeof MCP_SERVER_VERSION | typeof MCP_SESSION_ID | typeof MCP_TOOL_NAME | typeof MCP_TOOL_RESULT_CONTENT | typeof MCP_TOOL_RESULT_CONTENT_COUNT | typeof MCP_TOOL_RESULT_IS_ERROR | typeof MCP_TRANSPORT | typeof MDC_KEY | typeof MESSAGING_BATCH_MESSAGE_COUNT | typeof MESSAGING_DESTINATION | typeof MESSAGING_DESTINATION_CONNECTION | typeof MESSAGING_DESTINATION_NAME | typeof MESSAGING_MESSAGE_BODY_SIZE | typeof MESSAGING_MESSAGE_CONVERSATION_ID | typeof MESSAGING_MESSAGE_ENVELOPE_SIZE | typeof MESSAGING_MESSAGE_ID | typeof MESSAGING_MESSAGE_RECEIVE_LATENCY | typeof MESSAGING_MESSAGE_RETRY_COUNT | typeof MESSAGING_OPERATION_NAME | typeof MESSAGING_OPERATION_TYPE | typeof MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY | typeof MESSAGING_SYSTEM | typeof METHOD | typeof MIDDLEWARE_NAME | typeof NAVIGATION_ORIGIN | typeof NAVIGATION_ROUTE_ID | typeof NAVIGATION_TYPE | typeof NEL_ELAPSED_TIME | typeof NEL_PHASE | typeof NEL_REFERRER | typeof NEL_SAMPLING_FUNCTION | typeof NEL_TYPE | typeof NETWORK_CONNECTION_EFFECTIVE_TYPE | typeof NETWORK_CONNECTION_RTT | typeof NETWORK_CONNECTION_TYPE | typeof NETWORK_LOCAL_ADDRESS | typeof NETWORK_LOCAL_PORT | typeof NETWORK_PEER_ADDRESS | typeof NETWORK_PEER_PORT | typeof NETWORK_PROTOCOL_NAME | typeof NETWORK_PROTOCOL_VERSION | typeof NETWORK_TRANSPORT | typeof NETWORK_TYPE | typeof NET_HOST_IP | typeof NET_HOST_NAME | typeof NET_HOST_PORT | typeof NET_PEER_IP | typeof NET_PEER_NAME | typeof NET_PEER_PORT | typeof NET_PROTOCOL_NAME | typeof NET_PROTOCOL_VERSION | typeof NET_SOCK_FAMILY | typeof NET_SOCK_HOST_ADDR | typeof NET_SOCK_HOST_PORT | typeof NET_SOCK_PEER_ADDR | typeof NET_SOCK_PEER_NAME | typeof NET_SOCK_PEER_PORT | typeof NET_TRANSPORT | typeof OS_BUILD | typeof OS_BUILD_ID | typeof OS_DESCRIPTION | typeof OS_KERNEL_VERSION | typeof OS_NAME | typeof OS_RAW_DESCRIPTION | typeof OS_ROOTED | typeof OS_THEME | typeof OS_TYPE | typeof OS_VERSION | typeof OTEL_KIND | typeof OTEL_SCOPE_NAME | typeof OTEL_SCOPE_VERSION | typeof OTEL_STATUS_CODE | typeof OTEL_STATUS_DESCRIPTION | typeof PARAMS_KEY | typeof PERFORMANCE_ACTIVATIONSTART | typeof PERFORMANCE_TIMEORIGIN | typeof PREVIOUS_ROUTE | typeof PROCESS_COMMAND_ARGS | typeof PROCESS_EXECUTABLE_NAME | typeof PROCESS_PID | typeof PROCESS_RUNTIME_DESCRIPTION | typeof PROCESS_RUNTIME_ENGINE_NAME | typeof PROCESS_RUNTIME_ENGINE_VERSION | typeof PROCESS_RUNTIME_NAME | typeof PROCESS_RUNTIME_VERSION | typeof QUERY_KEY | typeof REACT_VERSION | typeof RELEASE | typeof REMIX_ACTION_FORM_DATA_KEY | typeof REPLAY_ID | typeof RESOURCE_DEPLOYMENT_ENVIRONMENT | typeof RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME | typeof RESOURCE_RENDER_BLOCKING_STATUS | typeof ROUTE | typeof RPC_GRPC_STATUS_CODE | typeof RPC_METHOD | typeof RPC_RESPONSE_STATUS_CODE | typeof RPC_SERVICE | typeof RPC_SYSTEM | typeof RPC_SYSTEM_NAME | typeof RUNTIME_BUILD | typeof RUNTIME_NAME | typeof RUNTIME_RAW_DESCRIPTION | typeof RUNTIME_VERSION | typeof SCORE_KEY | typeof SCORE_RATIO_KEY | typeof SCORE_TOTAL | typeof SCORE_WEIGHT_KEY | typeof SENTRY_ACTION | typeof SENTRY_BROWSER_NAME | typeof SENTRY_BROWSER_VERSION | typeof SENTRY_CANCELLATION_REASON | typeof SENTRY_CATEGORY | typeof SENTRY_CLIENT_SAMPLE_RATE | typeof SENTRY_DESCRIPTION | typeof SENTRY_DIST | typeof SENTRY_DOMAIN | typeof SENTRY_DSC_ENVIRONMENT | typeof SENTRY_DSC_PROJECT_ID | typeof SENTRY_DSC_PUBLIC_KEY | typeof SENTRY_DSC_RELEASE | typeof SENTRY_DSC_SAMPLED | typeof SENTRY_DSC_SAMPLE_RATE | typeof SENTRY_DSC_TRACE_ID | typeof SENTRY_DSC_TRANSACTION | typeof SENTRY_ENVIRONMENT | typeof SENTRY_EXCLUSIVE_TIME | typeof SENTRY_GRAPHQL_OPERATION | typeof SENTRY_GROUP | typeof SENTRY_HTTP_PREFETCH | typeof SENTRY_IDLE_SPAN_FINISH_REASON | typeof SENTRY_IS_REMOTE | typeof SENTRY_KIND | typeof SENTRY_MAIN_THREAD | typeof SENTRY_MESSAGE_PARAMETER_KEY | typeof SENTRY_MESSAGE_TEMPLATE | typeof SENTRY_METRIC_SOURCE | typeof SENTRY_MOBILE | typeof SENTRY_MODULE_KEY | typeof SENTRY_NEXTJS_SSR_FUNCTION_ROUTE | typeof SENTRY_NEXTJS_SSR_FUNCTION_TYPE | typeof SENTRY_NORMALIZED_DB_QUERY | typeof SENTRY_NORMALIZED_DB_QUERY_HASH | typeof SENTRY_NORMALIZED_DESCRIPTION | typeof SENTRY_OBSERVED_TIMESTAMP_NANOS | typeof SENTRY_OP | typeof SENTRY_ORIGIN | typeof SENTRY_PLATFORM | typeof SENTRY_PROFILER_ID | typeof SENTRY_PROFILE_ID | typeof SENTRY_RELEASE | typeof SENTRY_REPLAY_ID | typeof SENTRY_REPLAY_IS_BUFFERING | typeof SENTRY_REPORT_EVENT | typeof SENTRY_SDK_INTEGRATIONS | typeof SENTRY_SDK_NAME | typeof SENTRY_SDK_VERSION | typeof SENTRY_SEGMENT_ID | typeof _SENTRY_SEGMENT_ID | typeof SENTRY_SEGMENT_NAME | typeof SENTRY_SERVER_SAMPLE_RATE | typeof SENTRY_SOURCE | typeof SENTRY_SPAN_SOURCE | typeof SENTRY_STATUS | typeof SENTRY_STATUS_CODE | typeof SENTRY_STATUS_MESSAGE | typeof SENTRY_SVELTEKIT_NAVIGATION_FROM | typeof SENTRY_SVELTEKIT_NAVIGATION_TO | typeof SENTRY_SVELTEKIT_NAVIGATION_TYPE | typeof SENTRY_THREAD_ID | typeof SENTRY_TIMESTAMP_SEQUENCE | typeof SENTRY_TRACE_LIFECYCLE | typeof SENTRY_TRACE_PARENT_SPAN_ID | typeof SENTRY_TRACE_STATUS | typeof SENTRY_TRANSACTION | typeof SENTRY_USER_EMAIL | typeof SENTRY_USER_GEO_CITY | typeof SENTRY_USER_GEO_COUNTRY_CODE | typeof SENTRY_USER_GEO_REGION | typeof SENTRY_USER_GEO_SUBDIVISION | typeof SENTRY_USER_ID | typeof SENTRY_USER_IP | typeof SENTRY_USER_USERNAME | typeof SERVER_ADDRESS | typeof SERVER_NAME | typeof SERVER_PORT | typeof SERVICE_NAME | typeof SERVICE_VERSION | typeof SESSION_ID | typeof STALL_PERCENTAGE | typeof STALL_TOTAL_TIME | typeof STATE_TYPE | typeof THREAD_ID | typeof THREAD_NAME | typeof TIMBER_TAG | typeof TIME_TO_FULL_DISPLAY | typeof TIME_TO_INITIAL_DISPLAY | typeof TRANSACTION | typeof TRPC_PROCEDURE_PATH | typeof TRPC_PROCEDURE_TYPE | typeof TTFB | typeof TTFB_REQUESTTIME | typeof TYPE | typeof UI_COMPONENT_NAME | typeof UI_CONTRIBUTES_TO_TTFD | typeof UI_CONTRIBUTES_TO_TTID | typeof UI_ELEMENT_HEIGHT | typeof UI_ELEMENT_ID | typeof UI_ELEMENT_IDENTIFIER | typeof UI_ELEMENT_LOAD_TIME | typeof UI_ELEMENT_PAINT_TYPE | typeof UI_ELEMENT_RENDER_TIME | typeof UI_ELEMENT_TYPE | typeof UI_ELEMENT_URL | typeof UI_ELEMENT_WIDTH | typeof URL | typeof URL_DOMAIN | typeof URL_FRAGMENT | typeof URL_FULL | typeof URL_PATH | typeof URL_PATH_PARAMETER_KEY | typeof URL_PORT | typeof URL_QUERY | typeof URL_SAME_ORIGIN | typeof URL_SCHEME | typeof URL_TEMPLATE | typeof USER_AGENT_ORIGINAL | typeof USER_EMAIL | typeof USER_FULL_NAME | typeof USER_GEO_CITY | typeof USER_GEO_COUNTRY_CODE | typeof USER_GEO_REGION | typeof USER_GEO_SUBDIVISION | typeof USER_HASH | typeof USER_ID | typeof USER_IP_ADDRESS | typeof USER_NAME | typeof USER_ROLES | typeof VERCEL_BRANCH | typeof VERCEL_BUILD_ID | typeof VERCEL_DEPLOYMENT_ID | typeof VERCEL_DESTINATION | typeof VERCEL_EDGE_TYPE | typeof VERCEL_ENTRYPOINT | typeof VERCEL_EXECUTION_REGION | typeof VERCEL_ID | typeof VERCEL_JA3_DIGEST | typeof VERCEL_JA4_DIGEST | typeof VERCEL_LOG_TYPE | typeof VERCEL_PATH | typeof VERCEL_PROJECT_ID | typeof VERCEL_PROJECT_NAME | typeof VERCEL_PROXY_CACHE_ID | typeof VERCEL_PROXY_CLIENT_IP | typeof VERCEL_PROXY_HOST | typeof VERCEL_PROXY_LAMBDA_REGION | typeof VERCEL_PROXY_METHOD | typeof VERCEL_PROXY_PATH | typeof VERCEL_PROXY_PATH_TYPE | typeof VERCEL_PROXY_PATH_TYPE_VARIANT | typeof VERCEL_PROXY_REFERER | typeof VERCEL_PROXY_REGION | typeof VERCEL_PROXY_RESPONSE_BYTE_SIZE | typeof VERCEL_PROXY_SCHEME | typeof VERCEL_PROXY_STATUS_CODE | typeof VERCEL_PROXY_TIMESTAMP | typeof VERCEL_PROXY_USER_AGENT | typeof VERCEL_PROXY_VERCEL_CACHE | typeof VERCEL_PROXY_VERCEL_ID | typeof VERCEL_PROXY_WAF_ACTION | typeof VERCEL_PROXY_WAF_RULE_ID | typeof VERCEL_REQUEST_ID | typeof VERCEL_SOURCE | typeof VERCEL_STATUS_CODE;
declare const ATTRIBUTE_METADATA: Record<AttributeName, AttributeMetadata>;
type AttributeValue = string | number | boolean | Array<string> | Array<number> | Array<boolean>;
type Attributes = {
    [AI_CITATIONS]?: AI_CITATIONS_TYPE;
    [AI_COMPLETION_TOKENS_USED]?: AI_COMPLETION_TOKENS_USED_TYPE;
    [AI_DOCUMENTS]?: AI_DOCUMENTS_TYPE;
    [AI_FINISH_REASON]?: AI_FINISH_REASON_TYPE;
    [AI_FREQUENCY_PENALTY]?: AI_FREQUENCY_PENALTY_TYPE;
    [AI_FUNCTION_CALL]?: AI_FUNCTION_CALL_TYPE;
    [AI_GENERATION_ID]?: AI_GENERATION_ID_TYPE;
    [AI_INPUT_MESSAGES]?: AI_INPUT_MESSAGES_TYPE;
    [AI_IS_SEARCH_REQUIRED]?: AI_IS_SEARCH_REQUIRED_TYPE;
    [AI_METADATA]?: AI_METADATA_TYPE;
    [AI_MODEL_ID]?: AI_MODEL_ID_TYPE;
    [AI_MODEL_PROVIDER]?: AI_MODEL_PROVIDER_TYPE;
    [AI_PIPELINE_NAME]?: AI_PIPELINE_NAME_TYPE;
    [AI_PREAMBLE]?: AI_PREAMBLE_TYPE;
    [AI_PRESENCE_PENALTY]?: AI_PRESENCE_PENALTY_TYPE;
    [AI_PROMPT_TOKENS_USED]?: AI_PROMPT_TOKENS_USED_TYPE;
    [AI_RAW_PROMPTING]?: AI_RAW_PROMPTING_TYPE;
    [AI_RESPONSES]?: AI_RESPONSES_TYPE;
    [AI_RESPONSE_FORMAT]?: AI_RESPONSE_FORMAT_TYPE;
    [AI_SEARCH_QUERIES]?: AI_SEARCH_QUERIES_TYPE;
    [AI_SEARCH_RESULTS]?: AI_SEARCH_RESULTS_TYPE;
    [AI_SEED]?: AI_SEED_TYPE;
    [AI_STREAMING]?: AI_STREAMING_TYPE;
    [AI_TAGS]?: AI_TAGS_TYPE;
    [AI_TEMPERATURE]?: AI_TEMPERATURE_TYPE;
    [AI_TEXTS]?: AI_TEXTS_TYPE;
    [AI_TOOLS]?: AI_TOOLS_TYPE;
    [AI_TOOL_CALLS]?: AI_TOOL_CALLS_TYPE;
    [AI_TOP_K]?: AI_TOP_K_TYPE;
    [AI_TOP_P]?: AI_TOP_P_TYPE;
    [AI_TOTAL_COST]?: AI_TOTAL_COST_TYPE;
    [AI_TOTAL_TOKENS_USED]?: AI_TOTAL_TOKENS_USED_TYPE;
    [AI_WARNINGS]?: AI_WARNINGS_TYPE;
    [ANGULAR_VERSION]?: ANGULAR_VERSION_TYPE;
    [APP_APP_BUILD]?: APP_APP_BUILD_TYPE;
    [APP_APP_IDENTIFIER]?: APP_APP_IDENTIFIER_TYPE;
    [APP_APP_NAME]?: APP_APP_NAME_TYPE;
    [APP_APP_START_TIME]?: APP_APP_START_TIME_TYPE;
    [APP_APP_VERSION]?: APP_APP_VERSION_TYPE;
    [APP_BUILD]?: APP_BUILD_TYPE;
    [APP_IDENTIFIER]?: APP_IDENTIFIER_TYPE;
    [APP_IN_FOREGROUND]?: APP_IN_FOREGROUND_TYPE;
    [APP_NAME]?: APP_NAME_TYPE;
    [APP_START_COLD]?: APP_START_COLD_TYPE;
    [APP_START_TIME]?: APP_START_TIME_TYPE;
    [APP_START_TYPE]?: APP_START_TYPE_TYPE;
    [APP_START_WARM]?: APP_START_WARM_TYPE;
    [APP_VERSION]?: APP_VERSION_TYPE;
    [APP_VITALS_FRAMES_DELAY_VALUE]?: APP_VITALS_FRAMES_DELAY_VALUE_TYPE;
    [APP_VITALS_FRAMES_FROZEN_COUNT]?: APP_VITALS_FRAMES_FROZEN_COUNT_TYPE;
    [APP_VITALS_FRAMES_SLOW_COUNT]?: APP_VITALS_FRAMES_SLOW_COUNT_TYPE;
    [APP_VITALS_FRAMES_TOTAL_COUNT]?: APP_VITALS_FRAMES_TOTAL_COUNT_TYPE;
    [APP_VITALS_START_COLD_VALUE]?: APP_VITALS_START_COLD_VALUE_TYPE;
    [APP_VITALS_START_PREWARMED]?: APP_VITALS_START_PREWARMED_TYPE;
    [APP_VITALS_START_REASON]?: APP_VITALS_START_REASON_TYPE;
    [APP_VITALS_START_SCREEN]?: APP_VITALS_START_SCREEN_TYPE;
    [APP_VITALS_START_TYPE]?: APP_VITALS_START_TYPE_TYPE;
    [APP_VITALS_START_WARM_VALUE]?: APP_VITALS_START_WARM_VALUE_TYPE;
    [APP_VITALS_TTFD_VALUE]?: APP_VITALS_TTFD_VALUE_TYPE;
    [APP_VITALS_TTID_VALUE]?: APP_VITALS_TTID_VALUE_TYPE;
    [ART_GC_BLOCKING_COUNT]?: ART_GC_BLOCKING_COUNT_TYPE;
    [ART_GC_BLOCKING_TIME]?: ART_GC_BLOCKING_TIME_TYPE;
    [ART_GC_PRE_OOME_COUNT]?: ART_GC_PRE_OOME_COUNT_TYPE;
    [ART_GC_TOTAL_COUNT]?: ART_GC_TOTAL_COUNT_TYPE;
    [ART_GC_TOTAL_TIME]?: ART_GC_TOTAL_TIME_TYPE;
    [ART_GC_WAITING_TIME]?: ART_GC_WAITING_TIME_TYPE;
    [ART_MEMORY_FREE]?: ART_MEMORY_FREE_TYPE;
    [ART_MEMORY_FREE_UNTIL_GC]?: ART_MEMORY_FREE_UNTIL_GC_TYPE;
    [ART_MEMORY_FREE_UNTIL_OOME]?: ART_MEMORY_FREE_UNTIL_OOME_TYPE;
    [ART_MEMORY_MAX]?: ART_MEMORY_MAX_TYPE;
    [ART_MEMORY_TOTAL]?: ART_MEMORY_TOTAL_TYPE;
    [AWS_CLOUDWATCH_LOGS_LOG_GROUP]?: AWS_CLOUDWATCH_LOGS_LOG_GROUP_TYPE;
    [AWS_CLOUDWATCH_LOGS_LOG_STREAM]?: AWS_CLOUDWATCH_LOGS_LOG_STREAM_TYPE;
    [AWS_CLOUDWATCH_LOGS_URL]?: AWS_CLOUDWATCH_LOGS_URL_TYPE;
    [AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS]?: AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS_TYPE;
    [AWS_DYNAMODB_CONSISTENT_READ]?: AWS_DYNAMODB_CONSISTENT_READ_TYPE;
    [AWS_DYNAMODB_CONSUMED_CAPACITY]?: AWS_DYNAMODB_CONSUMED_CAPACITY_TYPE;
    [AWS_DYNAMODB_COUNT]?: AWS_DYNAMODB_COUNT_TYPE;
    [AWS_DYNAMODB_EXCLUSIVE_START_TABLE]?: AWS_DYNAMODB_EXCLUSIVE_START_TABLE_TYPE;
    [AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES]?: AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES_TYPE;
    [AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES]?: AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES_TYPE;
    [AWS_DYNAMODB_INDEX_NAME]?: AWS_DYNAMODB_INDEX_NAME_TYPE;
    [AWS_DYNAMODB_ITEM_COLLECTION_METRICS]?: AWS_DYNAMODB_ITEM_COLLECTION_METRICS_TYPE;
    [AWS_DYNAMODB_LIMIT]?: AWS_DYNAMODB_LIMIT_TYPE;
    [AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES]?: AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES_TYPE;
    [AWS_DYNAMODB_PROJECTION]?: AWS_DYNAMODB_PROJECTION_TYPE;
    [AWS_DYNAMODB_PROVISIONED_READ_CAPACITY]?: AWS_DYNAMODB_PROVISIONED_READ_CAPACITY_TYPE;
    [AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY]?: AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY_TYPE;
    [AWS_DYNAMODB_SCANNED_COUNT]?: AWS_DYNAMODB_SCANNED_COUNT_TYPE;
    [AWS_DYNAMODB_SCAN_FORWARD]?: AWS_DYNAMODB_SCAN_FORWARD_TYPE;
    [AWS_DYNAMODB_SEGMENT]?: AWS_DYNAMODB_SEGMENT_TYPE;
    [AWS_DYNAMODB_SELECT]?: AWS_DYNAMODB_SELECT_TYPE;
    [AWS_DYNAMODB_TABLE_COUNT]?: AWS_DYNAMODB_TABLE_COUNT_TYPE;
    [AWS_DYNAMODB_TABLE_NAMES]?: AWS_DYNAMODB_TABLE_NAMES_TYPE;
    [AWS_DYNAMODB_TOTAL_SEGMENTS]?: AWS_DYNAMODB_TOTAL_SEGMENTS_TYPE;
    [AWS_EXTENDED_REQUEST_ID]?: AWS_EXTENDED_REQUEST_ID_TYPE;
    [AWS_KINESIS_STREAM_NAME]?: AWS_KINESIS_STREAM_NAME_TYPE;
    [_AWS_KINESIS_STREAM_NAME]?: _AWS_KINESIS_STREAM_NAME_TYPE;
    [AWS_LAMBDA_AWS_REQUEST_ID]?: AWS_LAMBDA_AWS_REQUEST_ID_TYPE;
    [AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS]?: AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS_TYPE;
    [AWS_LAMBDA_FUNCTION_NAME]?: AWS_LAMBDA_FUNCTION_NAME_TYPE;
    [AWS_LAMBDA_FUNCTION_VERSION]?: AWS_LAMBDA_FUNCTION_VERSION_TYPE;
    [AWS_LAMBDA_INVOKED_ARN]?: AWS_LAMBDA_INVOKED_ARN_TYPE;
    [AWS_LAMBDA_INVOKED_FUNCTION_ARN]?: AWS_LAMBDA_INVOKED_FUNCTION_ARN_TYPE;
    [AWS_LAMBDA_REMAINING_TIME_IN_MILLIS]?: AWS_LAMBDA_REMAINING_TIME_IN_MILLIS_TYPE;
    [AWS_LOG_GROUP_NAMES]?: AWS_LOG_GROUP_NAMES_TYPE;
    [AWS_LOG_STREAM_NAMES]?: AWS_LOG_STREAM_NAMES_TYPE;
    [AWS_REQUEST_EXTENDED_ID]?: AWS_REQUEST_EXTENDED_ID_TYPE;
    [AWS_REQUEST_ID]?: AWS_REQUEST_ID_TYPE;
    [_AWS_REQUEST_ID]?: _AWS_REQUEST_ID_TYPE;
    [AWS_S3_BUCKET]?: AWS_S3_BUCKET_TYPE;
    [AWS_SECRETSMANAGER_SECRET_ARN]?: AWS_SECRETSMANAGER_SECRET_ARN_TYPE;
    [AWS_SNS_TOPIC_ARN]?: AWS_SNS_TOPIC_ARN_TYPE;
    [AWS_STEP_FUNCTIONS_ACTIVITY_ARN]?: AWS_STEP_FUNCTIONS_ACTIVITY_ARN_TYPE;
    [AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN]?: AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN_TYPE;
    [BLOCKED_MAIN_THREAD]?: BLOCKED_MAIN_THREAD_TYPE;
    [BROWSER_NAME]?: BROWSER_NAME_TYPE;
    [BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START]?: BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START_TYPE;
    [BROWSER_PERFORMANCE_TIME_ORIGIN]?: BROWSER_PERFORMANCE_TIME_ORIGIN_TYPE;
    [BROWSER_REPORT_TYPE]?: BROWSER_REPORT_TYPE_TYPE;
    [BROWSER_SCRIPT_INVOKER]?: BROWSER_SCRIPT_INVOKER_TYPE;
    [BROWSER_SCRIPT_INVOKER_TYPE]?: BROWSER_SCRIPT_INVOKER_TYPE_TYPE;
    [BROWSER_SCRIPT_SOURCE_CHAR_POSITION]?: BROWSER_SCRIPT_SOURCE_CHAR_POSITION_TYPE;
    [BROWSER_VERSION]?: BROWSER_VERSION_TYPE;
    [BROWSER_WEB_VITAL_CLS_REPORT_EVENT]?: BROWSER_WEB_VITAL_CLS_REPORT_EVENT_TYPE;
    [BROWSER_WEB_VITAL_CLS_SOURCE_KEY]?: BROWSER_WEB_VITAL_CLS_SOURCE_KEY_TYPE;
    [BROWSER_WEB_VITAL_CLS_VALUE]?: BROWSER_WEB_VITAL_CLS_VALUE_TYPE;
    [BROWSER_WEB_VITAL_FCP_VALUE]?: BROWSER_WEB_VITAL_FCP_VALUE_TYPE;
    [BROWSER_WEB_VITAL_FP_VALUE]?: BROWSER_WEB_VITAL_FP_VALUE_TYPE;
    [BROWSER_WEB_VITAL_INP_VALUE]?: BROWSER_WEB_VITAL_INP_VALUE_TYPE;
    [BROWSER_WEB_VITAL_LCP_ELEMENT]?: BROWSER_WEB_VITAL_LCP_ELEMENT_TYPE;
    [BROWSER_WEB_VITAL_LCP_ID]?: BROWSER_WEB_VITAL_LCP_ID_TYPE;
    [BROWSER_WEB_VITAL_LCP_LOAD_TIME]?: BROWSER_WEB_VITAL_LCP_LOAD_TIME_TYPE;
    [BROWSER_WEB_VITAL_LCP_RENDER_TIME]?: BROWSER_WEB_VITAL_LCP_RENDER_TIME_TYPE;
    [BROWSER_WEB_VITAL_LCP_REPORT_EVENT]?: BROWSER_WEB_VITAL_LCP_REPORT_EVENT_TYPE;
    [BROWSER_WEB_VITAL_LCP_SIZE]?: BROWSER_WEB_VITAL_LCP_SIZE_TYPE;
    [BROWSER_WEB_VITAL_LCP_URL]?: BROWSER_WEB_VITAL_LCP_URL_TYPE;
    [BROWSER_WEB_VITAL_LCP_VALUE]?: BROWSER_WEB_VITAL_LCP_VALUE_TYPE;
    [BROWSER_WEB_VITAL_TTFB_REQUEST_TIME]?: BROWSER_WEB_VITAL_TTFB_REQUEST_TIME_TYPE;
    [BROWSER_WEB_VITAL_TTFB_VALUE]?: BROWSER_WEB_VITAL_TTFB_VALUE_TYPE;
    [CACHE_HIT]?: CACHE_HIT_TYPE;
    [CACHE_ITEM_SIZE]?: CACHE_ITEM_SIZE_TYPE;
    [CACHE_KEY]?: CACHE_KEY_TYPE;
    [CACHE_OPERATION]?: CACHE_OPERATION_TYPE;
    [CACHE_TTL]?: CACHE_TTL_TYPE;
    [CACHE_WRITE]?: CACHE_WRITE_TYPE;
    [CHANNEL]?: CHANNEL_TYPE;
    [CLIENT_ADDRESS]?: CLIENT_ADDRESS_TYPE;
    [CLIENT_PORT]?: CLIENT_PORT_TYPE;
    [CLOUDFLARE_D1_DURATION]?: CLOUDFLARE_D1_DURATION_TYPE;
    [CLOUDFLARE_D1_QUERY_TYPE]?: CLOUDFLARE_D1_QUERY_TYPE_TYPE;
    [CLOUDFLARE_D1_ROWS_READ]?: CLOUDFLARE_D1_ROWS_READ_TYPE;
    [CLOUDFLARE_D1_ROWS_WRITTEN]?: CLOUDFLARE_D1_ROWS_WRITTEN_TYPE;
    [CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS]?: CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS_TYPE;
    [CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ]?: CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ_TYPE;
    [CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN]?: CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN_TYPE;
    [CLOUDFLARE_R2_BUCKET]?: CLOUDFLARE_R2_BUCKET_TYPE;
    [CLOUDFLARE_R2_OPERATION]?: CLOUDFLARE_R2_OPERATION_TYPE;
    [CLOUDFLARE_R2_REQUEST_DELIMITER]?: CLOUDFLARE_R2_REQUEST_DELIMITER_TYPE;
    [CLOUDFLARE_R2_REQUEST_KEY]?: CLOUDFLARE_R2_REQUEST_KEY_TYPE;
    [CLOUDFLARE_R2_REQUEST_PART_NUMBER]?: CLOUDFLARE_R2_REQUEST_PART_NUMBER_TYPE;
    [CLOUDFLARE_R2_REQUEST_PREFIX]?: CLOUDFLARE_R2_REQUEST_PREFIX_TYPE;
    [CLOUDFLARE_WORKFLOW_ATTEMPT]?: CLOUDFLARE_WORKFLOW_ATTEMPT_TYPE;
    [CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF]?: CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF_TYPE;
    [CLOUDFLARE_WORKFLOW_RETRIES_DELAY]?: CLOUDFLARE_WORKFLOW_RETRIES_DELAY_TYPE;
    [CLOUDFLARE_WORKFLOW_RETRIES_LIMIT]?: CLOUDFLARE_WORKFLOW_RETRIES_LIMIT_TYPE;
    [CLOUDFLARE_WORKFLOW_TIMEOUT]?: CLOUDFLARE_WORKFLOW_TIMEOUT_TYPE;
    [CLOUD_ACCOUNT_ID]?: CLOUD_ACCOUNT_ID_TYPE;
    [CLOUD_AVAILABILITY_ZONE]?: CLOUD_AVAILABILITY_ZONE_TYPE;
    [CLOUD_PLATFORM]?: CLOUD_PLATFORM_TYPE;
    [CLOUD_PROVIDER]?: CLOUD_PROVIDER_TYPE;
    [CLOUD_REGION]?: CLOUD_REGION_TYPE;
    [CLOUD_RESOURCE_ID]?: CLOUD_RESOURCE_ID_TYPE;
    [CLS]?: CLS_TYPE;
    [CLS_SOURCE_KEY]?: CLS_SOURCE_KEY_TYPE;
    [CODE_FILEPATH]?: CODE_FILEPATH_TYPE;
    [CODE_FILE_PATH]?: CODE_FILE_PATH_TYPE;
    [CODE_FUNCTION]?: CODE_FUNCTION_TYPE;
    [CODE_FUNCTION_NAME]?: CODE_FUNCTION_NAME_TYPE;
    [CODE_LINENO]?: CODE_LINENO_TYPE;
    [CODE_LINE_NUMBER]?: CODE_LINE_NUMBER_TYPE;
    [CODE_NAMESPACE]?: CODE_NAMESPACE_TYPE;
    [CONNECTIONTYPE]?: CONNECTIONTYPE_TYPE;
    [CONNECTION_RTT]?: CONNECTION_RTT_TYPE;
    [CULTURE_CALENDAR]?: CULTURE_CALENDAR_TYPE;
    [CULTURE_DISPLAY_NAME]?: CULTURE_DISPLAY_NAME_TYPE;
    [CULTURE_IS_24_HOUR_FORMAT]?: CULTURE_IS_24_HOUR_FORMAT_TYPE;
    [CULTURE_LOCALE]?: CULTURE_LOCALE_TYPE;
    [CULTURE_TIMEZONE]?: CULTURE_TIMEZONE_TYPE;
    [DB_COLLECTION_NAME]?: DB_COLLECTION_NAME_TYPE;
    [DB_DRIVER_NAME]?: DB_DRIVER_NAME_TYPE;
    [DB_NAME]?: DB_NAME_TYPE;
    [DB_NAMESPACE]?: DB_NAMESPACE_TYPE;
    [DB_OPERATION]?: DB_OPERATION_TYPE;
    [DB_OPERATION_BATCH_SIZE]?: DB_OPERATION_BATCH_SIZE_TYPE;
    [DB_OPERATION_NAME]?: DB_OPERATION_NAME_TYPE;
    [DB_QUERY_PARAMETER_KEY]?: DB_QUERY_PARAMETER_KEY_TYPE;
    [DB_QUERY_SUMMARY]?: DB_QUERY_SUMMARY_TYPE;
    [DB_QUERY_TEXT]?: DB_QUERY_TEXT_TYPE;
    [DB_REDIS_CONNECTION]?: DB_REDIS_CONNECTION_TYPE;
    [DB_REDIS_KEY]?: DB_REDIS_KEY_TYPE;
    [DB_REDIS_PARAMETERS]?: DB_REDIS_PARAMETERS_TYPE;
    [DB_RESPONSE_STATUS_CODE]?: DB_RESPONSE_STATUS_CODE_TYPE;
    [DB_SQL_BINDINGS]?: DB_SQL_BINDINGS_TYPE;
    [DB_STATEMENT]?: DB_STATEMENT_TYPE;
    [DB_STORED_PROCEDURE_NAME]?: DB_STORED_PROCEDURE_NAME_TYPE;
    [DB_SYSTEM]?: DB_SYSTEM_TYPE;
    [DB_SYSTEM_NAME]?: DB_SYSTEM_NAME_TYPE;
    [DB_USER]?: DB_USER_TYPE;
    [DEVICEMEMORY]?: DEVICEMEMORY_TYPE;
    [DEVICE_ARCHS]?: DEVICE_ARCHS_TYPE;
    [DEVICE_BATTERY_LEVEL]?: DEVICE_BATTERY_LEVEL_TYPE;
    [DEVICE_BATTERY_TEMPERATURE]?: DEVICE_BATTERY_TEMPERATURE_TYPE;
    [DEVICE_BOOT_TIME]?: DEVICE_BOOT_TIME_TYPE;
    [DEVICE_BRAND]?: DEVICE_BRAND_TYPE;
    [DEVICE_CHARGING]?: DEVICE_CHARGING_TYPE;
    [DEVICE_CHIPSET]?: DEVICE_CHIPSET_TYPE;
    [DEVICE_CLASS]?: DEVICE_CLASS_TYPE;
    [DEVICE_CONNECTION_TYPE]?: DEVICE_CONNECTION_TYPE_TYPE;
    [DEVICE_CPU_DESCRIPTION]?: DEVICE_CPU_DESCRIPTION_TYPE;
    [DEVICE_EXTERNAL_FREE_STORAGE]?: DEVICE_EXTERNAL_FREE_STORAGE_TYPE;
    [DEVICE_EXTERNAL_STORAGE_SIZE]?: DEVICE_EXTERNAL_STORAGE_SIZE_TYPE;
    [DEVICE_FAMILY]?: DEVICE_FAMILY_TYPE;
    [DEVICE_FREE_MEMORY]?: DEVICE_FREE_MEMORY_TYPE;
    [DEVICE_FREE_STORAGE]?: DEVICE_FREE_STORAGE_TYPE;
    [DEVICE_ID]?: DEVICE_ID_TYPE;
    [DEVICE_LOCALE]?: DEVICE_LOCALE_TYPE;
    [DEVICE_LOW_MEMORY]?: DEVICE_LOW_MEMORY_TYPE;
    [DEVICE_LOW_POWER_MODE]?: DEVICE_LOW_POWER_MODE_TYPE;
    [DEVICE_MANUFACTURER]?: DEVICE_MANUFACTURER_TYPE;
    [DEVICE_MEMORY_ESTIMATED_CAPACITY]?: DEVICE_MEMORY_ESTIMATED_CAPACITY_TYPE;
    [DEVICE_MEMORY_SIZE]?: DEVICE_MEMORY_SIZE_TYPE;
    [DEVICE_MODEL]?: DEVICE_MODEL_TYPE;
    [DEVICE_MODEL_ID]?: DEVICE_MODEL_ID_TYPE;
    [DEVICE_NAME]?: DEVICE_NAME_TYPE;
    [DEVICE_ONLINE]?: DEVICE_ONLINE_TYPE;
    [DEVICE_ORIENTATION]?: DEVICE_ORIENTATION_TYPE;
    [DEVICE_PROCESSOR_COUNT]?: DEVICE_PROCESSOR_COUNT_TYPE;
    [DEVICE_PROCESSOR_FREQUENCY]?: DEVICE_PROCESSOR_FREQUENCY_TYPE;
    [DEVICE_SCREEN_DENSITY]?: DEVICE_SCREEN_DENSITY_TYPE;
    [DEVICE_SCREEN_DPI]?: DEVICE_SCREEN_DPI_TYPE;
    [DEVICE_SCREEN_HEIGHT_PIXELS]?: DEVICE_SCREEN_HEIGHT_PIXELS_TYPE;
    [DEVICE_SCREEN_WIDTH_PIXELS]?: DEVICE_SCREEN_WIDTH_PIXELS_TYPE;
    [DEVICE_SIMULATOR]?: DEVICE_SIMULATOR_TYPE;
    [DEVICE_STORAGE_SIZE]?: DEVICE_STORAGE_SIZE_TYPE;
    [DEVICE_THERMAL_STATE]?: DEVICE_THERMAL_STATE_TYPE;
    [DEVICE_TIMEZONE]?: DEVICE_TIMEZONE_TYPE;
    [DEVICE_USABLE_MEMORY]?: DEVICE_USABLE_MEMORY_TYPE;
    [DIST]?: DIST_TYPE;
    [EFFECTIVECONNECTIONTYPE]?: EFFECTIVECONNECTIONTYPE_TYPE;
    [ENVIRONMENT]?: ENVIRONMENT_TYPE;
    [ERROR_TYPE]?: ERROR_TYPE_TYPE;
    [EVENT_ID]?: EVENT_ID_TYPE;
    [EVENT_NAME]?: EVENT_NAME_TYPE;
    [EXCEPTION_ESCAPED]?: EXCEPTION_ESCAPED_TYPE;
    [EXCEPTION_MESSAGE]?: EXCEPTION_MESSAGE_TYPE;
    [EXCEPTION_STACKTRACE]?: EXCEPTION_STACKTRACE_TYPE;
    [EXCEPTION_TYPE]?: EXCEPTION_TYPE_TYPE;
    [FAAS_COLDSTART]?: FAAS_COLDSTART_TYPE;
    [FAAS_CRON]?: FAAS_CRON_TYPE;
    [FAAS_DURATION_IN_MS]?: FAAS_DURATION_IN_MS_TYPE;
    [FAAS_ENTRY_POINT]?: FAAS_ENTRY_POINT_TYPE;
    [FAAS_EXECUTION]?: FAAS_EXECUTION_TYPE;
    [FAAS_ID]?: FAAS_ID_TYPE;
    [FAAS_IDENTITY]?: FAAS_IDENTITY_TYPE;
    [FAAS_INVOCATION_ID]?: FAAS_INVOCATION_ID_TYPE;
    [FAAS_INVOKED_NAME]?: FAAS_INVOKED_NAME_TYPE;
    [FAAS_INVOKED_PROVIDER]?: FAAS_INVOKED_PROVIDER_TYPE;
    [FAAS_INVOKED_REGION]?: FAAS_INVOKED_REGION_TYPE;
    [FAAS_NAME]?: FAAS_NAME_TYPE;
    [FAAS_TIME]?: FAAS_TIME_TYPE;
    [FAAS_TRIGGER]?: FAAS_TRIGGER_TYPE;
    [FAAS_VERSION]?: FAAS_VERSION_TYPE;
    [FCP]?: FCP_TYPE;
    [FLAG_EVALUATION_KEY]?: FLAG_EVALUATION_KEY_TYPE;
    [FP]?: FP_TYPE;
    [FRAMES_DELAY]?: FRAMES_DELAY_TYPE;
    [FRAMES_FROZEN]?: FRAMES_FROZEN_TYPE;
    [FRAMES_FROZEN_RATE]?: FRAMES_FROZEN_RATE_TYPE;
    [FRAMES_SLOW]?: FRAMES_SLOW_TYPE;
    [FRAMES_SLOW_RATE]?: FRAMES_SLOW_RATE_TYPE;
    [FRAMES_TOTAL]?: FRAMES_TOTAL_TYPE;
    [FS_ERROR]?: FS_ERROR_TYPE;
    [GCP_FUNCTION_CONTEXT_EVENT_ID]?: GCP_FUNCTION_CONTEXT_EVENT_ID_TYPE;
    [GCP_FUNCTION_CONTEXT_EVENT_TYPE]?: GCP_FUNCTION_CONTEXT_EVENT_TYPE_TYPE;
    [GCP_FUNCTION_CONTEXT_ID]?: GCP_FUNCTION_CONTEXT_ID_TYPE;
    [GCP_FUNCTION_CONTEXT_RESOURCE]?: GCP_FUNCTION_CONTEXT_RESOURCE_TYPE;
    [GCP_FUNCTION_CONTEXT_SOURCE]?: GCP_FUNCTION_CONTEXT_SOURCE_TYPE;
    [GCP_FUNCTION_CONTEXT_SPECVERSION]?: GCP_FUNCTION_CONTEXT_SPECVERSION_TYPE;
    [GCP_FUNCTION_CONTEXT_TIME]?: GCP_FUNCTION_CONTEXT_TIME_TYPE;
    [GCP_FUNCTION_CONTEXT_TIMESTAMP]?: GCP_FUNCTION_CONTEXT_TIMESTAMP_TYPE;
    [GCP_FUNCTION_CONTEXT_TYPE]?: GCP_FUNCTION_CONTEXT_TYPE_TYPE;
    [GCP_PROJECT_ID]?: GCP_PROJECT_ID_TYPE;
    [GEN_AI_AGENT_NAME]?: GEN_AI_AGENT_NAME_TYPE;
    [GEN_AI_CONTEXT_UTILIZATION]?: GEN_AI_CONTEXT_UTILIZATION_TYPE;
    [GEN_AI_CONTEXT_WINDOW_SIZE]?: GEN_AI_CONTEXT_WINDOW_SIZE_TYPE;
    [GEN_AI_CONVERSATION_ID]?: GEN_AI_CONVERSATION_ID_TYPE;
    [GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS]?: GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS_TYPE;
    [GEN_AI_COST_CACHE_READ_INPUT_TOKENS]?: GEN_AI_COST_CACHE_READ_INPUT_TOKENS_TYPE;
    [GEN_AI_COST_INPUT_TOKENS]?: GEN_AI_COST_INPUT_TOKENS_TYPE;
    [GEN_AI_COST_OUTPUT_TOKENS]?: GEN_AI_COST_OUTPUT_TOKENS_TYPE;
    [GEN_AI_COST_REASONING_OUTPUT_TOKENS]?: GEN_AI_COST_REASONING_OUTPUT_TOKENS_TYPE;
    [GEN_AI_COST_TOTAL_TOKENS]?: GEN_AI_COST_TOTAL_TOKENS_TYPE;
    [GEN_AI_EMBEDDINGS_INPUT]?: GEN_AI_EMBEDDINGS_INPUT_TYPE;
    [GEN_AI_FUNCTION_ID]?: GEN_AI_FUNCTION_ID_TYPE;
    [GEN_AI_INPUT_MESSAGES]?: GEN_AI_INPUT_MESSAGES_TYPE;
    [GEN_AI_OPERATION_NAME]?: GEN_AI_OPERATION_NAME_TYPE;
    [GEN_AI_OPERATION_TYPE]?: GEN_AI_OPERATION_TYPE_TYPE;
    [GEN_AI_OUTPUT_MESSAGES]?: GEN_AI_OUTPUT_MESSAGES_TYPE;
    [GEN_AI_PIPELINE_NAME]?: GEN_AI_PIPELINE_NAME_TYPE;
    [GEN_AI_PROMPT]?: GEN_AI_PROMPT_TYPE;
    [GEN_AI_PROMPT_NAME]?: GEN_AI_PROMPT_NAME_TYPE;
    [GEN_AI_PROVIDER_NAME]?: GEN_AI_PROVIDER_NAME_TYPE;
    [GEN_AI_REQUEST_AVAILABLE_TOOLS]?: GEN_AI_REQUEST_AVAILABLE_TOOLS_TYPE;
    [GEN_AI_REQUEST_FREQUENCY_PENALTY]?: GEN_AI_REQUEST_FREQUENCY_PENALTY_TYPE;
    [GEN_AI_REQUEST_MAX_TOKENS]?: GEN_AI_REQUEST_MAX_TOKENS_TYPE;
    [GEN_AI_REQUEST_MESSAGES]?: GEN_AI_REQUEST_MESSAGES_TYPE;
    [GEN_AI_REQUEST_MODEL]?: GEN_AI_REQUEST_MODEL_TYPE;
    [GEN_AI_REQUEST_PRESENCE_PENALTY]?: GEN_AI_REQUEST_PRESENCE_PENALTY_TYPE;
    [GEN_AI_REQUEST_REASONING_EFFORT]?: GEN_AI_REQUEST_REASONING_EFFORT_TYPE;
    [GEN_AI_REQUEST_SEED]?: GEN_AI_REQUEST_SEED_TYPE;
    [GEN_AI_REQUEST_STOP_SEQUENCES]?: GEN_AI_REQUEST_STOP_SEQUENCES_TYPE;
    [GEN_AI_REQUEST_TEMPERATURE]?: GEN_AI_REQUEST_TEMPERATURE_TYPE;
    [GEN_AI_REQUEST_TOP_K]?: GEN_AI_REQUEST_TOP_K_TYPE;
    [GEN_AI_REQUEST_TOP_P]?: GEN_AI_REQUEST_TOP_P_TYPE;
    [GEN_AI_RESPONSE_FINISH_REASONS]?: GEN_AI_RESPONSE_FINISH_REASONS_TYPE;
    [GEN_AI_RESPONSE_ID]?: GEN_AI_RESPONSE_ID_TYPE;
    [GEN_AI_RESPONSE_MODEL]?: GEN_AI_RESPONSE_MODEL_TYPE;
    [GEN_AI_RESPONSE_STREAMING]?: GEN_AI_RESPONSE_STREAMING_TYPE;
    [GEN_AI_RESPONSE_TEXT]?: GEN_AI_RESPONSE_TEXT_TYPE;
    [GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK]?: GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK_TYPE;
    [GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN]?: GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN_TYPE;
    [GEN_AI_RESPONSE_TOKENS_PER_SECOND]?: GEN_AI_RESPONSE_TOKENS_PER_SECOND_TYPE;
    [GEN_AI_RESPONSE_TOOL_CALLS]?: GEN_AI_RESPONSE_TOOL_CALLS_TYPE;
    [GEN_AI_SYSTEM]?: GEN_AI_SYSTEM_TYPE;
    [GEN_AI_SYSTEM_INSTRUCTIONS]?: GEN_AI_SYSTEM_INSTRUCTIONS_TYPE;
    [GEN_AI_SYSTEM_MESSAGE]?: GEN_AI_SYSTEM_MESSAGE_TYPE;
    [GEN_AI_TOOL_CALL_ARGUMENTS]?: GEN_AI_TOOL_CALL_ARGUMENTS_TYPE;
    [GEN_AI_TOOL_CALL_RESULT]?: GEN_AI_TOOL_CALL_RESULT_TYPE;
    [GEN_AI_TOOL_DEFINITIONS]?: GEN_AI_TOOL_DEFINITIONS_TYPE;
    [GEN_AI_TOOL_DESCRIPTION]?: GEN_AI_TOOL_DESCRIPTION_TYPE;
    [GEN_AI_TOOL_INPUT]?: GEN_AI_TOOL_INPUT_TYPE;
    [GEN_AI_TOOL_MESSAGE]?: GEN_AI_TOOL_MESSAGE_TYPE;
    [GEN_AI_TOOL_NAME]?: GEN_AI_TOOL_NAME_TYPE;
    [GEN_AI_TOOL_OUTPUT]?: GEN_AI_TOOL_OUTPUT_TYPE;
    [GEN_AI_TOOL_TYPE]?: GEN_AI_TOOL_TYPE_TYPE;
    [GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS]?: GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS_TYPE;
    [GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS]?: GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS_TYPE;
    [GEN_AI_USAGE_COMPLETION_TOKENS]?: GEN_AI_USAGE_COMPLETION_TOKENS_TYPE;
    [GEN_AI_USAGE_INPUT_TOKENS]?: GEN_AI_USAGE_INPUT_TOKENS_TYPE;
    [GEN_AI_USAGE_INPUT_TOKENS_CACHED]?: GEN_AI_USAGE_INPUT_TOKENS_CACHED_TYPE;
    [GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE]?: GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE_TYPE;
    [GEN_AI_USAGE_OUTPUT_TOKENS]?: GEN_AI_USAGE_OUTPUT_TOKENS_TYPE;
    [GEN_AI_USAGE_OUTPUT_TOKENS_REASONING]?: GEN_AI_USAGE_OUTPUT_TOKENS_REASONING_TYPE;
    [GEN_AI_USAGE_PROMPT_TOKENS]?: GEN_AI_USAGE_PROMPT_TOKENS_TYPE;
    [GEN_AI_USAGE_REASONING_OUTPUT_TOKENS]?: GEN_AI_USAGE_REASONING_OUTPUT_TOKENS_TYPE;
    [GEN_AI_USAGE_TOTAL_TOKENS]?: GEN_AI_USAGE_TOTAL_TOKENS_TYPE;
    [GRAPHQL_DOCUMENT]?: GRAPHQL_DOCUMENT_TYPE;
    [GRAPHQL_OPERATION_NAME]?: GRAPHQL_OPERATION_NAME_TYPE;
    [GRAPHQL_OPERATION_TYPE]?: GRAPHQL_OPERATION_TYPE_TYPE;
    [HARDWARECONCURRENCY]?: HARDWARECONCURRENCY_TYPE;
    [HTTP_CLIENT_IP]?: HTTP_CLIENT_IP_TYPE;
    [HTTP_DECODED_RESPONSE_CONTENT_LENGTH]?: HTTP_DECODED_RESPONSE_CONTENT_LENGTH_TYPE;
    [HTTP_FLAVOR]?: HTTP_FLAVOR_TYPE;
    [HTTP_FRAGMENT]?: HTTP_FRAGMENT_TYPE;
    [HTTP_HOST]?: HTTP_HOST_TYPE;
    [HTTP_METHOD]?: HTTP_METHOD_TYPE;
    [HTTP_QUERY]?: HTTP_QUERY_TYPE;
    [HTTP_REQUEST_BODY_DATA]?: HTTP_REQUEST_BODY_DATA_TYPE;
    [HTTP_REQUEST_CONNECTION_END]?: HTTP_REQUEST_CONNECTION_END_TYPE;
    [HTTP_REQUEST_CONNECT_START]?: HTTP_REQUEST_CONNECT_START_TYPE;
    [HTTP_REQUEST_DOMAIN_LOOKUP_END]?: HTTP_REQUEST_DOMAIN_LOOKUP_END_TYPE;
    [HTTP_REQUEST_DOMAIN_LOOKUP_START]?: HTTP_REQUEST_DOMAIN_LOOKUP_START_TYPE;
    [HTTP_REQUEST_FETCH_START]?: HTTP_REQUEST_FETCH_START_TYPE;
    [HTTP_REQUEST_HEADER_KEY]?: HTTP_REQUEST_HEADER_KEY_TYPE;
    [HTTP_REQUEST_METHOD]?: HTTP_REQUEST_METHOD_TYPE;
    [_HTTP_REQUEST_METHOD]?: _HTTP_REQUEST_METHOD_TYPE;
    [HTTP_REQUEST_REDIRECT_END]?: HTTP_REQUEST_REDIRECT_END_TYPE;
    [HTTP_REQUEST_REDIRECT_START]?: HTTP_REQUEST_REDIRECT_START_TYPE;
    [HTTP_REQUEST_REQUEST_START]?: HTTP_REQUEST_REQUEST_START_TYPE;
    [HTTP_REQUEST_RESEND_COUNT]?: HTTP_REQUEST_RESEND_COUNT_TYPE;
    [HTTP_REQUEST_RESPONSE_END]?: HTTP_REQUEST_RESPONSE_END_TYPE;
    [HTTP_REQUEST_RESPONSE_START]?: HTTP_REQUEST_RESPONSE_START_TYPE;
    [HTTP_REQUEST_SAME_ORIGIN]?: HTTP_REQUEST_SAME_ORIGIN_TYPE;
    [HTTP_REQUEST_SECURE_CONNECTION_START]?: HTTP_REQUEST_SECURE_CONNECTION_START_TYPE;
    [HTTP_REQUEST_TIME_TO_FIRST_BYTE]?: HTTP_REQUEST_TIME_TO_FIRST_BYTE_TYPE;
    [HTTP_REQUEST_WORKER_START]?: HTTP_REQUEST_WORKER_START_TYPE;
    [HTTP_RESPONSE_BODY_SIZE]?: HTTP_RESPONSE_BODY_SIZE_TYPE;
    [HTTP_RESPONSE_CONTENT_LENGTH]?: HTTP_RESPONSE_CONTENT_LENGTH_TYPE;
    [HTTP_RESPONSE_HEADER_CONTENT_LENGTH]?: HTTP_RESPONSE_HEADER_CONTENT_LENGTH_TYPE;
    [HTTP_RESPONSE_HEADER_KEY]?: HTTP_RESPONSE_HEADER_KEY_TYPE;
    [HTTP_RESPONSE_SIZE]?: HTTP_RESPONSE_SIZE_TYPE;
    [HTTP_RESPONSE_STATUS_CODE]?: HTTP_RESPONSE_STATUS_CODE_TYPE;
    [HTTP_RESPONSE_TRANSFER_SIZE]?: HTTP_RESPONSE_TRANSFER_SIZE_TYPE;
    [HTTP_ROUTE]?: HTTP_ROUTE_TYPE;
    [HTTP_SCHEME]?: HTTP_SCHEME_TYPE;
    [HTTP_SERVER_NAME]?: HTTP_SERVER_NAME_TYPE;
    [HTTP_SERVER_REQUEST_TIME_IN_QUEUE]?: HTTP_SERVER_REQUEST_TIME_IN_QUEUE_TYPE;
    [HTTP_STATUS_CODE]?: HTTP_STATUS_CODE_TYPE;
    [HTTP_TARGET]?: HTTP_TARGET_TYPE;
    [HTTP_URL]?: HTTP_URL_TYPE;
    [HTTP_USER_AGENT]?: HTTP_USER_AGENT_TYPE;
    [ID]?: ID_TYPE;
    [INP]?: INP_TYPE;
    [JSONRPC_PROTOCOL_VERSION]?: JSONRPC_PROTOCOL_VERSION_TYPE;
    [JSONRPC_REQUEST_ID]?: JSONRPC_REQUEST_ID_TYPE;
    [JVM_GC_ACTION]?: JVM_GC_ACTION_TYPE;
    [JVM_GC_NAME]?: JVM_GC_NAME_TYPE;
    [JVM_MEMORY_POOL_NAME]?: JVM_MEMORY_POOL_NAME_TYPE;
    [JVM_MEMORY_TYPE]?: JVM_MEMORY_TYPE_TYPE;
    [JVM_THREAD_DAEMON]?: JVM_THREAD_DAEMON_TYPE;
    [JVM_THREAD_STATE]?: JVM_THREAD_STATE_TYPE;
    [KOA_NAME]?: KOA_NAME_TYPE;
    [KOA_TYPE]?: KOA_TYPE_TYPE;
    [LCP]?: LCP_TYPE;
    [LCP_ELEMENT]?: LCP_ELEMENT_TYPE;
    [LCP_ID]?: LCP_ID_TYPE;
    [LCP_LOADTIME]?: LCP_LOADTIME_TYPE;
    [LCP_RENDERTIME]?: LCP_RENDERTIME_TYPE;
    [LCP_SIZE]?: LCP_SIZE_TYPE;
    [LCP_URL]?: LCP_URL_TYPE;
    [LOGGER_NAME]?: LOGGER_NAME_TYPE;
    [MCP_CANCELLED_REASON]?: MCP_CANCELLED_REASON_TYPE;
    [MCP_CANCELLED_REQUEST_ID]?: MCP_CANCELLED_REQUEST_ID_TYPE;
    [MCP_CLIENT_NAME]?: MCP_CLIENT_NAME_TYPE;
    [MCP_CLIENT_TITLE]?: MCP_CLIENT_TITLE_TYPE;
    [MCP_CLIENT_VERSION]?: MCP_CLIENT_VERSION_TYPE;
    [MCP_LIFECYCLE_PHASE]?: MCP_LIFECYCLE_PHASE_TYPE;
    [MCP_LOGGING_DATA_TYPE]?: MCP_LOGGING_DATA_TYPE_TYPE;
    [MCP_LOGGING_LEVEL]?: MCP_LOGGING_LEVEL_TYPE;
    [MCP_LOGGING_LOGGER]?: MCP_LOGGING_LOGGER_TYPE;
    [MCP_LOGGING_MESSAGE]?: MCP_LOGGING_MESSAGE_TYPE;
    [MCP_METHOD_NAME]?: MCP_METHOD_NAME_TYPE;
    [MCP_PROGRESS_CURRENT]?: MCP_PROGRESS_CURRENT_TYPE;
    [MCP_PROGRESS_MESSAGE]?: MCP_PROGRESS_MESSAGE_TYPE;
    [MCP_PROGRESS_PERCENTAGE]?: MCP_PROGRESS_PERCENTAGE_TYPE;
    [MCP_PROGRESS_TOKEN]?: MCP_PROGRESS_TOKEN_TYPE;
    [MCP_PROGRESS_TOTAL]?: MCP_PROGRESS_TOTAL_TYPE;
    [MCP_PROMPT_NAME]?: MCP_PROMPT_NAME_TYPE;
    [MCP_PROMPT_RESULT_DESCRIPTION]?: MCP_PROMPT_RESULT_DESCRIPTION_TYPE;
    [MCP_PROMPT_RESULT_MESSAGE_CONTENT]?: MCP_PROMPT_RESULT_MESSAGE_CONTENT_TYPE;
    [MCP_PROMPT_RESULT_MESSAGE_COUNT]?: MCP_PROMPT_RESULT_MESSAGE_COUNT_TYPE;
    [MCP_PROMPT_RESULT_MESSAGE_ROLE]?: MCP_PROMPT_RESULT_MESSAGE_ROLE_TYPE;
    [MCP_PROTOCOL_READY]?: MCP_PROTOCOL_READY_TYPE;
    [MCP_PROTOCOL_VERSION]?: MCP_PROTOCOL_VERSION_TYPE;
    [MCP_REQUEST_ARGUMENT_KEY]?: MCP_REQUEST_ARGUMENT_KEY_TYPE;
    [MCP_REQUEST_ARGUMENT_NAME]?: MCP_REQUEST_ARGUMENT_NAME_TYPE;
    [MCP_REQUEST_ARGUMENT_URI]?: MCP_REQUEST_ARGUMENT_URI_TYPE;
    [MCP_REQUEST_ID]?: MCP_REQUEST_ID_TYPE;
    [MCP_RESOURCE_PROTOCOL]?: MCP_RESOURCE_PROTOCOL_TYPE;
    [MCP_RESOURCE_URI]?: MCP_RESOURCE_URI_TYPE;
    [MCP_SERVER_NAME]?: MCP_SERVER_NAME_TYPE;
    [MCP_SERVER_TITLE]?: MCP_SERVER_TITLE_TYPE;
    [MCP_SERVER_VERSION]?: MCP_SERVER_VERSION_TYPE;
    [MCP_SESSION_ID]?: MCP_SESSION_ID_TYPE;
    [MCP_TOOL_NAME]?: MCP_TOOL_NAME_TYPE;
    [MCP_TOOL_RESULT_CONTENT]?: MCP_TOOL_RESULT_CONTENT_TYPE;
    [MCP_TOOL_RESULT_CONTENT_COUNT]?: MCP_TOOL_RESULT_CONTENT_COUNT_TYPE;
    [MCP_TOOL_RESULT_IS_ERROR]?: MCP_TOOL_RESULT_IS_ERROR_TYPE;
    [MCP_TRANSPORT]?: MCP_TRANSPORT_TYPE;
    [MDC_KEY]?: MDC_KEY_TYPE;
    [MESSAGING_BATCH_MESSAGE_COUNT]?: MESSAGING_BATCH_MESSAGE_COUNT_TYPE;
    [MESSAGING_DESTINATION]?: MESSAGING_DESTINATION_TYPE;
    [MESSAGING_DESTINATION_CONNECTION]?: MESSAGING_DESTINATION_CONNECTION_TYPE;
    [MESSAGING_DESTINATION_NAME]?: MESSAGING_DESTINATION_NAME_TYPE;
    [MESSAGING_MESSAGE_BODY_SIZE]?: MESSAGING_MESSAGE_BODY_SIZE_TYPE;
    [MESSAGING_MESSAGE_CONVERSATION_ID]?: MESSAGING_MESSAGE_CONVERSATION_ID_TYPE;
    [MESSAGING_MESSAGE_ENVELOPE_SIZE]?: MESSAGING_MESSAGE_ENVELOPE_SIZE_TYPE;
    [MESSAGING_MESSAGE_ID]?: MESSAGING_MESSAGE_ID_TYPE;
    [MESSAGING_MESSAGE_RECEIVE_LATENCY]?: MESSAGING_MESSAGE_RECEIVE_LATENCY_TYPE;
    [MESSAGING_MESSAGE_RETRY_COUNT]?: MESSAGING_MESSAGE_RETRY_COUNT_TYPE;
    [MESSAGING_OPERATION_NAME]?: MESSAGING_OPERATION_NAME_TYPE;
    [MESSAGING_OPERATION_TYPE]?: MESSAGING_OPERATION_TYPE_TYPE;
    [MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY]?: MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY_TYPE;
    [MESSAGING_SYSTEM]?: MESSAGING_SYSTEM_TYPE;
    [METHOD]?: METHOD_TYPE;
    [MIDDLEWARE_NAME]?: MIDDLEWARE_NAME_TYPE;
    [NAVIGATION_ORIGIN]?: NAVIGATION_ORIGIN_TYPE;
    [NAVIGATION_ROUTE_ID]?: NAVIGATION_ROUTE_ID_TYPE;
    [NAVIGATION_TYPE]?: NAVIGATION_TYPE_TYPE;
    [NEL_ELAPSED_TIME]?: NEL_ELAPSED_TIME_TYPE;
    [NEL_PHASE]?: NEL_PHASE_TYPE;
    [NEL_REFERRER]?: NEL_REFERRER_TYPE;
    [NEL_SAMPLING_FUNCTION]?: NEL_SAMPLING_FUNCTION_TYPE;
    [NEL_TYPE]?: NEL_TYPE_TYPE;
    [NETWORK_CONNECTION_EFFECTIVE_TYPE]?: NETWORK_CONNECTION_EFFECTIVE_TYPE_TYPE;
    [NETWORK_CONNECTION_RTT]?: NETWORK_CONNECTION_RTT_TYPE;
    [NETWORK_CONNECTION_TYPE]?: NETWORK_CONNECTION_TYPE_TYPE;
    [NETWORK_LOCAL_ADDRESS]?: NETWORK_LOCAL_ADDRESS_TYPE;
    [NETWORK_LOCAL_PORT]?: NETWORK_LOCAL_PORT_TYPE;
    [NETWORK_PEER_ADDRESS]?: NETWORK_PEER_ADDRESS_TYPE;
    [NETWORK_PEER_PORT]?: NETWORK_PEER_PORT_TYPE;
    [NETWORK_PROTOCOL_NAME]?: NETWORK_PROTOCOL_NAME_TYPE;
    [NETWORK_PROTOCOL_VERSION]?: NETWORK_PROTOCOL_VERSION_TYPE;
    [NETWORK_TRANSPORT]?: NETWORK_TRANSPORT_TYPE;
    [NETWORK_TYPE]?: NETWORK_TYPE_TYPE;
    [NET_HOST_IP]?: NET_HOST_IP_TYPE;
    [NET_HOST_NAME]?: NET_HOST_NAME_TYPE;
    [NET_HOST_PORT]?: NET_HOST_PORT_TYPE;
    [NET_PEER_IP]?: NET_PEER_IP_TYPE;
    [NET_PEER_NAME]?: NET_PEER_NAME_TYPE;
    [NET_PEER_PORT]?: NET_PEER_PORT_TYPE;
    [NET_PROTOCOL_NAME]?: NET_PROTOCOL_NAME_TYPE;
    [NET_PROTOCOL_VERSION]?: NET_PROTOCOL_VERSION_TYPE;
    [NET_SOCK_FAMILY]?: NET_SOCK_FAMILY_TYPE;
    [NET_SOCK_HOST_ADDR]?: NET_SOCK_HOST_ADDR_TYPE;
    [NET_SOCK_HOST_PORT]?: NET_SOCK_HOST_PORT_TYPE;
    [NET_SOCK_PEER_ADDR]?: NET_SOCK_PEER_ADDR_TYPE;
    [NET_SOCK_PEER_NAME]?: NET_SOCK_PEER_NAME_TYPE;
    [NET_SOCK_PEER_PORT]?: NET_SOCK_PEER_PORT_TYPE;
    [NET_TRANSPORT]?: NET_TRANSPORT_TYPE;
    [OS_BUILD]?: OS_BUILD_TYPE;
    [OS_BUILD_ID]?: OS_BUILD_ID_TYPE;
    [OS_DESCRIPTION]?: OS_DESCRIPTION_TYPE;
    [OS_KERNEL_VERSION]?: OS_KERNEL_VERSION_TYPE;
    [OS_NAME]?: OS_NAME_TYPE;
    [OS_RAW_DESCRIPTION]?: OS_RAW_DESCRIPTION_TYPE;
    [OS_ROOTED]?: OS_ROOTED_TYPE;
    [OS_THEME]?: OS_THEME_TYPE;
    [OS_TYPE]?: OS_TYPE_TYPE;
    [OS_VERSION]?: OS_VERSION_TYPE;
    [OTEL_KIND]?: OTEL_KIND_TYPE;
    [OTEL_SCOPE_NAME]?: OTEL_SCOPE_NAME_TYPE;
    [OTEL_SCOPE_VERSION]?: OTEL_SCOPE_VERSION_TYPE;
    [OTEL_STATUS_CODE]?: OTEL_STATUS_CODE_TYPE;
    [OTEL_STATUS_DESCRIPTION]?: OTEL_STATUS_DESCRIPTION_TYPE;
    [PARAMS_KEY]?: PARAMS_KEY_TYPE;
    [PERFORMANCE_ACTIVATIONSTART]?: PERFORMANCE_ACTIVATIONSTART_TYPE;
    [PERFORMANCE_TIMEORIGIN]?: PERFORMANCE_TIMEORIGIN_TYPE;
    [PREVIOUS_ROUTE]?: PREVIOUS_ROUTE_TYPE;
    [PROCESS_COMMAND_ARGS]?: PROCESS_COMMAND_ARGS_TYPE;
    [PROCESS_EXECUTABLE_NAME]?: PROCESS_EXECUTABLE_NAME_TYPE;
    [PROCESS_PID]?: PROCESS_PID_TYPE;
    [PROCESS_RUNTIME_DESCRIPTION]?: PROCESS_RUNTIME_DESCRIPTION_TYPE;
    [PROCESS_RUNTIME_ENGINE_NAME]?: PROCESS_RUNTIME_ENGINE_NAME_TYPE;
    [PROCESS_RUNTIME_ENGINE_VERSION]?: PROCESS_RUNTIME_ENGINE_VERSION_TYPE;
    [PROCESS_RUNTIME_NAME]?: PROCESS_RUNTIME_NAME_TYPE;
    [PROCESS_RUNTIME_VERSION]?: PROCESS_RUNTIME_VERSION_TYPE;
    [QUERY_KEY]?: QUERY_KEY_TYPE;
    [REACT_VERSION]?: REACT_VERSION_TYPE;
    [RELEASE]?: RELEASE_TYPE;
    [REMIX_ACTION_FORM_DATA_KEY]?: REMIX_ACTION_FORM_DATA_KEY_TYPE;
    [REPLAY_ID]?: REPLAY_ID_TYPE;
    [RESOURCE_DEPLOYMENT_ENVIRONMENT]?: RESOURCE_DEPLOYMENT_ENVIRONMENT_TYPE;
    [RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME]?: RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME_TYPE;
    [RESOURCE_RENDER_BLOCKING_STATUS]?: RESOURCE_RENDER_BLOCKING_STATUS_TYPE;
    [ROUTE]?: ROUTE_TYPE;
    [RPC_GRPC_STATUS_CODE]?: RPC_GRPC_STATUS_CODE_TYPE;
    [RPC_METHOD]?: RPC_METHOD_TYPE;
    [RPC_RESPONSE_STATUS_CODE]?: RPC_RESPONSE_STATUS_CODE_TYPE;
    [RPC_SERVICE]?: RPC_SERVICE_TYPE;
    [RPC_SYSTEM]?: RPC_SYSTEM_TYPE;
    [RPC_SYSTEM_NAME]?: RPC_SYSTEM_NAME_TYPE;
    [RUNTIME_BUILD]?: RUNTIME_BUILD_TYPE;
    [RUNTIME_NAME]?: RUNTIME_NAME_TYPE;
    [RUNTIME_RAW_DESCRIPTION]?: RUNTIME_RAW_DESCRIPTION_TYPE;
    [RUNTIME_VERSION]?: RUNTIME_VERSION_TYPE;
    [SCORE_KEY]?: SCORE_KEY_TYPE;
    [SCORE_RATIO_KEY]?: SCORE_RATIO_KEY_TYPE;
    [SCORE_TOTAL]?: SCORE_TOTAL_TYPE;
    [SCORE_WEIGHT_KEY]?: SCORE_WEIGHT_KEY_TYPE;
    [SENTRY_ACTION]?: SENTRY_ACTION_TYPE;
    [SENTRY_BROWSER_NAME]?: SENTRY_BROWSER_NAME_TYPE;
    [SENTRY_BROWSER_VERSION]?: SENTRY_BROWSER_VERSION_TYPE;
    [SENTRY_CANCELLATION_REASON]?: SENTRY_CANCELLATION_REASON_TYPE;
    [SENTRY_CATEGORY]?: SENTRY_CATEGORY_TYPE;
    [SENTRY_CLIENT_SAMPLE_RATE]?: SENTRY_CLIENT_SAMPLE_RATE_TYPE;
    [SENTRY_DESCRIPTION]?: SENTRY_DESCRIPTION_TYPE;
    [SENTRY_DIST]?: SENTRY_DIST_TYPE;
    [SENTRY_DOMAIN]?: SENTRY_DOMAIN_TYPE;
    [SENTRY_DSC_ENVIRONMENT]?: SENTRY_DSC_ENVIRONMENT_TYPE;
    [SENTRY_DSC_PROJECT_ID]?: SENTRY_DSC_PROJECT_ID_TYPE;
    [SENTRY_DSC_PUBLIC_KEY]?: SENTRY_DSC_PUBLIC_KEY_TYPE;
    [SENTRY_DSC_RELEASE]?: SENTRY_DSC_RELEASE_TYPE;
    [SENTRY_DSC_SAMPLED]?: SENTRY_DSC_SAMPLED_TYPE;
    [SENTRY_DSC_SAMPLE_RATE]?: SENTRY_DSC_SAMPLE_RATE_TYPE;
    [SENTRY_DSC_TRACE_ID]?: SENTRY_DSC_TRACE_ID_TYPE;
    [SENTRY_DSC_TRANSACTION]?: SENTRY_DSC_TRANSACTION_TYPE;
    [SENTRY_ENVIRONMENT]?: SENTRY_ENVIRONMENT_TYPE;
    [SENTRY_EXCLUSIVE_TIME]?: SENTRY_EXCLUSIVE_TIME_TYPE;
    [SENTRY_GRAPHQL_OPERATION]?: SENTRY_GRAPHQL_OPERATION_TYPE;
    [SENTRY_GROUP]?: SENTRY_GROUP_TYPE;
    [SENTRY_HTTP_PREFETCH]?: SENTRY_HTTP_PREFETCH_TYPE;
    [SENTRY_IDLE_SPAN_FINISH_REASON]?: SENTRY_IDLE_SPAN_FINISH_REASON_TYPE;
    [SENTRY_IS_REMOTE]?: SENTRY_IS_REMOTE_TYPE;
    [SENTRY_KIND]?: SENTRY_KIND_TYPE;
    [SENTRY_MAIN_THREAD]?: SENTRY_MAIN_THREAD_TYPE;
    [SENTRY_MESSAGE_PARAMETER_KEY]?: SENTRY_MESSAGE_PARAMETER_KEY_TYPE;
    [SENTRY_MESSAGE_TEMPLATE]?: SENTRY_MESSAGE_TEMPLATE_TYPE;
    [SENTRY_METRIC_SOURCE]?: SENTRY_METRIC_SOURCE_TYPE;
    [SENTRY_MOBILE]?: SENTRY_MOBILE_TYPE;
    [SENTRY_MODULE_KEY]?: SENTRY_MODULE_KEY_TYPE;
    [SENTRY_NEXTJS_SSR_FUNCTION_ROUTE]?: SENTRY_NEXTJS_SSR_FUNCTION_ROUTE_TYPE;
    [SENTRY_NEXTJS_SSR_FUNCTION_TYPE]?: SENTRY_NEXTJS_SSR_FUNCTION_TYPE_TYPE;
    [SENTRY_NORMALIZED_DB_QUERY]?: SENTRY_NORMALIZED_DB_QUERY_TYPE;
    [SENTRY_NORMALIZED_DB_QUERY_HASH]?: SENTRY_NORMALIZED_DB_QUERY_HASH_TYPE;
    [SENTRY_NORMALIZED_DESCRIPTION]?: SENTRY_NORMALIZED_DESCRIPTION_TYPE;
    [SENTRY_OBSERVED_TIMESTAMP_NANOS]?: SENTRY_OBSERVED_TIMESTAMP_NANOS_TYPE;
    [SENTRY_OP]?: SENTRY_OP_TYPE;
    [SENTRY_ORIGIN]?: SENTRY_ORIGIN_TYPE;
    [SENTRY_PLATFORM]?: SENTRY_PLATFORM_TYPE;
    [SENTRY_PROFILER_ID]?: SENTRY_PROFILER_ID_TYPE;
    [SENTRY_PROFILE_ID]?: SENTRY_PROFILE_ID_TYPE;
    [SENTRY_RELEASE]?: SENTRY_RELEASE_TYPE;
    [SENTRY_REPLAY_ID]?: SENTRY_REPLAY_ID_TYPE;
    [SENTRY_REPLAY_IS_BUFFERING]?: SENTRY_REPLAY_IS_BUFFERING_TYPE;
    [SENTRY_REPORT_EVENT]?: SENTRY_REPORT_EVENT_TYPE;
    [SENTRY_SDK_INTEGRATIONS]?: SENTRY_SDK_INTEGRATIONS_TYPE;
    [SENTRY_SDK_NAME]?: SENTRY_SDK_NAME_TYPE;
    [SENTRY_SDK_VERSION]?: SENTRY_SDK_VERSION_TYPE;
    [SENTRY_SEGMENT_ID]?: SENTRY_SEGMENT_ID_TYPE;
    [_SENTRY_SEGMENT_ID]?: _SENTRY_SEGMENT_ID_TYPE;
    [SENTRY_SEGMENT_NAME]?: SENTRY_SEGMENT_NAME_TYPE;
    [SENTRY_SERVER_SAMPLE_RATE]?: SENTRY_SERVER_SAMPLE_RATE_TYPE;
    [SENTRY_SOURCE]?: SENTRY_SOURCE_TYPE;
    [SENTRY_SPAN_SOURCE]?: SENTRY_SPAN_SOURCE_TYPE;
    [SENTRY_STATUS]?: SENTRY_STATUS_TYPE;
    [SENTRY_STATUS_CODE]?: SENTRY_STATUS_CODE_TYPE;
    [SENTRY_STATUS_MESSAGE]?: SENTRY_STATUS_MESSAGE_TYPE;
    [SENTRY_SVELTEKIT_NAVIGATION_FROM]?: SENTRY_SVELTEKIT_NAVIGATION_FROM_TYPE;
    [SENTRY_SVELTEKIT_NAVIGATION_TO]?: SENTRY_SVELTEKIT_NAVIGATION_TO_TYPE;
    [SENTRY_SVELTEKIT_NAVIGATION_TYPE]?: SENTRY_SVELTEKIT_NAVIGATION_TYPE_TYPE;
    [SENTRY_THREAD_ID]?: SENTRY_THREAD_ID_TYPE;
    [SENTRY_TIMESTAMP_SEQUENCE]?: SENTRY_TIMESTAMP_SEQUENCE_TYPE;
    [SENTRY_TRACE_LIFECYCLE]?: SENTRY_TRACE_LIFECYCLE_TYPE;
    [SENTRY_TRACE_PARENT_SPAN_ID]?: SENTRY_TRACE_PARENT_SPAN_ID_TYPE;
    [SENTRY_TRACE_STATUS]?: SENTRY_TRACE_STATUS_TYPE;
    [SENTRY_TRANSACTION]?: SENTRY_TRANSACTION_TYPE;
    [SENTRY_USER_EMAIL]?: SENTRY_USER_EMAIL_TYPE;
    [SENTRY_USER_GEO_CITY]?: SENTRY_USER_GEO_CITY_TYPE;
    [SENTRY_USER_GEO_COUNTRY_CODE]?: SENTRY_USER_GEO_COUNTRY_CODE_TYPE;
    [SENTRY_USER_GEO_REGION]?: SENTRY_USER_GEO_REGION_TYPE;
    [SENTRY_USER_GEO_SUBDIVISION]?: SENTRY_USER_GEO_SUBDIVISION_TYPE;
    [SENTRY_USER_ID]?: SENTRY_USER_ID_TYPE;
    [SENTRY_USER_IP]?: SENTRY_USER_IP_TYPE;
    [SENTRY_USER_USERNAME]?: SENTRY_USER_USERNAME_TYPE;
    [SERVER_ADDRESS]?: SERVER_ADDRESS_TYPE;
    [SERVER_NAME]?: SERVER_NAME_TYPE;
    [SERVER_PORT]?: SERVER_PORT_TYPE;
    [SERVICE_NAME]?: SERVICE_NAME_TYPE;
    [SERVICE_VERSION]?: SERVICE_VERSION_TYPE;
    [SESSION_ID]?: SESSION_ID_TYPE;
    [STALL_PERCENTAGE]?: STALL_PERCENTAGE_TYPE;
    [STALL_TOTAL_TIME]?: STALL_TOTAL_TIME_TYPE;
    [STATE_TYPE]?: STATE_TYPE_TYPE;
    [THREAD_ID]?: THREAD_ID_TYPE;
    [THREAD_NAME]?: THREAD_NAME_TYPE;
    [TIMBER_TAG]?: TIMBER_TAG_TYPE;
    [TIME_TO_FULL_DISPLAY]?: TIME_TO_FULL_DISPLAY_TYPE;
    [TIME_TO_INITIAL_DISPLAY]?: TIME_TO_INITIAL_DISPLAY_TYPE;
    [TRANSACTION]?: TRANSACTION_TYPE;
    [TRPC_PROCEDURE_PATH]?: TRPC_PROCEDURE_PATH_TYPE;
    [TRPC_PROCEDURE_TYPE]?: TRPC_PROCEDURE_TYPE_TYPE;
    [TTFB]?: TTFB_TYPE;
    [TTFB_REQUESTTIME]?: TTFB_REQUESTTIME_TYPE;
    [TYPE]?: TYPE_TYPE;
    [UI_COMPONENT_NAME]?: UI_COMPONENT_NAME_TYPE;
    [UI_CONTRIBUTES_TO_TTFD]?: UI_CONTRIBUTES_TO_TTFD_TYPE;
    [UI_CONTRIBUTES_TO_TTID]?: UI_CONTRIBUTES_TO_TTID_TYPE;
    [UI_ELEMENT_HEIGHT]?: UI_ELEMENT_HEIGHT_TYPE;
    [UI_ELEMENT_ID]?: UI_ELEMENT_ID_TYPE;
    [UI_ELEMENT_IDENTIFIER]?: UI_ELEMENT_IDENTIFIER_TYPE;
    [UI_ELEMENT_LOAD_TIME]?: UI_ELEMENT_LOAD_TIME_TYPE;
    [UI_ELEMENT_PAINT_TYPE]?: UI_ELEMENT_PAINT_TYPE_TYPE;
    [UI_ELEMENT_RENDER_TIME]?: UI_ELEMENT_RENDER_TIME_TYPE;
    [UI_ELEMENT_TYPE]?: UI_ELEMENT_TYPE_TYPE;
    [UI_ELEMENT_URL]?: UI_ELEMENT_URL_TYPE;
    [UI_ELEMENT_WIDTH]?: UI_ELEMENT_WIDTH_TYPE;
    [URL]?: URL_TYPE;
    [URL_DOMAIN]?: URL_DOMAIN_TYPE;
    [URL_FRAGMENT]?: URL_FRAGMENT_TYPE;
    [URL_FULL]?: URL_FULL_TYPE;
    [URL_PATH]?: URL_PATH_TYPE;
    [URL_PATH_PARAMETER_KEY]?: URL_PATH_PARAMETER_KEY_TYPE;
    [URL_PORT]?: URL_PORT_TYPE;
    [URL_QUERY]?: URL_QUERY_TYPE;
    [URL_SAME_ORIGIN]?: URL_SAME_ORIGIN_TYPE;
    [URL_SCHEME]?: URL_SCHEME_TYPE;
    [URL_TEMPLATE]?: URL_TEMPLATE_TYPE;
    [USER_AGENT_ORIGINAL]?: USER_AGENT_ORIGINAL_TYPE;
    [USER_EMAIL]?: USER_EMAIL_TYPE;
    [USER_FULL_NAME]?: USER_FULL_NAME_TYPE;
    [USER_GEO_CITY]?: USER_GEO_CITY_TYPE;
    [USER_GEO_COUNTRY_CODE]?: USER_GEO_COUNTRY_CODE_TYPE;
    [USER_GEO_REGION]?: USER_GEO_REGION_TYPE;
    [USER_GEO_SUBDIVISION]?: USER_GEO_SUBDIVISION_TYPE;
    [USER_HASH]?: USER_HASH_TYPE;
    [USER_ID]?: USER_ID_TYPE;
    [USER_IP_ADDRESS]?: USER_IP_ADDRESS_TYPE;
    [USER_NAME]?: USER_NAME_TYPE;
    [USER_ROLES]?: USER_ROLES_TYPE;
    [VERCEL_BRANCH]?: VERCEL_BRANCH_TYPE;
    [VERCEL_BUILD_ID]?: VERCEL_BUILD_ID_TYPE;
    [VERCEL_DEPLOYMENT_ID]?: VERCEL_DEPLOYMENT_ID_TYPE;
    [VERCEL_DESTINATION]?: VERCEL_DESTINATION_TYPE;
    [VERCEL_EDGE_TYPE]?: VERCEL_EDGE_TYPE_TYPE;
    [VERCEL_ENTRYPOINT]?: VERCEL_ENTRYPOINT_TYPE;
    [VERCEL_EXECUTION_REGION]?: VERCEL_EXECUTION_REGION_TYPE;
    [VERCEL_ID]?: VERCEL_ID_TYPE;
    [VERCEL_JA3_DIGEST]?: VERCEL_JA3_DIGEST_TYPE;
    [VERCEL_JA4_DIGEST]?: VERCEL_JA4_DIGEST_TYPE;
    [VERCEL_LOG_TYPE]?: VERCEL_LOG_TYPE_TYPE;
    [VERCEL_PATH]?: VERCEL_PATH_TYPE;
    [VERCEL_PROJECT_ID]?: VERCEL_PROJECT_ID_TYPE;
    [VERCEL_PROJECT_NAME]?: VERCEL_PROJECT_NAME_TYPE;
    [VERCEL_PROXY_CACHE_ID]?: VERCEL_PROXY_CACHE_ID_TYPE;
    [VERCEL_PROXY_CLIENT_IP]?: VERCEL_PROXY_CLIENT_IP_TYPE;
    [VERCEL_PROXY_HOST]?: VERCEL_PROXY_HOST_TYPE;
    [VERCEL_PROXY_LAMBDA_REGION]?: VERCEL_PROXY_LAMBDA_REGION_TYPE;
    [VERCEL_PROXY_METHOD]?: VERCEL_PROXY_METHOD_TYPE;
    [VERCEL_PROXY_PATH]?: VERCEL_PROXY_PATH_TYPE;
    [VERCEL_PROXY_PATH_TYPE]?: VERCEL_PROXY_PATH_TYPE_TYPE;
    [VERCEL_PROXY_PATH_TYPE_VARIANT]?: VERCEL_PROXY_PATH_TYPE_VARIANT_TYPE;
    [VERCEL_PROXY_REFERER]?: VERCEL_PROXY_REFERER_TYPE;
    [VERCEL_PROXY_REGION]?: VERCEL_PROXY_REGION_TYPE;
    [VERCEL_PROXY_RESPONSE_BYTE_SIZE]?: VERCEL_PROXY_RESPONSE_BYTE_SIZE_TYPE;
    [VERCEL_PROXY_SCHEME]?: VERCEL_PROXY_SCHEME_TYPE;
    [VERCEL_PROXY_STATUS_CODE]?: VERCEL_PROXY_STATUS_CODE_TYPE;
    [VERCEL_PROXY_TIMESTAMP]?: VERCEL_PROXY_TIMESTAMP_TYPE;
    [VERCEL_PROXY_USER_AGENT]?: VERCEL_PROXY_USER_AGENT_TYPE;
    [VERCEL_PROXY_VERCEL_CACHE]?: VERCEL_PROXY_VERCEL_CACHE_TYPE;
    [VERCEL_PROXY_VERCEL_ID]?: VERCEL_PROXY_VERCEL_ID_TYPE;
    [VERCEL_PROXY_WAF_ACTION]?: VERCEL_PROXY_WAF_ACTION_TYPE;
    [VERCEL_PROXY_WAF_RULE_ID]?: VERCEL_PROXY_WAF_RULE_ID_TYPE;
    [VERCEL_REQUEST_ID]?: VERCEL_REQUEST_ID_TYPE;
    [VERCEL_SOURCE]?: VERCEL_SOURCE_TYPE;
    [VERCEL_STATUS_CODE]?: VERCEL_STATUS_CODE_TYPE;
} & Record<string, AttributeValue | undefined>;

export { AI_CITATIONS, AI_COMPLETION_TOKENS_USED, AI_DOCUMENTS, AI_FINISH_REASON, AI_FREQUENCY_PENALTY, AI_FUNCTION_CALL, AI_GENERATION_ID, AI_INPUT_MESSAGES, AI_IS_SEARCH_REQUIRED, AI_METADATA, AI_MODEL_ID, AI_MODEL_PROVIDER, AI_PIPELINE_NAME, AI_PREAMBLE, AI_PRESENCE_PENALTY, AI_PROMPT_TOKENS_USED, AI_RAW_PROMPTING, AI_RESPONSES, AI_RESPONSE_FORMAT, AI_SEARCH_QUERIES, AI_SEARCH_RESULTS, AI_SEED, AI_STREAMING, AI_TAGS, AI_TEMPERATURE, AI_TEXTS, AI_TOOLS, AI_TOOL_CALLS, AI_TOP_K, AI_TOP_P, AI_TOTAL_COST, AI_TOTAL_TOKENS_USED, AI_WARNINGS, ANGULAR_VERSION, APP_APP_BUILD, APP_APP_IDENTIFIER, APP_APP_NAME, APP_APP_START_TIME, APP_APP_VERSION, APP_BUILD, APP_IDENTIFIER, APP_IN_FOREGROUND, APP_NAME, APP_START_COLD, APP_START_TIME, APP_START_TYPE, APP_START_WARM, APP_VERSION, APP_VITALS_FRAMES_DELAY_VALUE, APP_VITALS_FRAMES_FROZEN_COUNT, APP_VITALS_FRAMES_SLOW_COUNT, APP_VITALS_FRAMES_TOTAL_COUNT, APP_VITALS_START_COLD_VALUE, APP_VITALS_START_PREWARMED, APP_VITALS_START_REASON, APP_VITALS_START_SCREEN, APP_VITALS_START_TYPE, APP_VITALS_START_WARM_VALUE, APP_VITALS_TTFD_VALUE, APP_VITALS_TTID_VALUE, ART_GC_BLOCKING_COUNT, ART_GC_BLOCKING_TIME, ART_GC_PRE_OOME_COUNT, ART_GC_TOTAL_COUNT, ART_GC_TOTAL_TIME, ART_GC_WAITING_TIME, ART_MEMORY_FREE, ART_MEMORY_FREE_UNTIL_GC, ART_MEMORY_FREE_UNTIL_OOME, ART_MEMORY_MAX, ART_MEMORY_TOTAL, ATTRIBUTE_METADATA, ATTRIBUTE_TYPE, AWS_CLOUDWATCH_LOGS_LOG_GROUP, AWS_CLOUDWATCH_LOGS_LOG_STREAM, AWS_CLOUDWATCH_LOGS_URL, AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, AWS_DYNAMODB_CONSISTENT_READ, AWS_DYNAMODB_CONSUMED_CAPACITY, AWS_DYNAMODB_COUNT, AWS_DYNAMODB_EXCLUSIVE_START_TABLE, AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, AWS_DYNAMODB_INDEX_NAME, AWS_DYNAMODB_ITEM_COLLECTION_METRICS, AWS_DYNAMODB_LIMIT, AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, AWS_DYNAMODB_PROJECTION, AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, AWS_DYNAMODB_SCANNED_COUNT, AWS_DYNAMODB_SCAN_FORWARD, AWS_DYNAMODB_SEGMENT, AWS_DYNAMODB_SELECT, AWS_DYNAMODB_TABLE_COUNT, AWS_DYNAMODB_TABLE_NAMES, AWS_DYNAMODB_TOTAL_SEGMENTS, AWS_EXTENDED_REQUEST_ID, AWS_KINESIS_STREAM_NAME, AWS_LAMBDA_AWS_REQUEST_ID, AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS, AWS_LAMBDA_FUNCTION_NAME, AWS_LAMBDA_FUNCTION_VERSION, AWS_LAMBDA_INVOKED_ARN, AWS_LAMBDA_INVOKED_FUNCTION_ARN, AWS_LAMBDA_REMAINING_TIME_IN_MILLIS, AWS_LOG_GROUP_NAMES, AWS_LOG_STREAM_NAMES, AWS_REQUEST_EXTENDED_ID, AWS_REQUEST_ID, AWS_S3_BUCKET, AWS_SECRETSMANAGER_SECRET_ARN, AWS_SNS_TOPIC_ARN, AWS_STEP_FUNCTIONS_ACTIVITY_ARN, AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN, BLOCKED_MAIN_THREAD, BROWSER_NAME, BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START, BROWSER_PERFORMANCE_TIME_ORIGIN, BROWSER_REPORT_TYPE, BROWSER_SCRIPT_INVOKER, BROWSER_SCRIPT_INVOKER_TYPE, BROWSER_SCRIPT_SOURCE_CHAR_POSITION, BROWSER_VERSION, BROWSER_WEB_VITAL_CLS_REPORT_EVENT, BROWSER_WEB_VITAL_CLS_SOURCE_KEY, BROWSER_WEB_VITAL_CLS_SOURCE_KEY_BASE, BROWSER_WEB_VITAL_CLS_VALUE, BROWSER_WEB_VITAL_FCP_VALUE, BROWSER_WEB_VITAL_FP_VALUE, BROWSER_WEB_VITAL_INP_VALUE, BROWSER_WEB_VITAL_LCP_ELEMENT, BROWSER_WEB_VITAL_LCP_ID, BROWSER_WEB_VITAL_LCP_LOAD_TIME, BROWSER_WEB_VITAL_LCP_RENDER_TIME, BROWSER_WEB_VITAL_LCP_REPORT_EVENT, BROWSER_WEB_VITAL_LCP_SIZE, BROWSER_WEB_VITAL_LCP_URL, BROWSER_WEB_VITAL_LCP_VALUE, BROWSER_WEB_VITAL_TTFB_REQUEST_TIME, BROWSER_WEB_VITAL_TTFB_VALUE, CACHE_HIT, CACHE_ITEM_SIZE, CACHE_KEY, CACHE_OPERATION, CACHE_TTL, CACHE_WRITE, CHANNEL, CLIENT_ADDRESS, CLIENT_PORT, CLOUDFLARE_D1_DURATION, CLOUDFLARE_D1_QUERY_TYPE, CLOUDFLARE_D1_ROWS_READ, CLOUDFLARE_D1_ROWS_WRITTEN, CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS, CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ, CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN, CLOUDFLARE_R2_BUCKET, CLOUDFLARE_R2_OPERATION, CLOUDFLARE_R2_REQUEST_DELIMITER, CLOUDFLARE_R2_REQUEST_KEY, CLOUDFLARE_R2_REQUEST_PART_NUMBER, CLOUDFLARE_R2_REQUEST_PREFIX, CLOUDFLARE_WORKFLOW_ATTEMPT, CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF, CLOUDFLARE_WORKFLOW_RETRIES_DELAY, CLOUDFLARE_WORKFLOW_RETRIES_LIMIT, CLOUDFLARE_WORKFLOW_TIMEOUT, CLOUD_ACCOUNT_ID, CLOUD_AVAILABILITY_ZONE, CLOUD_PLATFORM, CLOUD_PROVIDER, CLOUD_REGION, CLOUD_RESOURCE_ID, CLS, CLS_SOURCE_KEY, CLS_SOURCE_KEY_BASE, CODE_FILEPATH, CODE_FILE_PATH, CODE_FUNCTION, CODE_FUNCTION_NAME, CODE_LINENO, CODE_LINE_NUMBER, CODE_NAMESPACE, CONNECTIONTYPE, CONNECTION_RTT, CULTURE_CALENDAR, CULTURE_DISPLAY_NAME, CULTURE_IS_24_HOUR_FORMAT, CULTURE_LOCALE, CULTURE_TIMEZONE, DB_COLLECTION_NAME, DB_DRIVER_NAME, DB_NAME, DB_NAMESPACE, DB_OPERATION, DB_OPERATION_BATCH_SIZE, DB_OPERATION_NAME, DB_QUERY_PARAMETER_KEY, DB_QUERY_PARAMETER_KEY_BASE, DB_QUERY_SUMMARY, DB_QUERY_TEXT, DB_REDIS_CONNECTION, DB_REDIS_KEY, DB_REDIS_PARAMETERS, DB_RESPONSE_STATUS_CODE, DB_SQL_BINDINGS, DB_STATEMENT, DB_STORED_PROCEDURE_NAME, DB_SYSTEM, DB_SYSTEM_NAME, DB_USER, DEVICEMEMORY, DEVICE_ARCHS, DEVICE_BATTERY_LEVEL, DEVICE_BATTERY_TEMPERATURE, DEVICE_BOOT_TIME, DEVICE_BRAND, DEVICE_CHARGING, DEVICE_CHIPSET, DEVICE_CLASS, DEVICE_CONNECTION_TYPE, DEVICE_CPU_DESCRIPTION, DEVICE_EXTERNAL_FREE_STORAGE, DEVICE_EXTERNAL_STORAGE_SIZE, DEVICE_FAMILY, DEVICE_FREE_MEMORY, DEVICE_FREE_STORAGE, DEVICE_ID, DEVICE_LOCALE, DEVICE_LOW_MEMORY, DEVICE_LOW_POWER_MODE, DEVICE_MANUFACTURER, DEVICE_MEMORY_ESTIMATED_CAPACITY, DEVICE_MEMORY_SIZE, DEVICE_MODEL, DEVICE_MODEL_ID, DEVICE_NAME, DEVICE_ONLINE, DEVICE_ORIENTATION, DEVICE_PROCESSOR_COUNT, DEVICE_PROCESSOR_FREQUENCY, DEVICE_SCREEN_DENSITY, DEVICE_SCREEN_DPI, DEVICE_SCREEN_HEIGHT_PIXELS, DEVICE_SCREEN_WIDTH_PIXELS, DEVICE_SIMULATOR, DEVICE_STORAGE_SIZE, DEVICE_THERMAL_STATE, DEVICE_TIMEZONE, DEVICE_USABLE_MEMORY, DIST, EFFECTIVECONNECTIONTYPE, ENVIRONMENT, ERROR_TYPE, EVENT_ID, EVENT_NAME, EXCEPTION_ESCAPED, EXCEPTION_MESSAGE, EXCEPTION_STACKTRACE, EXCEPTION_TYPE, FAAS_COLDSTART, FAAS_CRON, FAAS_DURATION_IN_MS, FAAS_ENTRY_POINT, FAAS_EXECUTION, FAAS_ID, FAAS_IDENTITY, FAAS_INVOCATION_ID, FAAS_INVOKED_NAME, FAAS_INVOKED_PROVIDER, FAAS_INVOKED_REGION, FAAS_NAME, FAAS_TIME, FAAS_TRIGGER, FAAS_VERSION, FCP, FLAG_EVALUATION_KEY, FLAG_EVALUATION_KEY_BASE, FP, FRAMES_DELAY, FRAMES_FROZEN, FRAMES_FROZEN_RATE, FRAMES_SLOW, FRAMES_SLOW_RATE, FRAMES_TOTAL, FS_ERROR, GCP_FUNCTION_CONTEXT_EVENT_ID, GCP_FUNCTION_CONTEXT_EVENT_TYPE, GCP_FUNCTION_CONTEXT_ID, GCP_FUNCTION_CONTEXT_RESOURCE, GCP_FUNCTION_CONTEXT_SOURCE, GCP_FUNCTION_CONTEXT_SPECVERSION, GCP_FUNCTION_CONTEXT_TIME, GCP_FUNCTION_CONTEXT_TIMESTAMP, GCP_FUNCTION_CONTEXT_TYPE, GCP_PROJECT_ID, GEN_AI_AGENT_NAME, GEN_AI_CONTEXT_UTILIZATION, GEN_AI_CONTEXT_WINDOW_SIZE, GEN_AI_CONVERSATION_ID, GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS, GEN_AI_COST_CACHE_READ_INPUT_TOKENS, GEN_AI_COST_INPUT_TOKENS, GEN_AI_COST_OUTPUT_TOKENS, GEN_AI_COST_REASONING_OUTPUT_TOKENS, GEN_AI_COST_TOTAL_TOKENS, GEN_AI_EMBEDDINGS_INPUT, GEN_AI_FUNCTION_ID, GEN_AI_INPUT_MESSAGES, GEN_AI_OPERATION_NAME, GEN_AI_OPERATION_TYPE, GEN_AI_OUTPUT_MESSAGES, GEN_AI_PIPELINE_NAME, GEN_AI_PROMPT, GEN_AI_PROMPT_NAME, GEN_AI_PROVIDER_NAME, GEN_AI_REQUEST_AVAILABLE_TOOLS, GEN_AI_REQUEST_FREQUENCY_PENALTY, GEN_AI_REQUEST_MAX_TOKENS, GEN_AI_REQUEST_MESSAGES, GEN_AI_REQUEST_MODEL, GEN_AI_REQUEST_PRESENCE_PENALTY, GEN_AI_REQUEST_REASONING_EFFORT, GEN_AI_REQUEST_SEED, GEN_AI_REQUEST_STOP_SEQUENCES, GEN_AI_REQUEST_TEMPERATURE, GEN_AI_REQUEST_TOP_K, GEN_AI_REQUEST_TOP_P, GEN_AI_RESPONSE_FINISH_REASONS, GEN_AI_RESPONSE_ID, GEN_AI_RESPONSE_MODEL, GEN_AI_RESPONSE_STREAMING, GEN_AI_RESPONSE_TEXT, GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK, GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN, GEN_AI_RESPONSE_TOKENS_PER_SECOND, GEN_AI_RESPONSE_TOOL_CALLS, GEN_AI_SYSTEM, GEN_AI_SYSTEM_INSTRUCTIONS, GEN_AI_SYSTEM_MESSAGE, GEN_AI_TOOL_CALL_ARGUMENTS, GEN_AI_TOOL_CALL_RESULT, GEN_AI_TOOL_DEFINITIONS, GEN_AI_TOOL_DESCRIPTION, GEN_AI_TOOL_INPUT, GEN_AI_TOOL_MESSAGE, GEN_AI_TOOL_NAME, GEN_AI_TOOL_OUTPUT, GEN_AI_TOOL_TYPE, GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS, GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS, GEN_AI_USAGE_COMPLETION_TOKENS, GEN_AI_USAGE_INPUT_TOKENS, GEN_AI_USAGE_INPUT_TOKENS_CACHED, GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE, GEN_AI_USAGE_OUTPUT_TOKENS, GEN_AI_USAGE_OUTPUT_TOKENS_REASONING, GEN_AI_USAGE_PROMPT_TOKENS, GEN_AI_USAGE_REASONING_OUTPUT_TOKENS, GEN_AI_USAGE_TOTAL_TOKENS, GRAPHQL_DOCUMENT, GRAPHQL_OPERATION_NAME, GRAPHQL_OPERATION_TYPE, HARDWARECONCURRENCY, HTTP_CLIENT_IP, HTTP_DECODED_RESPONSE_CONTENT_LENGTH, HTTP_FLAVOR, HTTP_FRAGMENT, HTTP_HOST, HTTP_METHOD, HTTP_QUERY, HTTP_REQUEST_BODY_DATA, HTTP_REQUEST_CONNECTION_END, HTTP_REQUEST_CONNECT_START, HTTP_REQUEST_DOMAIN_LOOKUP_END, HTTP_REQUEST_DOMAIN_LOOKUP_START, HTTP_REQUEST_FETCH_START, HTTP_REQUEST_HEADER_KEY, HTTP_REQUEST_HEADER_KEY_BASE, HTTP_REQUEST_METHOD, HTTP_REQUEST_REDIRECT_END, HTTP_REQUEST_REDIRECT_START, HTTP_REQUEST_REQUEST_START, HTTP_REQUEST_RESEND_COUNT, HTTP_REQUEST_RESPONSE_END, HTTP_REQUEST_RESPONSE_START, HTTP_REQUEST_SAME_ORIGIN, HTTP_REQUEST_SECURE_CONNECTION_START, HTTP_REQUEST_TIME_TO_FIRST_BYTE, HTTP_REQUEST_WORKER_START, HTTP_RESPONSE_BODY_SIZE, HTTP_RESPONSE_CONTENT_LENGTH, HTTP_RESPONSE_HEADER_CONTENT_LENGTH, HTTP_RESPONSE_HEADER_KEY, HTTP_RESPONSE_HEADER_KEY_BASE, HTTP_RESPONSE_SIZE, HTTP_RESPONSE_STATUS_CODE, HTTP_RESPONSE_TRANSFER_SIZE, HTTP_ROUTE, HTTP_SCHEME, HTTP_SERVER_NAME, HTTP_SERVER_REQUEST_TIME_IN_QUEUE, HTTP_STATUS_CODE, HTTP_TARGET, HTTP_URL, HTTP_USER_AGENT, ID, INP, JSONRPC_PROTOCOL_VERSION, JSONRPC_REQUEST_ID, JVM_GC_ACTION, JVM_GC_NAME, JVM_MEMORY_POOL_NAME, JVM_MEMORY_TYPE, JVM_THREAD_DAEMON, JVM_THREAD_STATE, KOA_NAME, KOA_TYPE, LCP, LCP_ELEMENT, LCP_ID, LCP_LOADTIME, LCP_RENDERTIME, LCP_SIZE, LCP_URL, LOGGER_NAME, MCP_CANCELLED_REASON, MCP_CANCELLED_REQUEST_ID, MCP_CLIENT_NAME, MCP_CLIENT_TITLE, MCP_CLIENT_VERSION, MCP_LIFECYCLE_PHASE, MCP_LOGGING_DATA_TYPE, MCP_LOGGING_LEVEL, MCP_LOGGING_LOGGER, MCP_LOGGING_MESSAGE, MCP_METHOD_NAME, MCP_PROGRESS_CURRENT, MCP_PROGRESS_MESSAGE, MCP_PROGRESS_PERCENTAGE, MCP_PROGRESS_TOKEN, MCP_PROGRESS_TOTAL, MCP_PROMPT_NAME, MCP_PROMPT_RESULT_DESCRIPTION, MCP_PROMPT_RESULT_MESSAGE_CONTENT, MCP_PROMPT_RESULT_MESSAGE_COUNT, MCP_PROMPT_RESULT_MESSAGE_ROLE, MCP_PROTOCOL_READY, MCP_PROTOCOL_VERSION, MCP_REQUEST_ARGUMENT_KEY, MCP_REQUEST_ARGUMENT_KEY_BASE, MCP_REQUEST_ARGUMENT_NAME, MCP_REQUEST_ARGUMENT_URI, MCP_REQUEST_ID, MCP_RESOURCE_PROTOCOL, MCP_RESOURCE_URI, MCP_SERVER_NAME, MCP_SERVER_TITLE, MCP_SERVER_VERSION, MCP_SESSION_ID, MCP_TOOL_NAME, MCP_TOOL_RESULT_CONTENT, MCP_TOOL_RESULT_CONTENT_COUNT, MCP_TOOL_RESULT_IS_ERROR, MCP_TRANSPORT, MDC_KEY, MDC_KEY_BASE, MESSAGING_BATCH_MESSAGE_COUNT, MESSAGING_DESTINATION, MESSAGING_DESTINATION_CONNECTION, MESSAGING_DESTINATION_NAME, MESSAGING_MESSAGE_BODY_SIZE, MESSAGING_MESSAGE_CONVERSATION_ID, MESSAGING_MESSAGE_ENVELOPE_SIZE, MESSAGING_MESSAGE_ID, MESSAGING_MESSAGE_RECEIVE_LATENCY, MESSAGING_MESSAGE_RETRY_COUNT, MESSAGING_OPERATION_NAME, MESSAGING_OPERATION_TYPE, MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY, MESSAGING_SYSTEM, METHOD, MIDDLEWARE_NAME, NAVIGATION_ORIGIN, NAVIGATION_ROUTE_ID, NAVIGATION_TYPE, NEL_ELAPSED_TIME, NEL_PHASE, NEL_REFERRER, NEL_SAMPLING_FUNCTION, NEL_TYPE, NETWORK_CONNECTION_EFFECTIVE_TYPE, NETWORK_CONNECTION_RTT, NETWORK_CONNECTION_TYPE, NETWORK_LOCAL_ADDRESS, NETWORK_LOCAL_PORT, NETWORK_PEER_ADDRESS, NETWORK_PEER_PORT, NETWORK_PROTOCOL_NAME, NETWORK_PROTOCOL_VERSION, NETWORK_TRANSPORT, NETWORK_TYPE, NET_HOST_IP, NET_HOST_NAME, NET_HOST_PORT, NET_PEER_IP, NET_PEER_NAME, NET_PEER_PORT, NET_PROTOCOL_NAME, NET_PROTOCOL_VERSION, NET_SOCK_FAMILY, NET_SOCK_HOST_ADDR, NET_SOCK_HOST_PORT, NET_SOCK_PEER_ADDR, NET_SOCK_PEER_NAME, NET_SOCK_PEER_PORT, NET_TRANSPORT, OS_BUILD, OS_BUILD_ID, OS_DESCRIPTION, OS_KERNEL_VERSION, OS_NAME, OS_RAW_DESCRIPTION, OS_ROOTED, OS_THEME, OS_TYPE, OS_VERSION, OTEL_KIND, OTEL_SCOPE_NAME, OTEL_SCOPE_VERSION, OTEL_STATUS_CODE, OTEL_STATUS_DESCRIPTION, PARAMS_KEY, PARAMS_KEY_BASE, PERFORMANCE_ACTIVATIONSTART, PERFORMANCE_TIMEORIGIN, PREVIOUS_ROUTE, PROCESS_COMMAND_ARGS, PROCESS_EXECUTABLE_NAME, PROCESS_PID, PROCESS_RUNTIME_DESCRIPTION, PROCESS_RUNTIME_ENGINE_NAME, PROCESS_RUNTIME_ENGINE_VERSION, PROCESS_RUNTIME_NAME, PROCESS_RUNTIME_VERSION, QUERY_KEY, QUERY_KEY_BASE, REACT_VERSION, RELEASE, REMIX_ACTION_FORM_DATA_KEY, REMIX_ACTION_FORM_DATA_KEY_BASE, REPLAY_ID, RESOURCE_DEPLOYMENT_ENVIRONMENT, RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME, RESOURCE_RENDER_BLOCKING_STATUS, ROUTE, RPC_GRPC_STATUS_CODE, RPC_METHOD, RPC_RESPONSE_STATUS_CODE, RPC_SERVICE, RPC_SYSTEM, RPC_SYSTEM_NAME, RUNTIME_BUILD, RUNTIME_NAME, RUNTIME_RAW_DESCRIPTION, RUNTIME_VERSION, SCORE_KEY, SCORE_KEY_BASE, SCORE_RATIO_KEY, SCORE_RATIO_KEY_BASE, SCORE_TOTAL, SCORE_WEIGHT_KEY, SCORE_WEIGHT_KEY_BASE, SENTRY_ACTION, SENTRY_BROWSER_NAME, SENTRY_BROWSER_VERSION, SENTRY_CANCELLATION_REASON, SENTRY_CATEGORY, SENTRY_CLIENT_SAMPLE_RATE, SENTRY_DESCRIPTION, SENTRY_DIST, SENTRY_DOMAIN, SENTRY_DSC_ENVIRONMENT, SENTRY_DSC_PROJECT_ID, SENTRY_DSC_PUBLIC_KEY, SENTRY_DSC_RELEASE, SENTRY_DSC_SAMPLED, SENTRY_DSC_SAMPLE_RATE, SENTRY_DSC_TRACE_ID, SENTRY_DSC_TRANSACTION, SENTRY_ENVIRONMENT, SENTRY_EXCLUSIVE_TIME, SENTRY_GRAPHQL_OPERATION, SENTRY_GROUP, SENTRY_HTTP_PREFETCH, SENTRY_IDLE_SPAN_FINISH_REASON, SENTRY_IS_REMOTE, SENTRY_KIND, SENTRY_MAIN_THREAD, SENTRY_MESSAGE_PARAMETER_KEY, SENTRY_MESSAGE_TEMPLATE, SENTRY_METRIC_SOURCE, SENTRY_MOBILE, SENTRY_MODULE_KEY, SENTRY_MODULE_KEY_BASE, SENTRY_NEXTJS_SSR_FUNCTION_ROUTE, SENTRY_NEXTJS_SSR_FUNCTION_TYPE, SENTRY_NORMALIZED_DB_QUERY, SENTRY_NORMALIZED_DB_QUERY_HASH, SENTRY_NORMALIZED_DESCRIPTION, SENTRY_OBSERVED_TIMESTAMP_NANOS, SENTRY_OP, SENTRY_ORIGIN, SENTRY_PLATFORM, SENTRY_PROFILER_ID, SENTRY_PROFILE_ID, SENTRY_RELEASE, SENTRY_REPLAY_ID, SENTRY_REPLAY_IS_BUFFERING, SENTRY_REPORT_EVENT, SENTRY_SDK_INTEGRATIONS, SENTRY_SDK_NAME, SENTRY_SDK_VERSION, SENTRY_SEGMENT_ID, SENTRY_SEGMENT_NAME, SENTRY_SERVER_SAMPLE_RATE, SENTRY_SOURCE, SENTRY_SPAN_SOURCE, SENTRY_STATUS, SENTRY_STATUS_CODE, SENTRY_STATUS_MESSAGE, SENTRY_SVELTEKIT_NAVIGATION_FROM, SENTRY_SVELTEKIT_NAVIGATION_TO, SENTRY_SVELTEKIT_NAVIGATION_TYPE, SENTRY_THREAD_ID, SENTRY_TIMESTAMP_SEQUENCE, SENTRY_TRACE_LIFECYCLE, SENTRY_TRACE_PARENT_SPAN_ID, SENTRY_TRACE_STATUS, SENTRY_TRANSACTION, SENTRY_USER_EMAIL, SENTRY_USER_GEO_CITY, SENTRY_USER_GEO_COUNTRY_CODE, SENTRY_USER_GEO_REGION, SENTRY_USER_GEO_SUBDIVISION, SENTRY_USER_ID, SENTRY_USER_IP, SENTRY_USER_USERNAME, SERVER_ADDRESS, SERVER_NAME, SERVER_PORT, SERVICE_NAME, SERVICE_VERSION, SESSION_ID, STALL_PERCENTAGE, STALL_TOTAL_TIME, STATE_TYPE, THREAD_ID, THREAD_NAME, TIMBER_TAG, TIME_TO_FULL_DISPLAY, TIME_TO_INITIAL_DISPLAY, TRANSACTION, TRPC_PROCEDURE_PATH, TRPC_PROCEDURE_TYPE, TTFB, TTFB_REQUESTTIME, TYPE, UI_COMPONENT_NAME, UI_CONTRIBUTES_TO_TTFD, UI_CONTRIBUTES_TO_TTID, UI_ELEMENT_HEIGHT, UI_ELEMENT_ID, UI_ELEMENT_IDENTIFIER, UI_ELEMENT_LOAD_TIME, UI_ELEMENT_PAINT_TYPE, UI_ELEMENT_RENDER_TIME, UI_ELEMENT_TYPE, UI_ELEMENT_URL, UI_ELEMENT_WIDTH, URL, URL_DOMAIN, URL_FRAGMENT, URL_FULL, URL_PATH, URL_PATH_PARAMETER_KEY, URL_PATH_PARAMETER_KEY_BASE, URL_PORT, URL_QUERY, URL_SAME_ORIGIN, URL_SCHEME, URL_TEMPLATE, USER_AGENT_ORIGINAL, USER_EMAIL, USER_FULL_NAME, USER_GEO_CITY, USER_GEO_COUNTRY_CODE, USER_GEO_REGION, USER_GEO_SUBDIVISION, USER_HASH, USER_ID, USER_IP_ADDRESS, USER_NAME, USER_ROLES, VERCEL_BRANCH, VERCEL_BUILD_ID, VERCEL_DEPLOYMENT_ID, VERCEL_DESTINATION, VERCEL_EDGE_TYPE, VERCEL_ENTRYPOINT, VERCEL_EXECUTION_REGION, VERCEL_ID, VERCEL_JA3_DIGEST, VERCEL_JA4_DIGEST, VERCEL_LOG_TYPE, VERCEL_PATH, VERCEL_PROJECT_ID, VERCEL_PROJECT_NAME, VERCEL_PROXY_CACHE_ID, VERCEL_PROXY_CLIENT_IP, VERCEL_PROXY_HOST, VERCEL_PROXY_LAMBDA_REGION, VERCEL_PROXY_METHOD, VERCEL_PROXY_PATH, VERCEL_PROXY_PATH_TYPE, VERCEL_PROXY_PATH_TYPE_VARIANT, VERCEL_PROXY_REFERER, VERCEL_PROXY_REGION, VERCEL_PROXY_RESPONSE_BYTE_SIZE, VERCEL_PROXY_SCHEME, VERCEL_PROXY_STATUS_CODE, VERCEL_PROXY_TIMESTAMP, VERCEL_PROXY_USER_AGENT, VERCEL_PROXY_VERCEL_CACHE, VERCEL_PROXY_VERCEL_ID, VERCEL_PROXY_WAF_ACTION, VERCEL_PROXY_WAF_RULE_ID, VERCEL_REQUEST_ID, VERCEL_SOURCE, VERCEL_STATUS_CODE, _AWS_KINESIS_STREAM_NAME, _AWS_REQUEST_ID, _HTTP_REQUEST_METHOD, _SENTRY_SEGMENT_ID };
export type { AI_CITATIONS_TYPE, AI_COMPLETION_TOKENS_USED_TYPE, AI_DOCUMENTS_TYPE, AI_FINISH_REASON_TYPE, AI_FREQUENCY_PENALTY_TYPE, AI_FUNCTION_CALL_TYPE, AI_GENERATION_ID_TYPE, AI_INPUT_MESSAGES_TYPE, AI_IS_SEARCH_REQUIRED_TYPE, AI_METADATA_TYPE, AI_MODEL_ID_TYPE, AI_MODEL_PROVIDER_TYPE, AI_PIPELINE_NAME_TYPE, AI_PREAMBLE_TYPE, AI_PRESENCE_PENALTY_TYPE, AI_PROMPT_TOKENS_USED_TYPE, AI_RAW_PROMPTING_TYPE, AI_RESPONSES_TYPE, AI_RESPONSE_FORMAT_TYPE, AI_SEARCH_QUERIES_TYPE, AI_SEARCH_RESULTS_TYPE, AI_SEED_TYPE, AI_STREAMING_TYPE, AI_TAGS_TYPE, AI_TEMPERATURE_TYPE, AI_TEXTS_TYPE, AI_TOOLS_TYPE, AI_TOOL_CALLS_TYPE, AI_TOP_K_TYPE, AI_TOP_P_TYPE, AI_TOTAL_COST_TYPE, AI_TOTAL_TOKENS_USED_TYPE, AI_WARNINGS_TYPE, ANGULAR_VERSION_TYPE, APP_APP_BUILD_TYPE, APP_APP_IDENTIFIER_TYPE, APP_APP_NAME_TYPE, APP_APP_START_TIME_TYPE, APP_APP_VERSION_TYPE, APP_BUILD_TYPE, APP_IDENTIFIER_TYPE, APP_IN_FOREGROUND_TYPE, APP_NAME_TYPE, APP_START_COLD_TYPE, APP_START_TIME_TYPE, APP_START_TYPE_TYPE, APP_START_WARM_TYPE, APP_VERSION_TYPE, APP_VITALS_FRAMES_DELAY_VALUE_TYPE, APP_VITALS_FRAMES_FROZEN_COUNT_TYPE, APP_VITALS_FRAMES_SLOW_COUNT_TYPE, APP_VITALS_FRAMES_TOTAL_COUNT_TYPE, APP_VITALS_START_COLD_VALUE_TYPE, APP_VITALS_START_PREWARMED_TYPE, APP_VITALS_START_REASON_TYPE, APP_VITALS_START_SCREEN_TYPE, APP_VITALS_START_TYPE_TYPE, APP_VITALS_START_WARM_VALUE_TYPE, APP_VITALS_TTFD_VALUE_TYPE, APP_VITALS_TTID_VALUE_TYPE, ART_GC_BLOCKING_COUNT_TYPE, ART_GC_BLOCKING_TIME_TYPE, ART_GC_PRE_OOME_COUNT_TYPE, ART_GC_TOTAL_COUNT_TYPE, ART_GC_TOTAL_TIME_TYPE, ART_GC_WAITING_TIME_TYPE, ART_MEMORY_FREE_TYPE, ART_MEMORY_FREE_UNTIL_GC_TYPE, ART_MEMORY_FREE_UNTIL_OOME_TYPE, ART_MEMORY_MAX_TYPE, ART_MEMORY_TOTAL_TYPE, AWS_CLOUDWATCH_LOGS_LOG_GROUP_TYPE, AWS_CLOUDWATCH_LOGS_LOG_STREAM_TYPE, AWS_CLOUDWATCH_LOGS_URL_TYPE, AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS_TYPE, AWS_DYNAMODB_CONSISTENT_READ_TYPE, AWS_DYNAMODB_CONSUMED_CAPACITY_TYPE, AWS_DYNAMODB_COUNT_TYPE, AWS_DYNAMODB_EXCLUSIVE_START_TABLE_TYPE, AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES_TYPE, AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES_TYPE, AWS_DYNAMODB_INDEX_NAME_TYPE, AWS_DYNAMODB_ITEM_COLLECTION_METRICS_TYPE, AWS_DYNAMODB_LIMIT_TYPE, AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES_TYPE, AWS_DYNAMODB_PROJECTION_TYPE, AWS_DYNAMODB_PROVISIONED_READ_CAPACITY_TYPE, AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY_TYPE, AWS_DYNAMODB_SCANNED_COUNT_TYPE, AWS_DYNAMODB_SCAN_FORWARD_TYPE, AWS_DYNAMODB_SEGMENT_TYPE, AWS_DYNAMODB_SELECT_TYPE, AWS_DYNAMODB_TABLE_COUNT_TYPE, AWS_DYNAMODB_TABLE_NAMES_TYPE, AWS_DYNAMODB_TOTAL_SEGMENTS_TYPE, AWS_EXTENDED_REQUEST_ID_TYPE, AWS_KINESIS_STREAM_NAME_TYPE, AWS_LAMBDA_AWS_REQUEST_ID_TYPE, AWS_LAMBDA_EXECUTION_DURATION_IN_MILLIS_TYPE, AWS_LAMBDA_FUNCTION_NAME_TYPE, AWS_LAMBDA_FUNCTION_VERSION_TYPE, AWS_LAMBDA_INVOKED_ARN_TYPE, AWS_LAMBDA_INVOKED_FUNCTION_ARN_TYPE, AWS_LAMBDA_REMAINING_TIME_IN_MILLIS_TYPE, AWS_LOG_GROUP_NAMES_TYPE, AWS_LOG_STREAM_NAMES_TYPE, AWS_REQUEST_EXTENDED_ID_TYPE, AWS_REQUEST_ID_TYPE, AWS_S3_BUCKET_TYPE, AWS_SECRETSMANAGER_SECRET_ARN_TYPE, AWS_SNS_TOPIC_ARN_TYPE, AWS_STEP_FUNCTIONS_ACTIVITY_ARN_TYPE, AWS_STEP_FUNCTIONS_STATE_MACHINE_ARN_TYPE, ApplyScrubbing, ApplyScrubbingInfo, AttributeMetadata, AttributeName, AttributeType, AttributeValue, AttributeVisibility, Attributes, BLOCKED_MAIN_THREAD_TYPE, BROWSER_NAME_TYPE, BROWSER_PERFORMANCE_NAVIGATION_ACTIVATION_START_TYPE, BROWSER_PERFORMANCE_TIME_ORIGIN_TYPE, BROWSER_REPORT_TYPE_TYPE, BROWSER_SCRIPT_INVOKER_TYPE_TYPE, BROWSER_SCRIPT_SOURCE_CHAR_POSITION_TYPE, BROWSER_VERSION_TYPE, BROWSER_WEB_VITAL_CLS_REPORT_EVENT_TYPE, BROWSER_WEB_VITAL_CLS_SOURCE_KEY_TYPE, BROWSER_WEB_VITAL_CLS_VALUE_TYPE, BROWSER_WEB_VITAL_FCP_VALUE_TYPE, BROWSER_WEB_VITAL_FP_VALUE_TYPE, BROWSER_WEB_VITAL_INP_VALUE_TYPE, BROWSER_WEB_VITAL_LCP_ELEMENT_TYPE, BROWSER_WEB_VITAL_LCP_ID_TYPE, BROWSER_WEB_VITAL_LCP_LOAD_TIME_TYPE, BROWSER_WEB_VITAL_LCP_RENDER_TIME_TYPE, BROWSER_WEB_VITAL_LCP_REPORT_EVENT_TYPE, BROWSER_WEB_VITAL_LCP_SIZE_TYPE, BROWSER_WEB_VITAL_LCP_URL_TYPE, BROWSER_WEB_VITAL_LCP_VALUE_TYPE, BROWSER_WEB_VITAL_TTFB_REQUEST_TIME_TYPE, BROWSER_WEB_VITAL_TTFB_VALUE_TYPE, CACHE_HIT_TYPE, CACHE_ITEM_SIZE_TYPE, CACHE_KEY_TYPE, CACHE_OPERATION_TYPE, CACHE_TTL_TYPE, CACHE_WRITE_TYPE, CHANNEL_TYPE, CLIENT_ADDRESS_TYPE, CLIENT_PORT_TYPE, CLOUDFLARE_D1_DURATION_TYPE, CLOUDFLARE_D1_QUERY_TYPE_TYPE, CLOUDFLARE_D1_ROWS_READ_TYPE, CLOUDFLARE_D1_ROWS_WRITTEN_TYPE, CLOUDFLARE_DURABLE_OBJECT_QUERY_BINDINGS_TYPE, CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_READ_TYPE, CLOUDFLARE_DURABLE_OBJECT_RESPONSE_ROWS_WRITTEN_TYPE, CLOUDFLARE_R2_BUCKET_TYPE, CLOUDFLARE_R2_OPERATION_TYPE, CLOUDFLARE_R2_REQUEST_DELIMITER_TYPE, CLOUDFLARE_R2_REQUEST_KEY_TYPE, CLOUDFLARE_R2_REQUEST_PART_NUMBER_TYPE, CLOUDFLARE_R2_REQUEST_PREFIX_TYPE, CLOUDFLARE_WORKFLOW_ATTEMPT_TYPE, CLOUDFLARE_WORKFLOW_RETRIES_BACKOFF_TYPE, CLOUDFLARE_WORKFLOW_RETRIES_DELAY_TYPE, CLOUDFLARE_WORKFLOW_RETRIES_LIMIT_TYPE, CLOUDFLARE_WORKFLOW_TIMEOUT_TYPE, CLOUD_ACCOUNT_ID_TYPE, CLOUD_AVAILABILITY_ZONE_TYPE, CLOUD_PLATFORM_TYPE, CLOUD_PROVIDER_TYPE, CLOUD_REGION_TYPE, CLOUD_RESOURCE_ID_TYPE, CLS_SOURCE_KEY_TYPE, CLS_TYPE, CODE_FILEPATH_TYPE, CODE_FILE_PATH_TYPE, CODE_FUNCTION_NAME_TYPE, CODE_FUNCTION_TYPE, CODE_LINENO_TYPE, CODE_LINE_NUMBER_TYPE, CODE_NAMESPACE_TYPE, CONNECTIONTYPE_TYPE, CONNECTION_RTT_TYPE, CULTURE_CALENDAR_TYPE, CULTURE_DISPLAY_NAME_TYPE, CULTURE_IS_24_HOUR_FORMAT_TYPE, CULTURE_LOCALE_TYPE, CULTURE_TIMEZONE_TYPE, ChangelogEntry, DB_COLLECTION_NAME_TYPE, DB_DRIVER_NAME_TYPE, DB_NAMESPACE_TYPE, DB_NAME_TYPE, DB_OPERATION_BATCH_SIZE_TYPE, DB_OPERATION_NAME_TYPE, DB_OPERATION_TYPE, DB_QUERY_PARAMETER_KEY_TYPE, DB_QUERY_SUMMARY_TYPE, DB_QUERY_TEXT_TYPE, DB_REDIS_CONNECTION_TYPE, DB_REDIS_KEY_TYPE, DB_REDIS_PARAMETERS_TYPE, DB_RESPONSE_STATUS_CODE_TYPE, DB_SQL_BINDINGS_TYPE, DB_STATEMENT_TYPE, DB_STORED_PROCEDURE_NAME_TYPE, DB_SYSTEM_NAME_TYPE, DB_SYSTEM_TYPE, DB_USER_TYPE, DEVICEMEMORY_TYPE, DEVICE_ARCHS_TYPE, DEVICE_BATTERY_LEVEL_TYPE, DEVICE_BATTERY_TEMPERATURE_TYPE, DEVICE_BOOT_TIME_TYPE, DEVICE_BRAND_TYPE, DEVICE_CHARGING_TYPE, DEVICE_CHIPSET_TYPE, DEVICE_CLASS_TYPE, DEVICE_CONNECTION_TYPE_TYPE, DEVICE_CPU_DESCRIPTION_TYPE, DEVICE_EXTERNAL_FREE_STORAGE_TYPE, DEVICE_EXTERNAL_STORAGE_SIZE_TYPE, DEVICE_FAMILY_TYPE, DEVICE_FREE_MEMORY_TYPE, DEVICE_FREE_STORAGE_TYPE, DEVICE_ID_TYPE, DEVICE_LOCALE_TYPE, DEVICE_LOW_MEMORY_TYPE, DEVICE_LOW_POWER_MODE_TYPE, DEVICE_MANUFACTURER_TYPE, DEVICE_MEMORY_ESTIMATED_CAPACITY_TYPE, DEVICE_MEMORY_SIZE_TYPE, DEVICE_MODEL_ID_TYPE, DEVICE_MODEL_TYPE, DEVICE_NAME_TYPE, DEVICE_ONLINE_TYPE, DEVICE_ORIENTATION_TYPE, DEVICE_PROCESSOR_COUNT_TYPE, DEVICE_PROCESSOR_FREQUENCY_TYPE, DEVICE_SCREEN_DENSITY_TYPE, DEVICE_SCREEN_DPI_TYPE, DEVICE_SCREEN_HEIGHT_PIXELS_TYPE, DEVICE_SCREEN_WIDTH_PIXELS_TYPE, DEVICE_SIMULATOR_TYPE, DEVICE_STORAGE_SIZE_TYPE, DEVICE_THERMAL_STATE_TYPE, DEVICE_TIMEZONE_TYPE, DEVICE_USABLE_MEMORY_TYPE, DIST_TYPE, DeprecationInfo, EFFECTIVECONNECTIONTYPE_TYPE, ENVIRONMENT_TYPE, ERROR_TYPE_TYPE, EVENT_ID_TYPE, EVENT_NAME_TYPE, EXCEPTION_ESCAPED_TYPE, EXCEPTION_MESSAGE_TYPE, EXCEPTION_STACKTRACE_TYPE, EXCEPTION_TYPE_TYPE, FAAS_COLDSTART_TYPE, FAAS_CRON_TYPE, FAAS_DURATION_IN_MS_TYPE, FAAS_ENTRY_POINT_TYPE, FAAS_EXECUTION_TYPE, FAAS_IDENTITY_TYPE, FAAS_ID_TYPE, FAAS_INVOCATION_ID_TYPE, FAAS_INVOKED_NAME_TYPE, FAAS_INVOKED_PROVIDER_TYPE, FAAS_INVOKED_REGION_TYPE, FAAS_NAME_TYPE, FAAS_TIME_TYPE, FAAS_TRIGGER_TYPE, FAAS_VERSION_TYPE, FCP_TYPE, FLAG_EVALUATION_KEY_TYPE, FP_TYPE, FRAMES_DELAY_TYPE, FRAMES_FROZEN_RATE_TYPE, FRAMES_FROZEN_TYPE, FRAMES_SLOW_RATE_TYPE, FRAMES_SLOW_TYPE, FRAMES_TOTAL_TYPE, FS_ERROR_TYPE, GCP_FUNCTION_CONTEXT_EVENT_ID_TYPE, GCP_FUNCTION_CONTEXT_EVENT_TYPE_TYPE, GCP_FUNCTION_CONTEXT_ID_TYPE, GCP_FUNCTION_CONTEXT_RESOURCE_TYPE, GCP_FUNCTION_CONTEXT_SOURCE_TYPE, GCP_FUNCTION_CONTEXT_SPECVERSION_TYPE, GCP_FUNCTION_CONTEXT_TIMESTAMP_TYPE, GCP_FUNCTION_CONTEXT_TIME_TYPE, GCP_FUNCTION_CONTEXT_TYPE_TYPE, GCP_PROJECT_ID_TYPE, GEN_AI_AGENT_NAME_TYPE, GEN_AI_CONTEXT_UTILIZATION_TYPE, GEN_AI_CONTEXT_WINDOW_SIZE_TYPE, GEN_AI_CONVERSATION_ID_TYPE, GEN_AI_COST_CACHE_CREATION_INPUT_TOKENS_TYPE, GEN_AI_COST_CACHE_READ_INPUT_TOKENS_TYPE, GEN_AI_COST_INPUT_TOKENS_TYPE, GEN_AI_COST_OUTPUT_TOKENS_TYPE, GEN_AI_COST_REASONING_OUTPUT_TOKENS_TYPE, GEN_AI_COST_TOTAL_TOKENS_TYPE, GEN_AI_EMBEDDINGS_INPUT_TYPE, GEN_AI_FUNCTION_ID_TYPE, GEN_AI_INPUT_MESSAGES_TYPE, GEN_AI_OPERATION_NAME_TYPE, GEN_AI_OPERATION_TYPE_TYPE, GEN_AI_OUTPUT_MESSAGES_TYPE, GEN_AI_PIPELINE_NAME_TYPE, GEN_AI_PROMPT_NAME_TYPE, GEN_AI_PROMPT_TYPE, GEN_AI_PROVIDER_NAME_TYPE, GEN_AI_REQUEST_AVAILABLE_TOOLS_TYPE, GEN_AI_REQUEST_FREQUENCY_PENALTY_TYPE, GEN_AI_REQUEST_MAX_TOKENS_TYPE, GEN_AI_REQUEST_MESSAGES_TYPE, GEN_AI_REQUEST_MODEL_TYPE, GEN_AI_REQUEST_PRESENCE_PENALTY_TYPE, GEN_AI_REQUEST_REASONING_EFFORT_TYPE, GEN_AI_REQUEST_SEED_TYPE, GEN_AI_REQUEST_STOP_SEQUENCES_TYPE, GEN_AI_REQUEST_TEMPERATURE_TYPE, GEN_AI_REQUEST_TOP_K_TYPE, GEN_AI_REQUEST_TOP_P_TYPE, GEN_AI_RESPONSE_FINISH_REASONS_TYPE, GEN_AI_RESPONSE_ID_TYPE, GEN_AI_RESPONSE_MODEL_TYPE, GEN_AI_RESPONSE_STREAMING_TYPE, GEN_AI_RESPONSE_TEXT_TYPE, GEN_AI_RESPONSE_TIME_TO_FIRST_CHUNK_TYPE, GEN_AI_RESPONSE_TIME_TO_FIRST_TOKEN_TYPE, GEN_AI_RESPONSE_TOKENS_PER_SECOND_TYPE, GEN_AI_RESPONSE_TOOL_CALLS_TYPE, GEN_AI_SYSTEM_INSTRUCTIONS_TYPE, GEN_AI_SYSTEM_MESSAGE_TYPE, GEN_AI_SYSTEM_TYPE, GEN_AI_TOOL_CALL_ARGUMENTS_TYPE, GEN_AI_TOOL_CALL_RESULT_TYPE, GEN_AI_TOOL_DEFINITIONS_TYPE, GEN_AI_TOOL_DESCRIPTION_TYPE, GEN_AI_TOOL_INPUT_TYPE, GEN_AI_TOOL_MESSAGE_TYPE, GEN_AI_TOOL_NAME_TYPE, GEN_AI_TOOL_OUTPUT_TYPE, GEN_AI_TOOL_TYPE_TYPE, GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS_TYPE, GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS_TYPE, GEN_AI_USAGE_COMPLETION_TOKENS_TYPE, GEN_AI_USAGE_INPUT_TOKENS_CACHED_TYPE, GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE_TYPE, GEN_AI_USAGE_INPUT_TOKENS_TYPE, GEN_AI_USAGE_OUTPUT_TOKENS_REASONING_TYPE, GEN_AI_USAGE_OUTPUT_TOKENS_TYPE, GEN_AI_USAGE_PROMPT_TOKENS_TYPE, GEN_AI_USAGE_REASONING_OUTPUT_TOKENS_TYPE, GEN_AI_USAGE_TOTAL_TOKENS_TYPE, GRAPHQL_DOCUMENT_TYPE, GRAPHQL_OPERATION_NAME_TYPE, GRAPHQL_OPERATION_TYPE_TYPE, HARDWARECONCURRENCY_TYPE, HTTP_CLIENT_IP_TYPE, HTTP_DECODED_RESPONSE_CONTENT_LENGTH_TYPE, HTTP_FLAVOR_TYPE, HTTP_FRAGMENT_TYPE, HTTP_HOST_TYPE, HTTP_METHOD_TYPE, HTTP_QUERY_TYPE, HTTP_REQUEST_BODY_DATA_TYPE, HTTP_REQUEST_CONNECTION_END_TYPE, HTTP_REQUEST_CONNECT_START_TYPE, HTTP_REQUEST_DOMAIN_LOOKUP_END_TYPE, HTTP_REQUEST_DOMAIN_LOOKUP_START_TYPE, HTTP_REQUEST_FETCH_START_TYPE, HTTP_REQUEST_HEADER_KEY_TYPE, HTTP_REQUEST_METHOD_TYPE, HTTP_REQUEST_REDIRECT_END_TYPE, HTTP_REQUEST_REDIRECT_START_TYPE, HTTP_REQUEST_REQUEST_START_TYPE, HTTP_REQUEST_RESEND_COUNT_TYPE, HTTP_REQUEST_RESPONSE_END_TYPE, HTTP_REQUEST_RESPONSE_START_TYPE, HTTP_REQUEST_SAME_ORIGIN_TYPE, HTTP_REQUEST_SECURE_CONNECTION_START_TYPE, HTTP_REQUEST_TIME_TO_FIRST_BYTE_TYPE, HTTP_REQUEST_WORKER_START_TYPE, HTTP_RESPONSE_BODY_SIZE_TYPE, HTTP_RESPONSE_CONTENT_LENGTH_TYPE, HTTP_RESPONSE_HEADER_CONTENT_LENGTH_TYPE, HTTP_RESPONSE_HEADER_KEY_TYPE, HTTP_RESPONSE_SIZE_TYPE, HTTP_RESPONSE_STATUS_CODE_TYPE, HTTP_RESPONSE_TRANSFER_SIZE_TYPE, HTTP_ROUTE_TYPE, HTTP_SCHEME_TYPE, HTTP_SERVER_NAME_TYPE, HTTP_SERVER_REQUEST_TIME_IN_QUEUE_TYPE, HTTP_STATUS_CODE_TYPE, HTTP_TARGET_TYPE, HTTP_URL_TYPE, HTTP_USER_AGENT_TYPE, ID_TYPE, INP_TYPE, JSONRPC_PROTOCOL_VERSION_TYPE, JSONRPC_REQUEST_ID_TYPE, JVM_GC_ACTION_TYPE, JVM_GC_NAME_TYPE, JVM_MEMORY_POOL_NAME_TYPE, JVM_MEMORY_TYPE_TYPE, JVM_THREAD_DAEMON_TYPE, JVM_THREAD_STATE_TYPE, KOA_NAME_TYPE, KOA_TYPE_TYPE, LCP_ELEMENT_TYPE, LCP_ID_TYPE, LCP_LOADTIME_TYPE, LCP_RENDERTIME_TYPE, LCP_SIZE_TYPE, LCP_TYPE, LCP_URL_TYPE, LOGGER_NAME_TYPE, MCP_CANCELLED_REASON_TYPE, MCP_CANCELLED_REQUEST_ID_TYPE, MCP_CLIENT_NAME_TYPE, MCP_CLIENT_TITLE_TYPE, MCP_CLIENT_VERSION_TYPE, MCP_LIFECYCLE_PHASE_TYPE, MCP_LOGGING_DATA_TYPE_TYPE, MCP_LOGGING_LEVEL_TYPE, MCP_LOGGING_LOGGER_TYPE, MCP_LOGGING_MESSAGE_TYPE, MCP_METHOD_NAME_TYPE, MCP_PROGRESS_CURRENT_TYPE, MCP_PROGRESS_MESSAGE_TYPE, MCP_PROGRESS_PERCENTAGE_TYPE, MCP_PROGRESS_TOKEN_TYPE, MCP_PROGRESS_TOTAL_TYPE, MCP_PROMPT_NAME_TYPE, MCP_PROMPT_RESULT_DESCRIPTION_TYPE, MCP_PROMPT_RESULT_MESSAGE_CONTENT_TYPE, MCP_PROMPT_RESULT_MESSAGE_COUNT_TYPE, MCP_PROMPT_RESULT_MESSAGE_ROLE_TYPE, MCP_PROTOCOL_READY_TYPE, MCP_PROTOCOL_VERSION_TYPE, MCP_REQUEST_ARGUMENT_KEY_TYPE, MCP_REQUEST_ARGUMENT_NAME_TYPE, MCP_REQUEST_ARGUMENT_URI_TYPE, MCP_REQUEST_ID_TYPE, MCP_RESOURCE_PROTOCOL_TYPE, MCP_RESOURCE_URI_TYPE, MCP_SERVER_NAME_TYPE, MCP_SERVER_TITLE_TYPE, MCP_SERVER_VERSION_TYPE, MCP_SESSION_ID_TYPE, MCP_TOOL_NAME_TYPE, MCP_TOOL_RESULT_CONTENT_COUNT_TYPE, MCP_TOOL_RESULT_CONTENT_TYPE, MCP_TOOL_RESULT_IS_ERROR_TYPE, MCP_TRANSPORT_TYPE, MDC_KEY_TYPE, MESSAGING_BATCH_MESSAGE_COUNT_TYPE, MESSAGING_DESTINATION_CONNECTION_TYPE, MESSAGING_DESTINATION_NAME_TYPE, MESSAGING_DESTINATION_TYPE, MESSAGING_MESSAGE_BODY_SIZE_TYPE, MESSAGING_MESSAGE_CONVERSATION_ID_TYPE, MESSAGING_MESSAGE_ENVELOPE_SIZE_TYPE, MESSAGING_MESSAGE_ID_TYPE, MESSAGING_MESSAGE_RECEIVE_LATENCY_TYPE, MESSAGING_MESSAGE_RETRY_COUNT_TYPE, MESSAGING_OPERATION_NAME_TYPE, MESSAGING_OPERATION_TYPE_TYPE, MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY_TYPE, MESSAGING_SYSTEM_TYPE, METHOD_TYPE, MIDDLEWARE_NAME_TYPE, NAVIGATION_ORIGIN_TYPE, NAVIGATION_ROUTE_ID_TYPE, NAVIGATION_TYPE_TYPE, NEL_ELAPSED_TIME_TYPE, NEL_PHASE_TYPE, NEL_REFERRER_TYPE, NEL_SAMPLING_FUNCTION_TYPE, NEL_TYPE_TYPE, NETWORK_CONNECTION_EFFECTIVE_TYPE_TYPE, NETWORK_CONNECTION_RTT_TYPE, NETWORK_CONNECTION_TYPE_TYPE, NETWORK_LOCAL_ADDRESS_TYPE, NETWORK_LOCAL_PORT_TYPE, NETWORK_PEER_ADDRESS_TYPE, NETWORK_PEER_PORT_TYPE, NETWORK_PROTOCOL_NAME_TYPE, NETWORK_PROTOCOL_VERSION_TYPE, NETWORK_TRANSPORT_TYPE, NETWORK_TYPE_TYPE, NET_HOST_IP_TYPE, NET_HOST_NAME_TYPE, NET_HOST_PORT_TYPE, NET_PEER_IP_TYPE, NET_PEER_NAME_TYPE, NET_PEER_PORT_TYPE, NET_PROTOCOL_NAME_TYPE, NET_PROTOCOL_VERSION_TYPE, NET_SOCK_FAMILY_TYPE, NET_SOCK_HOST_ADDR_TYPE, NET_SOCK_HOST_PORT_TYPE, NET_SOCK_PEER_ADDR_TYPE, NET_SOCK_PEER_NAME_TYPE, NET_SOCK_PEER_PORT_TYPE, NET_TRANSPORT_TYPE, OS_BUILD_ID_TYPE, OS_BUILD_TYPE, OS_DESCRIPTION_TYPE, OS_KERNEL_VERSION_TYPE, OS_NAME_TYPE, OS_RAW_DESCRIPTION_TYPE, OS_ROOTED_TYPE, OS_THEME_TYPE, OS_TYPE_TYPE, OS_VERSION_TYPE, OTEL_KIND_TYPE, OTEL_SCOPE_NAME_TYPE, OTEL_SCOPE_VERSION_TYPE, OTEL_STATUS_CODE_TYPE, OTEL_STATUS_DESCRIPTION_TYPE, PARAMS_KEY_TYPE, PERFORMANCE_ACTIVATIONSTART_TYPE, PERFORMANCE_TIMEORIGIN_TYPE, PREVIOUS_ROUTE_TYPE, PROCESS_COMMAND_ARGS_TYPE, PROCESS_EXECUTABLE_NAME_TYPE, PROCESS_PID_TYPE, PROCESS_RUNTIME_DESCRIPTION_TYPE, PROCESS_RUNTIME_ENGINE_NAME_TYPE, PROCESS_RUNTIME_ENGINE_VERSION_TYPE, PROCESS_RUNTIME_NAME_TYPE, PROCESS_RUNTIME_VERSION_TYPE, QUERY_KEY_TYPE, REACT_VERSION_TYPE, RELEASE_TYPE, REMIX_ACTION_FORM_DATA_KEY_TYPE, REPLAY_ID_TYPE, RESOURCE_DEPLOYMENT_ENVIRONMENT_NAME_TYPE, RESOURCE_DEPLOYMENT_ENVIRONMENT_TYPE, RESOURCE_RENDER_BLOCKING_STATUS_TYPE, ROUTE_TYPE, RPC_GRPC_STATUS_CODE_TYPE, RPC_METHOD_TYPE, RPC_RESPONSE_STATUS_CODE_TYPE, RPC_SERVICE_TYPE, RPC_SYSTEM_NAME_TYPE, RPC_SYSTEM_TYPE, RUNTIME_BUILD_TYPE, RUNTIME_NAME_TYPE, RUNTIME_RAW_DESCRIPTION_TYPE, RUNTIME_VERSION_TYPE, SCORE_KEY_TYPE, SCORE_RATIO_KEY_TYPE, SCORE_TOTAL_TYPE, SCORE_WEIGHT_KEY_TYPE, SENTRY_ACTION_TYPE, SENTRY_BROWSER_NAME_TYPE, SENTRY_BROWSER_VERSION_TYPE, SENTRY_CANCELLATION_REASON_TYPE, SENTRY_CATEGORY_TYPE, SENTRY_CLIENT_SAMPLE_RATE_TYPE, SENTRY_DESCRIPTION_TYPE, SENTRY_DIST_TYPE, SENTRY_DOMAIN_TYPE, SENTRY_DSC_ENVIRONMENT_TYPE, SENTRY_DSC_PROJECT_ID_TYPE, SENTRY_DSC_PUBLIC_KEY_TYPE, SENTRY_DSC_RELEASE_TYPE, SENTRY_DSC_SAMPLED_TYPE, SENTRY_DSC_SAMPLE_RATE_TYPE, SENTRY_DSC_TRACE_ID_TYPE, SENTRY_DSC_TRANSACTION_TYPE, SENTRY_ENVIRONMENT_TYPE, SENTRY_EXCLUSIVE_TIME_TYPE, SENTRY_GRAPHQL_OPERATION_TYPE, SENTRY_GROUP_TYPE, SENTRY_HTTP_PREFETCH_TYPE, SENTRY_IDLE_SPAN_FINISH_REASON_TYPE, SENTRY_IS_REMOTE_TYPE, SENTRY_KIND_TYPE, SENTRY_MAIN_THREAD_TYPE, SENTRY_MESSAGE_PARAMETER_KEY_TYPE, SENTRY_MESSAGE_TEMPLATE_TYPE, SENTRY_METRIC_SOURCE_TYPE, SENTRY_MOBILE_TYPE, SENTRY_MODULE_KEY_TYPE, SENTRY_NEXTJS_SSR_FUNCTION_ROUTE_TYPE, SENTRY_NEXTJS_SSR_FUNCTION_TYPE_TYPE, SENTRY_NORMALIZED_DB_QUERY_HASH_TYPE, SENTRY_NORMALIZED_DB_QUERY_TYPE, SENTRY_NORMALIZED_DESCRIPTION_TYPE, SENTRY_OBSERVED_TIMESTAMP_NANOS_TYPE, SENTRY_OP_TYPE, SENTRY_ORIGIN_TYPE, SENTRY_PLATFORM_TYPE, SENTRY_PROFILER_ID_TYPE, SENTRY_PROFILE_ID_TYPE, SENTRY_RELEASE_TYPE, SENTRY_REPLAY_ID_TYPE, SENTRY_REPLAY_IS_BUFFERING_TYPE, SENTRY_REPORT_EVENT_TYPE, SENTRY_SDK_INTEGRATIONS_TYPE, SENTRY_SDK_NAME_TYPE, SENTRY_SDK_VERSION_TYPE, SENTRY_SEGMENT_ID_TYPE, SENTRY_SEGMENT_NAME_TYPE, SENTRY_SERVER_SAMPLE_RATE_TYPE, SENTRY_SOURCE_TYPE, SENTRY_SPAN_SOURCE_TYPE, SENTRY_STATUS_CODE_TYPE, SENTRY_STATUS_MESSAGE_TYPE, SENTRY_STATUS_TYPE, SENTRY_SVELTEKIT_NAVIGATION_FROM_TYPE, SENTRY_SVELTEKIT_NAVIGATION_TO_TYPE, SENTRY_SVELTEKIT_NAVIGATION_TYPE_TYPE, SENTRY_THREAD_ID_TYPE, SENTRY_TIMESTAMP_SEQUENCE_TYPE, SENTRY_TRACE_LIFECYCLE_TYPE, SENTRY_TRACE_PARENT_SPAN_ID_TYPE, SENTRY_TRACE_STATUS_TYPE, SENTRY_TRANSACTION_TYPE, SENTRY_USER_EMAIL_TYPE, SENTRY_USER_GEO_CITY_TYPE, SENTRY_USER_GEO_COUNTRY_CODE_TYPE, SENTRY_USER_GEO_REGION_TYPE, SENTRY_USER_GEO_SUBDIVISION_TYPE, SENTRY_USER_ID_TYPE, SENTRY_USER_IP_TYPE, SENTRY_USER_USERNAME_TYPE, SERVER_ADDRESS_TYPE, SERVER_NAME_TYPE, SERVER_PORT_TYPE, SERVICE_NAME_TYPE, SERVICE_VERSION_TYPE, SESSION_ID_TYPE, STALL_PERCENTAGE_TYPE, STALL_TOTAL_TIME_TYPE, STATE_TYPE_TYPE, THREAD_ID_TYPE, THREAD_NAME_TYPE, TIMBER_TAG_TYPE, TIME_TO_FULL_DISPLAY_TYPE, TIME_TO_INITIAL_DISPLAY_TYPE, TRANSACTION_TYPE, TRPC_PROCEDURE_PATH_TYPE, TRPC_PROCEDURE_TYPE_TYPE, TTFB_REQUESTTIME_TYPE, TTFB_TYPE, TYPE_TYPE, UI_COMPONENT_NAME_TYPE, UI_CONTRIBUTES_TO_TTFD_TYPE, UI_CONTRIBUTES_TO_TTID_TYPE, UI_ELEMENT_HEIGHT_TYPE, UI_ELEMENT_IDENTIFIER_TYPE, UI_ELEMENT_ID_TYPE, UI_ELEMENT_LOAD_TIME_TYPE, UI_ELEMENT_PAINT_TYPE_TYPE, UI_ELEMENT_RENDER_TIME_TYPE, UI_ELEMENT_TYPE_TYPE, UI_ELEMENT_URL_TYPE, UI_ELEMENT_WIDTH_TYPE, URL_DOMAIN_TYPE, URL_FRAGMENT_TYPE, URL_FULL_TYPE, URL_PATH_PARAMETER_KEY_TYPE, URL_PATH_TYPE, URL_PORT_TYPE, URL_QUERY_TYPE, URL_SAME_ORIGIN_TYPE, URL_SCHEME_TYPE, URL_TEMPLATE_TYPE, URL_TYPE, USER_AGENT_ORIGINAL_TYPE, USER_EMAIL_TYPE, USER_FULL_NAME_TYPE, USER_GEO_CITY_TYPE, USER_GEO_COUNTRY_CODE_TYPE, USER_GEO_REGION_TYPE, USER_GEO_SUBDIVISION_TYPE, USER_HASH_TYPE, USER_ID_TYPE, USER_IP_ADDRESS_TYPE, USER_NAME_TYPE, USER_ROLES_TYPE, VERCEL_BRANCH_TYPE, VERCEL_BUILD_ID_TYPE, VERCEL_DEPLOYMENT_ID_TYPE, VERCEL_DESTINATION_TYPE, VERCEL_EDGE_TYPE_TYPE, VERCEL_ENTRYPOINT_TYPE, VERCEL_EXECUTION_REGION_TYPE, VERCEL_ID_TYPE, VERCEL_JA3_DIGEST_TYPE, VERCEL_JA4_DIGEST_TYPE, VERCEL_LOG_TYPE_TYPE, VERCEL_PATH_TYPE, VERCEL_PROJECT_ID_TYPE, VERCEL_PROJECT_NAME_TYPE, VERCEL_PROXY_CACHE_ID_TYPE, VERCEL_PROXY_CLIENT_IP_TYPE, VERCEL_PROXY_HOST_TYPE, VERCEL_PROXY_LAMBDA_REGION_TYPE, VERCEL_PROXY_METHOD_TYPE, VERCEL_PROXY_PATH_TYPE_TYPE, VERCEL_PROXY_PATH_TYPE_VARIANT_TYPE, VERCEL_PROXY_REFERER_TYPE, VERCEL_PROXY_REGION_TYPE, VERCEL_PROXY_RESPONSE_BYTE_SIZE_TYPE, VERCEL_PROXY_SCHEME_TYPE, VERCEL_PROXY_STATUS_CODE_TYPE, VERCEL_PROXY_TIMESTAMP_TYPE, VERCEL_PROXY_USER_AGENT_TYPE, VERCEL_PROXY_VERCEL_CACHE_TYPE, VERCEL_PROXY_VERCEL_ID_TYPE, VERCEL_PROXY_WAF_ACTION_TYPE, VERCEL_PROXY_WAF_RULE_ID_TYPE, VERCEL_REQUEST_ID_TYPE, VERCEL_SOURCE_TYPE, VERCEL_STATUS_CODE_TYPE, _AWS_KINESIS_STREAM_NAME_TYPE, _AWS_REQUEST_ID_TYPE, _HTTP_REQUEST_METHOD_TYPE, _SENTRY_SEGMENT_ID_TYPE };
