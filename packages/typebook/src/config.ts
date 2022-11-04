export interface Config {

    core: {
        allowPlugins?: boolean;
        pluginsFolder?: string;

        // Whether or not to use a polling event system for config changes, or use a static config system.
        useEventSystem?: boolean;

        // Whether or not to allow for the system to print debug information
        debug?: boolean;

        port?: number | string;
        hostname?: string;

        // If you would like to enable an orchestrator.
        orchestrator?: boolean;

        // Defaults to 'main'
        appSlug?: string;

        // Whether or not to build an API based on folder structure. Uses `app/api` as the base directory.
        builtInAPI?: boolean;

        // Whether or not to use the `src` folder instead.
        useSrc?: boolean;
    }

    orchestrator: {
        automaticMaster?: boolean;
        isMaster?: boolean;
        // Whether or not to support island architecture.
        islandArchitecture?: boolean;
        // Location of the island architecture config file.
        islandConfigFile?: string;
    }

    cli: {
        // Used to have different entry files for `prod` and `dev` (AKA Shells)
        environmentEntry?: boolean;
        // Whether or not to control dependencies with the CLI.
        controlDeps?: boolean;
    };

    metro: {
        babelRC?: string;
        metroRC?: string;
        // Used to set if we want to allow sucrase to be involved
        onlyBabel?: string;
    };

    interface: {
        logo?: string;
        customLogo?: boolean;
        showLogo?: boolean;
        showPort?: boolean;
        showCommands?: boolean;
        interactive?: boolean;
        clearConsole?: boolean;
        showMacCommands?: boolean;
        allowWebsite?: boolean;
    }
}