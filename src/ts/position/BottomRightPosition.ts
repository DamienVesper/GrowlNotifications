import {IPosition} from "../interface/IPosition";
import TsDom from "../model/tsdom";

export class BottomRightPosition implements IPosition {
    static readonly position: string = 'bottom-right';

    constructor(private notification: TsDom, private margin: number) { }

    calculate(): void {
        let offset: number = this.margin,
            notifications = TsDom.select('.growl-notification.position-' + BottomRightPosition.position)
        ;

        notifications.each((el: any) => {
            let element = TsDom.select(el);
            element
                .css('bottom', offset)
                .css('right', this.margin)
            ;
            offset += element.height() + this.margin;
        });
    }

    instances(): Array<TsDom> {
        let result: Array<TsDom> = [],
            notifications = TsDom.select('.growl-notification.position-' + BottomRightPosition.position)
        ;
        notifications.each((notification: HTMLElement) => {
            result.push(TsDom.select(notification));
        });

        return result;
    }
}
