import { Celula } from './Celula.js';

export class Tabuleiro {
  constructor(linhas, colunas, quantidadeMinas) {
    this.linhas = linhas;
    this.colunas = colunas;
    this.quantidadeMinas = quantidadeMinas;
    this.grade = this.#criarGrade();
    this.minasPosicionadas = false;
  }

  #criarGrade() {
    const grade = [];
    for (let l = 0; l < this.linhas; l++) {
      const linha = [];
      for (let c = 0; c < this.colunas; c++) {
        linha.push(new Celula(l, c));
      }
      grade.push(linha);
    }
    return grade;
  }

  posicionarMinas(linhaExcluir, colunaExcluir) {
    let posicionadas = 0;

    while (posicionadas < this.quantidadeMinas) {
      const l = Math.floor(Math.random() * this.linhas);
      const c = Math.floor(Math.random() * this.colunas);
      const celula = this.grade[l][c];

      const ehExcluida = l === linhaExcluir && c === colunaExcluir;

      if (!celula.ehMina && !ehExcluida) {
        celula.ehMina = true;
        posicionadas++;
      }
    }

    this.#calcularAdjacentes();
    this.minasPosicionadas = true;
  }

  #calcularAdjacentes() {
    for (let l = 0; l < this.linhas; l++) {
      for (let c = 0; c < this.colunas; c++) {
        const celula = this.grade[l][c];
        if (celula.ehMina) continue;

        celula.minasAdjacentes = this.#obterVizinhos(l, c)
          .filter(vizinho => vizinho.ehMina)
          .length;
      }
    }
  }

  #obterVizinhos(linha, coluna) {
    const vizinhos = [];

    for (let dl = -1; dl <= 1; dl++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dl === 0 && dc === 0) continue;

        const nl = linha + dl;
        const nc = coluna + dc;

        const dentroDosLimites =
          nl >= 0 && nl < this.linhas &&
          nc >= 0 && nc < this.colunas;

        if (dentroDosLimites) {
          vizinhos.push(this.grade[nl][nc]);
        }
      }
    }

    return vizinhos;
  }

  revelar(linha, coluna) {
    const celula = this.grade[linha][coluna];

    if (celula.ehRevelada || celula.ehBandeirada) return;

    celula.ehRevelada = true;

    if (!celula.ehMina && celula.minasAdjacentes === 0) {
      this.#obterVizinhos(linha, coluna).forEach(vizinho => {
        if (!vizinho.ehRevelada) {
          this.revelar(vizinho.linha, vizinho.coluna);
        }
      });
    }
  }

  alternarBandeira(linha, coluna) {
    const celula = this.grade[linha][coluna];
    if (celula.ehRevelada) return;

    if(celula.ehBandeirada){
      celula.ehBandeirada = false;
      return;
    }

    let quantidadeBandeiras = 0;

    this.grade.forEach(linha => {
      linha.forEach(c => {
        if(c.ehBandeirada) quantidadeBandeiras ++;
      });
    });

    if(quantidadeBandeiras < this.quantidadeMinas) {
      celula.ehBandeirada = true;
    }
  }

}