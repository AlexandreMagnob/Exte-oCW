class scrapySaipos {
  constructor() {
    this.scrapedData = [];
    this.titleRestaurant = ""
  }

  sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }

    async checkRepetition(complementExpandable) { 
      const plusButton = complementExpandable.querySelector('ion-button[data-qa="add-choice"]');     
      if(plusButton){ 
      plusButton.click(); 
      await this.sleep(500)
      const plusButtonDisalbe = complementExpandable.querySelector('.button-disabled')
        if(plusButtonDisalbe){
          return "sem repeticao"
        }else{
          return "com repeticao"
        }
    }else {
        return "sem repeticao";
      }
    }

    async processTypeComplement(typeComplement, complementExpandable, required) {
      const complement = typeComplement !== "" ? typeComplement : "";
      let repetition = await this.checkRepetition(complementExpandable);

        let minQtd = 0;
        let maxQtd = 0;
        if (required === "OBRIGATÓRIO") {
          minQtd = 1;
        }

        
        const minMatch = complement.match(/Escolha pelo menos uma opção/);
        const minOneMatch = complement.match(/Escolha até 1 opção/);
        const matchSelectUntil = complement.match(/^Escolha até (\d+) opções/);

         if(minMatch){
          minQtd = 1;
          maxQtd = 1
        }else if(matchSelectUntil){
          maxQtd = parseInt(matchSelectUntil[1], 10);
        }else if(minOneMatch){
          maxQtd = 1
        }
          
      
        
        let type = maxQtd > 1 ? "Mais de uma opcao " + repetition : "Apenas uma opcao ";
      
        return [type, minQtd, maxQtd];
      }
    

  async clickProductCards() {
    console.log("executando..")
    await this.sleep(1000)
    let categoryDivs = document.querySelectorAll('.category-container');
    console.log(categoryDivs)
    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
      await this.sleep(500)
      let categoryDivs = document.querySelectorAll('.category-container');
      let categoryDiv = categoryDivs[categoryIndex];
      let categoryNameElement = categoryDiv.querySelector('h2.category-desc');
      let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
      let productCards = categoryDiv.querySelectorAll(".list_circle_detail");
  
      let productData = [];
      for await (const productIndex of [...Array(productCards.length).keys()]) {
        await this.sleep(1000)
        let categoryDivs = document.querySelectorAll('.category-container');
        let categoryDiv = categoryDivs[categoryIndex];
        let productCards = categoryDiv.querySelectorAll((".list_circle_detail"));
        let productCard = productCards[productIndex];
        let priceElement = productCard.querySelector('#variation-price');
        let priceText = priceElement ? priceElement.textContent : "";
        let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')

          await this.sleep(500)
          productCard.scrollIntoView();
          productCard.click();
          // Agora, vamos adicionar um atraso antes de coletar os dados.
          await this.sleep(1000)
        console.log("clicou")
          let productModal = document.querySelector('#main-content')
          let titleElement = productModal.querySelector('h5[data-qa="item-description"]');
          let imgElement = productModal.querySelectorAll('img[alt="Logo"]')[1];
          let descricaoElement = productModal.querySelector('h5[data-qa="item-detail"');
          let productTitle = titleElement ? titleElement.textContent : "";
          let imgSrc = imgElement ? imgElement.src : "";
          let productDescricao = descricaoElement ? descricaoElement.textContent : "";
  
          let complementsDict = []
          let complementExpandables = document.querySelectorAll('div[style="width: 100%;"]:not(.quantity):not(.list_circle_detail)')

          for await (const complementExpandable of complementExpandables) {

            let optionsComplement = [];

              
              let typeComplementElement = complementExpandable.querySelector('.type_select');
              let requiredElement = complementExpandable.querySelector('.ion-float-end');
              let complementNameElement = complementExpandable.querySelector('h4[data-qa="additional"]');
              let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
              let required = ""

              if (requiredElement) {
                let requiredText = requiredElement.textContent.trim();
                required = requiredElement ? requiredElement.textContent : "";
                typeComplementText = typeComplementText.replace(requiredText, '');
              }

              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable,required)
              let complementName = complementNameElement ? complementNameElement.textContent : "";
              // Pegar nome de cada opção do complemento da iteração
              let optionsElement = complementExpandable.querySelectorAll('.choice-item-label.sc-ion-label-md-h.sc-ion-label-md-s.md.hydrated');
              for await (const optionElement of optionsElement) {
                let optionTitleElement = optionElement.querySelector('span[data-qa="choice-item-description"]');
                let optionPriceElement = optionElement.querySelector('div[data-qa="item-price"]');
                //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
  
                let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                //let optionQtd = optionQtdElement ? optionQtdElement.textContent : "";
                let optionDescription = "";
  
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
          // console.log("DESCRIÇAO: ", productDescricao)
          console.log("- - - - - - - - - - - - - - - - - ")
          console.log("                                  ")
          window.history.go(-1)
          await this.sleep(1000)
        
      }
      this.scrapedData.push({
        categoryName: categoryName,
        productsCategory: productData
      });
      //await this.backPage();
    }
    //alert("Finalizado!")
}


async backPage() {
  await this.sleep(1000);
  let back = document.querySelector('.nav_btn.floatLeft')
  if (back) {
    back.click()
}}
}