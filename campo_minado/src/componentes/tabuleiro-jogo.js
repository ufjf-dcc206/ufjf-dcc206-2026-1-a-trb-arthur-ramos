import { Tabuleiro } from '../jogo/Tabuleiro.js';
import './celula-jogo.js';

export class TabuleiroJogo extends HTMLElement {
  connectedCallback() {
    this.linhas = 9;
    this.colunas = 9;
    this.minas = 10;

    this.style.setProperty('--colunas', this.colunas);

    this.addEventListener('celula-revelar', (e) => this.#manipularRevelacao(e.detail));
    this.addEventListener('celula-bandeira', (e) => this.#manipularBandeira(e.detail));

    this.#iniciarJogo();
  }

  reiniciar() {
    this.#iniciarJogo();
  }

  #iniciarJogo() {
    this.jogoEncerrado = false;
    this.jogoGanho = false;
    this.tabuleiro = new Tabuleiro(this.linhas, this.colunas, this.minas);
    this.#construirGrade();
  }

  #construirGrade() {
    this.innerHTML = '';
    for (let l = 0; l < this.linhas; l++) {
      for (let c = 0; c < this.colunas; c++) {
        const celula = document.createElement('celula-jogo');
        celula.dataset.linha = l;
        celula.dataset.coluna = c;
        this.appendChild(celula);
      }
    }
    this.#renderizarTudo();
  }

  #manipularRevelacao({ linha, coluna }) {
    if (this.jogoEncerrado || this.jogoGanho) return;

    const celula = this.tabuleiro.grade[linha][coluna];
    if (celula.ehRevelada || celula.ehBandeirada) return;

    if (!this.tabuleiro.minasPosicionadas) {
      this.tabuleiro.posicionarMinas(linha, coluna);
      this.dispatchEvent(new CustomEvent('jogo-iniciar', { bubbles: true }));
    }

    this.tabuleiro.revelar(linha, coluna);

    if (celula.ehMina) {
      this.jogoEncerrado = true;
      this.#revelarTodasMinas();
      this.#renderizarTudo();
      this.dispatchEvent(new CustomEvent('jogo-encerrado', {
        bubbles: true,
        detail: { ganhou: false }
      }));
      return;
    }

    this.#renderizarTudo();
    this.#verificarVitoria();
  }

  #manipularBandeira({ linha, coluna }) {
    if (this.jogoEncerrado || this.jogoGanho) return;

    this.tabuleiro.alternarBandeira(linha, coluna);

    this.dispatchEvent(new CustomEvent('bandeiras-alteradas', {
      bubbles: true,
      detail: { quantidadeBandeiradas: this.#contarBandeiras() }
    }));

    this.#renderizarTudo();
  }

  #verificarVitoria() {
    const totalCelulas = this.linhas * this.colunas;
    const celulasSemMina = totalCelulas - this.minas;

    let quantidadeReveladas = 0;
    this.tabuleiro.grade.forEach(linha => linha.forEach(celula => {
      if (celula.ehRevelada && !celula.ehMina) quantidadeReveladas++;
    }));

    if (quantidadeReveladas === celulasSemMina) {
      this.jogoGanho = true;
      this.dispatchEvent(new CustomEvent('jogo-encerrado', {
        bubbles: true,
        detail: { ganhou: true }
      }));
    }
  }

  #revelarTodasMinas() {
    this.tabuleiro.grade.forEach(linha => linha.forEach(celula => {
      if (celula.ehMina) celula.ehRevelada = true;
    }));
  }

  #contarBandeiras() {
    let contagem = 0;
    this.tabuleiro.grade.forEach(linha => linha.forEach(celula => {
      if (celula.ehBandeirada) contagem++;
    }));
    return contagem;
  }

  #renderizarTudo() {
    this.querySelectorAll('celula-jogo').forEach(el => {
      const l = +el.dataset.linha;
      const c = +el.dataset.coluna;
      el.renderizar(this.tabuleiro.grade[l][c]);
    });
  }
}

customElements.define('tabuleiro-jogo', TabuleiroJogo);