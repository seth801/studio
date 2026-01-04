module.exports = [
"[project]/src/lib/firebase.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/94568_@firebase_auth_dist_node-esm_39d07344._.js",
  "server/chunks/ssr/2a4f4_@grpc_grpc-js_e65e1e96._.js",
  "server/chunks/ssr/node_modules_protobufjs_5977de25._.js",
  "server/chunks/ssr/node_modules_@firebase_firestore_dist_index_node_mjs_8bec9454._.js",
  "server/chunks/ssr/node_modules_@firebase_storage_dist_node-esm_index_node_esm_7eeaaba0.js",
  "server/chunks/ssr/node_modules_576bd560._.js",
  "server/chunks/ssr/[root-of-the-server]__4d16797d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/firebase.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/2a4f4_@grpc_grpc-js_e65e1e96._.js",
  "server/chunks/ssr/node_modules_protobufjs_5977de25._.js",
  "server/chunks/ssr/node_modules_@firebase_firestore_dist_index_node_mjs_8bec9454._.js",
  "server/chunks/ssr/node_modules_5d9ff14f._.js",
  "server/chunks/ssr/[externals]__44cdd76e._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript)");
    });
});
}),
];