let lessons = [];
let currentDay = Number(localStorage.getItem("yingbang_current_day") || "1");
let completedDays = JSON.parse(localStorage.getItem("yingbang_completed_days") || "[]");
let favoriteWords = JSON.parse(localStorage.getItem("yingbang_favorite_words") || "[]");
let audio = null;
let glossary = {};
let modalAudioText = "";
let modalAudioPath = "";
let modalWordKey = "";
let preferredVoice = null;
let onlineAudio = null;
const appVersion = "20260705-8";

const state = {
  tab: "today"
};

const $ = (selector) => document.querySelector(selector);

const relatedMeanings = {
  conference: "会议/大会",
  discussion: "讨论",
  appointment: "预约/约定",
  participant: "参会者",
  note: "记录/备注",
  assignment: "分配的任务",
  "due date": "截止日期",
  workflow: "工作流程",
  inbox: "收件箱",
  message: "消息",
  copy: "抄送/副本",
  recipient: "收件人",
  signature: "签名",
  record: "记录",
  draft: "草稿",
  format: "格式",
  archive: "归档",
  verify: "核实",
  clarify: "澄清",
  specifics: "具体细节",
  condition: "条件",
  problem: "问题",
  error: "错误",
  reason: "原因",
  method: "方法",
  improvement: "改进",
  phase: "阶段",
  goal: "目标",
  resource: "资源",
  outcome: "结果",
  customer: "客户",
  comment: "评论/意见",
  suggestion: "建议",
  decision: "决定",
  overview: "概览",
  brief: "简报",
  finding: "发现",
  action: "行动",
  "follow-up": "后续跟进",
  table: "表格",
  metric: "指标",
  figure: "数字/图示",
  trend: "趋势",
  analysis: "分析",
  calendar: "日历",
  time: "时间",
  availability: "可用时间",
  notice: "通知",
  login: "登录",
  role: "角色",
  authorization: "授权",
  transfer: "转交",
  credential: "凭证",
  range: "范围",
  adjustment: "调整",
  effort: "工作量",
  effect: "影响",
  warning: "警告",
  obstacle: "障碍",
  contingency: "应急方案",
  assist: "协助",
  check: "检查",
  accept: "接受",
  send: "发送",
  provide: "提供",
  staff: "员工",
  lead: "负责人",
  supplier: "供应商",
  member: "成员",
  contact: "联系人",
  track: "追踪",
  todo: "待办",
  open: "未关闭",
  complete: "完成",
  finish: "完成",
  audio: "音频",
  microphone: "麦克风",
  presenter: "演示者",
  display: "显示屏/展示",
  about: "关于",
  thanks: "感谢",
  please: "请",
  noted: "已知悉",
  sincerely: "谨上/诚挚地",
  background: "背景",
  ability: "能力",
  duty: "职责",
  advantage: "优势",
  difficulty: "困难",
  procedure: "流程",
  rule: "规则",
  stage: "阶段",
  control: "控制",
  expense: "费用",
  fee: "费用",
  quote: "报价",
  bill: "账单",
  finance: "财务",
  deal: "交易",
  purchase: "采购",
  agreement: "协议",
  buyer: "买方",
  shipment: "发货/运输",
  maintenance: "维护",
  case: "案例/工单",
  help: "帮助",
  finished: "已完成",
  ongoing: "进行中",
  stuck: "卡住/受阻",
  discuss: "讨论",
  align: "对齐/达成一致",
  enhance: "增强/提升",
  submit: "提交",
  proceed: "继续推进"
};

