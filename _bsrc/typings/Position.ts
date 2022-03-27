import Options from './options';

class Position {
    position: Options[`position`];
    offset: Record<`x` | `y`, number>;
    margin: number;

    calculate: () => void;
    instances: () => void;
}

export default Position;
