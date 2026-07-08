export class CabecalhoJogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="contador-bandeiras" class="contador">000</div>
      <button id="botao-reiniciar">🙂</button>
      <div id="cronometro" class="contador">000</div>
    `;

    this.elementoBandeiras = this.querySelector('#contador-bandeiras');
    this.elementoCronometro = this.querySelector('#cronometro');
    this.botaoReiniciar = this.querySelector('#botao-reiniciar');

    this.segundos = 0;
    this.intervalo = null;

    this.botaoReiniciar.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('reiniciar-jogo', { bubbles: true }));
    });
  }

  definirMinas(quantidade) {
    this.totalMinas = quantidade;
    this.atualizarBandeiras(0);
  }

  atualizarBandeiras(quantidadeBandeiradas) {
    const restantes = this.totalMinas - quantidadeBandeiradas;
    this.elementoBandeiras.textContent = String(restantes).padStart(3, '0');
  }

  iniciarCronometro() {
    if (this.intervalo) return;
    this.intervalo = setInterval(() => {
      this.segundos++;
      this.elementoCronometro.textContent = String(Math.min(this.segundos, 999)).padStart(3, '0');
    }, 1000);
  }

  pararCronometro() {
    clearInterval(this.intervalo);
    this.intervalo = null;
  }

  reiniciar() {
    this.pararCronometro();
    this.segundos = 0;
    this.elementoCronometro.textContent = '000';
    this.atualizarBandeiras(0);
  }
}

customElements.define('cabecalho-jogo', CabecalhoJogo);