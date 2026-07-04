let lessons = [];
let currentDay = Number(localStorage.getItem("yingbang_current_day") || "1");
let completedDays = JSON.parse(localStorage.getItem("yingbang_completed_days") || "[]");
let audio = null;
let glossary = {};
let modalAudioText = "";
let modalAudioPath = "";

const state = {
  tab: "today"
};

const $ = (selector) => document.querySelector(selector);

function saveState() {
  localStorage.setItem("yingbang_current_day", String(currentDay));
  localStorage.setItem("yingbang_completed_days", JSON.stringify(completedDays));
}

async function loadCommonJs(path, modules) {
  const response = await fetch(path);
  const code = await response.text();
  const module = { exports: {} };
  const require = (name) => modules[name];
  Function("require", "module", "exports", code)(require, module, module.exports);
  return module.exports;
}

async function loadLessons() {
  const audioModule = await loadCommonJs("./utils/audio.js", {});
  const wordDetails = await loadCommonJs("./utils/wordDetails.js", {
    "./audio": audioModule
  });
  const lessonModule = await loadCommonJs("./utils/lessons.js", {
    "./audio": audioModule,
    "./wordDetails": wordDetails,
    "./translations": await loadCommonJs("./utils/translations.js", {})
  });

  lessons = lessonModule.lessons;
}

function lesson() {
  return lessons[currentDay - 1] || lessons[0];
}

function normalizeWord(text) {
  return String(text)
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
}

