const grid = document.getElementById("grid");
const count = document.getElementById("count");
const detail = document.getElementById("detail");
const loadError = document.getElementById("load-error");
let works = [];
let activeFilter = "all";

function makeElement(tag, className = "", text = undefined) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function createCategory(label) { return makeElement("p", "category", label || "作品"); }


function matchesFilter(work) {
  if (activeFilter === "all") return true;

  // コンペ作品：コンペ参加作品をすべて表示
  if (activeFilter === "competition") {
    return work.participation === "competition";
  }

  // 本選通過作品：finalist が true の作品だけ表示
  if (activeFilter === "award") {
    return work.finalist === true;
  }

  // 展示のみ
  if (activeFilter === "exhibition") {
    return work.participation === "exhibition";
  }

  // イラスト・映像・立体作品・音楽
  return work.category === activeFilter;
}



function createMediaPreview(work) {
  const thumb = makeElement("div", "thumb");

  if (work.thumbnail) {
    const image = makeElement("img");
    image.src = work.thumbnail;
    image.alt = `${work.title}のサムネイル`;
    image.loading = "lazy";

    image.onerror = () => {
      thumb.replaceChildren(
        makeElement(
          "div",
          "thumb-placeholder",
          "サムネイルを読み込めません"
        )
      );
    };

    thumb.append(image);

    // 動画・音楽作品には再生マークを重ねる
    if (work.mediaType === "video" || work.mediaType === "audio") {
      thumb.append(
        makeElement("span", "play-badge", "▶")
      );
    }
  } else {
    thumb.append(
      makeElement(
        "div",
        "thumb-placeholder",
        work.category === "music" ? "♫ 音楽作品" : "▶ 映像作品"
      )
    );

    if (work.mediaType === "video" || work.mediaType === "audio") {
      thumb.append(makeElement("span", "play-badge", "▶"));
    }
  }

  return thumb;
}

function render() {
  grid.replaceChildren();
  detail.hidden = true;
  const shown = works.filter(matchesFilter);
  count.textContent = `${shown.length} 作品`;
  if (!shown.length) { grid.append(makeElement("p", "notice", "この条件に合う作品はまだありません。")); return; }
  shown.forEach((work) => {
    const card = makeElement("article", "card");
    const content = makeElement("div", "card-content");
    content.append(createCategory(work.categoryLabel), makeElement("h3", "", work.title), makeElement("p", "meta", `${work.creator}${work.school ? "｜" + work.school : ""}`));
    

if (work.award) {
  const awards = Array.isArray(work.award)
    ? work.award
    : [work.award];

  const awardColors = {
    "最優秀賞": "award-grand-prize",
    "優秀賞": "award-excellence",
    "審査員特別賞": "award-judge",
    "佳作": "award-honorable",
    "クリエイティブ賞": "award-creative",
  };

  awards.forEach((award) => {
    const awardLabel = makeElement(
      "p",
      "award-label",
      `★ ${award}`
    );

    const colorClass = awardColors[award];

    if (colorClass) {
      awardLabel.classList.add(colorClass);
    }

    content.append(awardLabel);
  });
}

    const button = makeElement("button", "view-button", "作品を見る →");
    button.type = "button";
    button.addEventListener("click", () => showDetail(work));
    content.append(button);
    card.append(createMediaPreview(work), content);
    grid.append(card);
  });
}
function showDetail(work) {
  detail.replaceChildren();
  detail.hidden = false;
  const top = makeElement("div", "detail-top");
  top.append(makeElement("span", "notice", "作品詳細"));
  const back = makeElement("button", "back-button", "← ギャラリーに戻る");
  back.type = "button";
  back.addEventListener("click", () => { detail.hidden = true; document.querySelector(".collection").scrollIntoView({ behavior: "smooth", block: "start" }); });
  top.append(back);
  const layout = makeElement("div", "detail-layout");
  const mediaBox = makeElement("div", "detail-media");
  const info = makeElement("div", "detail-info");
  if (work.mediaType === "video") {
    const video = makeElement("video");
    video.controls = true; video.preload = "metadata"; video.playsInline = true; video.src = work.media;
    video.setAttribute("aria-label", `${work.title}の動画`);
    video.addEventListener("error", () => mediaBox.append(makeElement("p", "error-message", "動画を読み込めませんでした。ネット接続・動画URL・ファイル形式を確認してください。")));
    mediaBox.append(video);
  } else {
    const image = makeElement("img"); image.src = work.media; image.alt = work.title;
    image.addEventListener("error", () => mediaBox.append(makeElement("p", "error-message", "画像を読み込めませんでした。works.json の media のパスを確認してください。")));
    mediaBox.append(image);
  }
  info.append(createCategory(work.categoryLabel), makeElement("h2", "", work.title), makeElement("p", "meta", `${work.creator}${work.school ? "｜" + work.school : ""}`), makeElement("p", "detail-description", work.description || "作品紹介は準備中です。"));
  const facts = makeElement("dl", "detail-facts");
  [["応募部門", work.categoryLabel || "—"], ["参加区分", work.participation === "exhibition" ? "展示のみ" : "コンテスト"], ["開催年", work.year || "—"], ["受賞歴", work.award || "—"]].forEach(([label, value]) => {
    const row = makeElement("div", "fact"); row.append(makeElement("dt", "", label), makeElement("dd", "", value)); facts.append(row);
  });
  info.append(facts); layout.append(mediaBox, info); detail.append(top, layout);
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  render();
}));
fetch("data/works.json")
  .then((response) => { if (!response.ok) throw new Error(`works.json の読み込みに失敗しました (${response.status})`); return response.json(); })
  .then((data) => { works = data; render(); })
  .catch((error) => { console.error(error); count.textContent = "読み込みエラー"; loadError.hidden = false; loadError.textContent = "作品データを読み込めませんでした。VS Code の Live Server で index.html を開いているか確認してください。"; });
