import {IPosition} from "../interface/IPosition";
import TsDom from "../model/tsdom";

export class BottomLeftPosition implements IPosition {
    static readonly position: string = 'bottom-left';

    constructor(private notification: TsDom, private margin: number) { }

    calculate(): void {
        let offset: number = this.margin,
            notifications = TsDom.select('.growl-notification.position-' + BottomLeftPosition.position)
        ;

        notifications.each((el: any) => {
            let element = TsDom.select(el);
            element
                .css('bottom', offset)
                .css('left', this.margin)
            ;
            offset += element.height() + this.margin;
        });
    }

    instances(): Array<TsDom> {
        let result: Array<TsDom> = [],
            notifications = TsDom.select('.growl-notification.position-' + BottomLeftPosition.position)
        ;
        notifications.each((notification: HTMLElement) => {
            result.push(TsDom.select(notification));
        });

        return result;
    }
}
