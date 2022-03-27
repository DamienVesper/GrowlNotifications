import Options from './options';

interface Position {
    position?: Options[`position`]

    calculates: () => void
    instances: () => unknown // TSDOM
}

export default Position;
