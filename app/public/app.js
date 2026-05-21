const $ = (selector) => document.querySelector(selector);

const form = $("#generateForm");
const promptInput = $("#prompt");
const generateButton = $("#generateButton");
const surpriseButton = $("#surpriseButton");
const resetDefaults = $("#resetDefaults");
const playerPanel = $("#playerPanel");
const loadingText = $("#loadingText");
const statusEl = $("#status");
const audio = $("#audio");
const download = $("#download");
const exportMp4 = $("#exportMp4");
const trackTitle = $("#trackTitle");
const historyEl = $("#history");
const refreshHistory = $("#refreshHistory");
const copySettings = $("#copySettings");
const refreshModels = $("#refreshModels");
const modelPicker = $("#modelPicker");
const modelTrigger = $("#modelTrigger");
const modelMenu = $("#modelMenu");
const modelInput = $("#model");
const modelTitle = $("#modelTitle");
const modelHint = $("#modelHint");
const modelState = $("#modelState");
const authModal = $("#authModal");
const copyAuthCommand = $("#copyAuthCommand");
const continueDownload = $("#continueDownload");
const closeAuthModal = $("#closeAuthModal");

const dictionary = {
  ru: {
    heroTitle: "Своя студия генерации.",
    promptGuide: "Пиши промпт на английском: жанр, настроение, инструменты, темп и что исключить.",
    ready: "Готово",
    rendering: "Генерация",
    downloading: "Загрузка",
    exporting: "Экспорт",
    prompt: "Промпт",
    promptPlaceholder: "dark electronic music, deep bass, tight groove, no vocals, 118 BPM",
    generate: "Сгенерировать",
    promptIdea: "Идея",
    resetDefaults: "Сбросить настройки",
    model: "Модель",
    refresh: "Обновить",
    seconds: "Секунды",
    secondsHint: "15-45 с для набросков",
    steps: "Шаги",
    stepsHint: "8 — хороший баланс",
    cfgHint: "1 естественно, 2-4 точнее",
    seedHint: "повторяет результат",
    moreControls: "Дополнительные настройки",
    apgHint: "оставь 1",
    noise: "Шум",
    noiseHint: "1 для text-to-audio",
    dtypeHint: "fp16 быстрее",
    keepModels: "Держать в памяти",
    keepModelsHint: "не выгружать модели после генерации",
    negativePrompt: "Негативный промпт",
    negativePlaceholder: "drums, vocals, distortion",
    negativeHint: "Работает, когда CFG не равен 1",
    latestRender: "Последний рендер",
    noAudio: "Пока нет аудио",
    downloadWav: "Скачать WAV",
    exportMp4: "Экспорт MP4",
    copySettings: "Копировать настройки",
    copied: "Скопировано",
    recent: "Недавние",
    noRenders: "Рендеров пока нет",
    installed: "Установлена",
    installedState: "веса готовы",
    downloadModel: "Загрузить",
    modelPartial: "частично",
    authTitle: "Hugging Face не авторизован",
    authText: "Загрузка может быть медленной или ограниченной. Авторизуйтесь один раз в терминале, либо продолжите без входа.",
    copyCommand: "Скопировать команду",
    downloadAnyway: "Скачать всё равно",
    close: "Закрыть",
    readingPrompt: "Читаю промпт",
    sampling: "Сэмплирую трек",
    decoding: "Декодирую WAV",
    preparing: "Готовлю запуск",
    generating: "Генерирую аудио",
    stillWorking: "Ещё работаю",
    mp4Ready: "MP4 готов",
    errors: {
      failed: "Генерация не удалась.",
      noWav: "Сначала сгенерируй WAV.",
      exportFailed: "Не удалось экспортировать MP4.",
    },
    modelHints: {
      medium: "Лучшее локальное качество для законченных музыкальных идей.",
      "sm-music": "Быстрые музыкальные наброски и много вариантов.",
      "sm-sfx": "Короткие эффекты, импакты, атмосферы и текстуры.",
    },
    modelUse: {
      medium: "лучшее качество",
      "sm-music": "быстрая музыка",
      "sm-sfx": "эффекты и текстуры",
    },
  },
  en: {
    heroTitle: "Your generation studio.",
    promptGuide: "Write genre, mood, instruments, tempo, and exclusions: “dark bass groove, no vocals, 118 BPM”.",
    ready: "Ready",
    rendering: "Rendering",
    downloading: "Downloading",
    exporting: "Exporting",
    prompt: "Prompt",
    promptPlaceholder: "dark electronic music, deep bass, tight groove, no vocals, 118 BPM",
    generate: "Generate",
    promptIdea: "Prompt",
    resetDefaults: "Reset settings",
    model: "Model",
    refresh: "Refresh",
    seconds: "Seconds",
    secondsHint: "15-45s for sketches",
    steps: "Steps",
    stepsHint: "8 is the sweet spot",
    cfgHint: "1 natural, 2-4 stricter",
    seedHint: "reuse to repeat",
    moreControls: "More controls",
    apgHint: "leave at 1",
    noise: "Noise",
    noiseHint: "1 for text only",
    dtypeHint: "fp16 is faster",
    keepModels: "Keep in memory",
    keepModelsHint: "do not unload models after generation",
    negativePrompt: "Negative prompt",
    negativePlaceholder: "drums, vocals, distortion",
    negativeHint: "Only matters when CFG is not 1",
    latestRender: "Latest render",
    noAudio: "No audio yet",
    downloadWav: "Download WAV",
    exportMp4: "Export MP4",
    copySettings: "Copy settings",
    copied: "Copied",
    recent: "Recent",
    noRenders: "No renders yet",
    installed: "Installed",
    installedState: "weights ready",
    downloadModel: "Download",
    modelPartial: "partial",
    authTitle: "Hugging Face is not authorized",
    authText: "Downloads may be slower or limited. Log in once in Terminal, or continue without authentication.",
    copyCommand: "Copy command",
    downloadAnyway: "Download anyway",
    close: "Close",
    readingPrompt: "Reading the prompt",
    sampling: "Sampling the track",
    decoding: "Decoding the waveform",
    preparing: "Preparing the run",
    generating: "Generating audio",
    stillWorking: "Still working",
    mp4Ready: "MP4 ready",
    errors: {
      failed: "Generation failed.",
      noWav: "Generate a WAV first.",
      exportFailed: "MP4 export failed.",
    },
    modelHints: {
      medium: "Best local quality. Use this for finished music ideas.",
      "sm-music": "Fast music sketches. Great when you want many variations.",
      "sm-sfx": "Short effects, impacts, ambience, transitions, textures.",
    },
    modelUse: {
      medium: "highest quality",
      "sm-music": "fast music",
      "sm-sfx": "effects and textures",
    },
  },
};

