interface Dictionary<T> {
    [key: string]: T;
}

interface Command {
    name: string;
    description: string;
    options?: string[][];
    arguments?: string[][];
    action: (str: any, options: Dictionary<any>) => void;
}

interface Config {
    core: {
        allowPlugins?: boolean;
        pluginsFolder?: string;
        useEventSystem?: boolean;
        debug?: boolean;
        port?: number | string;
        hostname?: string;
        orchestrator?: boolean;
        appSlug?: string;
        builtInAPI?: boolean;
        useSrc?: boolean;
    };
    orchestrator: {
        automaticMaster?: boolean;
        isMaster?: boolean;
        islandArchitecture?: boolean;
        islandConfigFile?: string;
    };
    cli: {
        environmentEntry?: boolean;
        controlDeps?: boolean;
    };
    metro: {
        babelRC?: string;
        metroRC?: string;
        onlyBabel?: string;
    };
    interface: {
        customLogo?: boolean;
        showLogo?: boolean;
        showPort?: boolean;
        showCommands?: boolean;
        interactive?: boolean;
        clearConsole?: boolean;
        showMacCommands?: boolean;
        allowWebsite?: boolean;
    };
}

export { Command, Config, Dictionary };
