// === Aguarda o carregamento completo do DOM ===
document.addEventListener('DOMContentLoaded', function() {
    // === PEGA O BOTÃO ===
    const botao = document.getElementById('botaoIniciar');

    // === VERIFICA SE O BOTÃO EXISTE ===
    if (!botao) {
        console.error('❌ Botão "Iniciar" não encontrado!');
        return;
    }

    // === FUNÇÃO QUE INICIA A AVENTURA ===
    function iniciarAventura() {
        // Efeito visual de clique (feedback)
        botao.style.transform = 'scale(0.92)';
        botao.style.boxShadow = '0 4px 12px rgba(180,40,80,0.6)';
        
        setTimeout(() => {
            botao.style.transform = '';
            botao.style.boxShadow = '';
        }, 200);

        // Animação de saída da capa
        const cover = document.querySelector('.cover');
        if (cover) {
            cover.style.transition = 'opacity 0.5s, transform 0.5s';
            cover.style.opacity = '0';
            cover.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                // REDIRECIONA PARA A PÁGINA DA HISTÓRIA
                window.location.href = 'historia.html';
            }, 500);
        } else {
            // Fallback: redireciona imediatamente
            window.location.href = 'historia.html';
        }

        console.log('🌸 Aventura iniciada! Redirecionando para a história...');
    }

    // === ADICIONA O EVENTO DE CLIQUE ===
    botao.addEventListener('click', iniciarAventura);

    // === EFEITO EXTRA: PREVIEW AO PASSAR O MOUSE ===
    botao.addEventListener('mouseenter', function() {
        this.style.transition = '0.15s';
    });

    // === MENSAGEM NO CONSOLE ===
    console.log('🌷 Capa da Aventura Rosa carregada! Clique em "Iniciar" para começar.');
});
// ============================================
// DADOS DA HISTÓRIA (Estrutura de escolhas)
// ============================================
const historia = {
    1: {
        titulo: "O Caminho das Pétalas",
        descricao: "Você segue o caminho de pétalas rosas e encontra uma fada que oferece um desejo. O que você pede?",
        emoji: "🧚‍♀️",
        opcoes: [
            { texto: "💫 Pedir sabedoria", proximo: 2 },
            { texto: "❤️ Pedir amor verdadeiro", proximo: 3 },
            { texto: "🌟 Pedir uma aventura emocionante", proximo: 4 }
        ]
    },
    2: {
        titulo: "O Dom da Sabedoria",
        descricao: "A fada concede a você sabedoria infinita. Você vê o mundo com novos olhos e descobre segredos antigos. A floresta se abre para você!",
        emoji: "📚",
        opcoes: [
            { texto: "🌿 Explorar a floresta secreta", proximo: 5 },
            { texto: "🏰 Voltar para o castelo", proximo: 6 }
        ]
    },
    3: {
        titulo: "O Amor Verdadeiro",
        descricao: "Seu coração se enche de amor. Você atrai pessoas boas e descobre que o verdadeiro amor está em todos os lugares. Uma borboleta rara pousa em sua mão.",
        emoji: "💕",
        opcoes: [
            { texto: "🦋 Seguir a borboleta", proximo: 5 },
            { texto: "🌸 Plantar um jardim do amor", proximo: 6 }
        ]
    },
    4: {
        titulo: "A Aventura Emocionante",
        descricao: "Você é transportado para uma terra mágica cheia de criaturas fantásticas. Um dragão amigável aparece e oferece carona!",
        emoji: "🐉",
        opcoes: [
            { texto: "🐉 Montar no dragão", proximo: 5 },
            { texto: "🗡️ Explorar a caverna", proximo: 6 }
        ]
    },
    5: {
        titulo: "O Grande Final",
        descricao: "Parabéns! Você completou sua jornada com sucesso. O mundo rosa se alegra com sua coragem e sabedoria. Você é um herói lendário!",
        emoji: "👑",
        opcoes: [
            { texto: "🔄 Recomeçar a aventura", proximo: 1 },
            { texto: "🏠 Voltar para o início", proximo: "fim" }
        ]
    },
    6: {
        titulo: "Um Novo Começo",
        descricao: "Sua escolha o levou a um lugar tranquilo e belo. Você encontra paz e descobre que a verdadeira magia está dentro de você.",
        emoji: "🌅",
        opcoes: [
            { texto: "🔄 Recomeçar a aventura", proximo: 1 },
            { texto: "🏠 Voltar para o início", proximo: "fim" }
        ]
    }
};

// ============================================
// ESTADO DO JOGO
// ============================================
let cenaAtual = 1;
let contadorEscolhas = 0;
let historico = [];

// ============================================
// ELEMENTOS DO DOM
// ============================================
const tituloCena = document.getElementById('tituloCena');
const descricaoCena = document.getElementById('descricaoCena');
const emojiCena = document.querySelector('.emoji-cena');
const opcoesContainer = document.getElementById('opcoesContainer');
const feedbackContainer = document.getElementById('feedbackContainer');
const feedbackTexto = document.getElementById('feedbackTexto');
const feedbackEmoji = document.getElementById('feedbackEmoji');
const btnContinuar = document.getElementById('btnContinuar');
const passoAtual = document.getElementById('passoAtual');
const progressoBarra = document.getElementById('progressoBarra');
const contadorEscolhasSpan = document.getElementById('contadorEscolhas');
const btnVoltar = document.getElementById('btnVoltar');

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

