const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const { adapterDB, adapterSequelizeDB } = require('./provider/database')
const ServerBotAPI = require('./apiBot')

const welcomFlow = require('./flows/welcom.flow')
const ChatGPTClass = require('./provider/agents/chatgpt.class.js')



// const ChatGPTInstance = new ChatGPTClass()

const main = async () => {
  /**
   * con el adaptador de base de datos del bot-whatsaap
   */

  // try {
  //   await adapterDB.init();
  //   console.log('Connection has been established successfully.');
  // } catch (error) {
  //   console.error('Unable to connect to the database:', error);
  // }

  /**
  * con el adaptador sequelize
  */
  try {
    await adapterSequelizeDB.authenticate();
    console.log('===============================');
    console.log('La conexión se ha establecido exitosamente.');
    console.log('===============================');
  } catch (error) {
    console.log('===============================');
    console.error('No se pudo conectar a la base de datos:', error);
    console.log('===============================');
  }

  const adapterFlow = createFlow([welcomFlow])

  const adapterProvider = createProvider(BaileysProvider)
  // const serverBotApi = new ServerBotAPI(adapterProvider, adapterDB)
  const serverBotApi = new ServerBotAPI(adapterProvider, adapterSequelizeDB)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  // QRPortalWeb()
  serverBotApi.start()
}

main()
