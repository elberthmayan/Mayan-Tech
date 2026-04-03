// Tabela de Preços Atualizada para DOCERIA
const tabelaPrecos = {
    'Bolo de Pote Ninho c/ Nutella': 15.00,
    'Bolo de Pote Cenoura c/ Chocolate': 12.00,
    'Bolo de Pote Red Velvet': 14.00,
    'Copo da Felicidade Morango': 22.00,
    'Copo da Felicidade Brownie': 25.00,
    'Fatia Torta de Limão': 13.00,
    'Caixa 4 Brigadeiros Gourmet': 12.00,
    'Combo Parabéns': 119.90,
    
    // Acréscimos
    'Adicional Morango': 3.00,
    'Adicional Nutella': 4.50,
    'Adicional Kinder Bueno': 4.00,
    'Adicional Gotas de Chocolate': 2.50,
    
    // Bebidas
    'Água s/gás': 3.00,
    'Água c/gás': 3.50,
    'Coca-Cola Lata': 6.00,
    'Guaraná Lata': 6.00,
    'Suco Natural Laranja': 7.00
};

let carrinho = [];
let itemSendoMontado = { lanche: '', acrescimos: [], bebidas: [] };
let tipoEntrega = 'Entrega'; 

// Funções de Alertas e Erros mantidas iguais...
function mostrarAlerta(mensagem) {
    const modal = document.getElementById('custom-alert');
    document.getElementById('custom-alert-message').innerText = mensagem;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); document.getElementById('custom-alert-box').classList.remove('scale-95'); document.getElementById('custom-alert-box').classList.add('scale-100'); }, 10);
}

function fecharAlerta() {
    const modal = document.getElementById('custom-alert');
    modal.classList.add('opacity-0');
    document.getElementById('custom-alert-box').classList.remove('scale-100');
    document.getElementById('custom-alert-box').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300); 
}

function limparErros() {
    ['nome', 'rua', 'numero', 'bairro'].forEach(campo => {
        const input = document.getElementById(`input-${campo}`);
        if(input) input.classList.remove('border-red-500');
        const erro = document.getElementById(`erro-${campo}`);
        if(erro) erro.classList.add('hidden');
    });
}

function mostrarErro(campo, mensagem) {
    const input = document.getElementById(`input-${campo}`);
    if(input) input.classList.add('border-red-500');
    const erro = document.getElementById(`erro-${campo}`);
    if(erro) { erro.innerText = mensagem; erro.classList.remove('hidden'); }
}

// Carrinho
function iniciarPedido(nomeLanche) {
    itemSendoMontado = { lanche: nomeLanche, acrescimos: [], bebidas: [] };
    document.getElementById('nome-lanche-display').innerText = nomeLanche;
    document.querySelectorAll('.bebida-checkbox, .acrescimo-checkbox').forEach(cb => cb.checked = false);
    abrirGaveta();
    mostrarTelaAcompanhamentos();
}

function adicionarAoCarrinho() {
    itemSendoMontado.bebidas = Array.from(document.querySelectorAll('.bebida-checkbox:checked')).map(cb => cb.value);
    itemSendoMontado.acrescimos = Array.from(document.querySelectorAll('.acrescimo-checkbox:checked')).map(cb => cb.value);
    
    let valorItem = tabelaPrecos[itemSendoMontado.lanche] || 0;
    itemSendoMontado.acrescimos.forEach(item => valorItem += tabelaPrecos[item] || 0);
    itemSendoMontado.bebidas.forEach(item => valorItem += tabelaPrecos[item] || 0);
    
    itemSendoMontado.valorTotal = valorItem;
    carrinho.push(JSON.parse(JSON.stringify(itemSendoMontado))); 
    
    atualizarBotaoFlutuante();
    mostrarTelaCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarBotaoFlutuante();
    carrinho.length === 0 ? fecharGaveta() : mostrarTelaCarrinho(); 
}

function calcularTotalGeral() {
    return carrinho.reduce((total, item) => total + item.valorTotal, 0);
}

function atualizarBotaoFlutuante() {
    const btnFlutuante = document.getElementById('btn-floating-cart');
    if (carrinho.length > 0) {
        btnFlutuante.classList.remove('hidden');
        document.getElementById('floating-cart-count').innerText = carrinho.length;
        document.getElementById('floating-cart-total').innerText = calcularTotalGeral().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        btnFlutuante.classList.add('hidden');
    }
}

