import express from 'express'
import routes from './routes'
const app: express.Application= express();

app.use('/',routes)

app.listen('8118',()=>{
  console.log('server is running on port 8118');
})