const examples = {
  ru: [
    "bass-heavy dark electronic groove, massive sub-bass, tight rolling rhythm, industrial percussion, dark ambient pads, no vocals, clean powerful mix, 118 BPM",
    "powerful female vocal hook over a groovy electronic pop track, tight bass, bright synths, 124 BPM",
    "warm lofi house loop, tape saturation, soft keys, 90 BPM",
    "minimal dark ambient drone, metallic textures, wide cinematic space, no vocals",
  ],
  en: [
    "bass-heavy dark electronic groove, massive sub-bass, dark ambient pads, clean powerful mix, 118 BPM",
    "powerful female vocal hook over a groovy electronic pop track, tight bass, bright synths, 124 BPM",
    "warm lofi house loop, tape saturation, soft keys, 90 BPM",
    "minimal dark ambient drone, metallic textures, wide cinematic space, no vocals",
  ],
};

let lang = localStorage.getItem("sa3Language") || "ru";
let latestSettings = null;
let latestRender = null;
let pollTimer = null;
let currentModels = [];
let pendingDownloadModel = null;

function t(key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary[lang]) ?? key;
}

function setValue(id, value) {
  document.querySelector(`#${id}`).value = value;
}

function value(id) {
  return document.querySelector(`#${id}`).value;
}

function selectedModel() {
  return currentModels.find((model) => model.id === modelInput.value) || currentModels[0];
}

function stateText(model) {
  if (!model) return "";
  if (model.installed) return t("installed");
  if (model.present > 0) return `${t("modelPartial")} ${model.present}/${model.total}`;
  return `${model.present}/${model.total}`;
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("isActive", button.dataset.lang === lang);
  });
  if (!promptInput.value.trim() || promptInput.dataset.autofilled === "true") {
    promptInput.value = examples[lang][0];
    promptInput.dataset.autofilled = "true";
  }
  updateModelTrigger();
  renderModelMenu();
}

