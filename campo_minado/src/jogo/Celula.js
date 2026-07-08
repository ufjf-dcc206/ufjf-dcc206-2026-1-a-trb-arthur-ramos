export class Celula {
  constructor(linha, coluna) {
    this.linha = linha;
    this.coluna = coluna;
    this.ehMina = false;
    this.ehRevelada = false;
    this.ehBandeirada = false;
    this.minasAdjacentes = 0;
  }
}