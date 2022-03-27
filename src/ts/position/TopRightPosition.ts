import {IPosition} from "../interface/IPosition";
import TsDom from "../model/tsdom";

export class TopRightPosition implements IPosition {
    static readonly position: string = 'top-right';

    constructor(private notification: TsDom, private margin: number) { }

    calculate(): void {
        let offset: number = this.margin,
            notifications = TsDom.select('.growl-notification.position-' + TopRightPosition.position)
        ;

        notifications.each((el: any) => {
            TsDom.select(el)
                .css('top', offset)
                .css('right', this.margin)
            ;
            offset += TsDom.select(el).height() + this.margin;
        });
    }

    instances(): Array<TsDom> {
        let result: Array<TsDom> = [],
            notifications = TsDom.select('.growl-notification.position-' + TopRightPosition.position)
        ;
        notifications.each((notification: HTMLElement) => {
            result.push(TsDom.select(notification));
        });

        return result;
    }
}
