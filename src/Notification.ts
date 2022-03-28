import Options from './typings/Options';
import { DefaultOpts } from './Defaults';

import TopLeft from './positions/TopLeft';
import TopCenter from './positions/TopCenter';
import TopRight from './positions/TopRight';
import BottomLeft from './positions/BottomLeft';
import BottomCenter from './positions/BottomCenter';
import BottomRight from './positions/BottomRight';

class Notification {
    options: Options;
    position: TopLeft | TopCenter | TopRight | BottomLeft | BottomCenter | BottomRight;

    element: HTMLDivElement;

    constructor (options: Options) {
        this.options = Object.assign(DefaultOpts, options);
        this.element = document.createElement(`div`);

        this.show();
    }

    show = (): void => {
        this.addNotification();
        this.initPosition();
        this.bindEvents();
    };

    hide = (): void => {
        this.element.classList.remove(`animation-${this.options.animation?.open ?? `slide-in`}`);
        this.element.classList.add(
            `animation-${this.options.animation?.close ?? `slide-out`}`,
            `growl-notification--closed`
        );
    };

    remove = (): void => {
        this.element.remove();
        this.position.calculate();
    };

    private readonly addNotification = (): void => {
        let template = this.getTemplate();

        // Add initial classes.
        this.element.classList.add(
            `growl-notification`,
            `growl-notification-${this.options.type ?? ``}`,
            `animation-${this.options.animation?.open ?? `slide-in`}`,
            `position-${this.options.position ?? `top-right`}`
        );

        // Add title.
        template = this.options.title === undefined
            ? template.replace(`<div class="growl-notification__title">{{ title }}</div>`, ``)
            : template.replace(`{{ title }}`, this.options.title);

        // Add description.
        template = template.replace(`{{ description }}`, this.options.description ?? ``);

        // Add image.
        if (this.options.image?.visible === true) {
            template.replace(`{{ image }}`, (this.options.image?.customImage !== undefined)
                ? `<div class="growl-notification__image growl-notification__image--custom"><img src="${this.options.image.customImage}" alt=""></div>`
                : `<div class="growl-notification__image"></div>`);

            this.element.classList.add(`growl-notification--image`);
        } else template = template.replace(`{{ image }}`, ``);

        // Set width.
        template = template.replace(`{{ width }}`, this.options.width !== undefined
            ? `width:${this.options.width}px;`
            : ``);

        // Set z-index.
        template = template.replace(`{{ zIndex }}`, this.options.zIndex !== undefined
            ? `z-index:${this.options.zIndex}`
            : ``);

        // Show progress bar.
        template = template.replace(`{{ showProgress }}`, this.options.showProgress === true
            ? ` is-visible`
            : ``);

        // Show buttons.
        template = template.replace(`{{ showButtons }}`, this.options.showButtons === true
            ? ` is-visible`
            : ``);

        // Populate button content.
        template = template
            .replace(` {{ actionBtnText }}`, this.options.buttons?.action?.text ?? `Ok`)
            .replace(` {{ cancelBtnText }}`, this.options.buttons?.cancel?.text ?? `Cancel`);

        this.element.innerHTML = template;
        document.body.append(this.element);

        if (this.options.showProgress === true && (this.options.closeTimeout !== undefined && this.options.closeTimeout > 0)) this.calculateProgress();
    };

    private readonly getTemplate = (): string => {
        return `
            <span class="growl-notification__close" style="{{ width }}{{ height }}{{ zIndex }}">
                <span class="growl-notification__close-icon"></span>
            </span>
            <div class="growl-notification__progress{{ showProgress }}">
                <div class="growl-notification__progress-bar"></div>
            </div>
            <div class="growl-notification__body">
                {{ image }}
                <div class="growl-notification__content">
                    <div class="growl-notification__title">{{ title }}</div>
                    <div class="growl-notification__desc">{{ description }}</div>
                </div>
            </div>
            <div class="growl-notification__buttons{{ showButtons }}">
                <span class="growl-notification__button growl-notification__button--action">{{ actionBtnText }}</span>
                <span class="growl-notification__button growl-notification__button--cancel">{{ cancelBtnText }}</span>
            </div>
      `;
    };

    private readonly calculateProgress = (): void => {
        const intervalAmount = Math.ceil(Number(this.options.closeTimeout) / 100);

        let width = 1;
        const interval = setInterval(() => {
            if (width >= 100) clearInterval(interval);
            else {
                // this.element
                //     .find(`.growl-notification__progress-bar`)
                //     .css(`width`, `${width}%`);
                width++;
            }
        }, intervalAmount);
    };

    private readonly bindEvents = (): void => {
        if ((this.options.closeWith?.includes(`click`)) ?? false) {
            this.element.classList.add(`growl-notification--close-on-clock`);
            this.element.addEventListener(`click`, () => this.hide());
        }

        // else if ((this.options.closeWith?.includes(`button`)) ?? false) {
        //     const closeBtn = this.notification.find(`.growl-notification__close`);
        //     closeBtn.on(`click`, () => self.close());
        // }

        // if (this.options.showButtons) {
        //     const actionBtn = this.notification.find(`.growl-notification__button--action`);

        //     actionBtn.on(`click`, (e: MouseEvent) => {
        //         self.options.buttons.action.callback.apply(self);
        //         self.close();
        //         e.stopPropagation();
        //     });

        //     const cancelBtn = this.notification.find(`.growl-notification__button--cancel`);

        //     cancelBtn.on(`click`, (e: MouseEvent) => {
        //         self.options.buttons.cancel.callback.apply(self);
        //         self.close();
        //         e.stopPropagation();
        //     });
        // }

        // if (this.options.closeTimeout && (this.options.closeTimeout > 0)) {
        //     setTimeout(() => self.close(), this.options.closeTimeout);
        // }
    };

    private readonly initPosition = (): void => {
        this.position.calculate();
    };
}

export default Notification;
