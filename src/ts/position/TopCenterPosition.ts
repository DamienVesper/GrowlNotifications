import { IPosition } from "../interface/IPosition";
import TsDom from "../model/tsdom";

export class TopCenterPosition implements IPosition {
    static readonly position: string = `top-center`;

    constructor (private readonly notification: TsDom, private readonly margin: number) { }

    calculate (): void {
        let offset: number = this.margin;
        const notifications = TsDom.select(`.growl-notification.position-${TopCenterPosition.position}`);

        notifications.each((el: any) => {
            const element = TsDom.select(el);
            element
                .css(`top`, offset)
                .css(`left`, `calc(50% - ${Math.ceil(element.width() / 2)}px)`)
            ;
            offset += element.height() + this.margin;
        });
    }

    instances (): TsDom[] {
        const result: TsDom[] = [];
        const notifications = TsDom.select(`.growl-notification.position-${TopCenterPosition.position}`)
        ;
        notifications.each((notification: HTMLElement) => {
            result.push(TsDom.select(notification));
        });

        return result;
    }
}
