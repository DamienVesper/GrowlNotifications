import {IPosition} from "../interface/IPosition";
import TsDom from "../model/tsdom";

export class TopLeftPosition implements IPosition {
    static readonly position: string = 'top-left';

    constructor(private notification: TsDom, private margin: number) { }

    calculate(): void {
        let offset: number = this.margin;
        let notifications = TsDom.select('.growl-notification.position-' + TopLeftPosition.position);

        notifications.each((el: any) => {
            let element = TsDom.select(el);
            element
                .css('top', offset)
                .css('left', this.margin)
            ;
            offset += element.height() + this.margin;
        });
    }

    instances(): Array<TsDom> {
        let result: Array<TsDom> = [],
            notifications = TsDom.select('.growl-notification.position-' + TopLeftPosition.position)
        ;
        notifications.each((notification: HTMLElement) => {
            result.push(TsDom.select(notification));
        });

        return result;
    }
}
