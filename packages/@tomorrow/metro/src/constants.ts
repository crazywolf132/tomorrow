/**
 * THIS IS A DIRECT COPY FROM EXPO. DO NOT EDIT.
 */

export const INTERNAL_CALLSITES_REGEX = new RegExp(
    [
        '/Libraries/Renderer/implementations/.+\\.js$',
        '/Libraries/BatchedBridge/MessageQueue\\.js$',
        '/Libraries/YellowBox/.+\\.js$',
        '/Libraries/LogBox/.+\\.js$',
        '/Libraries/Core/Timers/.+\\.js$',
        'node_modules/react-devtools-core/.+\\.js$',
        'node_modules/react-refresh/.+\\.js$',
        'node_modules/scheduler/.+\\.js$',
        // Metro replaces `require()` with a different method,
        // we want to omit this method from the stack trace.
        // This is akin to most React tooling.
        '/metro/.*/polyfills/require.js$',
        // Hide frames related to a fast refresh.
        '/metro/.*/lib/bundle-modules/.+\\.js$',
        '/metro/.*/lib/bundle-modules/.+\\.js$',
        'node_modules/react-native/Libraries/Utilities/HMRClient.js$',
        'node_modules/eventemitter3/index.js',
        'node_modules/event-target-shim/dist/.+\\.js$',
        // Ignore the log forwarder used in the expo package.
        '/expo/build/logs/RemoteConsole.js$',
        // Improve errors thrown by invariant (ex: `Invariant Violation: "main" has not been registered`).
        'node_modules/invariant/.+\\.js$',
        // Remove babel runtime additions
        'node_modules/regenerator-runtime/.+\\.js$',
        // Remove react native setImmediate ponyfill
        'node_modules/promise/setimmediate/.+\\.js$',
        // Babel helpers that implement language features
        'node_modules/@babel/runtime/.+\\.js$',
        // Hide Hermes internal bytecode
        '/InternalBytecode/InternalBytecode\\.js$',
        // Block native code invocations
        `\\[native code\\]`,
        // Hide react-dom (web)
        'node_modules/react-dom/.+\\.js$',
    ].join('|')
);
