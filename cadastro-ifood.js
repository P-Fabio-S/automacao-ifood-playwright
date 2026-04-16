const { chromium } = require('playwright');
const XLSX = require('xlsx');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages.find(p => p.url().includes('ifood.com.br')) || pages[pages.length - 1];

  console.log("🚀 Versão Blindada Mult-Itens: Triplo Clique em todos os campos de valor.");

  const workbook = XLSX.readFile('salgadas.xlsx');
  const sheet = workbook.Sheets["Salgadas"];
  const dados = XLSX.utils.sheet_to_json(sheet);

  for (const [index, linha] of dados.entries()) {
    const sabor = linha["Sabor"];
    if (!sabor) continue;

    const descricao = String(linha["Descrição dos Ingredientes"] || "");
    const precoBroto = String(linha["Broto (iFood)"] || "").replace(/\D/g, '');
    const precoGrande = String(linha["Grande (iFood)"] || "").replace(/\D/g, '');
    const codigoBroto = String(linha["Código BROTO (Ímpar)"] || "");
    const codigoGrande = String(linha["Código GRANDE (Par)"] || "");

    console.log(`\n📦 [Item ${index + 1}] Cadastrando: ${sabor}`);

    try {
      // --- PASSO 1: ABRIR ---
      await page.locator('button').filter({ hasText: 'Adicionar sabor' }).first().click();
      await page.waitForTimeout(6000); // Tempo extra para o modal carregar do zero

      // --- PASSO 2: NOME E DESCRIÇÃO ---
      await page.locator('input[name="name"]').fill(sabor);
      await page.waitForTimeout(2000);
      const campoDesc = page.locator('#description');
      await campoDesc.click();
      await campoDesc.fill(descricao);
      await page.waitForTimeout(3000);

      await page.locator('[data-testid="page-next-button"]').click();
      await page.waitForTimeout(8000);

      // --- PASSO 3: BROTO (PREÇO E PDV) ---
      console.log("💰 Preenchendo Broto...");
      const inputBroto = page.locator('input[name="size-0.price"]');
      await inputBroto.scrollIntoViewIfNeeded();
      // TRIPLO CLIQUE: Seleciona apenas o texto do campo, sem risco de tela azul
      await inputBroto.click({ clickCount: 3, delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);
      await page.keyboard.type(precoBroto, { delay: 120 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);

      console.log("🔢 Código PDV Broto...");
      const pdvBroto = page.locator('input[label="Código PDV"]').first();
      await pdvBroto.click({ clickCount: 3, delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Backspace');
      await page.keyboard.type(codigoBroto, { delay: 100 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(2000);

      // --- PASSO 4: GRANDE (PREÇO E PDV) ---
      console.log("💰 Preenchendo Grande...");
      const inputGrande = page.locator('input[name="size-1.price"]');
      await inputGrande.scrollIntoViewIfNeeded();
      await inputGrande.click({ clickCount: 3, delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);
      await page.keyboard.type(precoGrande, { delay: 120 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);

      console.log("🔢 Código PDV Grande...");
      const pdvGrande = page.locator('input[label="Código PDV"]').last();
      await pdvGrande.click({ clickCount: 3, delay: 100 });
      await page.waitForTimeout(1000);
      await page.keyboard.press('Backspace');
      await page.keyboard.type(codigoGrande, { delay: 100 });
      await page.keyboard.press('Tab');
      await page.waitForTimeout(5000);

      // --- PASSO 5: FINALIZAR ---
      await page.locator('[data-testid="page-submit-button"]').click();
      console.log(`✅ ${sabor} Finalizado!`);
      
      // ESPERA CRÍTICA: Aguarda o modal sumir e o botão de adicionar reaparecer
      console.log("⏳ Aguardando limpeza de cache do portal...");
      await page.waitForTimeout(12000); 

    } catch (erro) {
      console.log(`❌ Erro no item ${sabor}: ${erro.message}`);
      await page.pause(); // Para você ver onde travou
    }
  }
  console.log("🏁 Todos os itens foram processados!");
})();