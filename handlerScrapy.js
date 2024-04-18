class HandlerScrapy {
    constructor() {
      // Inicializa as instâncias dos scrapers
      this.scrapyDino = new scrapyDino();
      this.scrapyAnotai = new ScrapyAnotai();
      this.scrapyGoomer = new ScrapyGoomer();
      this.scrapyOlaClick = new ScrapyOlaClick();
      this.scrapyInstaDelivery = new scrapyInstaDelivery();
      this.scrapyHubt = new scrapyHubt();
      this.scrapyJotaja = new scrapyJotaja();
      this.scrapyYooga = new scrapyYooga();
      this.scrapyCardapioDigital = new scrapyCardapioDigital();
      this.scrapySaipos = new scrapySaipos();
      this.scrapyNeemo = new scrapyNeemo();
    }
  
    async handleScrapyChoice(restaurante) {
      // Decide qual scraper usar com base no restaurante escolhido pelo usuário
      if (restaurante === 'Dino') {
        await alert("Iniciando...");
        await this.scrapyDino.clickProductCards();
        const scrapedData = this.scrapyDino.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyDino.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)

      } else if (restaurante === 'Anotai') {
        await alert("Iniciando...");
        await this.scrapyAnotai.checkAndScrape();
        const scrapedData = this.scrapyAnotai.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyAnotai.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      } 
      else if(restaurante == "Yooga")
      {
        await alert("Iniciando...");
        await this.scrapyYooga.clickProductCards()
        const scrapedData = this.scrapyYooga.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyYooga.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if(restaurante == "Jotaja")
      {
        await alert("Iniciando...");
        await this.scrapyJotaja.clickProductCards()
        const scrapedData = this.scrapyJotaja.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyJotaja.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if(restaurante == "CardapioDigital")
      {
        await alert("Iniciando...");
        await this.scrapyCardapioDigital.clickProductCards()
        const scrapedData = this.scrapyCardapioDigital.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyCardapioDigital.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if(restaurante == "Hubt")
      {
        await alert("Iniciando...");
        await this.scrapyHubt.clickProductCards()
        const scrapedData = this.scrapyHubt.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyHubt.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if (restaurante == "Goomer"){
        await alert("Iniciando...");
        await this.scrapyGoomer.clickProductCards()
        const scrapedData = this.scrapyGoomer.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyGoomer.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if (restaurante === 'OlaClick') {
        await alert("Iniciando...");
        await this.scrapyOlaClick.clickProductCards()
        const scrapedData = this.scrapyOlaClick.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyOlaClick.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if (restaurante === 'Saipos') {
        await alert("Iniciando...");
        await this.scrapySaipos.clickProductCards()
        const scrapedData = this.scrapySaipos.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapySaipos.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if (restaurante === 'Neemo') {
        await alert("Iniciando...");
        await this.scrapyNeemo.clickProductCards()
        const scrapedData = this.scrapyNeemo.scrapedData
        await alert("Finalizado")
        const titleRestaurant = this.scrapyNeemo.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if (restaurante === 'InstaDelivery') {
        let verifyClosed = await this.scrapyInstaDelivery.verifyClosed()
        if(verifyClosed){
          alert("O estabelecimento está fechado. Tente quando ele estiver aberto.")
        }
        else{
          await alert("Iniciando...");
          await this.scrapyInstaDelivery.clickProductCards()
          const scrapedData = this.scrapyInstaDelivery.scrapedData
          await alert("Finalizado")
          const titleRestaurant = this.scrapyInstaDelivery.titleRestaurant
          await createCSV(scrapedData, titleRestaurant)
        }
      }
      else {
        await alert('Restaurante inválido');
      }
    }
  }
  
  // Exporta a classe HandlerScrapy
  window.HandlerScrapy = HandlerScrapy;
  
  // Escuta mensagens enviadas pelo popup.js
  chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.restaurante) {
        const handlerScrapy = new HandlerScrapy();
        await handlerScrapy.handleScrapyChoice(request.restaurante);
    }
  });
  