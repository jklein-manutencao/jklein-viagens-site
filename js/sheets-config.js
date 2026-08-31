// ============================================================
// CONFIGURAÇÃO DA PLANILHA (Google Sheets)
// ============================================================
// Depois de criar a planilha e publicar cada aba como CSV
// (Arquivo > Compartilhar > Publicar na Web > escolher a aba > CSV),
// cole aqui o link de cada aba, substituindo o texto entre aspas.
//
// Colunas esperadas em cada aba (primeira linha, sem acento/espaço):
//   nome_do_lugar | frase_curta | nome_da_imagem | link_do_whatsapp
//
// Na aba "home", uma linha com nome_do_lugar = "__HERO__" define a
// foto de fundo do topo (só preencher a coluna nome_da_imagem dela).
//
// Se deixar como "" (vazio), a página volta a usar o arquivo
// content/<pagina>.json normalmente (não quebra nada).
// ============================================================

var SHEET_ID = "17YVeqHM66vWc_V9c9zYjM9X37Oxji0A_nEejzknDTwo";

function sheetCsvUrl(nomeDaAba) {
  return "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(nomeDaAba);
}

var SHEET_CSV_URLS = {
  home: sheetCsvUrl("home"),
  internacional: sheetCsvUrl("internacional"),
  nacional: sheetCsvUrl("nacional"),
  cruzeiros: sheetCsvUrl("cruzeiros"),
  passagens: sheetCsvUrl("passagens"),
  ofertas: sheetCsvUrl("ofertas")
};