const relatedPhonetics = {
  conference: "/ˈkɑːnfərəns/",
  discussion: "/dɪˈskʌʃn/",
  appointment: "/əˈpɔɪntmənt/",
  participant: "/pɑːrˈtɪsɪpənt/",
  note: "/noʊt/",
  assignment: "/əˈsaɪnmənt/",
  "due date": "/duː deɪt/",
  workflow: "/ˈwɜːrkfloʊ/",
  inbox: "/ˈɪnbɑːks/",
  message: "/ˈmesɪdʒ/",
  copy: "/ˈkɑːpi/",
  recipient: "/rɪˈsɪpiənt/",
  signature: "/ˈsɪɡnətʃər/",
  record: "/ˈrekərd/",
  draft: "/dræft/",
  format: "/ˈfɔːrmæt/",
  archive: "/ˈɑːrkaɪv/",
  verify: "/ˈverɪfaɪ/",
  clarify: "/ˈklærəfaɪ/",
  specifics: "/spəˈsɪfɪks/",
  condition: "/kənˈdɪʃn/",
  problem: "/ˈprɑːbləm/",
  error: "/ˈerər/",
  reason: "/ˈriːzn/",
  method: "/ˈmeθəd/",
  improvement: "/ɪmˈpruːvmənt/",
  phase: "/feɪz/",
  goal: "/ɡoʊl/",
  resource: "/ˈriːsɔːrs/",
  outcome: "/ˈaʊtkʌm/",
  comment: "/ˈkɑːment/",
  suggestion: "/səɡˈdʒestʃən/",
  decision: "/dɪˈsɪʒn/",
  overview: "/ˈoʊvərvjuː/",
  brief: "/briːf/",
  finding: "/ˈfaɪndɪŋ/",
  action: "/ˈækʃn/",
  "follow-up": "/ˈfɑːloʊ ʌp/",
  table: "/ˈteɪbl/",
  metric: "/ˈmetrɪk/",
  figure: "/ˈfɪɡjər/",
  trend: "/trend/",
  analysis: "/əˈnæləsɪs/",
  calendar: "/ˈkælɪndər/",
  time: "/taɪm/",
  availability: "/əˌveɪləˈbɪləti/",
  notice: "/ˈnoʊtɪs/",
  login: "/ˈlɔːɡɪn/",
  role: "/roʊl/",
  authorization: "/ˌɔːθərəˈzeɪʃn/",
  transfer: "/trænsˈfɜːr/",
  credential: "/krɪˈdenʃl/",
  range: "/reɪndʒ/",
  adjustment: "/əˈdʒʌstmənt/",
  effort: "/ˈefərt/",
  effect: "/ɪˈfekt/",
  warning: "/ˈwɔːrnɪŋ/",
  obstacle: "/ˈɑːbstəkl/",
  contingency: "/kənˈtɪndʒənsi/",
  assist: "/əˈsɪst/",
  check: "/tʃek/",
  accept: "/əkˈsept/",
  send: "/send/",
  provide: "/prəˈvaɪd/",
  staff: "/stæf/",
  lead: "/liːd/",
  supplier: "/səˈplaɪər/",
  member: "/ˈmembər/",
  contact: "/ˈkɑːntækt/",
  track: "/træk/",
  todo: "/tuːˈduː/",
  open: "/ˈoʊpən/",
  complete: "/kəmˈpliːt/",
  finish: "/ˈfɪnɪʃ/",
  audio: "/ˈɔːdioʊ/",
  microphone: "/ˈmaɪkrəfoʊn/",
  presenter: "/prɪˈzentər/",
  display: "/dɪˈspleɪ/",
  about: "/əˈbaʊt/",
  thanks: "/θæŋks/",
  please: "/pliːz/",
  noted: "/ˈnoʊtɪd/",
  sincerely: "/sɪnˈsɪrli/",
  background: "/ˈbækɡraʊnd/",
  ability: "/əˈbɪləti/",
  duty: "/ˈduːti/",
  advantage: "/ədˈvæntɪdʒ/",
  difficulty: "/ˈdɪfɪkəlti/",
  procedure: "/prəˈsiːdʒər/",
  rule: "/ruːl/",
  stage: "/steɪdʒ/",
  control: "/kənˈtroʊl/",
  expense: "/ɪkˈspens/",
  fee: "/fiː/",
  quote: "/kwoʊt/",
  bill: "/bɪl/",
  finance: "/ˈfaɪnæns/",
  deal: "/diːl/",
  purchase: "/ˈpɜːrtʃəs/",
  agreement: "/əˈɡriːmənt/",
  buyer: "/ˈbaɪər/",
  shipment: "/ˈʃɪpmənt/",
  maintenance: "/ˈmeɪntənəns/",
  case: "/keɪs/",
  help: "/help/",
  finished: "/ˈfɪnɪʃt/",
  ongoing: "/ˈɑːnɡoʊɪŋ/",
  stuck: "/stʌk/",
  discuss: "/dɪˈskʌs/",
  align: "/əˈlaɪn/",
  enhance: "/ɪnˈhæns/",
  submit: "/səbˈmɪt/",
  proceed: "/proʊˈsiːd/",
  plan: "/plæn/"
};

