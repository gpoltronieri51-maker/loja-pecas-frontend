// Troque pela URL do seu backend publicado (ex: Render) antes de colocar no ar
const API_URL = 'https://loja-pecas-backend.onrender.com';

function pegarToken() { return localStorage.getItem('token'); }
function pegarUsuario() {
  const dados = localStorage.getItem('usuario');
  return dados ? JSON.parse(dados) : null;
}
function salvarSessao(usuario, token) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  localStorage.setItem('token', token);
}
function sair() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

async function api(caminho, opcoes = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  const token = pegarToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Erro na requisição');
  return dados;
}

// ----- Carrinho (guardado no navegador do cliente) -----
function pegarCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho') || '[]');
}
function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}
function adicionarAoCarrinho(produto, quantidade = 1) {
  const carrinho = pegarCarrinho();
  const existente = carrinho.find(i => i.produto_id === produto.id);
  if (existente) existente.quantidade += quantidade;
  else carrinho.push({ produto_id: produto.id, titulo: produto.titulo, preco: Number(produto.preco), imagem_url: produto.imagem_url, quantidade });
  salvarCarrinho(carrinho);
}
function removerDoCarrinho(produtoId) {
  salvarCarrinho(pegarCarrinho().filter(i => i.produto_id !== produtoId));
}
function atualizarContadorCarrinho() {
  const el = document.getElementById('contador-carrinho');
  if (el) el.textContent = pegarCarrinho().reduce((s, i) => s + i.quantidade, 0);
}
document.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);
