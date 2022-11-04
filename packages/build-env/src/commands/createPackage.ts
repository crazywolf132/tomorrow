import fs from 'fs-extra';
import { join } from 'path';
import type { Command } from '../types';
import inq from 'inquirer';

import template from '../../template.package.json';

export default {
    name: "new",
    description: "creates a new package",
    action: async () => {
        const prompt = inq.createPromptModule();

        prompt([
            {
                type: "input",
                name: "name",
                message: "Package name"
            },
            {
                type: "confirm",
                name: "tomorrow",
                message: "@Tomorrow package?"
            },
            {
                type: "confirm",
                name: "native",
                message: "react-native package?"
            }
        ]).then((answers) => {
            const modifiedTemplate = {
                ...template,
                name: answers.tomorrow ? `@tomorrow/${answers.name}` : answers.name,
                peerDependencies: {
                    ...template.peerDependencies,
                    ...(answers.native ? { "react-native": "*" } : {})
                },
                devDependencies: {
                    ...template.devDependencies,
                    ...(answers.native ? { "react-native": "latest", "@types/react-native": "latest", "react": "latest", "@types/react": "latest" } : { "@types/node": "latest" })
                }
            };

            const location = join(process.cwd(), 'packages', answers.tomorrow ? `@tomorrow/${answers.name}` : answers.name)

            fs.ensureFileSync(join(location, "package.json"));
            fs.ensureFileSync(join(location, 'src', 'index.ts'));
            fs.ensureFileSync(join(location, 'tsup.config.ts'));

            fs.writeFileSync(join(location, "package.json"), JSON.stringify(modifiedTemplate, null, 4));
            fs.writeFileSync(join(location, 'tsup.config.ts'), tsupTemplate.replace('{{native}}', answers.native ? "true" : "false"))

            if (!answers.native) {
                fs.writeFileSync(join(location, 'tsconfig.json'), JSON.stringify(nodeTsConfig, null, 4));
            }
        })
    }
} as Command;

const tsupTemplate = `
import { defineConfig } from 'tsup';
import { tsupBuilder } from 'build-env';

export default defineConfig([tsupBuilder({
    entry: ['src/index.ts'],
    reactNative: {{native}},
    cloneFile: false
})])
`

const nodeTsConfig = {
    "include": ["./src"],
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "resolveJsonModule": true,
        "moduleResolution": "Node"
    }
}