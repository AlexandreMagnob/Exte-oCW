class ScrapyOlaClick {
  constructor() {
      this.scrapedData = [];
      this.titleRestaurant = "";
  }

  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async checkRepetition(complementExpandable) { 
    const chooserDiv = complementExpandable.querySelector('div.topping-incrementable.py-2.mb-0');
    
    if(chooserDiv){  
    const plusButton = chooserDiv.querySelector('button.topping-incrementable__btn');    
    plusButton.click(); 
    await this.sleep(200)
    plusButton.click();
    await this.sleep(1000)
    const counter = chooserDiv.querySelector('.topping-incrementable__quantity');
    const counterValue = parseInt(counter.textContent, 10);
    if (counterValue > 1) {
      return "com repeticao";
    }else {
      return "sem repeticao";
    }
    }else {
      return "sem repeticao";
    }

}

        async processTypeComplement(typeComplement, complementExpandable) {
            console.log('typeComplement:', typeComplement);
            const complement = typeComplement.trim();

            let repetition = await this.checkRepetition(complementExpandable);
            let type = "";
            let minQtd = 0;
            let maxQtd = 0;


            
            const matchSelect = complement.match(/^Selecione (\d+) opções/);
            const matchSelectMin = complement.match(/^Selecione o mínimo (\d+) opção/);
            const matchSelectUntil = complement.match(/^Selecione até (\d+) opções/);
            const matchChooseFromTo = complement.match(/^Escolha de (\d+) até (\d+) opções$/);

            if (matchSelect) {
                const itemCount = parseInt(matchSelect[1], 10);
                if (itemCount !== 1) {
                    type = "Mais de uma opcao " + repetition;
                    minQtd = itemCount;
                    maxQtd = itemCount;
                    console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
                }
            } else if (complement === "Selecione 1 opção") {
                type = "Apenas uma opcao ";
                minQtd = 1;
                maxQtd = 1;
            } else if (matchSelectUntil) {
            const maxItems = parseInt(matchSelectUntil[1], 10);
            if (maxItems === 1) {
                type = "Apenas uma opcao " + repetition;
                minQtd = 0;
                maxQtd = maxItems;
                console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
            } else {
                type = "Mais de um opcao " + repetition;
                minQtd = 0;
                maxQtd = maxItems;
                console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
            }
        } else if (matchChooseFromTo) {
                const minItems = parseInt(matchChooseFromTo[1], 10);
                const maxItems = parseInt(matchChooseFromTo[2], 10);
                type = "Mais de uma opcao " + repetition;
                minQtd = minItems;
                maxQtd = maxItems;
                console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
            } else if (matchSelectMin) {
                const minItems = parseInt(matchSelectMin[1], 10);
                const maxItems = parseInt(matchSelectMin[1], 10);
                type = "Apenas uma opcao " + repetition;
                minQtd = minItems;
                maxQtd = maxItems
                console.log('minQtd:', minQtd, 'maxqtd', maxQtd);
            }
            return [type, minQtd, maxQtd];
          }
            
        
      

  async scrollSmoothly(targetY, duration) {
    const startingY = window.scrollY || document.documentElement.scrollTop;
    const difference = targetY - startingY;
    const startTime = new Date().getTime();

    function easeInOutQuad(time, start, change, duration) {
        time /= duration / 2;
        if (time < 1) return change / 2 * time * time + start;
        time--;
        return -change / 2 * (time * (time - 2) - 1) + start;
  }
  return new Promise((resolve) => {
    function animateScroll() {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;

        window.scrollTo(0, easeInOutQuad(elapsed, startingY, difference, duration));

        if (elapsed < duration) {
            requestAnimationFrame(animateScroll);
        } else {
            resolve();
        }
    }

    animateScroll();
});
}

  async scrollToEndAndBack() {
      // Role suavemente até o final da página
      await this.scrollSmoothly(document.body.scrollHeight, 2000); // 2000 ms (2 segundos)

      await this.sleep(1000); // Aguarde um segundo

      // Role suavemente de volta para o topo
      await this.scrollSmoothly(0, 2000); // 2000 ms (2 segundos)

      await this.sleep(1000); // Aguarde um segundo
  }

  async clickProductCards() {
      console.log("executando..")
      await this.sleep(1000);
      await this.scrollToEndAndBack();
      let categoryDivs = document.querySelectorAll('[data-v-294cdcdc=""][data-v-040becfc=""] > [data-v-294cdcdc=""]');

    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        let categoryDivs = document.querySelectorAll('[data-v-294cdcdc=""][data-v-040becfc=""] > [data-v-294cdcdc=""]');
        let categoryDiv = categoryDivs[categoryIndex];
        let h2Element = categoryDiv.querySelector('h2.category.text-truncate-1-line');

        if (h2Element && h2Element.textContent.trim() !== "Procurar Resultados") {
            let title = h2Element.textContent.trim();
            console.log("                                  ")
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log('Título:', title);
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("                                  ")
            let categoryNameElement = categoryDiv.querySelector('h2.category.text-truncate-1-line');
            let categoryName = categoryNameElement ? categoryNameElement.textContent : "";

            // Obtendo todos os cartões de produtos diretamente da categoria
            let productCards = categoryDiv.querySelectorAll('.product-card');
            console.log(productCards);
        
              let productData = [];
 
              for await (const productIndex of [...Array(productCards.length).keys()]) {
                  await this.sleep(1000);
                  let categoryDivs = document.querySelectorAll('[data-v-294cdcdc=""][data-v-040becfc=""] > [data-v-294cdcdc=""]');
                  let categoryDiv = categoryDivs[categoryIndex];
                  let productCards = categoryDiv.querySelectorAll('.product-card');
                  let productCard = productCards[productIndex];

                 // Verificar se o produto está esgotado
                let isOutOfStock = productCard.querySelector('.out-of-stock.product-card__out-of-stock');
                let productNameElement = productCard.querySelector('.product-card__title');
                let productName = productNameElement ? productNameElement.textContent.trim() : "Nome do Produto Indisponível";

                if (isOutOfStock) {
                    console.log("Produto esgotado. Adicionando ao productData. Nome do Produto:", productName);
                } else {
                    // Clicar no produto
                    await this.sleep(500);
                    productCard.scrollIntoView();
                    productCard.click();
                    await this.sleep(1000);
                    await this.openClosedComplementPanels();
                    // Adicionar um atraso antes de coletar os dados.
                    await this.sleep(1000);
                }

                  
            let productModal = document.querySelector('.v-dialog.v-dialog--active.v-dialog--scrollable');
            let titleElement = productModal.querySelector('.font-weight-bold');
            let priceElement = productModal.querySelector('.font-weight-medium.mr-3');
            let imageElement = productModal.querySelector('.v-image__image');
            let imgElement = ""
            if (imageElement && imageElement.style) {
              const backgroundImage = imageElement.style.backgroundImage;
          
              if (backgroundImage) {
                let imageUrl = backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
                imgElement = imageUrl
              }
            }
            
            let descricaoElement = productModal.querySelector('span[data-v-f3708e2c]');
            let productTitle = titleElement ? titleElement.textContent : "";
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')
            let imgSrc = imgElement ? imgElement : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";
    
            let complementsDict = []
            let complementExpandables = document.querySelectorAll('div.v-expansion-panel');
            
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.v-expansion-panel-header.product-expansion-panel__header');

              let optionsComplement = [];
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {

                let typeComplementElement = complementElement.querySelector('.product-expansion-header__category-validation');
                let requiredElement = complementElement.querySelector('span.btn-required.v-chip');
                let complementNameElement = complementElement.querySelector('div.product-expansion-header__category-title');
                
                let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText.trim(), complementExpandable);

                let required = requiredElement ? requiredElement.textContent : "";
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                
                
                // Pegar nome de cada opção do complemento da iteração

                let optionsElement = complementExpandable.querySelectorAll('.v-radio, .v-input,.topping-incrementable');
                
                let optionTitle = "";
                let optionPrice = "0";
                let optionDescription = "";

                for await (const optionElement of optionsElement) {
 
                if (optionElement.classList.contains('v-radio')) {
                  // Se a classe for 'radio', trata como um rádio.
                  let optionTitleElement = optionElement.querySelector('.product-price-radio__label');
                  let optionPriceElement = optionElement.querySelector('.product-price-radio__price');
                  optionTitle = optionTitleElement.textContent.trim();
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace(',', '.');
                  
                    
                  
                  
                }else if (optionElement.classList.contains('v-input')) {
                  // Se a classe for 'checkbox', trata como um checkbox.
                  let optionDivElement = optionElement.querySelector('.topping-checkbox__label');

                  if (optionDivElement) {

                    let optionText = optionDivElement.textContent;
                    let optionParts = optionText.split(/\s*\+\s*/);
                    optionTitle = optionParts[0].trim();
                    optionPrice = optionParts[1] ? optionParts[1].trim().replace(/[^\d,.]/g, '').replace(',', '.') : "0";
                    
                    
                    // Certificar-se de que optionPriceText seja uma string antes de tentar acessar a propriedade textContent
                    
                    
                  } 


                    
                  
                }else if (optionElement.classList.contains('topping-incrementable')) {
                  let optionTitleElement = optionElement.querySelector('.topping-incrementable__label');
                  let optionPriceElement = optionElement.querySelector('.topping-incrementable__price');
                  
                  let optionTitleText = optionTitleElement.textContent.trim();
                  optionTitle = optionTitleText
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace(',', '.');
                  
                  
                }
                
                
                  optionsComplement.push({
                    optionTitle: optionTitle,
                    optionPrice: optionPrice,
                    optionDescription: optionDescription
                  });
                }
                
    
                complementsDict.push({
                  nameComplement: complementName,
                  typeComplement: typeComplement,
                  minQtd: minQtd,
                  maxQtd: maxQtd,
                  required: required,
                  options: optionsComplement
                })
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("NOME DO COMPLEMENTO: ",complementName)
                console.log("TEXTO DO TIPO DO COMPLEMENTO: ",typeComplementText.trim())
                console.log("TIPO DO COMPLEMENT: ",typeComplement)
                console.log("QUANTIDADE MIN: ",minQtd)
                console.log("QUANTIDADE MAX: ",maxQtd)
                console.log("REQUERED: ",required)
                console.log("OPÇOES: ",optionsComplement)
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("                                  ")
              }
            }
    
            productData.push({
              title: productTitle,
              price: productPrice,
              imgSrc: imgSrc,
              descricao: productDescricao,
              complementsDict: complementsDict
            });
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("NOME PRODUTO: ", productTitle)
            console.log("PREÇO PRODUTO: ", productPrice)
            console.log("IMAGEM: ", imgSrc)
            console.log("DESCRIÇAO: ", productDescricao)
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("                                  ")
            await this.backPage();
            
          }
        
                  
              
              this.scrapedData.push({
                  categoryName: categoryName,
                  productsCategory: productData
              });
        }
              //  await this.backPage();
          
      }
      //alert("Finalizado!")
  }

  async backPage() {
        console.log("Voltou!")
        await this.sleep(1000);
        let productModal = document.querySelector('.v-dialog.v-dialog--active.v-dialog--scrollable');
        let back = productModal.querySelector('button.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default')
        if (back) {
          back.click()
      }
        await this.sleep(1000);
  }

  async openClosedComplementPanels() {
    // Seletor do modal
    let productModal = document.querySelector('.v-dialog.v-dialog--active.v-dialog--scrollable');
  
    if (productModal) {
      // Encontrar todos os painéis de complemento dentro do modal
      let complementPanels = productModal.querySelectorAll('.v-expansion-panel.product-expansion-panel');
  
      // Iterar sobre os painéis
      complementPanels.forEach((panel) => {
        // Verificar se o painel está fechado
        let isClosed = !panel.getAttribute('aria-expanded') || panel.getAttribute('aria-expanded') === 'false';
  
        if (isClosed) {
          // Encontrar o botão dentro do painel fechado e clicar nele
          let closeButton = panel.querySelector('.v-expansion-panel-header.product-expansion-panel__header');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    }
  }

  
  
}