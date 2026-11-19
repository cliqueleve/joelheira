// Preencha somente com dados confirmados. Use null para campos pendentes.
window.produtoCliqueLeve = {
  nome: "",
  descricao: "",
  materiais: "",
  preco: null, // Número em reais. Exemplo: 99.90
  tamanhos: [], // Exemplo de formato: ["P", "M", "G"]
  checkoutUrl: "", // Cole a URL HTTPS oficial do produto.
  // Preencha somente se o checkout documentar um parâmetro para o tamanho.
  checkoutParametroTamanho: "",
  beneficios: [], // Cada item tem as chaves titulo e texto.
  etapas: [], // Cada item tem titulo, texto e, opcionalmente, imagem e alt.
  pagamento: "",
  envio: "",
  devolucao: "",
  suporteUrl: "",
  faq: {
    tamanho: "",
    uso: "",
    atividades: "",
    higiene: "",
    entrega: "",
    suporte: "",
  },
};
