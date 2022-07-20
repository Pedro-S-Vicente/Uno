class partida {
    constructor(objPlayers) {
        this.ultimaCarta =
            arrCartas[Math.floor(Math.random() * arrCartas.length)];
        while (this.ultimaCarta.cor === "preto") {
            this.ultimaCarta =
                arrCartas[Math.floor(Math.random() * arrCartas.length)];
        }
        this.objPlayers = objPlayers;
        this.vezPlayer = 0;
        this.sentidoHr = true;
        this.qtddComprarCarta = 0;
        this.playerEmUno = null;
    }

    iniciarPartida() {
        this.objPlayers.forEach((p) => {
            for (let i = 0; i < 7; i++) p.comprarCarta();
        });

        this.atualizarHtmlPartida();
    }

    comprarXvezes(x, idPlayer) {
        let i, e;
        i = 0;
        e = setInterval(() => {
            i >= x ? clearInterval(e) : this.objPlayers[idPlayer].comprarCarta();
            this.atualizarHtmlPartida();
            i++;
        }, 250);
    }

    jogarCarta(n) {
        let player, carta;
        player = this.objPlayers[this.vezPlayer];
        carta = player.cartas[n];
        if (
            carta.cor === this.ultimaCarta.cor ||
            carta.simbolo === this.ultimaCarta.simbolo ||
            (carta.cor === "preto" && this.ultimaCarta.cor != "preto")
        ) {
            player.removerCarta(n);
            if (carta.simbolo[0] === "-") {
                this.qtddComprarCarta += -(Number(carta.simbolo));
                this.ultimaCarta = carta;
            } else {
                this.comprarXvezes(this.qtddComprarCarta, this.vezPlayer);
                this.qtddComprarCarta = 0;
            }

            if (carta.simbolo === "block") {
                this.mudarVez();
                this.ultimaCarta = carta;
            } else if (carta.simbolo === "reverse") {
                this.sentidoHr = !this.sentidoHr;
                this.ultimaCarta = carta;
            } else if (carta.cor === "preto") {
                this.ultimaCarta = this.playerEscolherCor(carta.simbolo);
            } else {
                this.ultimaCarta = carta;
            }
            this.eventoUno();
            this.mudarVez();
            this.atualizarHtmlPartida();
            return true;
        }
        return false;
    }

    mudarVez() {
        let i;
        this.sentidoHr ? (i = 1) : (i = -1);
        this.vezPlayer += i;
        if (this.vezPlayer < 0) {
            this.vezPlayer = this.objPlayers.length - 1;
        } else if (this.vezPlayer > this.objPlayers.length - 1) {
            this.vezPlayer = 0;
        }
        this.seForBotJogue();
    }

    seForBotJogue() {
        let player;
        player = this.objPlayers[this.vezPlayer];
        if (player.constructor.name === "bot") {
            player.fazerJogada();
        }
    }

    playerEscolherCor(simbolo) {
        let cor;
        cor = prompt("Escolha a cor gagabundo");
        return new carta(cor, simbolo);
    }

    atualizarHtmlCartasPlayerAJogar() {
        this.atualizarHtmlCartasPlayer(this.vezPlayer);
    }

    atualizarHtmlCartasPlayer (idPlayer) {
        let html, divPlayer, player;
        html = ``;
        divPlayer = document.querySelectorAll('.player')[idPlayer];
        player = this.objPlayers[idPlayer];
        if (idPlayer === this.vezPlayer && player.constructor.name === "player") {
            divPlayer.classList.add('jogar');
            player.cartas.forEach((carta, i) => {
                html += `
                <div class='carta ${carta.cor} carta-${carta.simbolo}' style='z-index: ${i};' onclick="p.jogarCarta(${i})">
                </div>
                `;
            });
            divPlayer.innerHTML = html;
            
        } else if (player.constructor.name === "player") {
            divPlayer.classList.remove('jogar');
            player.cartas.forEach((carta, i) => {
                html += `
                <div class='carta ${carta.cor} carta-${carta.simbolo}' style='z-index: ${i};'>
                </div>
                `;
            });
            divPlayer.innerHTML = html;
        } else {
            player.cartas.forEach((carta, i) => {
                html += `
                <div class='carta carta-uno' style='z-index: ${i};'>
                </div>
                `;
            });
            divPlayer.innerHTML = html;
        }
    }

    atualizarComprarCartas() {
        let divUltimaCartas, htmlUltimaCartas;
        divUltimaCartas = document.querySelector(".cards");
        htmlUltimaCartas = `
        <div class='carta ${this.ultimaCarta.cor} carta-${this.ultimaCarta.simbolo}'></div>
        `;
        this.objPlayers.forEach((player, e) => {
            if (e === this.vezPlayer && player.constructor.name === "player") {
                htmlUltimaCartas += `
                    <div class='comprar carta carta-uno' onclick='p.vezPlayerComprarCarta()'></div>
                `;
            } else if (player.constructor.name === "player") {
                htmlUltimaCartas += `
                    <div class='comprar carta carta-uno'></div>
                `;
            }
        });
        divUltimaCartas.innerHTML = htmlUltimaCartas;
    }
    atualizarHtmlPartida() {
        this.objPlayers.forEach((player, e) => {
            this.atualizarHtmlCartasPlayer(e);
        });
        this.atualizarComprarCartas();
    }

    fazerAnimacaoCartas() {
        let cartasPlayer, a;
        cartasPlayer = document.querySelectorAll(
            `#player-1 .carta`
        );
        a = Math.floor(Math.random() * cartasPlayer.length);
        cartasPlayer[a].classList.add("baixar-carta");
    }

    playerNaoPossuiCartaValida(player) {
        return (
            player.cartas.filter((carta) => {
                return (
                    carta.cor === this.ultimaCarta.cor ||
                    carta.simbolo === this.ultimaCarta.simbolo
                );
            }).length === 0
        );
    }

    vezPlayerComprarCarta() {
        let player;
        player = this.objPlayers[this.vezPlayer];
        if (this.playerNaoPossuiCartaValida(player)) {
            player.comprarCarta();
            this.atualizarHtmlPartida();
        }
    }

    eventoUno() {
        let player;
        player = this.objPlayers[this.vezPlayer];
        if (player.cartas.length === 1) {
            this.fazerBtnUno();
            this.playerEmUno = this.vezPlayer;
        }
    }

    fazerBtnUno() {
        let wrapperBtnUno;
        wrapperBtnUno = document.querySelector(".wrapper__btn_uno");
        wrapperBtnUno.style.display = "flex";
    }

    esconderBtnUno() {
        let wrapperBtnUno;
        wrapperBtnUno = document.querySelector(".wrapper__btn_uno");
        wrapperBtnUno.style.display = "none";
    }

    uno(idQuemApertou) {
        if (this.playerEmUno != null) {
            if (idQuemApertou != this.playerEmUno) {
                this.comprarXvezes(2, this.playerEmUno);
            }
            this.esconderBtnUno();
            this.playerEmUno = null;
            this.atualizarHtmlPartida();
        }
    }
}
