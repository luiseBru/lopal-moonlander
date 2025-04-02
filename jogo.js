// Moonlander. Um jogo de alunissagem
// Bruna Luise https://github.com/luiseBru)
// 28/03/20 mostrar o combustível como porcentagem25
// Versão 0.1.0
/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let moduloLunar = {
    posicao: {
        x: canvas.width / 2, 
        y: canvas.height / 2,
    },
    angulo: -Math.PI / 2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: 2,
        y: 0
    },
    combustivel: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
};
let estrelas = [];
for( let i = 0; i < 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.wigth,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2 ),
        transparencia: 1.0,
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
    };
}

const COMBUSTIVEL_MAXIMO = 1000;


function desenharModuloLunar() {
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorLigado) {
        desenharChama();
    }

    contexto.restore();
}

function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 80); 
    contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}


function mostrarCombustivel() {
    let combustivelPorcentagem = (moduloLunar.combustivel / COMBUSTIVEL_MAXIMO) * 100;
    return `Combustível: ${combustivelPorcentagem.toFixed(0)}%`;
}

function mostrarAltitude() {
    let altitude = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(0)} px`;
    return altitude;
}

function mostrarInformacoes() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    
    let velocidadeY = `Velocidade Y: ${(10 * moduloLunar.velocidade.y).toFixed(2)}`;
    contexto.fillText(velocidadeY, 10, 20);  

    let velocidadeX = `Velocidade X: ${(10 * moduloLunar.velocidade.x).toFixed(2)}`;
    contexto.fillText(velocidadeX, 10, 50); 

    let anguloGraus = `Ângulo: ${(moduloLunar.angulo * 180 / Math.PI).toFixed(2)}°`;
    contexto.fillText(anguloGraus, 10, 80);  

    contexto.fillText(mostrarCombustivel(), 10, 110); 

    contexto.fillText(mostrarAltitude(), 10, 140);  
}
function desenharEstrelas(){
    for ( let i; i < estrelas.length, i++ ){
        let estrelas = [i];
        contexto.beginPath();
        contexto.arc(estrelas.x, estrelas.y, estrelas.raio, 0, 2 * Math.PI);
        contexto.closePath()
        contexto.fillStile =- "rgba(255, 255, 255, " + estrelas.transparencia + ")";
        contexto.fill();
        contexto.restore()
    }
}

function mostrarMorte() {
    contexto.font = "bold 30px Arial";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "red";
    contexto.fillText("VOCE MORREU", canvas.width / 2, canvas.height / 2);
}

function mostrarPousoConcluido() {
    contexto.font = "bold 30px Arial";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "green";
    contexto.fillText("POUSO CONCLUIDO", canvas.width / 2, canvas.height / 2);
}
function atracaoGravitacional() {
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;

    if (moduloLunar.rotacaoAntiHorario) {
        moduloLunar.angulo += Math.PI / 180; 
    } else if (moduloLunar.rotacaoHorario) {
        moduloLunar.angulo -= Math.PI / 180; 
    }

    if (moduloLunar.motorLigado && moduloLunar.combustivel > 0) {
        moduloLunar.velocidade.x += 0.02 * Math.sin(moduloLunar.angulo);
        moduloLunar.velocidade.y -= 0.02 * Math.cos(moduloLunar.angulo);
        moduloLunar.combustivel -= 0.5; 
    }

    moduloLunar.velocidade.y += 0.01;

    if (moduloLunar.posicao.y < 10) {
        moduloLunar.posicao.y = 10;
        moduloLunar.velocidade.y = 0;
    }
}

function desenhar() {
   
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    atracaoGravitacional();

    desenharModuloLunar();

    mostrarInformacoes();

    
    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {
        if (moduloLunar.velocidade.y >= 5) {
            mostrarMorte(); // Mostrar "VOCE MORREU" se a velocidade for maior que 5
            return;
        } else {
            
            moduloLunar.posicao.y = canvas.height - 0.5 * moduloLunar.altura;
            moduloLunar.velocidade.y = 0;  

            if (Math.abs(moduloLunar.velocidade.y) <= 5) {
                mostrarPousoConcluido();  // Mostrar "POUSO CONCLUIDO" se a velocidade for menor ou igual a 5
            }
        }
    }

    requestAnimationFrame(desenhar);
}


document.addEventListener("keydown", teclaPressionada);
document.addEventListener("keyup", teclaSolta);


function teclaPressionada(evento) {
    if (evento.keyCode == 38 && moduloLunar.combustivel > 0) {
        moduloLunar.motorLigado = true; 
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoAntiHorario = true; 
    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoHorario = true;
    }
}


function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false; 
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoAntiHorario = false; 
        moduloLunar.rotacaoHorario = false; 
    }
}


desenhar();
