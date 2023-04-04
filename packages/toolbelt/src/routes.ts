import type { LeafNode, BranchNode, RouteNode, RequireContext } from 'typebook'
import { getNameFromFilePath, checkValidFileName, matchFragmentName } from './routeMatchers';

/**
 * Converts the metro-requireContext to LeafNodes
 */
const createLeafNodes = (context: RequireContext): LeafNode[] => {
    const leaves = context.keys().filter(checkValidFileName).map((key: string) => {
        try {
            if (!context(key)?.default) {
                // there is no default export... this is not a true file.
                return null;
            }
        } catch (e) {
            return null;
        }

        return {
            loadRoute: () => context(key),
            normalizedName: getNameFromFilePath(key),
            contextKey: key
        } as LeafNode
    })

    return leaves.filter(Boolean) as LeafNode[]
}

const getRecursiveBranches = (leaves: LeafNode[]): BranchNode => {
    const branch: BranchNode = {
        name: "",
        children: [],
        parents: [],
        node: null
    }

    // We are going to loop through all the leaves.
    for (const leaf of leaves) {
        // We will split the file path, so we can use it to create the branches
        const parts = leaf.normalizedName.split("/");
        let currentNode: BranchNode = branch;

        // We are going to loop through all the parts.
        for (const part of parts) {

            // We are going to check to see if there is a branch
            // with the same name as this `part`.
            const existingBranch = currentNode.children.find((item) => item.name === part);
            if (existingBranch) {
                // There is a branch with this name... we will replace the `currentNode`
                // with that of the found node.
                currentNode = existingBranch;
            } else {
                // There was no branch with this name.
                // We will make one
                const newNode: BranchNode = {
                    name: part,
                    children: [],
                    parents: [...currentNode.parents, currentNode.name],
                    node: null
                };
                currentNode.children.push(newNode);
                currentNode = newNode;
            }
        }
        currentNode.node = leaf
    }

    return branch;
}

const branchToRouteNode = ({ name, node, children }: BranchNode): RouteNode => {
    // generate dynamic -- Expo line 180
    if (node) {
        const fragmentName = matchFragmentName(name);
        const multiFragment = fragmentName?.includes(",");

        const clones = multiFragment ? fragmentName!.split(",").map((v) => ({ name: v.trim() })) : null;

        const output = {
            loadRoute: node.loadRoute,
            route: name,
            contextKey: node.contextKey,
            children: branchesAsRoutes(children),
            // put dynamic here
        }

        if (Array.isArray(clones)) {

        }
    }

    // Empty folder, skip it
    if (!children.length) {
        return null;
    }
}

// const branchesToRoute = (branchNode: BranchNode): RouteNode | null => {
//     const routes = tr
// }

const branchesAsRoutes = (nodes: BranchNode[]): RouteNode[] => {
    return nodes.map(branchToRouteNode).flat().filter(Boolean) as RouteNode[]
}

export const getRoutes = (context: RequireContext) => {
    const leaves = createLeafNodes(context);
    // console.log({ leaves })
    const branches = getRecursiveBranches(leaves);
    console.log(JSON.stringify({ leaves, branches }, null, 4));
}