import '../scss/themes/light/light-theme.scss';
import '../scss/themes/dark/dark-theme.scss';
import '../scss/themes/colored/colored-theme.scss';
import { IOptions } from './interface/IOptions';
import { IPosition } from "./interface/IPosition";
import { PositionFactory } from "./position/PositionFactory";
import * as deepmerge from "deepmerge";
import TsDom from './model/tsdom';
import { TopCenterPosition } from "./position/TopCenterPosition";
import { TopRightPosition } from "./position/TopRightPosition";
import { TopLeftPosition } from "./position/TopLeftPosition";
import { BottomCenterPosition } from "./position/BottomCenterPosition";
import { BottomLeftPosition } from "./position/BottomLeftPosition";
import { BottomRightPosition } from "./position/BottomRightPosition";

class GrowlNotification {
    options: IOptions;
    protected static globalOptions: IOptions = {};
    static instances: GrowlNotification[] = [];
    notification: TsDom;
    body: TsDom;
    template: string;
    position: IPosition;

    constructor (options: IOptions = {}) {
        this.options = deepmerge.all([GrowlNotification.defaultOptions, GrowlNotification.globalOptions, options]);
        // Disable animation duration if animation close set to 'none'
        if (!this.options.animation.close || this.options.animation.close == `none`) {
            this.options.animationDuration = 0;
        }
        this.notification = TsDom.create(`div`);
        this.body = TsDom.select(`body`);
        this.template = GrowlNotification.template;
        this.position = PositionFactory.newInstance(this.options.position, this.notification, this.options.margin);
        GrowlNotification.instances.push(this);
    }

    protected static get defaultOptions (): IOptions {
        return {
            margin: 20,
            type: `default`,
            title: ``,
            description: ``,
            image: {
                visible: false,
                customImage: ``
            },
            closeTimeout: 0,
            closeWith: [`click`, `button`],
            animation: {
                open: `slide-in`,
                close: `slide-out`
            },
            animationDuration: 0.2,
            position: `top-right`,
            showBorder: false,
            showButtons: false,
            buttons: {
                action: {
                    text: `Ok`,
                    callback: () => {}
                },
                cancel: {
                    text: `Cancel`,
                    callback: () => {}
                }
            },
            showProgress: false
        };
    }

    static get template (): string {
        return `<span class="growl-notification__close">
                  <span class="growl-notification__close-icon"></span>
                </span>
                <div class="growl-notification__progress">
                    <div class="growl-notification__progress-bar"></div>
                </div>
               <div class="growl-notification__body">
                 {{ image }}
                 <div class="growl-notification__content">
                   <div class="growl-notification__title">{{ title }}</div>
                   <div class="growl-notification__desc">{{ description }}</div>
                 </div>
                </div>
                <div class="growl-notification__buttons">
                    <span class="growl-notification__button growl-notification__button--action">Ok</span>
                    <span class="growl-notification__button growl-notification__button--cancel">Cancel</span>
                </div>`
        ;
    }

    static notify (options: IOptions = {}) {
        const newInstance = new GrowlNotification(options).show();
        let reduceHeight = 0;
        const removedNotifications: TsDom[] = [];
        const instances = newInstance.position.instances();

        instances.forEach((instance: TsDom) => {
            if (GrowlNotification.hasOverflow(newInstance, reduceHeight)) {
                removedNotifications.push(instance);
                reduceHeight += instance.height() + newInstance.options.margin;
            }
        });

        removedNotifications.forEach((instance: TsDom) => {
            instance.remove();
        });

        newInstance.position.calculate();

        return newInstance;
    }

    protected static hasOverflow (newInstance: GrowlNotification, reduceHeight = 0): boolean {
        let result = false;
        const windowHeight = TsDom.select(window).height();
        let offset = 0;

        if (
            (newInstance.position instanceof TopCenterPosition) ||
            (newInstance.position instanceof TopRightPosition) ||
            (newInstance.position instanceof TopLeftPosition)
        ) {
            offset = (newInstance.getContent().offset().top + newInstance.getContent().height() + newInstance.options.margin) - reduceHeight;

            if (offset >= windowHeight) {
                result = true;
            }
        } else if (
            (newInstance.position instanceof BottomCenterPosition) ||
            (newInstance.position instanceof BottomRightPosition) ||
            (newInstance.position instanceof BottomLeftPosition)
        ) {
            offset = newInstance.getContent().offset().top + reduceHeight;

            if (offset <= 0) {
                result = true;
            }
        }

        return result;
    }

