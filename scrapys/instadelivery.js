
class scrapyInstaDelivery {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
      
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
    

    async getPriceProduct(priceText){
      let multiplePrices = priceText.includes('\n');
      let productPrice;
      if (multiplePrices) {
        let priceElements = priceText.split('\n').map(e => e.trim()).filter(Boolean);
        productPrice = priceElements[0].replace(/[^\d,.]/g, '').replace('.', ',');
      } else {
        productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
      }
      return productPrice;
    }

    async checkRepetition(complementExpandable) {
      let button = complementExpandable.querySelector('button, .action');
      if (button) {
        return "com repeticao";
      } else {
        return "sem repeticao";
      }
    }

    async processTypeComplement(typeComplement, complementExpandable) {
      const complement = typeComplement !== "" ? typeComplement : "";
      let repetition = await this.checkRepetition(complementExpandable);
      let type = "";
      let minQtd = 0;
      let maxQtd = 0;
    
      if (complement.match(/^Escolha (\d+) opções/)) {
        const itemCount = parseInt(complement.match(/^Escolha (\d+) opções/)[1], 10);
        if (itemCount !== 1) {
          type = 'Mais de uma opcao ' + repetition;
          minQtd = itemCount;
          maxQtd = itemCount;
          console.log(minQtd,maxQtd)}
      }else if(complement == "Escolha 1 opção"){
        type = "Apenas uma opcao";
        minQtd = 1;
        maxQtd = 1;
      }
      else if (complement.startsWith("Escolha até ")) {
        const maxItems = parseInt(complement.match(/\d+/)[0], 10);
        type = 'Mais de uma opcao ' + repetition;
        minQtd = 0
        maxQtd = maxItems;
      } else if (complement.match(/^Escolha de \d+ até \d+ opções$/)) {
        const minMaxItems = complement.match(/\d+/g);
        const minItems = parseInt(minMaxItems[0], 10);
        const maxItems = parseInt(minMaxItems[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        minQtd = minItems;
        maxQtd = maxItems;
      }
      return [type, minQtd, maxQtd];
    }

    async cleanUpText(text) {
      // Remove espaços extras, quebras de linha e remove o texto entre parênteses
      return text.trim().replace(/\s+/g, ' ').replace(/\([^)]*\)/g, '');
    }
  
    async clickProductCards() {
      console.log("executando..")
      await this.sleep(500)

      this.titleRestaurant = document.title || '';
      console.log(this.titleRestaurant)
      let categoryDivs = document.querySelectorAll('.card.mb-4')
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.card.mb-4')
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.group-name')
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        
        let productCards = categoryDiv.querySelectorAll('.item-container.w-100 .col-md-12.item')

        console.log(categoryName)
        console.log(productCards.length)
  
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(500)
          let categoryDivs = document.querySelectorAll('.card.mb-4')
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll('.item-container.w-100 .col-md-12.item')
          let productCard = productCards[productIndex];
          
          console.log({productIndex, productCard})
          
          let priceElement = productCard.querySelector('.price');

          productCard.scrollIntoView()
          await this.sleep(500)
          productCard.click()

            await this.sleep(1500)
            let productModal = document.querySelector('.modal-content');
            let titleElement = productModal.querySelector('.itemName');
            console.log(titleElement)
            let imgElement = productModal.querySelector('img[alt="Item image"]')
            let descricaoElement = productModal.querySelector('.item-description')
            let productTitle = titleElement ? titleElement.textContent : "";
            let priceText = priceElement.textContent.trim();
            let productPrice = await this.getPriceProduct(priceText);
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";

            let complementsDict = []
            let complementExpandables = productModal.querySelectorAll(".col-md-12.complement")

            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.complement-font')
              let optionsComplement = [];
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {

                let complementNameElement = complementElement.textContent
                let complementTypeElement = complementElement.
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable);
                console.log([typeComplement, minQtd, maxQtd])
                let complementName = complementNameElement ? cleanUpText(complementNameElement) : "";
                
                // Pegar nome de cada opção do complemento da iteração
                let optionsElement = complementExpandable.querySelectorAll('.form-check');
                for await (const optionElement of optionsElement) {

                  let optionTitleElement = optionElement.querySelector('.item-complement');
                  let optionPriceElement = optionElement.querySelector('.sub-item-price')

                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace(',', '.');
                  let optionDescription = "";

                  console.log("- - - - - - - - - - - - - - - - - ")
                  console.log("NOME DO COMPLEMENTO: ",complementName)
                  console.log("TEXTO DO TIPO DO COMPLEMENTO: ",typeComplementText.trim())
                  console.log("TIPO DO COMPLEMENT: ",typeComplement)
                  console.log("QUANTIDADE MIN: ",minQtd)
                  console.log("QUANTIDADE MAX: ",maxQtd)
                  console.log("OPÇOES: ",optionsComplement)
                  console.log("- - - - - - - - - - - - - - - - - ")
                  console.log("                                  ")

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
        }
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        console.log("Categoria adicionada")
        await this.backPage();
      }
  
  async backPage() {
    console.log("Voltou!")
    await this.sleep(1000);
    let back = document.querySelector('.update-button');
    if (back) {
      back.click()
  }
    await this.sleep(1000);
  }
}