const relatedExampleBank = {
  conference: [{ text: "I will join the conference at two.", translation: "我会在两点参加大会。" }],
  discussion: [{ text: "Let's continue the discussion after lunch.", translation: "我们午饭后继续讨论。" }],
  appointment: [{ text: "I have an appointment with the client tomorrow.", translation: "我明天和客户有一个预约。" }],
  participant: [{ text: "Please send the agenda to all participants.", translation: "请把议程发给所有参会者。" }],
  note: [{ text: "I added a note to the project file.", translation: "我在项目文件里加了一条备注。" }],
  assignment: [{ text: "This assignment needs to be finished today.", translation: "这个分配的任务今天需要完成。" }],
  "due date": [{ text: "The due date for this task is Friday.", translation: "这个任务的截止日期是周五。" }],
  workflow: [{ text: "We need to improve the approval workflow.", translation: "我们需要改进审批流程。" }],
  inbox: [{ text: "Please check your inbox for the client email.", translation: "请查看收件箱里的客户邮件。" }],
  message: [{ text: "I sent a message to the team.", translation: "我给团队发了一条消息。" }],
  copy: [{ text: "Please send me a copy of the report.", translation: "请发我一份报告副本。" }],
  recipient: [{ text: "Please add the correct recipient before sending.", translation: "发送前请添加正确的收件人。" }],
  signature: [{ text: "Please add your signature at the end of the email.", translation: "请在邮件末尾加上你的签名。" }],
  record: [{ text: "Please keep a record of the client request.", translation: "请保留客户请求的记录。" }],
  draft: [{ text: "I will send the draft for review today.", translation: "我今天会发送草稿供审阅。" }],
  format: [{ text: "Please use the standard report format.", translation: "请使用标准报告格式。" }],
  archive: [{ text: "We should archive the old project files.", translation: "我们应该归档旧项目文件。" }],
  verify: [{ text: "Please verify the numbers before the meeting.", translation: "请在会议前核实这些数字。" }],
  clarify: [{ text: "Can you clarify the client requirement?", translation: "你能澄清一下客户需求吗？" }],
  specifics: [{ text: "Please send the specifics by email.", translation: "请通过邮件发送具体细节。" }],
  condition: [{ text: "The approval depends on one condition.", translation: "批准取决于一个条件。" }],
  problem: [{ text: "We need to solve this problem today.", translation: "我们今天需要解决这个问题。" }],
  error: [{ text: "There is an error in the report.", translation: "报告里有一个错误。" }],
  reason: [{ text: "What is the reason for the delay?", translation: "延迟的原因是什么？" }],
  method: [{ text: "This method can save the team time.", translation: "这个方法可以节省团队时间。" }],
  improvement: [{ text: "This improvement will help the workflow.", translation: "这个改进会帮助工作流程。" }],
  phase: [{ text: "The project is in the testing phase.", translation: "项目处于测试阶段。" }],
  goal: [{ text: "Our goal is to finish the report today.", translation: "我们的目标是今天完成报告。" }],
  resource: [{ text: "We need one more resource for this project.", translation: "这个项目还需要一个资源。" }],
  outcome: [{ text: "The outcome of the meeting was clear.", translation: "会议结果很清楚。" }],
  customer: [{ text: "The customer asked for a delivery update.", translation: "客户询问交付进展。" }],
  comment: [{ text: "The manager left a comment on the file.", translation: "经理在文件上留了一条评论。" }],
  suggestion: [{ text: "The client made a useful suggestion.", translation: "客户提出了一个有用的建议。" }],
  decision: [{ text: "We need a decision before Friday.", translation: "我们需要在周五前做决定。" }],
  overview: [{ text: "Please give me a quick overview of the project.", translation: "请给我一个项目简要概览。" }],
  brief: [{ text: "I will send a brief update after the meeting.", translation: "会议后我会发送一条简短更新。" }],
  finding: [{ text: "Please include this finding in the report.", translation: "请把这个发现写进报告。" }],
  action: [{ text: "We need clear action after the meeting.", translation: "会议后我们需要明确行动。" }],
  "follow-up": [{ text: "I will send a follow-up email tomorrow.", translation: "我明天会发送后续跟进邮件。" }],
  table: [{ text: "Please update the table in the report.", translation: "请更新报告里的表格。" }],
  metric: [{ text: "This metric is important for the sales report.", translation: "这个指标对销售报告很重要。" }],
  figure: [{ text: "Please double-check this figure.", translation: "请再检查一下这个数字。" }],
  trend: [{ text: "This chart shows a clear trend.", translation: "这张图表显示了明显趋势。" }],
  analysis: [{ text: "The analysis will be ready tomorrow.", translation: "分析明天会准备好。" }],
  calendar: [{ text: "Please add the meeting to your calendar.", translation: "请把会议加到你的日历里。" }],
  time: [{ text: "What time works for the client?", translation: "客户什么时间方便？" }],
  availability: [{ text: "Can you confirm your availability tomorrow?", translation: "你能确认明天是否有空吗？" }],
  notice: [{ text: "Please send a notice to the team.", translation: "请给团队发送一条通知。" }],
  login: [{ text: "Please login before joining the system.", translation: "进入系统前请先登录。" }],
  role: [{ text: "Your role in this project is reviewer.", translation: "你在这个项目里的角色是审阅人。" }],
  authorization: [{ text: "This action needs manager authorization.", translation: "这个操作需要经理授权。" }],
  transfer: [{ text: "We need to transfer the file to the new owner.", translation: "我们需要把文件转交给新的负责人。" }],
  credential: [{ text: "Please keep your login credential safe.", translation: "请妥善保管你的登录凭证。" }],
  range: [{ text: "The price is within the expected range.", translation: "价格在预期范围内。" }],
  adjustment: [{ text: "This adjustment will affect the timeline.", translation: "这个调整会影响时间线。" }],
  effort: [{ text: "This task needs more effort than expected.", translation: "这个任务需要比预期更多的工作量。" }],
  effect: [{ text: "The change has a small effect on delivery.", translation: "这个变更对交付有小影响。" }],
  warning: [{ text: "The system shows a warning message.", translation: "系统显示了一条警告信息。" }],
  obstacle: [{ text: "Access is the main obstacle right now.", translation: "权限是目前主要的障碍。" }],
  contingency: [{ text: "We need a contingency plan for the launch.", translation: "我们需要一个上线应急方案。" }],
  assist: [{ text: "Can you assist with the client report?", translation: "你能协助处理客户报告吗？" }],
  check: [{ text: "Please check the file before sending.", translation: "发送前请检查文件。" }],
  accept: [{ text: "The client will accept the proposal today.", translation: "客户今天会接受这个方案。" }],
  send: [{ text: "Please send the update to the team.", translation: "请把更新发送给团队。" }],
  provide: [{ text: "Can you provide the latest data?", translation: "你能提供最新数据吗？" }],
  staff: [{ text: "The staff need access to the system.", translation: "员工需要系统访问权限。" }],
  lead: [{ text: "The project lead will join the call.", translation: "项目负责人会参加电话会议。" }],
  supplier: [{ text: "The supplier will confirm the delivery date.", translation: "供应商会确认交付日期。" }],
  member: [{ text: "Each team member has one action item.", translation: "每位团队成员都有一个待办事项。" }],
  contact: [{ text: "Please contact the vendor today.", translation: "请今天联系供应商。" }],
  track: [{ text: "We need to track the project progress.", translation: "我们需要跟踪项目进度。" }],
  todo: [{ text: "This todo is still open.", translation: "这个待办事项还没有完成。" }],
  open: [{ text: "The support ticket is still open.", translation: "这个支持工单还开着。" }],
  complete: [{ text: "Please complete this task before noon.", translation: "请在中午前完成这个任务。" }],
  finish: [{ text: "I will finish the report today.", translation: "我今天会完成报告。" }],
  audio: [{ text: "The audio is not clear during the call.", translation: "电话会议里的音频不清楚。" }],
  microphone: [{ text: "Please check your microphone before the meeting.", translation: "会议前请检查麦克风。" }],
  presenter: [{ text: "The presenter will share the screen.", translation: "演示人会共享屏幕。" }],
  display: [{ text: "The dashboard will display the latest data.", translation: "仪表盘会显示最新数据。" }],
  about: [{ text: "I have a question about the report.", translation: "关于报告我有一个问题。" }],
  thanks: [{ text: "Thanks for the quick update.", translation: "感谢你的快速更新。" }],
  please: [{ text: "Please review the file today.", translation: "请今天审阅这个文件。" }],
  noted: [{ text: "Noted, I will follow up tomorrow.", translation: "收到，我明天会跟进。" }],
  sincerely: [{ text: "Sincerely is a formal email closing.", translation: "Sincerely 是正式的邮件结尾用语。" }],
  background: [{ text: "Can you share the project background?", translation: "你能分享一下项目背景吗？" }],
  ability: [{ text: "This role needs strong communication ability.", translation: "这个岗位需要很强的沟通能力。" }],
  duty: [{ text: "This duty belongs to the support team.", translation: "这项职责属于支持团队。" }],
  advantage: [{ text: "Fast response is our advantage.", translation: "快速响应是我们的优势。" }],
  difficulty: [{ text: "The main difficulty is the tight deadline.", translation: "主要困难是截止时间很紧。" }],
  procedure: [{ text: "Please follow the approval procedure.", translation: "请遵循审批流程。" }],
  rule: [{ text: "This rule applies to all team members.", translation: "这条规则适用于所有团队成员。" }],
  stage: [{ text: "The project is in the final stage.", translation: "项目处于最后阶段。" }],
  control: [{ text: "We need better quality control.", translation: "我们需要更好的质量控制。" }],
  expense: [{ text: "Please submit the expense report today.", translation: "请今天提交费用报告。" }],
  fee: [{ text: "The service fee is included in the quote.", translation: "服务费包含在报价里。" }],
  quote: [{ text: "Please send the quote to the customer.", translation: "请把报价发给客户。" }],
  bill: [{ text: "Please check the bill before payment.", translation: "付款前请检查账单。" }],
  finance: [{ text: "Finance will process the payment this week.", translation: "财务本周会处理付款。" }],
  deal: [{ text: "The sales team closed the deal today.", translation: "销售团队今天完成了这笔交易。" }],
  purchase: [{ text: "We need approval before the purchase.", translation: "采购前我们需要批准。" }],
  agreement: [{ text: "The agreement is ready for signature.", translation: "协议已经准备好签署。" }],
  buyer: [{ text: "The buyer asked for a lower price.", translation: "买方要求更低的价格。" }],
  shipment: [{ text: "The shipment will arrive next week.", translation: "货物下周会到达。" }],
  maintenance: [{ text: "The system maintenance starts tonight.", translation: "系统维护今晚开始。" }],
  case: [{ text: "This case needs support from IT.", translation: "这个工单需要 IT 支持。" }],
  help: [{ text: "Can you help me check this file?", translation: "你能帮我检查这个文件吗？" }],
  finished: [{ text: "The report is finished and ready to send.", translation: "报告已经完成，可以发送了。" }],
  ongoing: [{ text: "The discussion is still ongoing.", translation: "讨论仍在进行中。" }],
  stuck: [{ text: "I am stuck on the access issue.", translation: "我卡在权限问题上了。" }],
  discuss: [{ text: "Let's discuss the timeline tomorrow.", translation: "我们明天讨论时间线。" }],
  align: [{ text: "We need to align on the next step.", translation: "我们需要对齐下一步。" }],
  enhance: [{ text: "This change will enhance the user experience.", translation: "这个变更会提升用户体验。" }],
  submit: [{ text: "Please submit the final report today.", translation: "请今天提交最终报告。" }],
  proceed: [{ text: "Can we proceed with the current plan?", translation: "我们可以按当前计划继续推进吗？" }]
};

