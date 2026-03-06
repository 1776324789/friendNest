/* =========================
Canvas
========================= */

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const width = canvas.width
const height = canvas.height


/* =========================
Collision System
========================= */

let physics

if (window.DetectCollisions) {
    physics = new DetectCollisions.System()
} else {
    const { System } = await import("detect-collisions")
    physics = new System()
}


/* =========================
玩家
========================= */

const player = {
    x: width / 2,
    y: height - 120,
    r: 10,
    speed: 4,
    alive: true
}

player.collider = physics.createCircle(
    { x: player.x, y: player.y },
    player.r
)


/* =========================
敌人
========================= */

const enemy = {
    x: width / 2,
    y: height / 3,
    r: 14
}


/* =========================
墙体
========================= */

const walls = []

const wall1 = physics.createPolygon(
    { x: 400, y: 400 },
    [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 240, y: 120 },
        { x: 120, y: 200 },
        { x: -40, y: 120 }
    ]
)

const wall2 = physics.createPolygon(
    { x: 900, y: 300 },
    [
        { x: 0, y: 0 },
        { x: 150, y: -50 },
        { x: 250, y: 50 },
        { x: 100, y: 180 },
        { x: -80, y: 120 }
    ]
)

walls.push(wall1, wall2)


/* =========================
对象池
========================= */

const bulletPool = []

function getBullet() {

    if (bulletPool.length > 0) {
        return bulletPool.pop()
    }

    return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 4,
        active: true,
        collider: null
    }
}

function releaseBullet(b) {

    b.active = false

    if (b.collider) {
        physics.remove(b.collider)
        b.collider = null
    }

    bulletPool.push(b)

}


/* =========================
子弹
========================= */

const bullets = []

function createBullet(x, y, vx, vy) {

    const b = getBullet()

    b.x = x
    b.y = y
    b.vx = vx
    b.vy = vy
    b.active = true

    b.collider = physics.createCircle({ x, y }, b.r)

    bullets.push(b)

}


/* =========================
圆形弹幕
========================= */

function shootCircle(x, y, count) {

    for (let i = 0; i < count; i++) {

        const angle = (Math.PI * 2 / count) * i

        const vx = Math.cos(angle) * 2
        const vy = Math.sin(angle) * 2

        createBullet(x, y, vx, vy)

    }

}


/* =========================
输入
========================= */

const keys = {}

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true
})

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false
})


/* =========================
玩家移动
========================= */

function updatePlayer() {

    if (!player.alive) return

    const oldX = player.x
    const oldY = player.y

    if (keys["w"]) player.y -= player.speed
    if (keys["s"]) player.y += player.speed
    if (keys["a"]) player.x -= player.speed
    if (keys["d"]) player.x += player.speed

    player.collider.x = player.x
    player.collider.y = player.y

    for (let wall of walls) {

        if (physics.checkCollision(player.collider, wall)) {
            player.x = oldX
            player.y = oldY

            player.collider.x = player.x
            player.collider.y = player.y
        }

    }

}


/* =========================
子弹更新
========================= */

function updateBullets() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const b = bullets[i]

        if (!b.active) {
            bullets.splice(i, 1)
            continue
        }

        b.x += b.vx
        b.y += b.vy

        b.collider.x = b.x
        b.collider.y = b.y

        if (
            b.x < -20 ||
            b.x > width + 20 ||
            b.y < -20 ||
            b.y > height + 20
        ) {
            releaseBullet(b)
            bullets.splice(i, 1)
            continue
        }

    }

}


/* =========================
碰撞检测
========================= */

function updateCollision() {

    if (!player.alive) return

    physics.update()

    for (let i = bullets.length - 1; i >= 0; i--) {

        const b = bullets[i]

        for (let wall of walls) {

            if (physics.checkCollision(b.collider, wall)) {

                releaseBullet(b)
                bullets.splice(i, 1)
                break

            }

        }

        if (!player.alive) continue

        if (b.collider && physics.checkCollision(b.collider, player.collider)) {

            player.alive = false

        }

    }

}


/* =========================
子弹渲染
========================= */

function drawBullets() {

    ctx.fillStyle = "#ff5555"

    for (let b of bullets) {

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()

    }

}


/* =========================
玩家渲染
========================= */

function drawPlayer() {

    ctx.beginPath()
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2)

    ctx.fillStyle = player.alive ? "#00ffff" : "#555"

    ctx.fill()

}


/* =========================
敌人渲染
========================= */

function drawEnemy() {

    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2)

    ctx.fillStyle = "#ffaa00"

    ctx.fill()

}


/* =========================
墙体渲染
========================= */

function drawWalls() {

    ctx.strokeStyle = "#00ff00"
    ctx.lineWidth = 2

    for (let wall of walls) {

        const pts = wall.points

        ctx.beginPath()

        ctx.moveTo(
            wall.x + pts[0].x,
            wall.y + pts[0].y
        )

        for (let p of pts) {

            ctx.lineTo(
                wall.x + p.x,
                wall.y + p.y
            )

        }

        ctx.closePath()
        ctx.stroke()

    }

}


/* =========================
敌人攻击
========================= */

let fireTimer = 0

function updateEnemy() {

    fireTimer++

    if (fireTimer > 60) {

        fireTimer = 0

        shootCircle(enemy.x, enemy.y, 24)

    }

}


/* =========================
游戏循环
========================= */

function gameLoop() {

    updatePlayer()

    updateEnemy()

    updateBullets()

    updateCollision()

    ctx.clearRect(0, 0, width, height)

    drawEnemy()

    drawWalls()

    drawPlayer()

    drawBullets()

    requestAnimationFrame(gameLoop)

}

gameLoop()