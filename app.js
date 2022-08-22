const express = require('express')
const app = express()
const port = 3000
const menuList = require('./restaurant.json')
const exphbs = require('express-handlebars')

//setting template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

//index
app.get('/', (req, res) => {
  res.render('index', {menus: menuList.results})
})

//show one menu
app.get('/restaurants/:menu_id', (req, res) => {
  const oneMenu = menuList.results.find(menu => menu.id.toString() === req.params.menu_id)
  res.render('show', {menu: oneMenu})
})

// search 
app.get('/search', (req, res) => {
  const condition = req.query.condition
  const keyword = req.query.keyword
  let feedback = ''
  //name
  if (condition === 'name') {
    const menus = menuList.results.filter(menu => {
      return menu.name.includes(keyword)
    })
    // not found
    if (menus.length === 0) {
      feedback = '未發現!!!'
      return res.render('index', {menus: menuList.results, keyword, name: condition, feedback})
    }

    feedback = `發現:${menus.length}筆`
    return res.render('index', {menus: menus, keyword, name: condition, feedback})
  } 

  //type
  if (condition === 'type') {
    const menus = menuList.results.filter(menu => {
      return menu.category.includes(keyword)
    })
    // not found
    if (menus.length === 0) {
      feedback = '未發現!!!'
      return res.render('index', {menus: menuList.results, keyword, type: condition, feedback})
    }
    feedback = `發現:${menus.length}筆`
    return res.render('index', {menus: menus, keyword: keyword, type: condition, feedback})
  } 

  feedback = '請選擇條件!!!'
  res.render('index', {menus: menuList.results, keyword, feedback })
})


app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})