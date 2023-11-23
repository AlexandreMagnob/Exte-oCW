
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
    

    async getComplementQuantityRequired(complementType) {
      // Remover parênteses e espaços extras
      let cleanedType = complementType.replace(/[()]/g, '').trim();
    
      // Identificar se é Obrigatório ou Opcional
      let isOptional = cleanedType.toLowerCase().includes('opcional');
    
      // Encontrar os números presentes na string
      let matches = cleanedType.match(/(\d+)/g);
    
      // Definir maxQuantity baseado nos matches
      let maxQuantity = matches ? parseInt(matches[matches.length - 1], 10) : 1;
      let minQuantity = 0
      if(!isOptional){
        minQuantity = maxQuantity
      }
      return {
        isOptional: isOptional,
        minQuantity: minQuantity,
        maxQuantity: maxQuantity
      };
    }
    async getComplementType(complementExpandable, Quantity){
      let hasButton = complementExpandable.querySelector('.update-button')
      let repetion
      let type
      if(Quantity>1){
        type = "Mais de uma opcao"
      }
      else{
        type = "Apenas uma opcao"
      }
      if (hasButton){
        repetion = "com repeticao"
      }
      else {
        repetion = "sem repeticao"
      }
      return type + repetion;
    }

    async processComplements(productModal) {
      let complementsDict = []
      let complementExpandables = productModal.querySelectorAll(".col-md-12.complement");
      for await (const complementExpandable of complementExpandables) {
        let complementElements = complementExpandable.querySelectorAll('.complement-font');
        let optionsComplement = [];
        // Pegar o nome de cada complemento
        for await (const complementElement of complementElements) {

          let complementNameElement = complementElement.textContent
          //Separa o nome do complemento do seu tipo e.g : (Obrigatório) 0/2 
          let [complementName, complementType] = await this.cleanUpText(complementNameElement.textContent);
          //Captura a quantidade de opções e se a opção é obrigatória ou não
          let [isRequired, minQtd, maxQtd] = await this.getComplementQuantityRequired(typeComplementText);
          //Verifica se tem repetição e o tipo 'mais de uma opcao' ou não.
          let typeComplement = await this.getComplementType(complementExpandable, maxQtd) 
          console.log([typeComplement, minQtd, maxQtd])
          
          // Pegar nome de cada opção do complemento da iteração
          let optionsElement = complementExpandable.querySelectorAll('.form-check');
          for await (const optionElement of optionsElement) {

            let optionTitleElement = optionElement.querySelector('.item-complement');
            let optionPriceElement = optionElement.querySelector('.sub-item-price')

            let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
            let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
            let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace(',', '.');
            let optionDescription = "";
                
          }
        }
      }
    }
    
    async calculateComplements(productModal) {
      // Busque o botão "Avançar" dentro do productModal
      let avancarButton = productModal.querySelector('.add-cart-button:contains("Avançar")');
    
      while (avancarButton) {
        // Se o botão "Avançar" estiver disponível, clique nele
        avancarButton.click();
        await processComplements(productModal);
        // Busque novamente o botão "Avançar" dentro do productModal
        avancarButton = productModal.querySelector('.add-cart-button:contains("Avançar")');
      }
    }

    async cleanUpText(text) {
    // Remove espaços extras e quebras de linha
    let cleanedText = text.trim().replace(/\s+/g, ' ');

    // Encontrar o texto entre parênteses
    let matches = cleanedText.match(/\(([^)]*)\)/);

    // Se houver correspondências, extraia o texto entre parênteses
    let complementType = matches ? matches[1] : '';

    // Remova o texto entre parênteses de cleanedText
    cleanedText = cleanedText.replace(/\([^)]*\)/g, '');

    return [cleanedText.trim(), complementType.trim()];
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
                
    
                complementsDict.push({
                  nameComplement: complementName,
                  typeComplement: typeComplement,
                  minQtd: minQtd,
                  maxQtd: maxQtd,
                  options: optionsComplement
                })
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