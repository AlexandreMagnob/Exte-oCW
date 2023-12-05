
class ScrapyDino {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
    async checkRepetition(complementExpandable){
        
        return repetition
    }


    async processTypeComplement(complementExpandable) {
      
        var typeOption = complementExpandable.querySelector('.sc-fLlhyt.cNWLEt.sc-ecbf8c8a-0');
        var typeText = typeOption ? typeOption.textContent.trim() : "";
        var minQtd, maxtd
        var required = complementExpandable.querySelector('.sc-fLlhyt.cNWLEt.sc-ecbf8c8a-0.sc-2815c808-5');
      
        var regex = /(\d+)\s+de\s+(\d+)/;
        var match = typeText.match(regex);
        var type
        var repetition = 

        // Atribua os valores a minQtd e maxQtd, ou 0 se não houver correspondência
        minQtd = match ? parseInt(match[1], 10) : 0;
        maxQtd = match ? parseInt(match[2], 10) : 0;
      
        // Verifique se 'required' existe e tem o texto "Obrigatório"
        if (required && required.textContent.trim() === "Obrigatório") {
          minQtd = 1;
        }
      
        console.log({ minQtd, maxQtd });

        if(maxtd>1){
            type = "Mais de uma opcao" + repetition
        }
        else{
            type = "Apenas uma opcao"
        }

        return [minQtd, maxQtd]
      }
  
      async extractPrice(priceText) {
        if (priceText.toLowerCase().includes('a partir de')) {
          return 0; // Retorna 0 se a expressão for encontrada
        } else {
          let price = parseFloat(priceText.match(/[\d,]+/)[0].replace(',', '.'));
      
          return price;
        }
      }
  
    async clickProductCards() {
  
      this.titleRestaurant = (document.title || {}).textContent || '';
  
      console.log("executando..")
      await this.sleep(500)
      let categoryDivs = document.querySelectorAll('.sc-7aaae754-1')
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.sc-7aaae754-1')
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.sc-gKXOVf')
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
    
        //Expande a categoria de produtos
        await this.expandCategory(categoryDiv)
  
        let productCards = categoryDiv.querySelectorAll('.sc-de312e94-3');
  
        console.log(categoryName)
        console.log(productCards.length)
  
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(500)
          let categoryDivs = document.querySelectorAll('.sc-7aaae754-1')
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll('.sc-de312e94-3');
          let productCard = productCards[productIndex];
          
          console.log({productIndex, productCard})
  
            let priceElement = productCard.querySelector('.sc-fLlhyt.bNJFxQ');
          
            productCard.scrollIntoView();
            await this.sleep(500)
            productCard.click();
              
              // Agora, vamos adicionar um atraso antes de coletar os dados.
            await this.sleep(1000)
            let productModal = document.querySelector('.sc-himrzO');
            let titleElement = productModal.querySelector('.sc-gKXOVf.itJyZm');
            console.log(titleElement)
            let imgElement = productModal.querySelector('.sc-29a74f8b-8');
            let descricaoElement = productModal.querySelector('.sc-fLlhyt.isejHB')
            let productTitle = titleElement ? titleElement.textContent : "";
            console.log(productTitle)
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = await this.extractPrice(priceText);  
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";
    
            let complementsDict = []
            let complementExpandables = productModal.querySelectorAll('.sc-bczRLJ.sc-f719e9b0-0')
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.sc-bczRLJ.sc-f719e9b0-0.sc-2815c808-1')
              let optionsComplement = [];
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                let complementNameElement = complementElement.querySelector('h3.sc-gKXOVf.hyVdID')
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(complementExpandable);
                console.log([typeComplement, minQtd, maxQtd])
                
                // Adiciona verificação para pular "Alguma observação?"
                if (complementName.trim() === "Alguma observação?") {
                  console.log("Observação pulada..")
                  continue; // Pula para a próxima iteração do loop
              }
  
                // Pegar nome de cada opção do complemento da iteração
                let optionsElement = complementExpandable.querySelectorAll('.checkbox,.radio,.pb.pt');
                for await (const optionElement of optionsElement) {
                  let optionTitle = "";
                  let optionPrice = "0";
                  let optionDescription = "";
  
                  if (optionElement.classList.contains('radio')) {
                    // Se a classe for 'radio', trata como um rádio.
                    let optionTitleElement = optionElement.querySelector('label');
                    let optionPriceElement = optionElement.querySelector('.pull-right');
                    
                    optionTitle = optionTitleElement.textContent.trim();
                    let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                    optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')
  
                    
                    console.log({optionPrice, optionTitle})
                    
                  } else if (optionElement.classList.contains('pb') && optionElement.classList.contains('pt')) {
                    let optionText = optionElement.textContent.trim();
                    let regex = /Máx\.\s\d+\s*([\s\S]+?)\s*\+\s*R\$(\d+,\d{2})/;
                    let match = optionText.match(regex);
  
                    optionTitle = match ? match[1].trim() : "";
                    optionPrice = match ? match[2] : "";
                    
                    console.log({optionPrice, optionTitle})
                  }
                  else if (optionElement.classList.contains('checkbox')) {
                    // Se a classe for 'checkbox', trata como um checkbox.
                    let optionLabelElement = optionElement.querySelector('label');
                    
                    if (optionLabelElement) {
                      let optionLabelContent = optionLabelElement.textContent.trim();
                      optionTitle = optionLabelContent.split('+')[0].trim();
                      let optionPriceText = optionLabelContent.split('+')[1];
                      optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')
  
                      console.log({optionPrice, optionTitle})
                    }
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
                  options: optionsComplement
                })
              }
            }
    
            productData.push({
              title: productTitle,
              price: productPrice,
              imgSrc: imgSrc,
              descricao: productDescricao,
              complementsDict: complementsDict
            });
            console.log("Produto adicionado")
            await this.backPage();
          
        }
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        console.log("Categoria adicionada")
        await this.backPage();
      }
  }
  
  
  async backPage() {
    console.log("Voltou!")
    await this.sleep(1000);
    let back = document.querySelector('.modal-dialog .fa-chevron-left');
    if (back) {
      back.click()
  }
    await this.sleep(1000);
  }
  }
  