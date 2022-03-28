import PositionOpts from '../typings/PositionOpts';

class BottomCenter {
    options: PositionOpts;
    position: string;

    offset: Record<`x` | `y`, number>;
    margin: number;

    constructor (options: PositionOpts) {
        this.options = options;
        this.position = `bottom-center`;

        this.margin = this.options.margin ?? 20;
        this.offset = {
            x: this.options.offset?.x ?? 0,
            y: this.options.offset?.y ?? 0
        };
    }

    calculate = (): void => {
        let offset = this.margin - this.offset.y;

        const notifications = document.querySelectorAll(`..growl-notification.position-${this.position}`);

        notifications.forEach((element: HTMLDivElement) => {
            element.style.bottom = offset.toString();
            element.style.left = `calc(50% - ${Math.ceil(parseFloat(element.style.width) / 2)}px)`;

            offset += parseFloat(element.style.height) + this.margin;
        });
    };
}

export default BottomCenter;
