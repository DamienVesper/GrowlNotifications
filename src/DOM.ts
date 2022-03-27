/* eslint-disable @typescript-eslint/no-explicit-any */

class DOM {
    nodes: unknown[] = []; // Collection array for nodes.
    pseudoSelector = ``; // Psuedo selector for current node.
    callbacks: Record<string, (e: any) => void>;

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

    select = (selector: any, context?: HTMLElement | Document): DOM => new DOM(selector, context);

    create = (nodeName: string): DOM => new DOM(this.createNode(nodeName));

    attr = (name: string, value?: any): string | DOM => {
        if (value === undefined) return this.getLastNode().getAttribute(name);

        this.nodes.forEach((node: HTMLElement) => node.setAttribute(name, value));
        return this;
    };

    append = (content: HTMLElement | DOM): DOM => {
        let element: HTMLElement;

        if (content instanceof DOM) element = (content as any).get();
        else element = content;

        this.nodes.forEach((node: HTMLElement) => node.appendChild(element));

        return this;
    };

    parent = (): DOM => new DOM(this.getLastNode().parentNode);

    hasClass = (name: string): boolean => this.getLastNode().classList.contains(name);

    addClass = (name: string): DOM => {
        const cssClasses = name.split(` `);

        this.nodes.forEach((node: HTMLElement) => {
            for (const cssClass of cssClasses) node.classList.add(cssClass);
        });

        return this;
    };

    find = (selector: any): DOM => new DOM(selector, this.getLastNode());

    trigger = (eventName: string, detail?: Record<string, unknown>): DOM => {
        const event = new CustomEvent(eventName, detail);
        this.nodes.forEach((node: HTMLElement) => node.dispatchEvent(event));

        return this;
    };

    text = (text: string): DOM => {
        this.nodes.forEach((node: HTMLElement) => {
            node.innerText = text;
        });

        return this;
    };

    css = (name: string, value?: string): DOM | any => {
        if (value !== undefined) {
            if (isNaN(parseFloat(value))) return;
            else value = `${value}px`;

            if (this.nodes.length > 1) {
                this.nodes.forEach((node: HTMLElement) => {
                    node.style[name] = (value as string);
                });
            } else (this.nodes[0] as HTMLElement).style[name] = value;
        } else {
            const node = this.getLastNode();
            let result: number | null = null;

            const styleName = this.convertToJSProperty(name);

            if ((typeof node.getBoundingClientRect === `function`) && this.pseudoSelector == null) result = node.getBoundingClientRect()[styleName];

            if (result == null) {
                const value = getComputedStyle(node, this.pseudoSelector)[styleName];

                if ((value as string).includes(`px`)) result = parseInt(value, 10);
            }

            if (isNaN((result as number))) {
                throw new Error(`Undefined css property: ${name}`);
            }

            return result;
        }
    };

    on = (eventName: string, callback: (node: HTMLElement, e: any) => void): void => {
        this.nodes.forEach((node: HTMLElement) => {
            const callbackFn = (e: any): void => callback.call(node, e);
            this.callbacks[eventName] = callbackFn;
        });
    };

    off = (eventName: string): void => {
        const callbackFn = this.callbacks[eventName];
        this.nodes.forEach((node: HTMLElement) => node.removeEventListener(eventName, callbackFn, false));
    };

    val = (value?: string | number): DOM | (string | number) => {
        if (value === undefined) return this.getLastNode().value;

        this.nodes.forEach((node: any) => {
            node.value = value;
        });

        return this;
    };

    is = (tagName: string): boolean => this.getLastNode().tagName.toLowerCase() === tagName;

    get = (i?: number): HTMLElement => (this.nodes as HTMLElement[])[i ?? 0];

    length = (): number => this.nodes.length;

    hide = (): DOM => {
        this.nodes.forEach((node: HTMLElement) => {
            this.select(node).css(`display`, `none`);
        });

        return this;
    };

    show = (): DOM => {
        this.nodes.forEach((node: HTMLElement) => {
            this.select(node).css(`display`, `block`);
        });

        return this;
    };

    empty = (): DOM => {
        this.nodes.forEach((node: HTMLElement) => {
            node.innerHTML = ``;
        });

        return this;
    };

    html = (content: string): DOM => {
        this.nodes.forEach((node: HTMLElement) => {
            node.innerHTML = content;
        });

        return this;
    };

    remove = (): void => {
        this.nodes.forEach((node: HTMLElement) => {
            node.remove();
        });
    };

    insertBefore = (data: any): DOM => {
        const element = this.resolveElement(data);

        this.nodes.forEach((node: HTMLElement) => {
            node.parentNode?.insertBefore(element, element.previousSibling);
        });

        return this;
    };

    insertAfter = (data: any): DOM => {
        const element = this.resolveElement(data);

        this.nodes.forEach((node: HTMLElement) => {
            node.parentNode?.insertBefore(element, node.nextSibling);
        });

        return this;
    };

    resolveElement = (data: any): HTMLElement => {
        let element;

        if (this.isHTML(data)) element = this.createNode(data);
        else if (data instanceof HTMLElement) element = data;
        else if (data instanceof DOM) element = data.get();

        return element;
    };

    closest = (selector: string): DOM => this.select(this.getLastNode().closest(selector));

    data = (name: string): string | DOM => this.attr(`data-${name}`);

    width = (value?: number | string): any => {
        if (value !== undefined) {
            this.css(`width`, `${value}`);
            return this;
        }
    };

    height = (value?: number): any => {
        if (value !== undefined) {
            this.css(`height`, `${value}`);
            return this;
        }

        if (this.getLastNode() === window) return parseInt(this.getLastNode().innerHeight, 10);
    };

    position = (): Record<`top` | `bottom` | `left` | `right`, number> => {
        return {
            top: parseFloat(this.getLastNode().getBoundingClientRect().top),
            bottom: parseFloat(this.getLastNode().getBoundingClientRect().bottom),
            left: parseFloat(this.getLastNode().getBoundingClientRect().left),
            right: parseFloat(this.getLastNode().getBoundingClientRect().right)
        };
    };

    offset = (): Record<`top` | `left`, number> => {
        return {
            top: parseFloat(this.getLastNode().offsetTop),
            left: parseFloat(this.getLastNode().offsetLeft)
        };
    };

    createNode = (name: string): Node | undefined => {
        if (name[0] === `<` && name[name.length - 1] === `>`) {
            const element = document.createElement(`div`);
            element.innerHTML = name;

            if (element.firstChild != null) return (element.firstChild);
            else return undefined;
        } else return document.createElement(name);
    };

    isHTML = (text: string): boolean => text[0] === `<` && text[text.length - 1] === `>`;

    convertToJSProperty = (name: string): string => {
        name = name.toLowerCase().replace(`-`, ` `);
        name = name.replace(/(^| )(\w)/g, (x) => x.toUpperCase());
        name = name.charAt(0).toLowerCase() + name.slice(1);

        return name.replace(` `, ``);
    };

    getLastNode = (): any => this.nodes[this.nodes.length - 1];
}

export default DOM;