function renderizarListaCarrinho() {
    const listaContainer = document.getElementById('lista-carrinho');
    listaContainer.innerHTML = '';

    carrinho.forEach((item, index) => {
        let detalhes = '';
        if(item.acrescimos.length > 0) detalhes += `<p class="text-xs text-sweet-pinkHover">+ ${item.acrescimos.join(', ')}</p>`;
        if(item.bebidas.length > 0) detalhes += `<p class="text-xs text-sweet-pink">+ ${item.bebidas.join(', ')}</p>`;

        listaContainer.innerHTML += `
            <div class="bg-sweet-bg border border-sweet-border p-4 rounded relative pr-12 mb-2">
                <div class="flex justify-between items-start mb-1">
                    <h4 class="text-sweet-dark font-serif font-bold text-lg">${item.lanche}</h4>
                    <span class="text-sweet-pinkHover font-bold shrink-0 ml-4">${item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                ${detalhes}
                <button onclick="removerDoCarrinho(${index})" class="absolute top-4 right-3 text-gray-400 hover:text-red-500 transition">
                    <i class="ph-bold ph-trash text-xl"></i>
                </button>
            </div>
        `;
    });
    document.getElementById('carrinho-subtotal-texto').innerText = calcularTotalGeral().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Telas e Gaveta
function abrirGaveta() {
    document.getElementById('checkout-overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('checkout-overlay').classList.remove('opacity-0'), 10);
    document.getElementById('checkout-drawer').classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
}

function fecharGaveta() {
    document.getElementById('checkout-drawer').classList.add('translate-x-full');
    document.getElementById('checkout-overlay').classList.add('opacity-0');
    setTimeout(() => document.getElementById('checkout-overlay').classList.add('hidden'), 300); 
    document.body.style.overflow = 'auto'; 
}

function esconderTodasTelas() {
    ['acompanhamentos', 'carrinho', 'endereco'].forEach(step => {
        document.getElementById(`step-${step}`).classList.add('hidden');
        document.getElementById(`footer-${step}`).classList.add('hidden');
    });
}

function mostrarTelaAcompanhamentos() {
    esconderTodasTelas();
    document.getElementById('drawer-title').innerText = "Personalizar Doce";
    document.getElementById('step-acompanhamentos').classList.remove('hidden');
    document.getElementById('footer-acompanhamentos').classList.remove('hidden');
}

function mostrarTelaCarrinho() {
    if(carrinho.length === 0) return fecharGaveta();
    abrirGaveta();
    renderizarListaCarrinho();
    esconderTodasTelas();
    document.getElementById('drawer-title').innerText = "Sua Sacola";
    document.getElementById('step-carrinho').classList.remove('hidden');
    document.getElementById('footer-carrinho').classList.remove('hidden');
}

function avancarParaEndereco() {
    esconderTodasTelas();
    carregarDadosSalvos();
    setTipoEntrega(tipoEntrega);
    document.getElementById('drawer-title').innerText = "Finalizar";
    document.getElementById('step-endereco').classList.remove('hidden');
    document.getElementById('footer-endereco').classList.remove('hidden');
    document.querySelector('#footer-endereco button:last-child').innerHTML = `<i class="ph-light ph-whatsapp text-lg"></i> Enviar Pedido (${calcularTotalGeral().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`;
}

// Endereço e Checkout
function toggleTroco() {
    const divTroco = document.getElementById('div-troco');
    if (document.getElementById('input-pagamento').value === 'Dinheiro') divTroco.classList.remove('hidden');
    else { divTroco.classList.add('hidden'); document.getElementById('input-troco').value = ''; }
}

function carregarDadosSalvos() {
    const dadosSalvos = localStorage.getItem('doceria_dados_cliente');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        if(dados.nome) document.getElementById('input-nome').value = dados.nome;
        if(dados.pagamento) { document.getElementById('input-pagamento').value = dados.pagamento; toggleTroco(); }
        if(dados.cep) document.getElementById('input-cep').value = dados.cep;
        if(dados.rua) document.getElementById('input-rua').value = dados.rua;
        if(dados.numero) document.getElementById('input-numero').value = dados.numero;
        if(dados.bairro) document.getElementById('input-bairro').value = dados.bairro;
        if(dados.referencia) document.getElementById('input-referencia').value = dados.referencia;
    }
}

function setTipoEntrega(tipo) {
    tipoEntrega = tipo;
    const btnEntrega = document.getElementById('btn-entrega');
    const btnRetirada = document.getElementById('btn-retirada');
    if (tipo === 'Entrega') {
        btnEntrega.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase bg-sweet-pink text-white rounded transition";
        btnRetirada.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-sweet-muted hover:bg-gray-100 rounded transition";
        document.getElementById('bloco-endereco').classList.remove('hidden');
    } else {
        btnRetirada.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase bg-sweet-pink text-white rounded transition";
        btnEntrega.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-sweet-muted hover:bg-gray-100 rounded transition";
        document.getElementById('bloco-endereco').classList.add('hidden');
    }
}

async function buscarCEP() {
    const cep = document.getElementById('input-cep').value.replace(/\D/g, ''); 
    if (cep.length === 8) {
        try {
            let data = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();
            if (!data.erro) {
                document.getElementById('input-rua').value = data.logradouro;
                document.getElementById('input-bairro').value = data.bairro;
                document.getElementById('input-numero').focus(); 
            }
        } catch (e) {}
    }
}

// FINALIZAR PEDIDO NO WHATSAPP
function finalizarPedido() {
    limparErros();
    let temErro = false;
    const nome = document.getElementById('input-nome').value.trim();
    const pagamento = document.getElementById('input-pagamento').value;
    const troco = document.getElementById('input-troco').value.trim();
    const rua = document.getElementById('input-rua').value.trim();
    const numero = document.getElementById('input-numero').value.trim();
    const bairro = document.getElementById('input-bairro').value.trim();
    
    if(!nome) { mostrarErro('nome', 'Como devemos te chamar?'); temErro = true; }
    if(tipoEntrega === 'Entrega') {
        if(!rua) { mostrarErro('rua', 'Informe a rua.'); temErro = true; }
        if(!numero) { mostrarErro('numero', 'Informe o número.'); temErro = true; }
        if(!bairro) { mostrarErro('bairro', 'Informe o bairro.'); temErro = true; }
    }
    if(temErro) return;

    localStorage.setItem('doceria_dados_cliente', JSON.stringify({ nome, pagamento, cep: document.getElementById('input-cep').value, rua, numero, bairro, referencia: document.getElementById('input-referencia').value }));

    let mensagem = `*🧁 NOVO PEDIDO - DOCERIA ELEGANCE*\n-----------------------------------\n👤 *Cliente:* ${nome}\n🛵 *Modo:* ${tipoEntrega}\n\n*📝 ITENS DO PEDIDO*\n`;
    
    carrinho.forEach((item) => {
        mensagem += `\n▶ *1x ${item.lanche}*`;
        if(item.acrescimos.length > 0) mensagem += `\n➕ Adicionais: ${item.acrescimos.join(', ')}`;
        if(item.bebidas.length > 0) mensagem += `\n🥤 Bebidas: ${item.bebidas.join(', ')}`;
        mensagem += `\n💵 Subtotal: ${item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    });

    mensagem += `\n*💰 RESUMO DO VALOR*\nTotal dos doces: ${calcularTotalGeral().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    if (tipoEntrega === 'Entrega') mensagem += `🛵 *Taxa de Entrega:* (A calcular pelo endereço)\n`;

    mensagem += `\n*💳 PAGAMENTO*\nForma: ${pagamento}\n`;
    if (pagamento === 'Dinheiro' && troco) mensagem += `💵 *Troco para:* R$ ${troco}\n`;

    if (tipoEntrega === 'Entrega') {
        mensagem += `\n*📍 ENDEREÇO DE ENTREGA*\n${rua}, Nº ${numero}\nBairro: ${bairro}\n`;
        const ref = document.getElementById('input-referencia').value.trim();
        if (ref) mensagem += `Ref: ${ref}\n`;
        mensagem += `🗺️ *Abrir no GPS:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rua}, ${numero} - ${bairro}, Belo Horizonte`)}\n`;
        mensagem += `-----------------------------------\n⚠️ *Aguardo a confirmação e o valor da taxa!*`;
    } else {
        mensagem += `-----------------------------------\n✅ *Irei retirar na loja. Aguardo confirmação!*`;
    }

    document.getElementById('whatsapp-message-content').innerHTML = mensagem.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>') + '<span class="text-[10px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">agora <i class="ph-fill ph-checks text-[#53bdeb] text-sm"></i></span>';
    
    carrinho = [];
    atualizarBotaoFlutuante();
    fecharGaveta();
    abrirWhatsAppSimulado();
}

window.addEventListener('DOMContentLoaded', () => {
    ['nome', 'rua', 'numero', 'bairro'].forEach(c => {
        const i = document.getElementById(`input-${c}`);
        if(i) i.addEventListener('input', () => { i.classList.remove('border-red-500'); document.getElementById(`erro-${c}`).classList.add('hidden'); });
    });
});

function abrirWhatsAppSimulado() { document.getElementById('whatsapp-simulator').classList.remove('hidden'); document.getElementById('whatsapp-simulator').classList.add('flex'); setTimeout(() => { document.getElementById('whatsapp-simulator').classList.remove('opacity-0'); document.getElementById('whatsapp-box').classList.remove('scale-95'); document.getElementById('whatsapp-box').classList.add('scale-100'); }, 10); }
function fecharWhatsAppSimulado() { document.getElementById('whatsapp-simulator').classList.add('opacity-0'); document.getElementById('whatsapp-box').classList.remove('scale-100'); document.getElementById('whatsapp-box').classList.add('scale-95'); setTimeout(() => { document.getElementById('whatsapp-simulator').classList.add('hidden'); document.getElementById('whatsapp-simulator').classList.remove('flex'); }, 300); }