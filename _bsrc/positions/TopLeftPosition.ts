import DOM from '../DOM';

import Position from '../typings/Position';

class TopLeftPosition extends Position {
    constructor (opts: { offset: { x: number, y: number }, margin: number }) {
        super();

        this.position = `top-left`;
    }

    calculate = (): void => {
        const offset = this.margin + this.offset.y;
        const notifications = new DOM(`.growl-notification.position-${this.position}`);

        notifications.nodes.forEach((notification: HTMLElement) => {
            const             
        });
    };
}

export default TopLeftPosition;
