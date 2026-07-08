import './style.css';
import './componentes/cabecalho.js';
import './componentes/tabuleiro-jogo.js';

document.querySelector('#app').innerHTML = `
  <main>
    <div id="container">
      <cabecalho-jogo></cabecalho-jogo>
      <tabuleiro-jogo></tabuleiro-jogo>
    </div>
  </main>
`;

const cabecalho = document.querySelector('cabecalho-jogo');
const tabuleiro = document.querySelector('tabuleiro-jogo');

cabecalho.definirMinas(10);

tabuleiro.addEventListener('jogo-iniciar', () => cabecalho.iniciarCronometro());
tabuleiro.addEventListener('bandeiras-alteradas', (e) => cabecalho.atualizarBandeiras(e.detail.quantidadeBandeiradas));
tabuleiro.addEventListener('jogo-encerrado', (e) => {
  cabecalho.pararCronometro();
  alert(e.detail.ganhou ? 'Você venceu!' : 'Você perdeu!');
});

cabecalho.addEventListener('reiniciar-jogo', () => {
  cabecalho.reiniciar();
  tabuleiro.reiniciar();
});