function saveState() {
  localStorage.setItem("yingbang_current_day", String(currentDay));
  localStorage.setItem("yingbang_completed_days", JSON.stringify(completedDays));
  localStorage.setItem("yingbang_favorite_words", JSON.stringify(favoriteWords));
}

async function loadCommonJs(path, modules) {
  const candidates = Array.isArray(path) ? path : [path];
  let response = null;

  for (const candidate of candidates) {
    response = await fetch(candidate, { cache: "no-store" });
    if (response.ok) {
      break;
    }
  }

  if (!response || !response.ok) {
    throw new Error(`Cannot load ${candidates.join(", ")}`);
  }

  const code = await response.text();
  const module = { exports: {} };
  const require = (name) => modules[name];
  Function("require", "module", "exports", code)(require, module, module.exports);
  return module.exports;
}

function repoBasePath() {
  const parts = location.pathname.split("/").filter(Boolean);
  const mobileIndex = parts.indexOf("mobile-web");

  if (mobileIndex > 0) {
    return `/${parts.slice(0, mobileIndex).join("/")}`;
  }

  if (location.hostname.endsWith("github.io") && parts.length > 0) {
    return `/${parts[0]}`;
  }

  return "";
}

function dataPaths(name) {
  const base = repoBasePath();
  const paths = [
    `./utils/${name}?v=${appVersion}`,
    `../utils/${name}?v=${appVersion}`,
    `${base}/utils/${name}?v=${appVersion}`,
    `/utils/${name}?v=${appVersion}`
  ];

  return [...new Set(paths)];
}

