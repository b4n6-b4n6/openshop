const { spinUp } = require("./spinUp")

spinUp().then((onion) => {
  console.log(`Shop ready at ${onion}`)
})