function setBusy(isBusy, type = "generate") {
  document.body.classList.toggle("busy", isBusy);
  playerPanel.classList.toggle("isLoading", isBusy);
  generateButton.disabled = isBusy;
  exportMp4.disabled = isBusy;
  document.querySelectorAll("[data-download-model]").forEach((button) => {
    button.disabled = isBusy;
  });
  statusEl.textContent = isBusy
    ? type === "download"
      ? t("downloading")
      : type === "export"
        ? t("exporting")
        : t("rendering")
    : t("ready");
  if (isBusy) {
    loadingText.textContent = type === "download" ? t("downloading") : type === "export" ? t("exporting") : t("generating");
    startPolling();
  } else {
    stopPolling();
  }
}

function payload() {
  const seedRaw = value("seed").trim();
  return {
    prompt: promptInput.value,
    model: modelInput.value,
    seconds: Number(value("seconds")),
    steps: Number(value("steps")),
    cfg: Number(value("cfg")),
    apg: Number(value("apg")),
    initNoiseLevel: Number(value("initNoiseLevel")),
    seed: seedRaw ? Number(seedRaw) : null,
    dtype: value("dtype"),
    negativePrompt: value("negativePrompt"),
    keepModels: $("#keepModels").checked,
  };
}

function resetToDefaults() {
  modelInput.value = "medium";
  setValue("seconds", 30);
  setValue("steps", 8);
  setValue("cfg", 1);
  setValue("seed", "");
  setValue("apg", 1);
  setValue("initNoiseLevel", 1);
  setValue("dtype", "fp16");
  setValue("negativePrompt", "");
  $("#keepModels").checked = false;
  promptInput.value = examples[lang][0];
  promptInput.dataset.autofilled = "true";
  updateModelTrigger();
  renderModelMenu();
}

function summarizeLogs(job) {
  const logs = job?.logs || "";
  if (job?.type === "download") return t("downloading");
  if (!logs) return t("generating");
  if (logs.includes("Decoder")) return t("decoding");
  if (logs.includes("DiT")) return t("sampling");
  if (logs.includes("T5Gemma")) return t("readingPrompt");
  return t("preparing");
}

function startPolling() {
  stopPolling();
  pollTimer = window.setInterval(async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.busy) loadingText.textContent = summarizeLogs(data.job);
    } catch {
      loadingText.textContent = t("stillWorking");
    }
  }, 900);
}

function stopPolling() {
  if (pollTimer) window.clearInterval(pollTimer);
  pollTimer = null;
}

function niceName(file) {
  return file
    .replace(/^\d{4}-\d{2}-\d{2}T/, "")
    .replace(/-[a-f0-9]{8}\.(wav|mp4)$/i, "")
    .replace(/\.(wav|mp4)$/i, "")
    .replaceAll("-", " ");
}

function setLatest(item, title = null) {
  latestRender = item;
  audio.src = item.url;
  download.href = item.url;
  download.download = item.name;
  trackTitle.textContent = title || niceName(item.name);
}

async function renderHistory(history) {
  const items = history || (await fetch("/api/history").then((r) => r.json())).history;
  historyEl.innerHTML = "";
  if (!items.length) {
    historyEl.innerHTML = `<div class="historyItem"><a>${t("noRenders")}</a></div>`;
    return;
  }
  if (!audio.getAttribute("src")) setLatest(items[0]);
  for (const item of items) {
    const card = document.createElement("article");
    card.className = "historyItem";
    card.innerHTML = `
      <a href="${item.url}" download>${niceName(item.name)}</a>
      <audio controls src="${item.url}"></audio>
    `;
    historyEl.appendChild(card);
  }
}

function updateModelTrigger() {
  const model = selectedModel();
  if (!model) return;
  const shortName = model.label.replace("Stable Audio 3 ", "");
  modelTitle.textContent = shortName;
  modelHint.textContent = t(`modelHints.${model.id}`);
  modelState.textContent = stateText(model);
  $("#seconds").max = model.maxSeconds;
}

function renderModelMenu() {
  modelMenu.innerHTML = "";
  for (const model of currentModels) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = `modelOption ${model.id === modelInput.value ? "isSelected" : ""}`;
    option.dataset.modelOption = model.id;
    const action = model.installed
      ? `<b>${t("installed")}</b>`
      : `<b class="downloadModel" data-download-model="${model.id}">${t("downloadModel")}</b>`;
    option.innerHTML = `
      <span>
        <strong>${model.label.replace("Stable Audio 3 ", "")}</strong>
        <small>${t(`modelUse.${model.id}`)} · ${model.installed ? t("installedState") : stateText(model)}</small>
      </span>
      ${action}
    `;
    modelMenu.appendChild(option);
  }
}

async function loadModels() {
  const res = await fetch("/api/models");
  const data = await res.json();
  currentModels = data.models;
  updateModelTrigger();
  renderModelMenu();
}