// Função para carregar uma cena
function carregarCena(id) {
    // Se for "fim", volta para a capa
    if (id === "fim") {
        window.location.href = 'index.html';
        return;
    }

    const cena = historia[id];
    if (!cena) {
        console.error('Cena não encontrada!');
        return;
    }

    // Atualiza o conteúdo
    tituloCena.textContent = cena.titulo;
    descricaoCena.textContent = cena.descricao;
    emojiCena.textContent = cena.emoji;

    // Atualiza as opções
    opcoesContainer.innerHTML = '';
    cena.opcoes.forEach((opcao, index) => {
        const btn = document.createElement('button');
        btn.className = 'opcao-btn';
        btn.textContent = opcao.texto;
        btn.dataset.proximo = opcao.proximo;
        btn.addEventListener('click', () => fazerEscolha(opcao.proximo, opcao.texto));
        opcoesContainer.appendChild(btn);
    });

    // Atualiza progresso
    const totalCenas = Object.keys(historia).length;
    const progresso = (id / totalCenas) * 100;
    progressoBarra.style.width = Math.min(progresso, 100) + '%';
    passoAtual.textContent = `Passo ${id} de ${totalCenas}`;

    // Atualiza contador
    contadorEscolhasSpan.textContent = `Escolhas: ${contadorEscolhas}`;

    // Esconde feedback
    feedbackContainer.style.display = 'none';
    opcoesContainer.style.display = 'flex';

    // Animação de entrada
    const cenaElement = document.querySelector('.cena');
    cenaElement.style.animation = 'none';
    setTimeout(() => {
        cenaElement.style.animation = 'fadeInUp 0.5s ease';
    }, 10);

    cenaAtual = id;
}

// Função para fazer uma escolha
function fazerEscolha(proximoId, textoEscolha) {
    // Mostra feedback
    contadorEscolhas++;
    const feedbacks = [
        "✨ Que escolha mágica!",
        "🌸 O destino se revela...",
        "🌟 Uma decisão corajosa!",
        "💫 O universo responde...",
        "🌺 A magia floresce!",
        "🦋 Uma nova porta se abre..."
    ];
    const emojis = ['🌟', '✨', '🌸', '💫', '🌺', '🦋', '💖', '🌈'];
    
    const feedbackRandom = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    const emojiRandom = emojis[Math.floor(Math.random() * emojis.length)];
    
    feedbackTexto.textContent = `${feedbackRandom} Você escolheu: "${textoEscolha}"`;
    feedbackEmoji.textContent = emojiRandom;
    
    // Esconde opções e mostra feedback
    opcoesContainer.style.display = 'none';
    feedbackContainer.style.display = 'block';
    
    // Salva no histórico
    historico.push({
        cena: cenaAtual,
        escolha: textoEscolha,
        proximo: proximoId
    });

    // Configura o botão continuar
    btnContinuar.onclick = function() {
        feedbackContainer.style.display = 'none';
        opcoesContainer.style.display = 'flex';
        carregarCena(proximoId);
    };

    // Efeito visual no feedback
    feedbackContainer.style.animation = 'none';
    setTimeout(() => {
        feedbackContainer.style.animation = 'fadeInUp 0.5s ease';
    }, 10);

    // Atualiza contador
    contadorEscolhasSpan.textContent = `Escolhas: ${contadorEscolhas}`;

    // Efeito de confete (simples)
    criarConfete();
}

// ============================================
// EFEITOS VISUAIS
// ============================================

// Função para criar confetes simples
function criarConfete() {
    const cores = ['#ff6b8a', '#ff8da1', '#ffb3c6', '#ffd1dc', '#ff4d6d'];
    for (let i = 0; i < 12; i++) {
        const confete = document.createElement('div');
        confete.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${Math.random() * 100}vw;
            top: -10px;
            pointer-events: none;
            z-index: 9999;
            animation: confeteFall ${2 + Math.random() * 2}s linear forwards;
        `;
        document.body.appendChild(confete);
        
        // Remove após a animação
        setTimeout(() => {
            confete.remove();
        }, 4000);
    }
}

// Adiciona a animação de confete no CSS
const styleConfete = document.createElement('style');
styleConfete.textContent = `
    @keyframes confeteFall {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleConfete);

// ============================================
// EVENTOS E INICIALIZAÇÃO
// ============================================

// Botão voltar
btnVoltar.addEventListener('click', function() {
    if (confirm('🌸 Tem certeza que quer voltar? Sua aventura será perdida.')) {
        window.location.href = 'index.html';
    }
});

// Inicializa a história
carregarCena(1);

// ============================================
// ATALHOS DE TECLADO (acessibilidade)
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && feedbackContainer.style.display !== 'none') {
        btnContinuar.click();
    }
    if (e.key === 'Escape') {
        btnVoltar.click();
    }
});

console.log('🌸 Aventura Rosa carregada! Boa sorte, aventureiro(a)!');
console.log('💡 Dica: Use Enter para continuar e ESC para voltar.');