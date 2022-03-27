export interface IOptions {
    margin?: number
    width?: number|string
    zIndex?: number
    type?: string
    title?: string
    description?: string
    image?: {
        visible?: boolean
        customImage: string
    }
    closeTimeout?: boolean | number
    closeWith?: string[]
    animation?: {
        open: string
        close: string
    }
    animationDuration?: number
    position?: string
    showBorder?: boolean
    showButtons?: boolean
    buttons?: {
        action?: {
            text?: string
            callback?: Function
        }
        cancel?: {
            text?: string
            callback?: Function
        }
    }
    showProgress?: boolean
}
