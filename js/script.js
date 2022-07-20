const arrCartas = [];
const coresCartas = ['azul', 'vermelho', 'verde', 'amarelo'];


arrCartas.push(
    new carta('preto', 'mudarCor'),
    new carta('preto', '-4')
);
coresCartas.forEach((c) => {
    for (let i=0; i < 10; i++) {
        arrCartas.push(new carta(c, String(i)));
    }
    arrCartas.push(new carta(c, '-2'));
    arrCartas.push(new carta(c, 'block'));
    arrCartas.push(new carta(c, 'reverse'));

});

let p;
p = new partida(
    [new bot (), new player()]
);
p.iniciarPartida();
setTimeout(()=>{p.seForBotJogue()}, 1000);