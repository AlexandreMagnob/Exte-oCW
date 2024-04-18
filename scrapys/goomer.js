
class ScrapyGoomer {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
      
    } 
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
    

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
      
      let requiredLabel = complementExpandable.querySelector('[data-test="required-label"]');
      if (requiredLabel){
        minQtd = 1
      }

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
  
    async clickProductCards() {
      console.log("executando..")
      await this.sleep(500)

      this.titleRestaurant = (document.querySelector('.sc-msiz1g-0 strong') || {}).textContent || '';
      console.log(this.titleRestaurant)
      let categoryDivs = document.querySelectorAll('.sc-4uh17g-0');
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.sc-4uh17g-0');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('h2')
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        
        let productCards = categoryDiv.querySelectorAll('[data-test="product-item"]')

        console.log(categoryName)
        console.log(productCards.length)
  
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(500)
          let categoryDivs = document.querySelectorAll('.sc-4uh17g-0');
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll('[data-test="product-item"]')
          let productCard = productCards[productIndex];
          
          console.log({productIndex, productCard})
          
          productCard.scrollIntoView()
          await this.sleep(500)
          productCard.click()

            // Agora, vamos adicionar um atraso antes de coletar os dados.
            await this.sleep(1500)
            let productModal = document.querySelector('.sc-1w3vq2h-2');
            let titleElement = productModal.querySelector('.name');
            console.log(titleElement)
            let imgElement = productModal.querySelector('img');
            let descricaoElement = productModal.querySelector('.description');
            let productTitle = titleElement ? titleElement.textContent : "";
            console.log(productTitle)
            let priceElement = productModal.querySelector('.price');
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";
    
            let complementsDict = []
            let complementExpandables = document.querySelectorAll('[data-test="optional-items-list"]');
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.sc-470djk-0')
              let optionsComplement = [];
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                let complementNameElement = complementElement.querySelector('.title');
                let typeComplementElement = complementElement.querySelector('.tip');
                let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable);
                console.log([typeComplement, minQtd, maxQtd])
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                
                // Pegar nome de cada opção do complemento da iteração
                let optionsElement = complementExpandable.querySelectorAll('.sc-zh9q04-0');
                for await (const optionElement of optionsElement) {

                  let optionTitleElement = optionElement.querySelector('.description');
                  let optionPriceElement = optionElement.querySelector('.value');

                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')
                  let optionDescription = optionTitle.includes('-') ? optionTitle.split('-')[1].trim() : "";

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
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        console.log("Categoria adicionada")
      }
    }
  
  async backPage() {
    console.log("Voltou!")
    await this.sleep(1000);
    let back = document.querySelector('[data-test="btn-back"]');
    if (back) {
      back.click()
  }
    await this.sleep(1000);
  }
}