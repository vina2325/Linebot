/* eslint-disable no-unused-expressions */
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

bot.on('message', async (event) => {
  const msg = []
  try {
    if (event.message.type === 'location') {
      let str = ''
      const data = await rp({
        uri: `https://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000467?filters=Longitude%20gt%20%27${(event.message.longitude) - 0.0051818841330708}%27%20and%20Longitude%20lt%20%27${(event.message.longitude) + 0.0051818841330708}%27%20and%20Latitude%20lt%20%27${(event.message.latitude) + 0.004510599909788}%27%20and%20Latitude%20gt%20%27${(event.message.latitude) - 0.004510599909788}%27&offset=0&limit=1000`,
        json: true
      })
      for (let i = 0; i < data.result.records.length; i++) {
        str += '🚾' + data.result.records[i].Name + '\n' + '➡' + data.result.records[i].Address + '\n' + '🈴' + data.result.records[i].Grade + '\n' + ' ' + '\n'
        if (i >= 9) { break }
      }
      str += '〰〰〰〰〰〰〰〰〰〰〰〰〰' + '\n' + '✍請輸入欲前往【廁所名稱】'
      msg.push(str)
    } else if (event.message.type === 'text') {
      const map = await rp({
        uri: `https://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000467?filters=Name%20eq%20%27${escape(event.message.text)}%27&offset=0&limit=1000`,
        json: true
      })
      msg.push({
        type: 'location',
        title: map.result.records[0].Name,
        address: map.result.records[0].Address,
        latitude: map.result.records[0].Latitude,
        longitude: map.result.records[0].Longitude
      })
    }
  } catch (error) {
    console.log(error.message)
    if (event.message.type === 'location') {
      msg.push('附近沒有公廁，請自行處理(,,Ծ‸Ծ,, )')
    } else if (event.message.type === 'text') {
      console.log('text')
      msg.push(
        { type: 'text', text: '請輸入正確格式' + '\n' + '\n' + '1⃣傳送您所在位置🌎' + '\n' + '2⃣輸入您欲前往廁所的名稱🚻 ' + '\n' + '(名稱都要正確喔!)' }, {
          type: 'image',
          originalContentUrl: 'https://raw.githubusercontent.com/vina2325/Linebot/master/imgs/01.jpg',
          previewImageUrl: 'https://raw.githubusercontent.com/vina2325/Linebot/master/imgs/01.jpg'
        }, {
          type: 'image',
          originalContentUrl: 'https://raw.githubusercontent.com/vina2325/Linebot/master/imgs/02.jpg',
          previewImageUrl: 'https://raw.githubusercontent.com/vina2325/Linebot/master/imgs/02.jpg'
        }
      )
    }
  }
  console.log(msg)
  event.reply(msg)
})

// 在port啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動123')
})
