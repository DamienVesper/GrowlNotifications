/* eslint-disable @typescript-eslint/no-explicit-any */

class DOM {
    nodes: unknown[] = []; // Collection array for nodes.
    pseudoSelector = ``; // Psuedo selector for current node.
    callbacks: Record<string, () => void>;

    constructor (selector: string | any, context?: HTMLElement | Document) {
        context = context ?? document;

        if (typeof selector === `string`) {
            if (selector[0] === `<` && selector[selector.length - 1] === `>`) this.nodes = [this.createNode(selector)];
            else {
                if (selector.search(/(:before|:after)$/gi) !== -1) {
                    const found = selector.match(/(:before|:after)$/gi);
                    if (found === null) return;

                    selector = selector.split(found[0])[0];
                    this.pseudoSelector = found[0];
                }

                // Query the DOM.
                this.nodes = [...context.querySelectorAll(selector)];
            }
        } else if (selector instanceof NodeList) {
            this.nodes = selector.length > 1
                ? [...selector]
                : [selector];
        } else if (
            selector instanceof Document ||
            selector instanceof Window ||
            selector instanceof HTMLElement
        ) this.nodes = [selector];
    }
}

export default DOM;
