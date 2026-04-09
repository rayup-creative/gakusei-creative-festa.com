const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

// Canvas の初期設定
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 星のデータを生成
let stars = [];
const numStars = 150;

function initializeStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.01,
            color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 255, 1)`
        });
    }
}
initializeStars();

// 星を描画する関数
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();

        // 星の輝きの変化
        star.alpha += star.speed;
        if (star.alpha >= 1 || star.alpha <= 0) {
            star.speed *= -1;
        }

        // 星の色もランダムに変更
        star.color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 255, ${star.alpha})`;
    });

    requestAnimationFrame(drawStars);
}

// 星空をアニメーション
drawStars();