    static closeAll () {
        GrowlNotification.instances = [];

        TsDom.select(`.growl-notification`).each((growlNotification: any) => {
            TsDom.select(growlNotification).remove();
        });
    }

    show () {
        this.addNotification();
        this.initPosition();
        this.bindEvents();

        return this;
    }

    close (): void {
        const self = this;
        this.notification
            .removeClass(`animation-${this.options.animation.open}`)
            .addClass(`animation-${this.options.animation.close}`)
            .addClass(`growl-notification--closed`)
        ;
        setTimeout(() => {
            self.remove();
            self.position.calculate();
        }, this.options.animationDuration * 1000);
    }

    remove () {
        const index = GrowlNotification.instances.indexOf(this);
        GrowlNotification.instances.splice(index, 1);
        this.notification.remove();

        return this;
    }

    getContent () {
        return this.notification;
    }

    /**
    * Add notification to document
    */
    private addNotification () {
        const options = this.options;
        let template = this.template.replace(`{{ title }}`, options.title);
        template = template.replace(`{{ description }}`, options.description);

        if (this.options.image.visible) {
            if (this.options.image.customImage) {
                template = template.replace(`{{ image }}`, `<div class="growl-notification__image growl-notification__image--custom"><img src="${this.options.image.customImage}" alt=""></div>`);
            } else {
                template = template.replace(`{{ image }}`, `<div class="growl-notification__image"></div>`);
            }
        } else {
            template = template.replace(`{{ image }}`, ``);
        }

        this.notification
            .addClass(`growl-notification`)
            .addClass(`growl-notification--${options.type}`)
            .addClass(`animation-${options.animation.open}`)
            .addClass(`position-${options.position}`)
        ;

        if (options.image != null) {
            this.notification.addClass(`growl-notification--image`);
        }

        this.notification.html(template);

        if (!options.title) {
            this.notification.find(`.growl-notification__title`).remove();
        }

        if (options.width) {
            this.notification.width(options.width);
        }

        if (options.zIndex) {
            this.notification.css(`z-index`, options.zIndex);
        }

        if (options.showProgress && (options.closeTimeout > 0)) {
            this.notification
                .find(`.growl-notification__progress`)
                .addClass(`is-visible`)
            ;
            this.notification.addClass(`has-progress`);
        }

        if (options.showButtons) {
            this.notification.find(`.growl-notification__buttons`).addClass(`is-visible`);
            this.notification.find(`.growl-notification__button--action`).text(options.buttons.action.text);
            this.notification.find(`.growl-notification__button--cancel`).text(options.buttons.cancel.text);
        }

        this.body.append(this.notification);

        if (options.showProgress && (options.closeTimeout > 0)) {
            this.calculateProgress();
        }
    }

    /**
    * Calculate and set notification positions
    */
    private initPosition () {
        this.position.calculate();
    }

    private calculateProgress () {
        const intervalAmount = Math.ceil(Number(this.options.closeTimeout) / 100);
        let width = 1;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                this.notification
                    .find(`.growl-notification__progress-bar`)
                    .css(`width`, `${width}%`)
                ;
                width++;
            }
        }, intervalAmount)
        ;
    }

    private bindEvents (): void {
        const self = this;

        if (this.options.closeWith.includes(`click`)) {
            this.notification
                .addClass(`growl-notification--close-on-click`)
                .on(`click`, () => self.close())
            ;
        } else if (this.options.closeWith.includes(`button`)) {
            const closeBtn = this.notification.find(`.growl-notification__close`);
            closeBtn.on(`click`, () => self.close());
        }

        if (this.options.showButtons) {
            const actionBtn = this.notification.find(`.growl-notification__button--action`);

            actionBtn.on(`click`, (e: MouseEvent) => {
                self.options.buttons.action.callback.apply(self);
                self.close();
                e.stopPropagation();
            });

            const cancelBtn = this.notification.find(`.growl-notification__button--cancel`);

            cancelBtn.on(`click`, (e: MouseEvent) => {
                self.options.buttons.cancel.callback.apply(self);
                self.close();
                e.stopPropagation();
            });
        }

        if (this.options.closeTimeout && (this.options.closeTimeout > 0)) {
            setTimeout(() => self.close(), this.options.closeTimeout);
        }
    }

    public static setGlobalOptions (options: IOptions): void {
        GrowlNotification.globalOptions = options;
    }
}

export = GrowlNotification;