async function loadLessons() {
  if (Array.isArray(window.YINGBANG_LESSONS)) {
    lessons = window.YINGBANG_LESSONS;
    return;
  }

  const audioModule = await loadCommonJs(dataPaths("audio.js"), {});
  const wordDetails = await loadCommonJs(dataPaths("wordDetails.js"), {
    "./audio": audioModule
  });
  const translations = await loadCommonJs(dataPaths("translations.js"), {});
  const lessonModule = await loadCommonJs(dataPaths("lessons.js"), {
    "./audio": audioModule,
    "./wordDetails": wordDetails,
    "./translations": translations
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

function isFavoriteWord(word) {
  return favoriteWords.includes(normalizeWord(word));
}

function toggleFavoriteWord(word) {
  const key = normalizeWord(word);
  if (!key) {
    return;
  }

  favoriteWords = isFavoriteWord(key)
    ? favoriteWords.filter((item) => item !== key)
    : [...favoriteWords, key];
  saveState();
  render();

  if (modalWordKey === key && $("#wordModal").classList.contains("open")) {
    updateModalFavoriteButton(key);
  }
}

function updateModalFavoriteButton(word) {
  const favorite = isFavoriteWord(word);
  $("#modalFavorite").textContent = favorite ? "已收藏" : "收藏";
  $("#modalFavorite").classList.toggle("active", favorite);
  $("#modalFavorite").dataset.favoriteWord = normalizeWord(word);
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
    .replace(/>/g, "&gt;");
}

function optionalBlock(label, content, className = "memory") {
  if (!content) {
    return "";
  }

  return `
    <div class="label">${label}</div>
    <div class="${className}">${linkWords(content)}</div>
  `;
}

function translatedLine(text) {
  if (!text) {
    return "";
  }

  return `<div class="line muted-line">${escapeHtml(text)}</div>`;
}

function examplesForDetail(detail) {
  if (Array.isArray(detail.examples) && detail.examples.length) {
    return detail.examples;
  }

  return [{
    text: detail.example || `Please add "${detail.word}" to the project notes.`,
    translation: detail.exampleTranslation || ""
  }];
}

function examplesHtml(detail) {
  return examplesForDetail(detail).map((item) => `
    <div class="example-item">
      <div class="example-row">
        <div class="line">${linkWords(item.text)}</div>
        <button class="play example-play" data-audio="" data-text="${escapeHtml(item.text)}">听</button>
      </div>
      ${translatedLine(item.translation)}
    </div>
  `).join("");
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
  preferredVoice = preferredVoice || voices.find((voice) =>
    voice.lang === "en-US" && /google|microsoft|samantha|ava|jenny|aria/i.test(voice.name)
  ) || voices.find((voice) => voice.lang === "en-US") || voices.find((voice) => /^en[-_]/i.test(voice.lang));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  window.speechSynthesis.speak(utterance);
  return true;
}

function onlineTtsUrl(text) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${encodeURIComponent(text)}`;
}

function playOnlineTts(text) {
  if (!text) {
    return Promise.reject(new Error("No text"));
  }

  if (!onlineAudio) {
    onlineAudio = new Audio();
  }

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("Online TTS timeout")), 4500);

    onlineAudio.pause();
    onlineAudio.currentTime = 0;
    onlineAudio.src = onlineTtsUrl(text);
    onlineAudio.oncanplaythrough = null;
    onlineAudio.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Online TTS failed"));
    };
    onlineAudio.play().then(() => {
      window.clearTimeout(timer);
      resolve();
    }).catch((error) => {
      window.clearTimeout(timer);
      reject(error);
    });
  });
}

function playLocalAudio(path, text) {
  if (!path) {
    return Promise.reject(new Error("No local audio"));
  }

  if (!audio) {
    audio = new Audio();
  }

  audio.pause();
  audio.currentTime = 0;
  audio.src = path;

  return audio.play();
}

function play(path, text) {
  playOnlineTts(text)
    .catch(() => playLocalAudio(path, text))
    .catch(() => {
      if (!speakText(text)) {
        alert(`请跟读：${text || ""}`);
      }
    });
}

function detailForWord(rawWord) {
  const key = normalizeWord(rawWord);
  if (glossary[key]) {
    return glossary[key];
  }
  const examples = relatedExampleBank[key] || [{
    text: `Please add "${rawWord}" to the project notes.`,
    translation: `请把“${rawWord}”加到项目备注里。`
  }];

  return {
    word: rawWord,
    meaning: relatedMeanings[key] || "相关职场词",
    phonetic: relatedPhonetics[key] || "",
    meanings: [relatedMeanings[key] || "相关职场词"],
    similar: [],
    memory: "",
    example: examples[0].text,
    exampleTranslation: examples[0].translation,
    examples,
    sentence: "",
    sentenceCn: "",
    understanding: "",
    audio: ""
  };
}

function wordsForLesson(item = lesson()) {
  const baseWords = item.words || [];
  const seen = new Set(baseWords.map((word) => normalizeWord(word.word)));
  const relatedCandidates = baseWords
    .flatMap((word) => word.similar || [])
    .concat(Object.keys(relatedMeanings));
  const extraWords = [];

  for (const candidate of relatedCandidates) {
    const key = normalizeWord(candidate);
    if (!key || seen.has(key)) {
      continue;
    }

    extraWords.push(detailForWord(candidate));
    seen.add(key);
    if (baseWords.length + extraWords.length >= 10) {
      break;
    }
  }

  return [...baseWords, ...extraWords];
}

function openWordModal(rawWord) {
  const detail = detailForWord(rawWord);
  modalWordKey = normalizeWord(detail.word);
  modalAudioText = detail.word;
  modalAudioPath = detail.audio;

  $("#modalWord").textContent = detail.word;
  $("#modalPhonetic").textContent = detail.phonetic || "点击播放发音练习";
  $("#modalMeaning").textContent = detail.meaning;
  $("#modalMeanings").innerHTML = detail.meanings.map((text) => `<div class="line">${escapeHtml(text)}</div>`).join("");
  $("#modalSimilar").innerHTML = detail.similar.length
    ? detail.similar.map((text) => `<button class="tag tag-button" data-lookup-word="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join("")
    : `<span class="tag">暂无</span>`;
  $("#modalExamples").innerHTML = examplesHtml(detail);
  $("#modalUnderstandingBlock").style.display = detail.understanding ? "" : "none";
  $("#modalMemoryBlock").style.display = detail.memory ? "" : "none";
  $("#modalUnderstanding").innerHTML = detail.understanding ? linkWords(detail.understanding) : "";
  $("#modalMemory").innerHTML = detail.memory ? linkWords(detail.memory) : "";
  updateModalFavoriteButton(detail.word);
  $("#wordModal").classList.add("open");
  $("#wordModal").setAttribute("aria-hidden", "false");
}

function closeWordModal() {
  $("#wordModal").classList.remove("open");
  $("#wordModal").setAttribute("aria-hidden", "true");
}

function openCompleteModal(day) {
  $("#completeModalText").textContent = `Day ${day} 完成了。今天已经听、看、说了一轮，明天继续往前走。`;
  $("#completeModal").classList.add("open");
  $("#completeModal").setAttribute("aria-hidden", "false");
}

function closeCompleteModal() {
  $("#completeModal").classList.remove("open");
  $("#completeModal").setAttribute("aria-hidden", "true");
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
  $("#wordList").innerHTML = wordsForLesson()
    .map((word, index) => `
      <article class="word-card">
        <div class="word-head">
          <div>
            <div class="word-title-row">
              <span class="word-number">${index + 1}</span>
              <button class="word word-button" data-lookup-word="${escapeHtml(word.word)}">${word.word}</button>
            </div>
            <div class="phonetic">${word.phonetic}</div>
          </div>
          <div class="word-actions">
            <button class="favorite ${isFavoriteWord(word.word) ? "active" : ""}" data-favorite-word="${escapeHtml(word.word)}">${isFavoriteWord(word.word) ? "已收藏" : "收藏"}</button>
            <button class="play" data-audio="${word.audio}" data-text="${word.word}">发音</button>
          </div>
        </div>
        <div class="meaning">${word.meaning}</div>
        <div class="label">多重解释</div>
        ${word.meanings.map((text) => `<div class="line">${text}</div>`).join("")}
        <div class="label">相似/相关词</div>
        <div class="tags">${word.similar.map((text) => `<button class="tag tag-button" data-lookup-word="${escapeHtml(text)}">${text}</button>`).join("")}</div>
        <div class="label">例句</div>
        ${examplesHtml(word)}
        ${optionalBlock("帮助理解", word.understanding)}
        ${optionalBlock("联想记忆", word.memory)}
      </article>
    `)
    .join("");
}

function wordReviewCard(word) {
  return `
    <article class="review-item">
      <div class="review-row">
        <div>
          <button class="word word-button" data-lookup-word="${escapeHtml(word.word)}">${word.word}</button>
          <div class="phonetic">${word.phonetic}</div>
        </div>
        <div class="word-actions">
          <button class="favorite ${isFavoriteWord(word.word) ? "active" : ""}" data-favorite-word="${escapeHtml(word.word)}">${isFavoriteWord(word.word) ? "已收藏" : "收藏"}</button>
          <button class="play" data-audio="${word.audio}" data-text="${word.word}">发音</button>
        </div>
      </div>
      <div class="meaning">${word.meaning}</div>
      <div class="label">例句</div>
      ${examplesHtml(word)}
      ${optionalBlock("帮助理解", word.understanding)}
      ${optionalBlock("联想记忆", word.memory)}
    </article>
  `;
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
          <span class="plan-words">${wordsForLesson(item).map((word) => word.word).join(" / ")}</span>
        </span>
      </button>
    `)
    .join("");
}

function renderReview() {
  const allWords = lessons.flatMap((item) => wordsForLesson(item));
  const favorites = favoriteWords
    .map((key) => allWords.find((word) => normalizeWord(word.word) === key) || detailForWord(key))
    .filter(Boolean);
  const learned = lessons
    .filter((item) => completedDays.includes(item.day))
    .flatMap((item) => wordsForLesson(item))
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  $("#favoriteList").innerHTML = favorites.length
    ? favorites.map(wordReviewCard).join("")
    : `<div class="empty">看到陌生词时点“收藏”，这里就会变成你的重点复习清单。</div>`;

  $("#reviewList").innerHTML = learned.length
    ? learned.map(wordReviewCard).join("")
    : `<div class="empty">完成第一天打卡后，这里会自动出现复习词。</div>`;
}

function renderToday() {
  renderHeader();
  renderWords();
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
  const favoriteButton = event.target.closest("[data-favorite-word]");
  const translateButton = event.target.closest("[data-translation-id]");
  const tabButton = event.target.closest("[data-tab]");
  const planButton = event.target.closest("[data-day]");

  if (favoriteButton) {
    toggleFavoriteWord(favoriteButton.dataset.favoriteWord);
    return;
  }

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

  if (event.target.closest("[data-close-complete-modal]")) {
    closeCompleteModal();
  }
});

$("#modalPlay").addEventListener("click", () => {
  play(modalAudioPath, modalAudioText);
});

$("#completeBtn").addEventListener("click", (event) => {
  event.stopPropagation();
  const day = lesson().day;
  if (!completedDays.includes(day)) {
    completedDays.push(day);
  }
  saveState();
  render();
  openCompleteModal(day);
});

$("#completeModalBtn").addEventListener("click", () => {
  currentDay = Math.min(lesson().day + 1, lessons.length);
  saveState();
  closeCompleteModal();
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
  .catch((error) => {
    $("#todayTitle").textContent = "加载失败";
    $("#wordList").innerHTML = `<div class="empty">课程数据暂时没有加载出来：${escapeHtml(error.message || "未知错误")}</div>`;
  });
