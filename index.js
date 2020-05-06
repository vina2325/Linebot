// 引用linebot
import linebot from 'linebot'
// 引用dotenv 套件
import dotenv from 'dotenv'
import rp from 'request-promise'
// 讀取.env檔
dotenv.config()

// 宣告機器人的資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECPET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 當收到訊息時
// bot.on('message', event => {
//   if (event.message.type === 'text') {
//     event.reply(event.message.text)
//   }
//   console.log(event)
// })

// -------------------------------

// bot.on('message', async (event) => {
//   let msg = ''
//   try {
//     const data = await rp({ uri: `https://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000467?filters=Country%20eq%20%27${escape(event.message.text)}%27&offset=0&limit=1000`, json: true })

//     for (let i = 0; i < data.result.records.length; i++) {
//       msg += data.result.records[i].Name + '\n'

//       if (i === 30) { break }
//     }
//   } catch (error) {
//     msg = '請輸入正確訊息'
//   }
//   event.reply(msg)
//   console.log(event)
//   console.log(msg)
// })

bot.on('message', async (event) => {
  let msg = ''
  try {
    const data = await rp({
      uri: `https://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000467?filters=Longitude%20gt%20%27${(event.message.longitude) - 0.0103637682661416}%27%20and%20Longitude%20lt%20% 27${(event.message.longitude) + 0.0103637682661416}%27%20and%20Latitude%20lt%20%27${(event.message.latitude) + 0.009021199819576}%27%20and%20Latitude%20gt%20%27${(event.message.latitude) - 0.009021199819576}%27&offset=0&limit=1000`,
      json: true
    })
    for (let i = 0; i < data.result.records.length; i++) {
      msg += '🚾' + data.result.records[i].Name + '\n' + '➡' + data.result.records[i].Address + '\n' + '🈴' + data.result.records[i].Grade + '\n' + ' ' + '\n'

      // if (i === 30) { break }
    }
  } catch (error) {
    msg = '請輸入正確訊息'
  }
  event.reply(msg)
  console.log(event)
  console.log(msg)
})

// 在port啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動123')
})
