import Notification from './Notification';

import Options from './typings/Options';

class GrowlNotificationController {
    instances: Notification[];

    notify = (options: Options): void => {
        const notification = new Notification(options);
        this.instances.push(notification);
    };
}

export default GrowlNotificationController;
