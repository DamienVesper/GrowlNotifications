import { IPosition } from "../interface/IPosition";
import TsDom from "../model/tsdom";

export class TopLeftPosition implements IPosition {
    static readonly position: string = `top-left`;

    constructor (private readonly notification: TsDom, private readonly margin: number) { }

    calculate (): void {
        let offset: number = this.margin;
        const notifications = TsDom.select(`.growl-notification.position-${TopLeftPosition.position}`);

        notifications.each((el: any) => {
            const element = TsDom.select(el);
            element
                .css(`top`, offset)
                .css(`left`, this.margin)
            ;
            offset += element.height() + this.margin;
        });
    }

    instances (): TsDom[] {
        const result: TsDom[] = [];
        const notifications = TsDom.select(`.growl-notification.position-${TopLeftPosition.position}`)
        ;
        notifications.each((notification: HTMLElement) => {
            result.push(TsDom.select(notification));
        });

        return result;
    }
}
