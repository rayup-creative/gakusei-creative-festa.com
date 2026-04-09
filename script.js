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



// Vimeoプレイヤーの初期化
const iframe = document.getElementById('vimeo-player');
const player = new Vimeo.Player(iframe);

// 動画終了時の処理（ループを防ぐ）
player.on('ended', function() {
    console.log('動画が終了しました。一度だけ再生。');
    // 必要に応じて背景やエフェクトを変更するなど、後続処理を追加可能
});

// 動画再生の繰り返しを防ぐためにループ設定を解除
player.setLoop(false).then(function () {
    console.log('ループ設定を解除しました');
});

// ウィンドウリサイズ時にもCanvasのサイズをリセット
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeStars();
});


function createSparkle() {
    const sparkleContainer = document.querySelector('.sparkle-container');

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    // ランダムな位置に配置
    const x = Math.random() * 100 + '%';
    const y = Math.random() * 100 + '%';
    sparkle.style.left = x;
    sparkle.style.top = y;

    // ランダムサイズと速度の調整
    sparkle.style.width = Math.random() * 30 + 15 + 'px';
    sparkle.style.height = Math.random() * 30 + 15 + 'px';
    sparkle.style.animationDelay = Math.random() * 1 + 's';

    sparkleContainer.appendChild(sparkle);

    // 1秒後にエフェクト削除
    setTimeout(() => sparkle.remove(), 1000);
}

// 0.1秒ごとにエフェクトを生成する
setInterval(createSparkle, 100);




