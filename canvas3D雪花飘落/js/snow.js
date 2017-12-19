// ;(function() {
//   var requestAnimationFrame =
//     window.requestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.msRequestAnimationFrame ||
//     function(callback) {
//       window.setTimeout(callback, 1000 / 60)
//     }
//   window.requestAnimationFrame = requestAnimationFrame
// })()

class Snow {
  constructor(config) {
    this.settings = {
      speed: config.speed || 0,
      size: config.size || 2,
      count: config.count || 200,
      opacity: config.opacity || 0,
      color: config.color || "#ffffff",
      windPower: config.windPower || 0,
      image: config.image || false
    }
    this.canvas = document.getElementById(config.el)
    this.ctx = this.canvas.getContext("2d")
    this.flakeCount = this.settings.count
    this.flakes = []
    this.mX = -100
    this.mY = -100

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.canvas && this.init()
  }
  init() {
    if (this.settings.image !== false) {
      let img = document.createElement("img") //创建一个img元素
      img.src = this.settings.image
      img.style.display = "none"
      img.id = "lis_flake"
      document.body.appendChild(img)
    }
    for (let i = 0; i < this.flakeCount; i++) {
      let x = Math.floor(Math.random() * this.canvas.width)
      let y = Math.floor(Math.random() * this.canvas.height)
      let size = Math.random() * 20 + this.settings.size
      let speed = Math.random() * 1 + this.settings.speed
      let opacity = Math.random() * 0.5 + this.settings.opacity

      this.flakes.push({
        speed,
        velX: 0,
        x,
        y,
        size,
        opacity,
        velY: speed,
        stepSize: Math.random() / 30,
        step: 0,
        angle: 180
      })
    }
    this.snow()
  }

  snow() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.flakeCount; i++) {
      let flake = this.flakes[i]
      let x = this.mX
      let y = this.mY
      let minDist = 100
      let x2 = flake.x
      let y2 = flake.y

      let dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y))
      let dx = x2 - x
      let dy = y2 - y

      if (dist < minDist) {
        let force = minDist / (dist * dist)
        let xcomp = (x - x2) / dist
        let ycomp = (y - y2) / dist
        let deltaV = force / 2

        flake.velX -= deltaV * xcomp
        flake.velY -= deltaV * ycomp
      } else {
        flake.velX *= 0.98
        if (flake.velY <= flake.speed) {
          flake.velY = flake.speed
        }

        switch (this.settings.windPower) {
          case false:
            flake.velX += Math.cos((flake.step += 0.05)) * flake.stepSize
            break

          case 0:
            flake.velX += Math.cos((flake.step += 0.05)) * flake.stepSize
            break

          default:
            flake.velX += 0.01 + settings.windPower / 100
        }
      }

      let s = this.settings.color
      let patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/
      let matches = patt.exec(s)
      let rgb =
        parseInt(matches[1], 16) +
        "," +
        parseInt(matches[2], 16) +
        "," +
        parseInt(matches[3], 16)

      flake.y += flake.velY
      flake.x += flake.velX

      if (flake.y >= this.canvas.height || flake.y <= 0) {
        this.reset(flake)
      }

      if (flake.x >= this.canvas.width || flake.x <= 0) {
        this.reset(flake)
      }
      if (this.settings.image == false) {
        this.ctx.fillStyle = "rgba(" + rgb + "," + flake.opacity + ")"
        this.ctx.beginPath()
        this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        this.ctx.fill()
      } else {
        this.ctx.drawImage(
          document.getElementById("lis_flake"),
          flake.x,
          flake.y,
          flake.size * 2,
          flake.size * 2
        )
      }
    }
    window.setTimeout(() => {
      this.snow()
    }, 1000 / 60)
    // requestAnimationFrame(this.snow())
  }
  reset(flake) {
    if (this.settings.windPower == false || this.settings.windPower == 0) {
      flake.x = Math.floor(Math.random() * this.canvas.width)
      flake.y = 0
    } else {
      if (this.settings.windPower > 0) {
        let xarray = Array(Math.floor(Math.random() * canvas.width), 0)
        let yarray = Array(0, Math.floor(Math.random() * canvas.height))
        let allarray = Array(xarray, yarray)

        let selected_array =
          allarray[Math.floor(Math.random() * allarray.length)]

        flake.x = selected_array[0]
        flake.y = selected_array[1]
      } else {
        let xarray = Array(Math.floor(Math.random() * this.canvas.width), 0)
        let yarray = Array(
          this.canvas.width,
          Math.floor(Math.random() * this.canvas.height)
        )
        let allarray = Array(xarray, yarray)

        let selected_array =
          allarray[Math.floor(Math.random() * allarray.length)]

        flake.x = selected_array[0]
        flake.y = selected_array[1]
      }
    }

    flake.size = Math.random() * 3 + this.settings.size
    flake.speed = Math.random() * 1 + this.settings.speed
    flake.velY = flake.speed
    flake.velX = 0
    flake.opacity = Math.random() * 0.5 + this.settings.opacity
  }
}
