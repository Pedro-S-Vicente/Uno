class player {
    constructor () {
        this.cartas = [];
    }

    comprarCarta () {
        let r;
        r = Math.floor(Math.random() * arrCartas.length);
        this.cartas.push(arrCartas[r]);
    }

    removerCarta (n) {
        this.cartas.splice(n, 1);
    }
}