import Notification from './Notification';

import Options from './typings/Options';

class GrowlNotificationController {
    instances: Notification[];

    constructor () {
        this.instances = [];
    }

    notify = (options: Options): void => {
        const notification = new Notification(options);
        this.instances.push(notification);

        setTimeout(() => this.removeNotification(this.instances.length - 1), notification.options.closeTimeout ?? 4e3);
    };

    private readonly removeNotification = (i: number): void => {
        const notification = this.instances[i];
        if (notification === undefined) return;

        notification.hide();

        setTimeout(() => {
            notification.remove();
            notification.position.calculate();

            this.instances.splice(i, 1);
        }, (notification.options.animationDuration ?? 0.2) * 1e3);
    };
}

export default GrowlNotificationController;
