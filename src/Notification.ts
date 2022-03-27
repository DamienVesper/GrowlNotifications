import Options from './typings/Options';
import { DefaultOpts } from './Defaults';

class Notification {
    options: Options;

    element: HTMLDivElement;

    constructor (options: Options) {
        this.options = Object.assign(DefaultOpts, options);
        this.element = document.createElement(`div`);
    }

    show = (): void => {
        document.body.append(this.element);
    };

    hide = (): void => {
        this.element.remove();
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

    getTemplate = (): string => {
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
}

export default Notification;
