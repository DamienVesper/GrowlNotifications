interface Options {
    type?: string
    title?: string
    description?: string

    position?: `top-left` | `top-center` | `top-right` | `bottom-left` | `bottom-center` | `bottom-right`
    margin?: number
    offset?: {
        x?: number
        y?: number
    }

    width?: number | string
    zIndex?: number

    image?: {
        customImage: string
        visible?: boolean
    }

    animationDuration?: number
    animation?: {
        open: string
        close: string
    }

    closeTimeout?: boolean | number
    closeWith?: string[]

    showBorder?: boolean
    showButtons?: boolean

    buttons?: {
        action?: {
            action?: {
                text: string
                callback?: () => void
            }
            cancel?: {
                text?: string
                callback?: () => void
            }
        }
    }

    showProgress?: boolean
}

export default Options;
