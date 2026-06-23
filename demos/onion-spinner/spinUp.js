const { spawn } = require("node:child_process")
const { readFile } = require("node:fs/promises")

const readMyOnion = async () => (
  readFile('./shop-onion/hostname', 'utf8')
)

const fatallyDie = (error) => {
  console.error(error)
  process.exit(-1)
}

const spinUp = () => new Promise((resolve) => {
  const p = spawn("tor", ["-f", "torrc.my-shop"])

  const consume = (lines) => {
    lines.split("\n").filter((v) => !!v).forEach((line) => {
      const parts = line.split(/(?: \[)|(?:\] )/)
      if (!parts) { return }

      const [datetime, level, log] = parts

      if (log.startsWith(`Bootstrapped `)) {
        const parts_2 = log.match(/Bootstrapped (\d+)%/)
        if (!(parts_2 && !!parts_2[1])) { return }

        const percent = Number(parts_2[1])
        if (percent === 100) {
          readMyOnion().then((onion) => {
            resolve(onion)
          })
        }
      }
    })
  }

  p.stdout.on("data", (buffer) => { consume(buffer.toString()) })

  p.on("close", (code) => { fatallyDie(new Error(`tor closed with ${code}`)) })
  p.on("error", (error) => { fatallyDie(error) })
})

module.exports = { spinUp }