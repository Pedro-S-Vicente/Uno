class bot extends player {
    cartasPodemSerJogadas() {
        return this.cartas.filter((carta) => {
            return (
                carta.cor === p.ultimaCarta.cor ||
                carta.simbolo === p.ultimaCarta.simbolo ||
                (carta.cor === "preto" && p.ultimaCarta.cor != "preto")
            );
        });
    }

    possuiCartasParaJogar() {
        return this.cartasPodemSerJogadas().length > 0;
    }

    existeEstaCartaParaJogar(simbolo) {
        let cartasPodem;
        cartasPodem = this.cartasPodemSerJogadas().filter((carta) => {
            return simbolo === carta.simbolo;
        });
        if (cartasPodem.length > 0) return this.cartas.indexOf(cartasPodem[0]);
        return false;
    }

    fazerJogada() {
        setTimeout(()=> {
            this.clicarUno();
        }, Math.floor(Math.random() * 1000))
        
        setTimeout(()=> {
            let e;
            e = setInterval(() => {
                if (this.possuiCartasParaJogar()) {
                    p.fazerAnimacaoCartas();
                    setTimeout(() => {
                        if (p.qtddComprarCarta > 0 && this.existeEstaCartaParaJogar("-2")) {
                            p.jogarCarta(this.existeEstaCartaParaJogar("-2"));
                        } else if (
                            p.qtddComprarCarta > 0 &&
                            this.existeEstaCartaParaJogar("-4")
                        ) {
                            p.jogarCarta(this.existeEstaCartaParaJogar("-4"));
                        } else if (this.existeEstaCartaParaJogar("block")) {
                            p.jogarCarta(this.existeEstaCartaParaJogar("block"));
                        } else if (this.existeEstaCartaParaJogar("reverse")) {
                            p.jogarCarta(this.existeEstaCartaParaJogar("reverse"));
                        } else if (this.existeEstaCartaParaJogar(p.ultimaCarta)) {
                            p.jogarCarta(this.existeEstaCartaParaJogar(p.ultimaCarta));
                        } else {
                            let cartasValidas, cartaAleatoria;
                            cartasValidas = this.cartasPodemSerJogadas();
                            cartaAleatoria =
                                cartasValidas[
                                    Math.floor(Math.random() * cartasValidas.length)
                                ];
                            p.jogarCarta(
                                this.existeEstaCartaParaJogar(cartaAleatoria.simbolo)
                            );
                        }
                    }, 1250);
                    clearInterval(e)
                } else {
                    this.comprarCarta();
                    p.atualizarHtmlPartida();
                }

            }, 250);
        }, 3000);
    }

    clicarUno () {
        if (p.playerEmUno != null) {
            p.uno(0);
        }
    }
}
