/* eslint-disable @typescript-eslint/no-empty-function */

import Options from './typings/Options';

const DefaultOpts: Options = {
    type: `default`,
    title: undefined,
    description: `Hi there!`,

    position: `top-right`,
    margin: 20,
    offset: {
        x: 0,
        y: 0
    },

    width: 0,
    zIndex: 0,

    image: {
        visible: false
    },

    animationDuration: 0.2,
    animation: {
        open: `slide-in`,
        close: `slide-out`
    },

    closeTimeout: 0,
    closeWith: [`click`, `button`],

    showBorder: false,
    showButtons: false,

    buttons: {
        action: {
            text: `Ok`,
            callback: () => {}
        },
        cancel: {
            text: `cancel`,
            callback: () => {}
        }
    },

    showProgress: false
};

export {
    DefaultOpts
};
