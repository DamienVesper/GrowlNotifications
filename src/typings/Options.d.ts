interface Options {
    type?: string
    title?: string
    description: string

    position?: `top-left` | `top-center` | `top-right` | `bottom-left` | `bottom-center` | `bottom-right`
    margin?: number
    offset?: {
        x?: number
        y?: number
    }

    width?: number
    zIndex?: number

    image?: {
        visible: boolean
        customImage?: string
    }

    animationDuration?: number
    animation?: {
        open: string
        close: string
    }

    closeTimeout?: number
    closeWith?: string[]

    showBorder?: boolean
    showButtons?: boolean

    buttons?: {
        action?: {
            text: string
            callback?: () => void
        }
        cancel?: {
            text?: string
            callback?: () => void
        }
    }

    showProgress?: boolean
}

export default Options;
