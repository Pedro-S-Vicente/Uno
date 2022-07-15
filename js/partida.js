class partida {
    constructor (objPlayers) {
        this.ultimaCarta = arrCartas[Math.floor(Math.random() * arrCartas.length)];
        while(this.ultimaCarta.cor === 'preto') {
            this.ultimaCarta = arrCartas[Math.floor(Math.random() * arrCartas.length)];
        }
        this.objPlayers = objPlayers;
        this.vezPlayer = 0;
        this.sentidoHr = true;
        this.qtddComprarCarta = 0;
    }

    iniciarPartida () {
        this.objPlayers.forEach((p) => {
            for(let i=0; i < 7; i++)
                p.comprarCarta();
        });

        this.atualizarHtmlPartida();
    }

    jogarCarta (n) {
        let player, carta;
        player = this.objPlayers[this.vezPlayer];
        carta = player.cartas[n];
        if (carta.cor === this.ultimaCarta.cor || carta.simbolo === this.ultimaCarta.simbolo || ((carta.cor === 'preto') && (this.ultimaCarta.cor != 'preto'))) {
            player.removerCarta(n);
            if (carta.simbolo[0] === '+') {
                this.qtddComprarCarta += Number(carta.simbolo);
                this.ultimaCarta = carta;
            } else {
                for (let i=0; i<this.qtddComprarCarta; i++) 
                    this.objPlayers[this.vezPlayer].comprarCarta();
                this.qtddComprarCarta = 0;
            }

            if (carta.simbolo === 'block') {
                this.mudarVez();
                this.ultimaCarta = carta;
            } else if (carta.simbolo === 'reverse') {
                this.sentidoHr = !this.sentidoHr;
                this.ultimaCarta = carta;
            } else if (carta.cor === 'preto') {
                this.ultimaCarta = this.playerEscolherCor();
            } else {
                this.ultimaCarta = carta;
            }
            this.mudarVez();
            this.atualizarHtmlPartida();
            return true;
        }
        return false;
    }

    mudarVez () {
        let i;
        (this.sentidoHr) ? i=1 : i=-1;
        this.vezPlayer += i;
        if (this.vezPlayer < 0) {
            this.vezPlayer = this.objPlayers.length - 1;
        } else if (this.vezPlayer > this.objPlayers.length - 1) {
            this.vezPlayer = 0;
        }
        this.seForBotJogue();
    }

    seForBotJogue () {
        let player;
        player = this.objPlayers[this.vezPlayer];
        if (player.constructor.name === 'bot') {
            setTimeout(()=>{player.fazerJogada()},Math.floor(Math.random()*5000));
            
        }
    }

    playerEscolherCor() {
        let cor;
        cor = prompt('Escolha a cor gagabundo');
        return new carta(cor, 'mudarCor');
    }

    atualizarHtmlPartida () {
        let divsPlayer, divUltimaCartas, html;
        divsPlayer = document.querySelectorAll('.player');
        divUltimaCartas = document.querySelector('.cards');
        this.objPlayers.forEach((player, e) => {
            html = '';
            if (e === this.vezPlayer && player.constructor.name === 'player') {
                player.cartas.forEach((carta, i) =>  {
                    html += `
                    <div class='carta ${carta.cor}' onclick='p.jogarCarta(${i})' style='z-index: ${i};'>
                        ${carta.simbolo}
                    </div>
                    `
                });
            } else if (player.constructor.name === 'player') {
                player.cartas.forEach((carta, i) =>  {
                    html += `
                    <div class='carta ${carta.cor}' style='z-index: ${i};'>
                        ${carta.simbolo}
                    </div>
                    `
                });
            } else {
                player.cartas.forEach((carta, i) =>  {
                    html += `
                    <div class='carta carta-uno' style='z-index: ${i};'>
                    </div>
                    `
                });
            }
            divsPlayer[e].innerHTML = html;
        })
        divUltimaCartas.innerHTML = `
        <div class='carta ${this.ultimaCarta.cor}'>
            ${this.ultimaCarta.simbolo}
        </div>
        <div class='comprar carta preto' onclick='p.vezPlayerComprarCarta()'>
            Compra
        </div>
        `;
    }

    fazerAnimacaoCartas() {
        let cartasPlayer, a;
        cartasPlayer = document.querySelectorAll(`.player:nth-child(${this.vezPlayer+1}) .carta`);
        a = Math.floor(Math.random() *cartasPlayer.length);
        cartasPlayer[a].style.bottom = '10px';
        cartasPlayer[a].style.zIndex = '99999';
    }

    playerNaoPossuiCartaValida(player) {
        return (player.cartas.filter((carta)=> {
            return (carta.cor === this.ultimaCarta.cor || carta.simbolo === this.ultimaCarta.simbolo)
        }).length === 0);
    }

    vezPlayerComprarCarta () {
        let player;
        player = this.objPlayers[this.vezPlayer];
        if (this.playerNaoPossuiCartaValida(player)) {
            player.comprarCarta();
            this.atualizarHtmlPartida();
        }
    }
}
