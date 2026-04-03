// ==========================================
// SISTEMA DE AGENDAMENTO VIA WHATSAPP
// ==========================================
let agendamentoAtual = {
    servico: '',
    preco: ''
};

// Abre a gaveta lateral
function iniciarAgendamento(servico, preco) {
    agendamentoAtual.servico = servico;
    agendamentoAtual.preco = preco;
    
    document.getElementById('servico-display').innerText = servico;
    document.getElementById('preco-display').innerText = preco;
    
    // Limpa os campos
    document.getElementById('input-nome').value = '';
    document.getElementById('input-data').value = '';
    document.getElementById('input-hora').value = '';
    
    const overlay = document.getElementById('checkout-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);

    const drawer = document.getElementById('checkout-drawer');
    drawer.classList.remove('translate-x-full');
    
    document.body.style.overflow = 'hidden';
}

function fecharAgendamento() {
    const drawer = document.getElementById('checkout-drawer');
    drawer.classList.add('translate-x-full');
    
    const overlay = document.getElementById('checkout-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300); 
    
    document.body.style.overflow = 'auto'; 
}

// Monta a mensagem e envia para o Zap
function finalizarAgendamento() {
    const nome = document.getElementById('input-nome').value;
    const profissional = document.getElementById('select-profissional').value;
    const data = document.getElementById('input-data').value;
    const hora = document.getElementById('input-hora').value;
    const pagamento = document.getElementById('select-pagamento').value;

    if(!nome || !data || !hora) {
        alert('Por favor, preencha seu Nome, a Data e o Horário desejado!');
        return;
    }

    // Formata a data de YYYY-MM-DD para DD/MM/YYYY
    const dataFormatada = data.split('-').reverse().join('/');

    // SEU NÚMERO AQUI
    const numeroWhatsapp = "5531987953562"; 
    
    // MENSAGEM DIRETA E ENXUTA
    let mensagem = `💈 *NOVO AGENDAMENTO* 💈\n\n`;
    mensagem += `👤 *Cliente:* ${nome}\n`;
    mensagem += `✂️ *Serviço:* ${agendamentoAtual.servico} (${agendamentoAtual.preco})\n`;
    mensagem += `💈 *Profissional:* ${profissional}\n`;
    mensagem += `📅 *Data:* ${dataFormatada}\n`;
    mensagem += `⏰ *Horário:* ${hora}\n`;
    mensagem += `💳 *Pagamento:* ${pagamento}`;

    const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    
    fecharAgendamento();
}

// Efeito de sombra na Navbar ao rolar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'shadow-black/50');
    } else {
        navbar.classList.remove('shadow-lg', 'shadow-black/50');
    }
});

// ==========================================
// SISTEMA DE HORÁRIO DE FUNCIONAMENTO
// ==========================================
function verificarStatusBarbearia() {
    const agora = new Date();
    const diaSemana = agora.getDay(); 
    const horaAtual = agora.getHours() + (agora.getMinutes() / 60);
    
    let barbeariaAberta = false;
    let textoAbertura = "";

    // Regra: Segunda a Sábado (1 a 6) das 09:00 às 20:00 (20.0)
    if (diaSemana >= 1 && diaSemana <= 6) {
        if (horaAtual >= 9.0 && horaAtual < 20.0) {
            barbeariaAberta = true;
        } else if (horaAtual < 9.0) {
            textoAbertura = "Abre hoje às 09:00h";
        } else { // Passou das 20h
            if (diaSemana === 6) { // Sábado a noite
                textoAbertura = "Abre segunda às 09:00h";
            } else {
                textoAbertura = "Abre amanhã às 09:00h";
            }
        }
    } 
    // Regra: Domingo (0) - Fechado
    else if (diaSemana === 0) {
        textoAbertura = "Abre amanhã às 09:00h";
    }

    const statusDiv = document.getElementById('status-loja');
    if (statusDiv) {
        if (barbeariaAberta) {
            statusDiv.innerHTML = `
                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs tracking-widest uppercase font-semibold">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Aberto Agora
                </span>
            `;
        } else {
            statusDiv.innerHTML = `
                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs tracking-widest uppercase font-semibold">
                    <span class="w-2 h-2 rounded-full bg-red-500"></span>
                    Fechado • ${textoAbertura}
                </span>
            `;
        }
    }
}

window.addEventListener('DOMContentLoaded', verificarStatusBarbearia);
setInterval(verificarStatusBarbearia, 60000);