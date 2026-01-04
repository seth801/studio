module.exports = [
"[project]/src/ai/genkit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ai",
    ()=>ai
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__ = __turbopack_context__.i("[externals]/genkit [external] (genkit, esm_import, [project]/node_modules/genkit)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$genkit$2d$ai$2f$google$2d$genai__$5b$external$5d$__$2840$genkit$2d$ai$2f$google$2d$genai$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$genkit$2d$ai$2f$google$2d$genai$29$__ = __turbopack_context__.i("[externals]/@genkit-ai/google-genai [external] (@genkit-ai/google-genai, esm_import, [project]/node_modules/@genkit-ai/google-genai)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$genkit$2d$ai$2f$google$2d$genai__$5b$external$5d$__$2840$genkit$2d$ai$2f$google$2d$genai$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$genkit$2d$ai$2f$google$2d$genai$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$genkit$2d$ai$2f$google$2d$genai__$5b$external$5d$__$2840$genkit$2d$ai$2f$google$2d$genai$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$genkit$2d$ai$2f$google$2d$genai$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const ai = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["genkit"])({
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$genkit$2d$ai$2f$google$2d$genai__$5b$external$5d$__$2840$genkit$2d$ai$2f$google$2d$genai$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$genkit$2d$ai$2f$google$2d$genai$29$__["googleAI"])()
    ],
    model: 'googleai/gemini-2.0-flash'
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/ai/flows/extract-rate-con-flow.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"408ee1483bb0bd8321586cc6df5b2ef0fa484ac2ee":"extractRateCon"},"",""] */ __turbopack_context__.s([
    "extractRateCon",
    ()=>extractRateCon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * @fileOverview A flow to extract information from a rate confirmation document.
 *
 * - extractRateCon - A function that handles the rate confirmation extraction process.
 * - ExtractRateConInput - The input type for the extractRateCon function.
 * - ExtractRateConOutput - The return type for the extractRateCon function.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$genkit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ai/genkit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__ = __turbopack_context__.i("[externals]/genkit [external] (genkit, esm_import, [project]/node_modules/genkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$genkit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$genkit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const ExtractRateConInputSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].object({
    rateConDataUri: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe("A rate confirmation document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")
});
const StopSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].enum([
        'pickup',
        'delivery'
    ]).describe('The type of stop.'),
    location: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe('The location address for the stop.'),
    date: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe('The date for the stop.'),
    time: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe('The time or time window for the stop.')
});
const ExtractRateConOutputSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].object({
    broker: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe('The name of the broker or company.'),
    loadNumber: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe('The unique identifier for the load.'),
    stops: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].array(StopSchema).describe('An array of all pickup and delivery stops for the load.'),
    commodity: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].string().describe('The type of commodity being shipped.'),
    weight: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].number().describe('The weight of the load in pounds (lbs).'),
    rate: __TURBOPACK__imported__module__$5b$externals$5d2f$genkit__$5b$external$5d$__$28$genkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$genkit$29$__["z"].number().describe('The flat rate for the load in dollars.')
});
async function extractRateCon(input) {
    return extractRateConFlow(input);
}
const extractRateConFlow = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$genkit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ai"].defineFlow({
    name: 'extractRateConFlow',
    inputSchema: ExtractRateConInputSchema,
    outputSchema: ExtractRateConOutputSchema
}, async (input)=>{
    const { output } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$genkit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ai"].generate({
        prompt: [
            {
                media: {
                    url: input.rateConDataUri
                }
            },
            {
                text: `You are an expert logistics coordinator. Your task is to extract key information from the provided Rate Confirmation document, including all stops.

Please extract the following information:
- Broker Name
- Load Number
- All Stops (pickups and deliveries), in chronological order.
- Commodity
- Weight (in lbs)
- Rate (in dollars)

Provide the extracted information in the specified JSON format.`
            }
        ],
        output: {
            schema: ExtractRateConOutputSchema
        }
    });
    if (!output) {
        throw new Error('Failed to extract information from rate confirmation.');
    }
    return output;
});
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    extractRateCon
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(extractRateCon, "408ee1483bb0bd8321586cc6df5b2ef0fa484ac2ee", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/(admin)/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/ai/flows/extract-rate-con-flow.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ai/flows/extract-rate-con-flow.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/(admin)/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/ai/flows/extract-rate-con-flow.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "408ee1483bb0bd8321586cc6df5b2ef0fa484ac2ee",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractRateCon"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(admin)/admin/page/actions.js { ACTIONS_MODULE0 => "[project]/src/ai/flows/extract-rate-con-flow.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ai/flows/extract-rate-con-flow.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$extract$2d$rate$2d$con$2d$flow$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)"); //# sourceMappingURL=server-reference.js.map
}),
"[externals]/genkit [external] (genkit, esm_import, [project]/node_modules/genkit)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("genkit-8a29976f7302c1b6");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@genkit-ai/google-genai [external] (@genkit-ai/google-genai, esm_import, [project]/node_modules/@genkit-ai/google-genai)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@genkit-ai/google-genai-e9f2d7a5de33d2b4");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
} //# sourceMappingURL=action-validate.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a5a559e5._.js.map