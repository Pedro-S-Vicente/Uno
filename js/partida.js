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
            i >= x
                ? clearInterval(e)
                : this.objPlayers[idPlayer].comprarCarta();
            this.atualizarHtmlCartasPlayerAJogar();
            i++;
        }, 150);
    }

    jogarCarta(n) {
        let player, cartaJogada;
        player = this.objPlayers[this.vezPlayer];
        cartaJogada = player.cartas[n];
        if (
            cartaJogada.cor === this.ultimaCarta.cor ||
            cartaJogada.simbolo === this.ultimaCarta.simbolo ||
            (cartaJogada.cor === "preto" && this.ultimaCarta.cor != "preto")
        ) {
            player.removerCarta(n);
            this.eventoUno();
            if (cartaJogada.simbolo[0] === "-" && this.ultimaCarta != "-4") {
                this.qtddComprarCarta += -Number(cartaJogada.simbolo);
                this.ultimaCarta = cartaJogada;
            } else if (this.qtddComprarCarta > 0) {
                this.comprarXvezes(this.qtddComprarCarta, this.vezPlayer);
                this.qtddComprarCarta = 0;
            }

            if (cartaJogada.simbolo === "block") {
                this.mudarVez("block");
                this.ultimaCarta = cartaJogada;
            } else if (cartaJogada.simbolo === "reverse") {
                this.sentidoHr = !this.sentidoHr;
                this.ultimaCarta = cartaJogada;
            } else if (cartaJogada.cor != "preto") {
                this.ultimaCarta = cartaJogada;
            }

            if (cartaJogada.cor != "preto") {
                this.mudarVez();
                this.atualizarHtmlPartida();
            } else {
                this.atualizarHtmlCartasPlayerAJogar();
                this.playerEscolherCor();
                this.ultimaCarta = new carta('', cartaJogada.simbolo);
                if (player.constructor.name === "bot") {
                    player.escolherCor();
                }
            }
        }
    }

    playerEscolherCor() {
        let player;
        player = this.objPlayers[this.vezPlayer];
        this.onclickEscolherCor();
        this.mostrarHtml('.wrapper__escolher_cor');
    }

    onclickEscolherCor() {
        let btns, player;
        btns = document.querySelectorAll("button");
        player = this.objPlayers[this.vezPlayer];
        

        if (player.constructor.name === "bot") {
            btns.forEach((btn) => {
                btn.style.cursor = "default";
                btn.removeAttribute("onclick");
            });
        } else {
            btns.forEach((btn, i) => {
                btn.style.cursor = "pointer";
                btn.setAttribute("onclick", `p.cor(${i})`);
            });
        }
    }

    cor (corEscolhida) {
        this.ultimaCarta.cor = coresCartas[corEscolhida];
        this.mudarVez();
        this.atualizarHtmlPartida();
        this.esconderHtml('.wrapper__escolher_cor');
    }


    
    mostrarHtml(query) {
        let el;
        el = document.querySelector(query);
        el.style.display = "flex";
    }

    esconderHtml (query) {
        let el;
        el = document.querySelector(query);
        el.style.display = "none";
    }

    mudarVez(motivo) {
        let i;
        this.sentidoHr ? (i = 1) : (i = -1);
        this.vezPlayer += i;
        if (this.vezPlayer < 0) {
            this.vezPlayer = this.objPlayers.length - 1;
        } else if (this.vezPlayer > this.objPlayers.length - 1) {
            this.vezPlayer = 0;
        }

        if (motivo != "block") {
            this.seForBotJogue();
        }
    }

    seForBotJogue() {
        let player;
        player = this.objPlayers[this.vezPlayer];
        if (player.constructor.name === "bot") {
            player.fazerJogada();
        }
    }

    atualizarHtmlCartasPlayerAJogar() {
        this.atualizarHtmlCartasPlayer(this.vezPlayer);
    }

    atualizarHtmlCartasPlayer(idPlayer) {
        let html, divPlayer, player;
        html = ``;
        divPlayer = document.querySelectorAll(".player")[idPlayer];
        player = this.objPlayers[idPlayer];
        if (
            idPlayer === this.vezPlayer &&
            player.constructor.name === "player"
        ) {
            player.cartas.forEach((carta, i) => {
                html += `
                <div class='carta ${carta.cor} carta-${carta.simbolo}' style='z-index: ${i};' onclick="p.jogarCarta(${i})">
                </div>
                `;
            });
            divPlayer.innerHTML = html;
            divPlayer.classList.add("jogar");
        } else if (player.constructor.name === "player") {
            player.cartas.forEach((carta, i) => {
                html += `
                <div class='carta ${carta.cor} carta-${carta.simbolo}' style='z-index: ${i};'>
                </div>
                `;
            });
            divPlayer.innerHTML = html;
            divPlayer.classList.remove("jogar");
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
        cartasPlayer = document.querySelectorAll(`#player-1 .carta`);
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
            this.playerEmUno = this.vezPlayer;
            this.mostrarHtml('.wrapper__btn_uno')
            this.objPlayers.forEach((player) => {
                if (player.constructor.name == "bot") {
                    player.tempoClicarUno();
                }
            });
        }
    }

    uno(idQuemApertou) {
        if (this.playerEmUno != null) {
            if (idQuemApertou != this.playerEmUno) {
                this.comprarXvezes(2, this.playerEmUno);
            }
            this.esconderHtml('.wrapper__btn_uno')
            this.playerEmUno = null;
            this.atualizarHtmlPartida();
        }
    }
}
