export default {
    core: {
        allowPlugins: true,
        pluginsFolder: "plugins",

        // Whether or not to use a polling event system for config changes, or use a static config system.
        useEventSystem: true,

        // Whether or not to allow for the system to print debug information
        debug: true,

        port: 8081,
        hostname: "localhost",

        // If you would like to enable an orchestrator.
        orchestrator: false,

        // Defaults to 'main'
        appSlug: "main",

        // Whether or not to build an API based on folder structure. Uses `app/api` as the base directory.
        builtInAPI: false,

        // Whether or not to use the `src` folder instead.
        useSrc: true,
    },

    orchestrator: {
        automaticMaster: true,
        isMaster: undefined,
        // Whether or not to support island architecture.
        islandArchitecture: false,
        // Location of the island architecture config file.
        islandConfigFile: "island.config.js",
    },

    cli: {
        // Used to have different entry files for `prod` and `dev` (AKA Shells)
        environmentEntry: false,
        // Whether or not to control dependencies with the CLI.
        controlDeps: true,
    },

    metro: {
        babelRC: undefined,
        metroRC: undefined,
        // Used to set if we want to allow sucrase to be involved
        onlyBabel: undefined,
    },

    interface: {
        logo: undefined,
        customLogo: false,
        showLogo: true,
        showPort: true,
        showCommands: true,
        interactive: true,
        clearConsole: true,
        showMacCommands: true,
        allowWebsite: false,
    }
}