function buildGlossary() {
  glossary = {};
  lessons.flatMap((item) => item.words).forEach((word) => {
    glossary[word.word.toLowerCase()] = word;
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkWords(text) {
  return escapeHtml(text).replace(/[A-Za-z]+(?:[-'][A-Za-z]+)?/g, (token) => {
    const key = normalizeWord(token);
    return `<button class="inline-word" data-lookup-word="${key}">${token}</button>`;
  });
}

function speakText(text) {
  if (!text || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text || "");
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find((voice) => /^en[-_]/i.test(voice.lang));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  window.speechSynthesis.speak(utterance);
  return true;
}

function play(path, text) {
  if (speakText(text)) {
    return;
  }

  if (!audio) {
    audio = new Audio();
  }

  audio.pause();
  audio.currentTime = 0;
  audio.src = path;
  audio.play().catch(() => {
    alert(`请跟读：${text || ""}`);
  });

  audio.onerror = () => {
    alert(`请跟读：${text || ""}`);
  };
}

function detailForWord(rawWord) {
  const key = normalizeWord(rawWord);
  if (glossary[key]) {
    return glossary[key];
  }

  return {
    word: rawWord,
    meaning: "暂未收录中文解释",
    phonetic: "",
    meanings: ["这个词还没有加入今日词卡。", "你可以先听发音，再结合句子猜意思。"],
    similar: [],
    memory: "如果这个词经常在工作里遇到，可以之后加入你的重点词表。",
    example: "",
    audio: ""
  };
}

function openWordModal(rawWord) {
  const detail = detailForWord(rawWord);
  modalAudioText = detail.word;
  modalAudioPath = detail.audio;

  $("#modalWord").textContent = detail.word;
  $("#modalPhonetic").textContent = detail.phonetic || "点击播放发音练习";
  $("#modalMeaning").textContent = detail.meaning;
  $("#modalMeanings").innerHTML = detail.meanings.map((text) => `<div class="line">${escapeHtml(text)}</div>`).join("");
  $("#modalSimilar").innerHTML = detail.similar.length
    ? detail.similar.map((text) => `<span class="tag">${escapeHtml(text)}</span>`).join("")
    : `<span class="tag">暂无</span>`;
  $("#modalExample").textContent = detail.example || "可以回到原句里理解这个词。";
  $("#modalMemory").textContent = detail.memory;
  $("#wordModal").classList.add("open");
  $("#wordModal").setAttribute("aria-hidden", "false");
}

function closeWordModal() {
  $("#wordModal").classList.remove("open");
  $("#wordModal").setAttribute("aria-hidden", "true");
}

function renderHeader() {
  const item = lesson();
  const completed = completedDays.length;

  $("#dayBadge").textContent = `Day ${item.day}`;
  $("#theme").textContent = item.theme;
  $("#completedText").textContent = `${completed} / ${lessons.length}`;
  $("#progressFill").style.width = `${Math.round((completed / lessons.length) * 100)}%`;
  $("#todayTitle").textContent = item.theme;
}

function renderWords() {
  $("#wordList").innerHTML = lesson().words
    .map((word) => `
      <article class="word-card">
        <div class="word-head">
          <div>
            <div class="word">${word.word}</div>
            <div class="phonetic">${word.phonetic}</div>
          </div>
          <button class="play" data-audio="${word.audio}" data-text="${word.word}">发音</button>
        </div>
        <div class="meaning">${word.meaning}</div>
        <div class="label">多重解释</div>
        ${word.meanings.map((text) => `<div class="line">${text}</div>`).join("")}
        <div class="label">相似/相关词</div>
        <div class="tags">${word.similar.map((text) => `<span class="tag">${text}</span>`).join("")}</div>
        <div class="label">例句</div>
        <div class="line">${word.example}</div>
        <div class="memory">${word.memory}</div>
      </article>
    `)
    .join("");
}

function renderSentences() {
  $("#sentenceList").innerHTML = lesson().sentenceCards
    .map((sentence) => `
      <article class="sentence">
        <div class="sentence-row">
          <div class="sentence-text">${linkWords(sentence.text)}</div>
          <button class="play" data-audio="${sentence.audio}" data-text="${sentence.text}">听</button>
        </div>
        <div class="hint">看一遍，听自己读 5 遍</div>
      </article>
    `)
    .join("");
}

function renderDialogue() {
  $("#dialogueList").innerHTML = lesson().dialogueCards
    .map((line, index) => `
      <article class="dialogue-row ${line.speaker === "B" ? "b" : ""}">
        <div class="speaker">${line.speaker}</div>
        <div class="dialogue-bubble">
          <div class="dialogue-content">
          <div class="dialogue-text">${linkWords(line.text)}</div>
            <div class="dialogue-translation" id="dialogueTranslation${index}">${line.translation || ""}</div>
          </div>
          <div class="dialogue-actions">
            <button class="play" data-audio="${line.audio}" data-text="${line.text}">听</button>
            <button class="translate" data-translation-id="dialogueTranslation${index}">翻译</button>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderPlan() {
  $("#planList").innerHTML = lessons
    .map((item) => `
      <button class="plan-item ${completedDays.includes(item.day) ? "done" : ""}" data-day="${item.day}">
        <span class="plan-day">Day ${item.day}</span>
        <span class="plan-main">
          <span class="plan-theme">${item.theme}</span>
          <span class="plan-words">${item.words.map((word) => word.word).join(" / ")}</span>
        </span>
      </button>
    `)
    .join("");
}

function renderReview() {
  const learned = lessons
    .filter((item) => completedDays.includes(item.day))
    .flatMap((item) => item.words)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  $("#reviewList").innerHTML = learned.length
    ? learned.map((word) => `
      <article class="review-item">
        <div class="review-row">
          <div>
            <div class="word">${word.word}</div>
            <div class="phonetic">${word.phonetic}</div>
          </div>
          <button class="play" data-audio="${word.audio}" data-text="${word.word}">发音</button>
        </div>
        <div class="meaning">${word.meaning}</div>
        <div class="memory">${word.memory}</div>
      </article>
    `).join("")
    : `<div class="empty">完成第一天打卡后，这里会自动出现复习词。</div>`;
}

function renderToday() {
  renderHeader();
  renderWords();
  renderSentences();
  renderDialogue();
  $("#outputTask").textContent = lesson().output;
  $("#completeBtn").textContent = completedDays.includes(lesson().day)
    ? "今天已完成，看看下一天"
    : "完成今天打卡";
}

function render() {
  renderToday();
  renderPlan();
  renderReview();
}

function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${tab}Panel`);
  });
}

document.addEventListener("click", (event) => {
  const playButton = event.target.closest("[data-audio]");
  const lookupWord = event.target.closest("[data-lookup-word]");
  const translateButton = event.target.closest("[data-translation-id]");
  const tabButton = event.target.closest("[data-tab]");
  const planButton = event.target.closest("[data-day]");

  if (lookupWord) {
    openWordModal(lookupWord.dataset.lookupWord);
    return;
  }

  if (playButton) {
    play(playButton.dataset.audio, playButton.dataset.text);
  }

  if (translateButton) {
    const translation = document.getElementById(translateButton.dataset.translationId);
    if (translation) {
      const visible = translation.classList.toggle("visible");
      translateButton.textContent = visible ? "隐藏" : "翻译";
    }
  }

  if (tabButton) {
    switchTab(tabButton.dataset.tab);
  }

  if (planButton) {
    currentDay = Number(planButton.dataset.day);
    saveState();
    switchTab("today");
    render();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-word-modal]")) {
    closeWordModal();
  }
});

$("#modalPlay").addEventListener("click", () => {
  play(modalAudioPath, modalAudioText);
});

$("#completeBtn").addEventListener("click", () => {
  const day = lesson().day;
  if (!completedDays.includes(day)) {
    completedDays.push(day);
    currentDay = Math.min(day + 1, lessons.length);
  } else {
    currentDay = Math.min(day + 1, lessons.length);
  }
  saveState();
  render();
});

$("#shuffleBtn").addEventListener("click", renderReview);

$("#resetBtn").addEventListener("click", () => {
  if (!confirm("会清空已完成打卡，从 Day 1 重新开始。")) {
    return;
  }
  completedDays = [];
  currentDay = 1;
  saveState();
  render();
});

loadLessons()
  .then(() => {
    buildGlossary();
    render();
  })
  .catch(() => {
    $("#todayTitle").textContent = "加载失败";
    $("#wordList").innerHTML = `<div class="empty">请用本地服务打开手机网页版，不要直接双击 HTML 文件。</div>`;
  });
