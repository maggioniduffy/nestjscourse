interface Hombre {
    id: string;
    mujeres: string[];
}

interface Mujer {
    id: string;
    hombres: string[];
}

interface Pareja {
    hombre: Hombre;
    mujer: Mujer;
}

const N = 4;
const hombresList: Hombre[] = [];
const mujeresList: Mujer[] = [];

const hombre1 = {
    id: 'A',
    mujeres: ['W', 'X', 'Z', 'Y'],
};

const hombre2 = {
    id: 'B',
    mujeres: ['X', 'Y', 'Z', 'W'],
};

const hombre3 = {
    id: 'C',
    mujeres: ['Z', 'W', 'X', 'Y'],
};

const hombre4 = {
    id: 'D',
    mujeres: ['Z', 'W', 'Y', 'X'],
};

const mujer1 = {
    id: 'X',
    hombres: ['C', 'A', 'D', 'B'],
};

const mujer2 = {
    id: 'Y',
    hombres: ['A', 'D', 'C', 'B'],
};

const mujer3 = {
    id: 'W',
    hombres: ['A', 'B', 'D', 'C'],
};

const mujer4 = {
    id: 'Z',
    hombres: ['C', 'D', 'B', 'A'],
};

hombresList.push(hombre1, hombre2, hombre3, hombre4);
mujeresList.push(mujer1, mujer2, mujer3, mujer4);

const i = 1;
const seguir = true;

while (seguir) {
    let j = 1;
    const hombre = hombresList[i];
    let mujer;
    let min = 10;
    while (j <= N) {
        const idMujerAux = hombre.mujeres[j];
        const mujerAux = mujeresList.filter((m) => m.id === idMujerAux)[0];
        const pref = mujerAux.hombres.indexOf(hombre.id);
        const sum = j + pref;
        if (sum < min) {
            min = sum;
            mujer = mujerAux;
        }
        j++;
    }
}
