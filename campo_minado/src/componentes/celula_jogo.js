const CORES_NUMEROS = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

export class CelulaJogo extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('celula-revelar', {
        bubbles: true,
        detail: {
          linha: +this.dataset.linha,
          coluna: +this.dataset.coluna,
        }
      }));
    });

    this.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('celula-bandeira', {
        bubbles: true,
        detail: {
          linha: +this.dataset.linha,
          coluna: +this.dataset.coluna,
        }
      }));
    });
  }

  renderizar(estadoCelula) {
    this.classList.toggle('revelada', estadoCelula.ehRevelada);
    this.classList.toggle('bandeirada', estadoCelula.ehBandeirada);
    this.classList.toggle('mina', estadoCelula.ehRevelada && estadoCelula.ehMina);

    this.style.color = '';

    if (estadoCelula.ehBandeirada) {
      this.textContent = '🚩';
    } else if (estadoCelula.ehRevelada) {
      if (estadoCelula.ehMina) {
        this.textContent = '💣';
      } else if (estadoCelula.minasAdjacentes > 0) {
        this.textContent = estadoCelula.minasAdjacentes;
        this.style.color = CORES_NUMEROS[estadoCelula.minasAdjacentes] || '#000000';
      } else {
        this.textContent = '';
      }
    } else {
      this.textContent = '';
    }
  }
}

customElements.define('celula-jogo', CelulaJogo);