async function downloadModel(modelId) {
  setBusy(true, "download");
  try {
    const res = await fetch("/api/models/download", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: modelId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Download failed.");
    currentModels = data.models;
    updateModelTrigger();
    renderModelMenu();
  } catch (error) {
    trackTitle.textContent = error.message;
  } finally {
    setBusy(false);
  }
}

function openAuthModal(modelId) {
  pendingDownloadModel = modelId;
  authModal.classList.add("isOpen");
  authModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  authModal.classList.remove("isOpen");
  authModal.setAttribute("aria-hidden", "true");
}

async function guardedDownload(modelId) {
  const auth = await fetch("/api/auth").then((res) => res.json()).catch(() => ({ authenticated: false }));
  if (!auth.authenticated) {
    openAuthModal(modelId);
    return;
  }
  await downloadModel(modelId);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = payload();
  if (!body.prompt.trim()) {
    promptInput.focus();
    return;
  }
  promptInput.dataset.autofilled = "false";
  setBusy(true, "generate");
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t("errors.failed"));

    latestSettings = data.settings;
    setLatest(data, data.model);
    await renderHistory(data.history);
    await loadModels();
    audio.play().catch(() => {});
  } catch (error) {
    trackTitle.textContent = error.message;
  } finally {
    setBusy(false);
  }
});

modelTrigger.addEventListener("click", () => {
  const isOpen = modelPicker.classList.toggle("isOpen");
  modelTrigger.setAttribute("aria-expanded", String(isOpen));
});

modelMenu.addEventListener("click", async (event) => {
  const downloadTarget = event.target.closest("[data-download-model]");
  if (downloadTarget) {
    event.stopPropagation();
    await guardedDownload(downloadTarget.dataset.downloadModel);
    return;
  }
  const option = event.target.closest("[data-model-option]");
  if (!option) return;
  modelInput.value = option.dataset.modelOption;
  modelPicker.classList.remove("isOpen");
  modelTrigger.setAttribute("aria-expanded", "false");
  updateModelTrigger();
  renderModelMenu();
});

document.addEventListener("click", (event) => {
  if (!modelPicker.contains(event.target)) {
    modelPicker.classList.remove("isOpen");
    modelTrigger.setAttribute("aria-expanded", "false");
  }
});

exportMp4.addEventListener("click", async () => {
  if (!latestRender?.name?.endsWith(".wav")) {
    trackTitle.textContent = t("errors.noWav");
    return;
  }
  setBusy(true, "export");
  try {
    const res = await fetch("/api/export/mp4", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: latestRender.name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t("errors.exportFailed"));
    const link = document.createElement("a");
    link.href = data.url;
    link.download = data.name;
    link.click();
    statusEl.textContent = t("mp4Ready");
  } catch (error) {
    trackTitle.textContent = error.message;
  } finally {
    setBusy(false);
  }
});

surpriseButton.addEventListener("click", () => {
  promptInput.value = examples[lang][Math.floor(Math.random() * examples[lang].length)];
  promptInput.dataset.autofilled = "false";
  promptInput.focus();
});

resetDefaults.addEventListener("click", resetToDefaults);
refreshHistory.addEventListener("click", () => renderHistory());
refreshModels.addEventListener("click", () => loadModels());

copySettings.addEventListener("click", async () => {
  if (!latestSettings) return;
  await navigator.clipboard.writeText(JSON.stringify(latestSettings, null, 2));
  copySettings.textContent = t("copied");
  window.setTimeout(() => {
    copySettings.textContent = t("copySettings");
  }, 1000);
});

copyAuthCommand.addEventListener("click", async () => {
  await navigator.clipboard.writeText($("#authCommand").textContent);
  copyAuthCommand.textContent = t("copied");
  window.setTimeout(() => {
    copyAuthCommand.textContent = t("copyCommand");
  }, 1000);
});

continueDownload.addEventListener("click", async () => {
  const modelId = pendingDownloadModel;
  closeModal();
  if (modelId) await downloadModel(modelId);
});

closeAuthModal.addEventListener("click", closeModal);

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    lang = button.dataset.lang;
    localStorage.setItem("sa3Language", lang);
    applyLanguage();
    renderHistory();
  });
});

promptInput.addEventListener("input", () => {
  promptInput.dataset.autofilled = "false";
});

promptInput.value = examples[lang][0];
promptInput.dataset.autofilled = "true";
applyLanguage();
loadModels();
renderHistory();
