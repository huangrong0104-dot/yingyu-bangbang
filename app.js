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
const appVersion = "20260705-10";

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

const embeddedModules = {
  "wordDetails.js": "const { audioPath } = require(\"./audio\");\n\nconst phonetics = {\n  meeting: \"/ˈmiːtɪŋ/\",\n  agenda: \"/əˈdʒendə/\",\n  attend: \"/əˈtend/\",\n  reschedule: \"/ˌriːˈʃedjuːl/\",\n  minutes: \"/ˈmɪnɪts/\",\n  task: \"/tæsk/\",\n  deadline: \"/ˈdedlaɪn/\",\n  priority: \"/praɪˈɔːrəti/\",\n  progress: \"/ˈprɑːɡres/\",\n  status: \"/ˈsteɪtəs/\",\n  email: \"/ˈiːmeɪl/\",\n  reply: \"/rɪˈplaɪ/\",\n  forward: \"/ˈfɔːrwərd/\",\n  attachment: \"/əˈtætʃmənt/\",\n  subject: \"/ˈsʌbdʒekt/\",\n  document: \"/ˈdɑːkjumənt/\",\n  file: \"/faɪl/\",\n  folder: \"/ˈfoʊldər/\",\n  version: \"/ˈvɜːrʒn/\",\n  template: \"/ˈtemplət/\",\n  confirm: \"/kənˈfɜːrm/\",\n  \"double-check\": \"/ˌdʌbl ˈtʃek/\",\n  detail: \"/ˈdiːteɪl/\",\n  requirement: \"/rɪˈkwaɪərmənt/\",\n  information: \"/ˌɪnfərˈmeɪʃn/\",\n  issue: \"/ˈɪʃuː/\",\n  bug: \"/bʌɡ/\",\n  solution: \"/səˈluːʃn/\",\n  fix: \"/fɪks/\",\n  cause: \"/kɔːz/\",\n  project: \"/ˈprɑːdʒekt/\",\n  owner: \"/ˈoʊnər/\",\n  milestone: \"/ˈmaɪlstoʊn/\",\n  timeline: \"/ˈtaɪmlaɪn/\",\n  deliverable: \"/dɪˈlɪvərəbl/\",\n  client: \"/ˈklaɪənt/\",\n  request: \"/rɪˈkwest/\",\n  feedback: \"/ˈfiːdbæk/\",\n  proposal: \"/prəˈpoʊzl/\",\n  approval: \"/əˈpruːvl/\",\n  report: \"/rɪˈpɔːrt/\",\n  summary: \"/ˈsʌməri/\",\n  update: \"/ˌʌpˈdeɪt/\",\n  result: \"/rɪˈzʌlt/\",\n  \"next step\": \"/nekst step/\",\n  data: \"/ˈdeɪtə/\",\n  sheet: \"/ʃiːt/\",\n  chart: \"/tʃɑːrt/\",\n  number: \"/ˈnʌmbər/\",\n  total: \"/ˈtoʊtl/\",\n  schedule: \"/ˈskedʒuːl/\",\n  available: \"/əˈveɪləbl/\",\n  busy: \"/ˈbɪzi/\",\n  slot: \"/slɑːt/\",\n  reminder: \"/rɪˈmaɪndər/\",\n  handover: \"/ˈhændoʊvər/\",\n  access: \"/ˈækses/\",\n  account: \"/əˈkaʊnt/\",\n  password: \"/ˈpæswɜːrd/\",\n  permission: \"/pərˈmɪʃn/\",\n  scope: \"/skoʊp/\",\n  change: \"/tʃeɪndʒ/\",\n  estimate: \"/ˈestɪmət/\",\n  impact: \"/ˈɪmpækt/\",\n  risk: \"/rɪsk/\",\n  delay: \"/dɪˈleɪ/\",\n  blocker: \"/ˈblɑːkər/\",\n  urgent: \"/ˈɜːrdʒənt/\",\n  \"backup plan\": \"/ˈbækʌp plæn/\",\n  support: \"/səˈpɔːrt/\",\n  review: \"/rɪˈvjuː/\",\n  approve: \"/əˈpruːv/\",\n  share: \"/ʃer/\",\n  team: \"/tiːm/\",\n  colleague: \"/ˈkɑːliːɡ/\",\n  manager: \"/ˈmænɪdʒər/\",\n  partner: \"/ˈpɑːrtnər/\",\n  vendor: \"/ˈvendər/\",\n  \"follow up\": \"/ˈfɑːloʊ ʌp/\",\n  \"action item\": \"/ˈækʃn ˈaɪtəm/\",\n  pending: \"/ˈpendɪŋ/\",\n  done: \"/dʌn/\",\n  close: \"/kloʊz/\",\n  call: \"/kɔːl/\",\n  mute: \"/mjuːt/\",\n  speaker: \"/ˈspiːkər/\",\n  screen: \"/skriːn/\",\n  \"share screen\": \"/ʃer skriːn/\",\n  regarding: \"/rɪˈɡɑːrdɪŋ/\",\n  appreciate: \"/əˈpriːʃieɪt/\",\n  kindly: \"/ˈkaɪndli/\",\n  \"as discussed\": \"/æz dɪˈskʌst/\",\n  \"best regards\": \"/best rɪˈɡɑːrdz/\",\n  experience: \"/ɪkˈspɪriəns/\",\n  skill: \"/skɪl/\",\n  responsibility: \"/rɪˌspɑːnsəˈbɪləti/\",\n  strength: \"/streŋθ/\",\n  challenge: \"/ˈtʃælɪndʒ/\",\n  process: \"/ˈprɑːses/\",\n  standard: \"/ˈstændərd/\",\n  step: \"/step/\",\n  checklist: \"/ˈtʃeklɪst/\",\n  quality: \"/ˈkwɑːləti/\",\n  budget: \"/ˈbʌdʒɪt/\",\n  cost: \"/kɔːst/\",\n  price: \"/praɪs/\",\n  invoice: \"/ˈɪnvɔɪs/\",\n  payment: \"/ˈpeɪmənt/\",\n  sales: \"/seɪlz/\",\n  order: \"/ˈɔːrdər/\",\n  contract: \"/ˈkɑːntrækt/\",\n  customer: \"/ˈkʌstəmər/\",\n  delivery: \"/dɪˈlɪvəri/\",\n  operation: \"/ˌɑːpəˈreɪʃn/\",\n  service: \"/ˈsɜːrvɪs/\",\n  ticket: \"/ˈtɪkɪt/\",\n  response: \"/rɪˈspɑːns/\",\n  \"daily report\": \"/ˈdeɪli rɪˈpɔːrt/\",\n  completed: \"/kəmˈpliːtɪd/\",\n  \"in progress\": \"/ɪn ˈprɑːɡres/\",\n  blocked: \"/blɑːkt/\",\n  \"tomorrow plan\": \"/təˈmɑːroʊ plæn/\",\n  communicate: \"/kəˈmjuːnɪkeɪt/\",\n  coordinate: \"/koʊˈɔːrdɪneɪt/\",\n  improve: \"/ɪmˈpruːv/\",\n  deliver: \"/dɪˈlɪvər/\",\n  continue: \"/kənˈtɪnjuː/\"\n};\n\nconst relatedGroups = [\n  [\"meeting\", \"agenda\", \"attend\", \"reschedule\", \"minutes\", \"conference\", \"discussion\", \"appointment\", \"participant\", \"note\"],\n  [\"task\", \"deadline\", \"priority\", \"progress\", \"status\", \"assignment\", \"due date\", \"timeline\", \"workflow\", \"update\"],\n  [\"email\", \"reply\", \"forward\", \"attachment\", \"subject\", \"inbox\", \"message\", \"copy\", \"recipient\", \"signature\"],\n  [\"document\", \"file\", \"folder\", \"version\", \"template\", \"record\", \"draft\", \"format\", \"copy\", \"archive\"],\n  [\"confirm\", \"double-check\", \"detail\", \"requirement\", \"information\", \"verify\", \"clarify\", \"specifics\", \"condition\", \"note\"],\n  [\"issue\", \"bug\", \"solution\", \"fix\", \"cause\", \"problem\", \"error\", \"reason\", \"method\", \"improvement\"],\n  [\"project\", \"owner\", \"milestone\", \"timeline\", \"deliverable\", \"phase\", \"goal\", \"resource\", \"plan\", \"outcome\"],\n  [\"client\", \"request\", \"feedback\", \"proposal\", \"approval\", \"customer\", \"comment\", \"suggestion\", \"decision\", \"response\"],\n  [\"report\", \"summary\", \"update\", \"result\", \"next step\", \"overview\", \"brief\", \"finding\", \"action\", \"follow-up\"],\n  [\"data\", \"sheet\", \"chart\", \"number\", \"total\", \"table\", \"metric\", \"figure\", \"trend\", \"analysis\"],\n  [\"schedule\", \"available\", \"busy\", \"slot\", \"reminder\", \"calendar\", \"appointment\", \"time\", \"availability\", \"notice\"],\n  [\"handover\", \"access\", \"account\", \"password\", \"permission\", \"login\", \"role\", \"authorization\", \"transfer\", \"credential\"],\n  [\"scope\", \"change\", \"estimate\", \"impact\", \"requirement\", \"range\", \"adjustment\", \"effort\", \"effect\", \"plan\"],\n  [\"risk\", \"delay\", \"blocker\", \"urgent\", \"backup plan\", \"warning\", \"problem\", \"obstacle\", \"priority\", \"contingency\"],\n  [\"support\", \"review\", \"approve\", \"share\", \"request\", \"assist\", \"check\", \"accept\", \"send\", \"provide\"],\n  [\"team\", \"colleague\", \"manager\", \"partner\", \"vendor\", \"staff\", \"lead\", \"supplier\", \"member\", \"contact\"],\n  [\"follow up\", \"action item\", \"pending\", \"done\", \"close\", \"track\", \"todo\", \"open\", \"complete\", \"finish\"],\n  [\"call\", \"mute\", \"speaker\", \"screen\", \"share screen\", \"meeting\", \"audio\", \"microphone\", \"presenter\", \"display\"],\n  [\"regarding\", \"appreciate\", \"kindly\", \"as discussed\", \"best regards\", \"about\", \"thanks\", \"please\", \"noted\", \"sincerely\"],\n  [\"experience\", \"skill\", \"responsibility\", \"strength\", \"challenge\", \"background\", \"ability\", \"duty\", \"advantage\", \"difficulty\"],\n  [\"process\", \"standard\", \"step\", \"checklist\", \"quality\", \"procedure\", \"rule\", \"stage\", \"review\", \"control\"],\n  [\"budget\", \"cost\", \"price\", \"invoice\", \"payment\", \"expense\", \"fee\", \"quote\", \"bill\", \"finance\"],\n  [\"sales\", \"order\", \"contract\", \"customer\", \"delivery\", \"deal\", \"purchase\", \"agreement\", \"buyer\", \"shipment\"],\n  [\"operation\", \"service\", \"ticket\", \"response\", \"support\", \"workflow\", \"maintenance\", \"case\", \"reply\", \"help\"],\n  [\"daily report\", \"completed\", \"in progress\", \"blocked\", \"tomorrow plan\", \"update\", \"finished\", \"ongoing\", \"stuck\", \"plan\"],\n  [\"communicate\", \"coordinate\", \"improve\", \"deliver\", \"continue\", \"discuss\", \"align\", \"enhance\", \"submit\", \"proceed\"]\n];\n\nconst fallbackRelated = [\n  \"plan\",\n  \"update\",\n  \"check\",\n  \"discuss\",\n  \"confirm\",\n  \"review\",\n  \"share\",\n  \"support\",\n  \"follow-up\",\n  \"summary\"\n];\n\nconst usageNotes = {\n  agenda: \"开会前别人发 agenda，就是告诉你这次会要讨论什么。看到 agenda，先想到“会前清单”。\",\n  attend: \"attend 后面常接 meeting / call / training，意思是“去参加”。比 join 更正式一点。\",\n  reschedule: \"schedule 是安排时间；前面加 re-，就是重新安排时间，也就是“改期”。\",\n  minutes: \"minutes 在会议里不是“分钟”，而是“会议纪要”。会后发给大家看的记录。\",\n  deadline: \"deadline 是最后期限，不是普通时间。别人问 deadline，就是问“最晚什么时候交”。\",\n  priority: \"priority 表示优先级。high priority 就是这件事要先做。\",\n  status: \"status 常用来问进展：current status 就是“现在做到哪一步了”。\",\n  attachment: \"邮件里的 attachment 就是附件。常见句子是 Please check the attachment.\",\n  subject: \"subject 在邮件里是标题，不是学校里的“科目”。\",\n  version: \"version 常和 latest 连用：latest version 就是“最新版”。\",\n  template: \"template 是可以套用的模板，比如报价单模板、报告模板、邮件模板。\",\n  confirm: \"confirm 不是简单说 yes，而是把信息再确认一遍。\",\n  \"double-check\": \"double-check 是“再检查一次”，语气比 check 更谨慎。\",\n  requirement: \"requirement 是对方明确要的条件或需求，不只是“想法”。\",\n  issue: \"issue 在工作里常指需要处理的问题，语气比 problem 更职场。\",\n  bug: \"bug 多用于系统、软件、流程出错，不是普通“虫子”。\",\n  solution: \"solution 是解决方案，常和 issue/problem 搭配。\",\n  fix: \"fix 可以是动词“修复”，也可以是名词“修复办法”。\",\n  cause: \"cause 是原因。find the cause 就是先查为什么出问题。\",\n  owner: \"project owner 不是“老板”，而是这个项目的负责人。\",\n  milestone: \"milestone 是项目里的关键节点，比如上线、交付、评审。\",\n  timeline: \"timeline 是一整条时间安排，不只是某一个时间点。\",\n  deliverable: \"deliverable 是最后要交出去的东西，比如报告、文件、方案。\",\n  feedback: \"feedback 是别人看完后给你的意见，可以是修改建议，也可以是评价。\",\n  proposal: \"proposal 是提交给别人看的方案，通常还需要对方确认或批准。\",\n  approval: \"approval 是批准。waiting for approval 就是等对方点头。\",\n  summary: \"summary 是把重点压缩后说清楚，不是把全部内容重复一遍。\",\n  update: \"update 在汇报里常表示“进展更新”。Here is a quick update 很常用。\",\n  result: \"result 是结果。汇报时可以说 The result looks good.\",\n  \"next step\": \"next step 是下一步动作，适合会议结尾确认谁接着做什么。\",\n  available: \"available 用来问别人有没有空，也可以说资源是否可用。\",\n  slot: \"slot 是一小段可安排的时间，比如 3:00-3:30 这个空档。\",\n  handover: \"handover 是交接，把工作、账号、文件或进度交给别人。\",\n  access: \"access 是访问权限。没有 access 就进不了系统或文件。\",\n  permission: \"permission 是许可/权限，常用于账号、文件、系统设置。\",\n  scope: \"scope 是范围。out of scope 就是不在这次工作范围内。\",\n  estimate: \"estimate 是预估，不是最终数字。常用于时间、成本、工作量。\",\n  impact: \"impact 是影响。别人问 impact，就是问这件事会影响什么。\",\n  risk: \"risk 是风险，事情还没发生，但可能造成问题。\",\n  blocker: \"blocker 是挡住进度的问题。不解决它，任务就推进不了。\",\n  urgent: \"urgent 是紧急。urgent 不一定重要，但需要快处理。\",\n  \"backup plan\": \"backup plan 是备用方案，主方案出问题时用。\",\n  vendor: \"vendor 是供应商，不是客户。客户买东西，vendor 提供东西。\",\n  \"action item\": \"action item 是会后要做的具体事项，通常要有人负责。\",\n  pending: \"pending 是还没处理完、还在等。\",\n  regarding: \"regarding 常用于邮件开头，意思是“关于……”。\",\n  appreciate: \"appreciate 比 thanks 更正式，适合邮件里表达感谢。\",\n  kindly: \"kindly 常放在请求里，让语气更礼貌，比如 Kindly check.\",\n  \"as discussed\": \"as discussed 用在邮件里，表示“按我们刚才讨论的”。\",\n  \"best regards\": \"best regards 是邮件结尾礼貌用语，不是正文内容。\",\n  responsibility: \"responsibility 是职责，适合介绍自己负责什么工作。\",\n  checklist: \"checklist 是检查清单，一项项确认有没有漏。\",\n  budget: \"budget 是预算，还没花出去；cost 是已经或预计要花的钱。\",\n  invoice: \"invoice 是发票/账单，通常用于付款流程。\",\n  contract: \"contract 是合同，常和 review/sign/approve 搭配。\",\n  delivery: \"delivery 在工作里常指交付或发货，不只是外卖。\",\n  ticket: \"ticket 在客服/IT 里是工单，不是车票。\",\n  response: \"response 是回复或响应，常用于客户、客服、系统处理。\",\n  \"in progress\": \"in progress 表示正在进行中，还没完成。\",\n  coordinate: \"coordinate 是协调，让不同人或团队配合起来。\",\n  deliver: \"deliver 在工作里常表示按时交付结果。\"\n};\n\nconst memoryHooks = {\n  agenda: \"记法：agenda 像“安排单”。会议开始前先看安排单。\",\n  reschedule: \"记法：re = again，schedule = 安排时间，所以 reschedule = 重新安排时间。\",\n  minutes: \"记法：会议结束后几分钟内整理出来的重点，可以联想到 minutes = 会议纪要。\",\n  deadline: \"记法：dead + line，像一条不能越过的最后线。\",\n  attachment: \"记法：attach 是贴上/附上，attachment 就是邮件上附着的文件。\",\n  \"double-check\": \"记法：double 是两次，所以 double-check 是检查第二遍。\",\n  milestone: \"记法：mile + stone，路上的里程碑，项目里的关键节点。\",\n  deliverable: \"记法：deliver 是交付，deliverable 是可以交付出去的成果。\",\n  approval: \"记法：approve 是批准，approval 是“批准这件事”。\",\n  \"next step\": \"记法：会议最后问 next step，就是问下一步谁做什么。\",\n  slot: \"记法：把日程想成很多小格子，空出来的一格就是 slot。\",\n  handover: \"记法：hand + over，把手里的工作交过去。\",\n  blocker: \"记法：block 是挡住，blocker 就是挡住进度的东西。\",\n  pending: \"记法：pending 像挂在那里，事情还没有落地完成。\",\n  \"as discussed\": \"记法：discussed 是已经讨论过，用在邮件里接上刚才的会议内容。\",\n  checklist: \"记法：check + list，一张用来打勾确认的清单。\",\n  invoice: \"记法：看到 invoice 就想到付款流程里的票据。\",\n  ticket: \"记法：客服/IT 里的 ticket 像排队号码，一个问题对应一个工单。\",\n  \"in progress\": \"记法：progress 是进度，in progress 就是在进度中。\"\n};\n\nfunction getRelatedWords(word, lessonWords) {\n  const blocked = new Set([word, ...lessonWords]);\n  const group = relatedGroups.find((items) => items.includes(word)) || fallbackRelated;\n  const candidates = [...group, ...fallbackRelated]\n    .filter((item, index, items) => items.indexOf(item) === index)\n    .filter((item) => !blocked.has(item));\n\n  if (candidates.length <= 3) {\n    return candidates;\n  }\n\n  const groupIndex = Math.max(group.indexOf(word), 0);\n  return [0, 1, 2].map((step) => candidates[(groupIndex + step) % candidates.length]);\n}\n\nfunction getWordDetail(word, meaning, relatedWords) {\n  const related = getRelatedWords(word, relatedWords);\n\n  return {\n    word,\n    meaning,\n    phonetic: phonetics[word] || \"\",\n    meanings: [meaning],\n    similar: related,\n    memory: memoryHooks[word] || \"\",\n    example: `I need to use ${word} at work.`,\n    examples: [],\n    sentence: \"\",\n    sentenceCn: \"\",\n    understanding: usageNotes[word] || \"\",\n    audio: audioPath(word)\n  };\n}\n\nmodule.exports = {\n  getWordDetail\n};\n",
  "translations.js": "const sentenceTranslations = {\n  \"I have a meeting this afternoon.\": \"我今天下午有一个会议。\",\n  \"Can we reschedule the meeting?\": \"我们可以把会议改期吗？\",\n  \"I will send the meeting minutes.\": \"我会发送会议纪要。\",\n  \"What is the deadline?\": \"截止时间是什么时候？\",\n  \"This task is high priority.\": \"这个任务优先级很高。\",\n  \"What is the current status?\": \"目前状态怎么样？\",\n  \"I will reply to the email.\": \"我会回复这封邮件。\",\n  \"Please check the attachment.\": \"请查看附件。\",\n  \"I will forward it to you.\": \"我会把它转发给你。\",\n  \"Please use this template.\": \"请使用这个模板。\",\n  \"This is the latest version.\": \"这是最新版本。\",\n  \"I saved the file in the folder.\": \"我把文件保存在文件夹里了。\",\n  \"Can you confirm the details?\": \"你能确认一下细节吗？\",\n  \"I will double-check the information.\": \"我会再次检查这些信息。\",\n  \"We need to confirm the requirement.\": \"我们需要确认需求。\",\n  \"There is an issue.\": \"这里有一个问题。\",\n  \"We need to find the cause.\": \"我们需要找到原因。\",\n  \"I will fix it today.\": \"我今天会修复它。\",\n  \"Who is the project owner?\": \"项目负责人是谁？\",\n  \"What is the timeline?\": \"时间线是怎样的？\",\n  \"This is the main deliverable.\": \"这是主要交付物。\",\n  \"The client has a request.\": \"客户有一个请求。\",\n  \"We received feedback from the client.\": \"我们收到了客户的反馈。\",\n  \"We are waiting for approval.\": \"我们正在等待批准。\",\n  \"Here is a quick update.\": \"这里有一个简短更新。\",\n  \"The result looks good.\": \"结果看起来不错。\",\n  \"What is the next step?\": \"下一步是什么？\",\n  \"Please update the sheet.\": \"请更新表格。\",\n  \"The total number is correct.\": \"总数是正确的。\",\n  \"This chart shows the result.\": \"这个图表展示了结果。\",\n  \"Are you available tomorrow?\": \"你明天有空吗？\",\n  \"I am busy this morning.\": \"我今天上午很忙。\",\n  \"Do you have a time slot?\": \"你有空的时间段吗？\",\n  \"I will do the handover today.\": \"我今天会做交接。\",\n  \"Do you have access?\": \"你有权限吗？\",\n  \"Please give me permission.\": \"请给我权限。\",\n  \"We received client feedback.\": \"我们收到了客户反馈。\",\n  \"The requirement is clear.\": \"需求很清楚。\",\n  \"This change has an impact.\": \"这个变更有影响。\",\n  \"Can you estimate the time?\": \"你能估算一下时间吗？\",\n  \"There is a risk.\": \"这里有一个风险。\",\n  \"This task may be delayed.\": \"这个任务可能会延迟。\",\n  \"We need a backup plan.\": \"我们需要一个备用方案。\",\n  \"Could you review this file?\": \"你能审查一下这个文件吗？\",\n  \"Please share the document.\": \"请分享这个文档。\",\n  \"Can you approve this request?\": \"你能批准这个请求吗？\",\n  \"I will check with my manager.\": \"我会和我的经理确认。\",\n  \"My colleague will follow up.\": \"我的同事会跟进。\",\n  \"We need to contact the vendor.\": \"我们需要联系供应商。\",\n  \"I will follow up tomorrow.\": \"我明天会跟进。\",\n  \"This action item is pending.\": \"这个待办事项还在待处理。\",\n  \"Can we close this task?\": \"我们可以结束这个任务吗？\",\n  \"Can you hear me?\": \"你能听到我说话吗？\",\n  \"I will share my screen.\": \"我会共享我的屏幕。\",\n  \"Sorry, I was on mute.\": \"抱歉，我刚才静音了。\",\n  \"Regarding the report, I have one question.\": \"关于这份报告，我有一个问题。\",\n  \"I appreciate your help.\": \"感谢你的帮助。\",\n  \"As discussed, I will send the file today.\": \"如讨论所述，我今天会发送文件。\",\n  \"I have experience in this area.\": \"我在这个领域有经验。\",\n  \"My responsibility is project support.\": \"我的职责是项目支持。\",\n  \"This is a big challenge for me.\": \"这对我来说是一个很大的挑战。\",\n  \"What is the process?\": \"流程是什么？\",\n  \"Please follow the checklist.\": \"请按照检查清单操作。\",\n  \"We need to improve the quality.\": \"我们需要提升质量。\",\n  \"What is the budget?\": \"预算是多少？\",\n  \"The cost is too high.\": \"成本太高了。\",\n  \"Please send the invoice.\": \"请发送发票。\",\n  \"We received a new order.\": \"我们收到了一个新订单。\",\n  \"The contract is ready.\": \"合同已经准备好了。\",\n  \"When is the delivery date?\": \"交付日期是什么时候？\",\n  \"The support ticket is open.\": \"这个支持工单还开着。\",\n  \"We need a quick response.\": \"我们需要快速响应。\",\n  \"The service is working well.\": \"服务运行良好。\",\n  \"Here is my daily report.\": \"这是我的工作日报。\",\n  \"Two tasks are in progress.\": \"有两个任务正在进行中。\",\n  \"My tomorrow plan is to follow up.\": \"我明天的计划是继续跟进。\",\n  \"I want to improve my communication.\": \"我想提升我的沟通能力。\",\n  \"I will coordinate with the team.\": \"我会和团队协调。\",\n  \"We need to deliver it on time.\": \"我们需要按时交付它。\"\n};\n\nfunction translateSentence(text) {\n  return sentenceTranslations[text] || \"\";\n}\n\nmodule.exports = {\n  translateSentence\n};\n",
  "lessons.js": "const { getWordDetail } = require(\"./wordDetails\");\nconst { audioPath } = require(\"./audio\");\nconst { translateSentence } = require(\"./translations\");\n\nconst rawLessons = [\n  {\n    day: 1,\n    theme: \"会议安排\",\n    words: [\n      [\"meeting\", \"会议\"],\n      [\"agenda\", \"议程\"],\n      [\"attend\", \"参加\"],\n      [\"reschedule\", \"改期\"],\n      [\"minutes\", \"会议纪要\"]\n    ],\n    sentences: [\n      \"I have a meeting this afternoon.\",\n      \"Can we reschedule the meeting?\",\n      \"I will send the meeting minutes.\"\n    ],\n    output: \"用 meeting 说一句今天的会议安排。\"\n  },\n  {\n    day: 2,\n    theme: \"任务推进\",\n    words: [\n      [\"task\", \"任务\"],\n      [\"deadline\", \"截止时间\"],\n      [\"priority\", \"优先级\"],\n      [\"progress\", \"进度\"],\n      [\"status\", \"状态\"]\n    ],\n    sentences: [\n      \"What is the deadline?\",\n      \"This task is high priority.\",\n      \"What is the current status?\"\n    ],\n    output: \"用 deadline 或 status 汇报一句工作情况。\"\n  },\n  {\n    day: 3,\n    theme: \"邮件沟通\",\n    words: [\n      [\"email\", \"邮件\"],\n      [\"reply\", \"回复\"],\n      [\"forward\", \"转发\"],\n      [\"attachment\", \"附件\"],\n      [\"subject\", \"主题\"]\n    ],\n    sentences: [\n      \"I will reply to the email.\",\n      \"Please check the attachment.\",\n      \"I will forward it to you.\"\n    ],\n    output: \"用 attachment 说一句邮件相关的话。\"\n  },\n  {\n    day: 4,\n    theme: \"文件资料\",\n    words: [\n      [\"document\", \"文档\"],\n      [\"file\", \"文件\"],\n      [\"folder\", \"文件夹\"],\n      [\"version\", \"版本\"],\n      [\"template\", \"模板\"]\n    ],\n    sentences: [\n      \"Please use this template.\",\n      \"This is the latest version.\",\n      \"I saved the file in the folder.\"\n    ],\n    output: \"用 latest version 说一句。\"\n  },\n  {\n    day: 5,\n    theme: \"确认信息\",\n    words: [\n      [\"confirm\", \"确认\"],\n      [\"double-check\", \"再次检查\"],\n      [\"detail\", \"细节\"],\n      [\"requirement\", \"需求\"],\n      [\"information\", \"信息\"]\n    ],\n    sentences: [\n      \"Can you confirm the details?\",\n      \"I will double-check the information.\",\n      \"We need to confirm the requirement.\"\n    ],\n    output: \"用 confirm 说一句你想确认的事情。\"\n  },\n  {\n    day: 6,\n    theme: \"问题处理\",\n    words: [\n      [\"issue\", \"问题\"],\n      [\"bug\", \"错误\"],\n      [\"solution\", \"解决方案\"],\n      [\"fix\", \"修复\"],\n      [\"cause\", \"原因\"]\n    ],\n    sentences: [\n      \"There is an issue.\",\n      \"We need to find the cause.\",\n      \"I will fix it today.\"\n    ],\n    output: \"用 issue 或 solution 说一句。\"\n  },\n  {\n    day: 7,\n    theme: \"周复习\",\n    words: [\n      [\"agenda\", \"议程\"],\n      [\"deadline\", \"截止时间\"],\n      [\"attachment\", \"附件\"],\n      [\"version\", \"版本\"],\n      [\"issue\", \"问题\"]\n    ],\n    sentences: [\n      \"Please check the attachment.\",\n      \"This is the latest version.\",\n      \"What is the deadline?\"\n    ],\n    output: \"选本周最有用的 3 个词，各造一句中文意思明确的英文短句。\"\n  },\n  {\n    day: 8,\n    theme: \"项目协作\",\n    words: [\n      [\"project\", \"项目\"],\n      [\"owner\", \"负责人\"],\n      [\"milestone\", \"里程碑\"],\n      [\"timeline\", \"时间线\"],\n      [\"deliverable\", \"交付物\"]\n    ],\n    sentences: [\n      \"Who is the project owner?\",\n      \"What is the timeline?\",\n      \"This is the main deliverable.\"\n    ],\n    output: \"用 project owner 说一句。\"\n  },\n  {\n    day: 9,\n    theme: \"客户沟通\",\n    words: [\n      [\"client\", \"客户\"],\n      [\"request\", \"请求\"],\n      [\"feedback\", \"反馈\"],\n      [\"proposal\", \"方案\"],\n      [\"approval\", \"批准\"]\n    ],\n    sentences: [\n      \"The client has a request.\",\n      \"We received feedback from the client.\",\n      \"We are waiting for approval.\"\n    ],\n    output: \"用 feedback 或 approval 说一句客户相关的话。\"\n  },\n  {\n    day: 10,\n    theme: \"汇报表达\",\n    words: [\n      [\"report\", \"报告\"],\n      [\"summary\", \"总结\"],\n      [\"update\", \"更新\"],\n      [\"result\", \"结果\"],\n      [\"next step\", \"下一步\"]\n    ],\n    sentences: [\n      \"Here is a quick update.\",\n      \"The result looks good.\",\n      \"What is the next step?\"\n    ],\n    output: \"用 Here is... 做一句简单汇报。\"\n  },\n  {\n    day: 11,\n    theme: \"数据与表格\",\n    words: [\n      [\"data\", \"数据\"],\n      [\"sheet\", \"表格\"],\n      [\"chart\", \"图表\"],\n      [\"number\", \"数字\"],\n      [\"total\", \"总数\"]\n    ],\n    sentences: [\n      \"Please update the sheet.\",\n      \"The total number is correct.\",\n      \"This chart shows the result.\"\n    ],\n    output: \"用 sheet 或 chart 说一句。\"\n  },\n  {\n    day: 12,\n    theme: \"时间管理\",\n    words: [\n      [\"schedule\", \"日程\"],\n      [\"available\", \"有空的\"],\n      [\"busy\", \"忙的\"],\n      [\"slot\", \"时间段\"],\n      [\"reminder\", \"提醒\"]\n    ],\n    sentences: [\n      \"Are you available tomorrow?\",\n      \"I am busy this morning.\",\n      \"Do you have a time slot?\"\n    ],\n    output: \"用 available 问一句对方是否有空。\"\n  },\n  {\n    day: 13,\n    theme: \"交接和权限\",\n    words: [\n      [\"handover\", \"交接\"],\n      [\"access\", \"权限\"],\n      [\"account\", \"账号\"],\n      [\"password\", \"密码\"],\n      [\"permission\", \"许可\"]\n    ],\n    sentences: [\n      \"I will do the handover today.\",\n      \"Do you have access?\",\n      \"Please give me permission.\"\n    ],\n    output: \"用 access 说一句你是否有权限。\"\n  },\n  {\n    day: 14,\n    theme: \"周复习\",\n    words: [\n      [\"milestone\", \"里程碑\"],\n      [\"feedback\", \"反馈\"],\n      [\"update\", \"更新\"],\n      [\"sheet\", \"表格\"],\n      [\"available\", \"有空的\"]\n    ],\n    sentences: [\n      \"Here is a quick update.\",\n      \"Are you available tomorrow?\",\n      \"We received client feedback.\"\n    ],\n    output: \"把本周最像工作中会用到的一句读 10 遍。\"\n  },\n  {\n    day: 15,\n    theme: \"需求讨论\",\n    words: [\n      [\"requirement\", \"需求\"],\n      [\"scope\", \"范围\"],\n      [\"change\", \"变更\"],\n      [\"estimate\", \"估算\"],\n      [\"impact\", \"影响\"]\n    ],\n    sentences: [\n      \"The requirement is clear.\",\n      \"This change has an impact.\",\n      \"Can you estimate the time?\"\n    ],\n    output: \"用 requirement 或 impact 说一句。\"\n  },\n  {\n    day: 16,\n    theme: \"风险提醒\",\n    words: [\n      [\"risk\", \"风险\"],\n      [\"delay\", \"延迟\"],\n      [\"blocker\", \"阻碍\"],\n      [\"urgent\", \"紧急的\"],\n      [\"backup plan\", \"备用方案\"]\n    ],\n    sentences: [\n      \"There is a risk.\",\n      \"This task may be delayed.\",\n      \"We need a backup plan.\"\n    ],\n    output: \"用 risk 或 delay 提醒一句。\"\n  },\n  {\n    day: 17,\n    theme: \"工作请求\",\n    words: [\n      [\"request\", \"请求\"],\n      [\"support\", \"支持\"],\n      [\"review\", \"审查\"],\n      [\"approve\", \"批准\"],\n      [\"share\", \"分享\"]\n    ],\n    sentences: [\n      \"Could you review this file?\",\n      \"Please share the document.\",\n      \"Can you approve this request?\"\n    ],\n    output: \"用 Could you... 说一句礼貌请求。\"\n  },\n  {\n    day: 18,\n    theme: \"团队协作\",\n    words: [\n      [\"team\", \"团队\"],\n      [\"colleague\", \"同事\"],\n      [\"manager\", \"经理\"],\n      [\"partner\", \"合作方\"],\n      [\"vendor\", \"供应商\"]\n    ],\n    sentences: [\n      \"I will check with my manager.\",\n      \"My colleague will follow up.\",\n      \"We need to contact the vendor.\"\n    ],\n    output: \"用 manager 或 colleague 说一句。\"\n  },\n  {\n    day: 19,\n    theme: \"跟进事项\",\n    words: [\n      [\"follow up\", \"跟进\"],\n      [\"action item\", \"待办事项\"],\n      [\"pending\", \"待处理\"],\n      [\"done\", \"完成\"],\n      [\"close\", \"关闭/结束\"]\n    ],\n    sentences: [\n      \"I will follow up tomorrow.\",\n      \"This action item is pending.\",\n      \"Can we close this task?\"\n    ],\n    output: \"用 follow up 说一句你要跟进什么。\"\n  },\n  {\n    day: 20,\n    theme: \"电话会议\",\n    words: [\n      [\"call\", \"通话\"],\n      [\"mute\", \"静音\"],\n      [\"speaker\", \"发言人\"],\n      [\"screen\", \"屏幕\"],\n      [\"share screen\", \"共享屏幕\"]\n    ],\n    sentences: [\n      \"Can you hear me?\",\n      \"I will share my screen.\",\n      \"Sorry, I was on mute.\"\n    ],\n    output: \"把三句电话会议表达各读 5 遍。\"\n  },\n  {\n    day: 21,\n    theme: \"周复习\",\n    words: [\n      [\"scope\", \"范围\"],\n      [\"blocker\", \"阻碍\"],\n      [\"approve\", \"批准\"],\n      [\"vendor\", \"供应商\"],\n      [\"action item\", \"待办事项\"]\n    ],\n    sentences: [\n      \"This task may be delayed.\",\n      \"Could you review this file?\",\n      \"I will follow up tomorrow.\"\n    ],\n    output: \"做一次 30 秒小汇报：进度、问题、下一步。\"\n  },\n  {\n    day: 22,\n    theme: \"邮件礼貌语\",\n    words: [\n      [\"regarding\", \"关于\"],\n      [\"appreciate\", \"感谢\"],\n      [\"kindly\", \"请\"],\n      [\"as discussed\", \"如讨论所述\"],\n      [\"best regards\", \"此致\"]\n    ],\n    sentences: [\n      \"Regarding the report, I have one question.\",\n      \"I appreciate your help.\",\n      \"As discussed, I will send the file today.\"\n    ],\n    output: \"用 regarding 写一句邮件开头。\"\n  },\n  {\n    day: 23,\n    theme: \"面试和自我介绍\",\n    words: [\n      [\"experience\", \"经验\"],\n      [\"skill\", \"技能\"],\n      [\"responsibility\", \"职责\"],\n      [\"strength\", \"优势\"],\n      [\"challenge\", \"挑战\"]\n    ],\n    sentences: [\n      \"I have experience in this area.\",\n      \"My responsibility is project support.\",\n      \"This is a big challenge for me.\"\n    ],\n    output: \"用 My responsibility is... 说一句你的工作职责。\"\n  },\n  {\n    day: 24,\n    theme: \"流程和标准\",\n    words: [\n      [\"process\", \"流程\"],\n      [\"standard\", \"标准\"],\n      [\"step\", \"步骤\"],\n      [\"checklist\", \"检查清单\"],\n      [\"quality\", \"质量\"]\n    ],\n    sentences: [\n      \"What is the process?\",\n      \"Please follow the checklist.\",\n      \"We need to improve the quality.\"\n    ],\n    output: \"用 process 或 checklist 说一句。\"\n  },\n  {\n    day: 25,\n    theme: \"成本和预算\",\n    words: [\n      [\"budget\", \"预算\"],\n      [\"cost\", \"成本\"],\n      [\"price\", \"价格\"],\n      [\"invoice\", \"发票\"],\n      [\"payment\", \"付款\"]\n    ],\n    sentences: [\n      \"What is the budget?\",\n      \"The cost is too high.\",\n      \"Please send the invoice.\"\n    ],\n    output: \"用 budget 或 invoice 说一句。\"\n  },\n  {\n    day: 26,\n    theme: \"销售和订单\",\n    words: [\n      [\"sales\", \"销售\"],\n      [\"order\", \"订单\"],\n      [\"contract\", \"合同\"],\n      [\"customer\", \"客户\"],\n      [\"delivery\", \"交付/配送\"]\n    ],\n    sentences: [\n      \"We received a new order.\",\n      \"The contract is ready.\",\n      \"When is the delivery date?\"\n    ],\n    output: \"用 order 或 contract 说一句。\"\n  },\n  {\n    day: 27,\n    theme: \"运营和支持\",\n    words: [\n      [\"operation\", \"运营\"],\n      [\"support\", \"支持\"],\n      [\"service\", \"服务\"],\n      [\"ticket\", \"工单\"],\n      [\"response\", \"响应\"]\n    ],\n    sentences: [\n      \"The support ticket is open.\",\n      \"We need a quick response.\",\n      \"The service is working well.\"\n    ],\n    output: \"用 ticket 或 response 说一句。\"\n  },\n  {\n    day: 28,\n    theme: \"周复习\",\n    words: [\n      [\"regarding\", \"关于\"],\n      [\"responsibility\", \"职责\"],\n      [\"process\", \"流程\"],\n      [\"budget\", \"预算\"],\n      [\"contract\", \"合同\"]\n    ],\n    sentences: [\n      \"Regarding the report, I have one question.\",\n      \"What is the budget?\",\n      \"The contract is ready.\"\n    ],\n    output: \"选 5 个你工作最可能用到的词，收藏复习。\"\n  },\n  {\n    day: 29,\n    theme: \"工作日报\",\n    words: [\n      [\"daily report\", \"日报\"],\n      [\"completed\", \"已完成\"],\n      [\"in progress\", \"进行中\"],\n      [\"blocked\", \"受阻\"],\n      [\"tomorrow plan\", \"明日计划\"]\n    ],\n    sentences: [\n      \"Here is my daily report.\",\n      \"Two tasks are in progress.\",\n      \"My tomorrow plan is to follow up.\"\n    ],\n    output: \"说一个 20 秒工作日报：完成、进行中、明日计划。\"\n  },\n  {\n    day: 30,\n    theme: \"职场综合复盘\",\n    words: [\n      [\"communicate\", \"沟通\"],\n      [\"coordinate\", \"协调\"],\n      [\"improve\", \"提升\"],\n      [\"deliver\", \"交付\"],\n      [\"continue\", \"继续\"]\n    ],\n    sentences: [\n      \"I want to improve my communication.\",\n      \"I will coordinate with the team.\",\n      \"We need to deliver it on time.\"\n    ],\n    output: \"说一句你接下来最想提升的职场英语能力。\"\n  }\n];\n\nconst workExampleBank = {\n  meeting: [{ text: \"I have a meeting with the team this afternoon.\", translation: \"我今天下午要和团队开会。\" }],\n  agenda: [{ text: \"Please send the agenda before the meeting.\", translation: \"请在会议前发送议程。\" }],\n  attend: [{ text: \"I will attend the project meeting tomorrow.\", translation: \"我明天会参加项目会议。\" }],\n  reschedule: [{ text: \"Can we reschedule the call to Friday?\", translation: \"我们可以把电话会议改到周五吗？\" }],\n  minutes: [{ text: \"I will share the meeting minutes after the call.\", translation: \"电话会议后我会分享会议纪要。\" }],\n  task: [{ text: \"This task needs to be finished today.\", translation: \"这个任务今天需要完成。\" }],\n  deadline: [{ text: \"The deadline for this report is Friday.\", translation: \"这份报告的截止时间是周五。\" }],\n  priority: [{ text: \"This request is our top priority today.\", translation: \"这个请求是我们今天最优先处理的事项。\" }],\n  progress: [{ text: \"Can you update me on the progress?\", translation: \"你能告诉我一下进度吗？\" }],\n  status: [{ text: \"What is the current status of this task?\", translation: \"这个任务目前是什么状态？\" }],\n  email: [{ text: \"I will send you an email with the details.\", translation: \"我会给你发一封包含细节的邮件。\" }],\n  reply: [{ text: \"Please reply to the client today.\", translation: \"请今天回复客户。\" }],\n  forward: [{ text: \"I will forward the email to my manager.\", translation: \"我会把这封邮件转发给经理。\" }],\n  attachment: [{ text: \"Please check the attachment in the email.\", translation: \"请查看邮件里的附件。\" }],\n  subject: [{ text: \"Please update the email subject.\", translation: \"请更新邮件主题。\" }],\n  document: [{ text: \"Please review the document before the meeting.\", translation: \"请在会议前审阅这份文档。\" }],\n  file: [{ text: \"I uploaded the file to the shared folder.\", translation: \"我把文件上传到了共享文件夹。\" }],\n  folder: [{ text: \"The file is in the project folder.\", translation: \"文件在项目文件夹里。\" }],\n  version: [{ text: \"Please use the latest version of the file.\", translation: \"请使用这个文件的最新版本。\" }],\n  template: [{ text: \"Please use this template for the report.\", translation: \"请用这个模板写报告。\" }],\n  confirm: [{ text: \"Can you confirm the meeting time?\", translation: \"你能确认一下会议时间吗？\" }],\n  \"double-check\": [{ text: \"I will double-check the numbers before sending the report.\", translation: \"发送报告前我会再检查一遍数字。\" }],\n  detail: [{ text: \"Please send me the details by email.\", translation: \"请通过邮件把细节发给我。\" }],\n  requirement: [{ text: \"The client changed the requirement this morning.\", translation: \"客户今天上午改了需求。\" }],\n  information: [{ text: \"Please share the information with the team.\", translation: \"请把这些信息分享给团队。\" }],\n  issue: [{ text: \"There is an issue with the latest file.\", translation: \"最新文件有一个问题。\" }],\n  bug: [{ text: \"The team found a bug in the system.\", translation: \"团队在系统里发现了一个错误。\" }],\n  solution: [{ text: \"We need a solution before the client meeting.\", translation: \"客户会议前我们需要一个解决方案。\" }],\n  fix: [{ text: \"I will fix the issue this afternoon.\", translation: \"我今天下午会修复这个问题。\" }],\n  cause: [{ text: \"We need to find the cause of the delay.\", translation: \"我们需要找出延迟的原因。\" }],\n  project: [{ text: \"This project starts next Monday.\", translation: \"这个项目下周一开始。\" }],\n  owner: [{ text: \"Who is the owner of this task?\", translation: \"这个任务的负责人是谁？\" }],\n  milestone: [{ text: \"The next milestone is the client review.\", translation: \"下一个里程碑是客户评审。\" }],\n  timeline: [{ text: \"Can you share the project timeline?\", translation: \"你能分享项目时间线吗？\" }],\n  deliverable: [{ text: \"The main deliverable is a weekly report.\", translation: \"主要交付物是一份周报。\" }],\n  client: [{ text: \"The client asked for an update.\", translation: \"客户要求更新进展。\" }],\n  request: [{ text: \"We received a new request from the client.\", translation: \"我们收到了客户的新请求。\" }],\n  feedback: [{ text: \"The client gave feedback on the proposal.\", translation: \"客户对方案给了反馈。\" }],\n  proposal: [{ text: \"I will send the proposal this afternoon.\", translation: \"我今天下午会发送方案。\" }],\n  approval: [{ text: \"We are waiting for manager approval.\", translation: \"我们正在等待经理批准。\" }],\n  report: [{ text: \"Please send the weekly report by Friday.\", translation: \"请在周五前发送周报。\" }],\n  summary: [{ text: \"Can you write a short summary of the meeting?\", translation: \"你能写一份简短的会议总结吗？\" }],\n  update: [{ text: \"Here is a quick update on the project.\", translation: \"这是项目的简短进展更新。\" }],\n  result: [{ text: \"The result looks good so far.\", translation: \"目前结果看起来不错。\" }],\n  \"next step\": [{ text: \"What is the next step after this meeting?\", translation: \"这次会议后的下一步是什么？\" }],\n  data: [{ text: \"Please check the data in the sheet.\", translation: \"请检查表格里的数据。\" }],\n  sheet: [{ text: \"I updated the sheet this morning.\", translation: \"我今天上午更新了表格。\" }],\n  chart: [{ text: \"This chart shows the monthly result.\", translation: \"这张图表展示了月度结果。\" }],\n  number: [{ text: \"The number in this report is not correct.\", translation: \"这份报告里的数字不正确。\" }],\n  total: [{ text: \"Please check the total before sending it.\", translation: \"发送前请检查总数。\" }],\n  schedule: [{ text: \"My schedule is full this afternoon.\", translation: \"我今天下午的日程满了。\" }],\n  available: [{ text: \"Are you available for a call tomorrow?\", translation: \"你明天有空开个电话会议吗？\" }],\n  busy: [{ text: \"I am busy with a client request today.\", translation: \"我今天忙着处理一个客户请求。\" }],\n  slot: [{ text: \"Do you have a time slot tomorrow morning?\", translation: \"你明天上午有空档吗？\" }],\n  reminder: [{ text: \"Please set a reminder for the deadline.\", translation: \"请为截止时间设置一个提醒。\" }],\n  handover: [{ text: \"I will prepare the handover notes today.\", translation: \"我今天会准备交接说明。\" }],\n  access: [{ text: \"I do not have access to this folder.\", translation: \"我没有这个文件夹的访问权限。\" }],\n  account: [{ text: \"Please create an account for the new colleague.\", translation: \"请给新同事创建一个账号。\" }],\n  password: [{ text: \"Please reset your password before login.\", translation: \"登录前请重置密码。\" }],\n  permission: [{ text: \"Can you give me permission to edit this file?\", translation: \"你能给我编辑这个文件的权限吗？\" }],\n  scope: [{ text: \"This change is outside the project scope.\", translation: \"这个变更超出了项目范围。\" }],\n  change: [{ text: \"This change may affect the timeline.\", translation: \"这个变更可能会影响时间线。\" }],\n  estimate: [{ text: \"Can you estimate the work time?\", translation: \"你能估算一下工作时间吗？\" }],\n  impact: [{ text: \"What is the impact of this delay?\", translation: \"这个延迟有什么影响？\" }],\n  risk: [{ text: \"There is a risk with this plan.\", translation: \"这个计划有风险。\" }],\n  delay: [{ text: \"The delivery may have a short delay.\", translation: \"交付可能会有一点延迟。\" }],\n  blocker: [{ text: \"This issue is a blocker for the team.\", translation: \"这个问题阻碍了团队推进。\" }],\n  urgent: [{ text: \"This is an urgent client request.\", translation: \"这是一个紧急的客户请求。\" }],\n  \"backup plan\": [{ text: \"We need a backup plan for the launch.\", translation: \"我们需要一个上线备用方案。\" }],\n  support: [{ text: \"The support team will help with this issue.\", translation: \"支持团队会协助处理这个问题。\" }],\n  review: [{ text: \"Please review the file before noon.\", translation: \"请在中午前审阅这个文件。\" }],\n  approve: [{ text: \"Can you approve this request today?\", translation: \"你今天能批准这个请求吗？\" }],\n  share: [{ text: \"Please share the document with the team.\", translation: \"请把文档分享给团队。\" }],\n  team: [{ text: \"The team will discuss this tomorrow.\", translation: \"团队明天会讨论这件事。\" }],\n  colleague: [{ text: \"My colleague will follow up with the client.\", translation: \"我的同事会跟进客户。\" }],\n  manager: [{ text: \"I will check this with my manager.\", translation: \"我会和经理确认这件事。\" }],\n  partner: [{ text: \"Our partner will join the meeting.\", translation: \"我们的合作方会参加会议。\" }],\n  vendor: [{ text: \"The vendor will send the invoice today.\", translation: \"供应商今天会发送发票。\" }],\n  \"follow up\": [{ text: \"I will follow up with the client tomorrow.\", translation: \"我明天会跟进客户。\" }],\n  \"action item\": [{ text: \"This action item needs an owner.\", translation: \"这个待办事项需要一个负责人。\" }],\n  pending: [{ text: \"This request is still pending.\", translation: \"这个请求还在等待处理。\" }],\n  done: [{ text: \"The report is done and ready to send.\", translation: \"报告已经完成，可以发送了。\" }],\n  close: [{ text: \"Can we close this task today?\", translation: \"我们今天可以关闭这个任务吗？\" }],\n  call: [{ text: \"Can we have a quick call this afternoon?\", translation: \"我们今天下午可以快速通个电话吗？\" }],\n  mute: [{ text: \"Sorry, I was on mute during the call.\", translation: \"抱歉，我刚才电话会议时静音了。\" }],\n  speaker: [{ text: \"The speaker will present the project update.\", translation: \"发言人会介绍项目进展。\" }],\n  screen: [{ text: \"I can see your screen now.\", translation: \"我现在能看到你的屏幕了。\" }],\n  \"share screen\": [{ text: \"I will share screen and show the report.\", translation: \"我会共享屏幕并展示报告。\" }],\n  regarding: [{ text: \"Regarding the report, I have one question.\", translation: \"关于这份报告，我有一个问题。\" }],\n  appreciate: [{ text: \"I appreciate your quick response.\", translation: \"感谢你的快速回复。\" }],\n  kindly: [{ text: \"Kindly check the attachment.\", translation: \"请查看附件。\" }],\n  \"as discussed\": [{ text: \"As discussed, I will send the file today.\", translation: \"如讨论所说，我今天会发送文件。\" }],\n  \"best regards\": [{ text: \"Best regards is a common email closing.\", translation: \"Best regards 是常见的邮件结尾用语。\" }],\n  experience: [{ text: \"I have experience in customer support.\", translation: \"我有客户支持方面的经验。\" }],\n  skill: [{ text: \"Communication is an important work skill.\", translation: \"沟通是一项重要的工作技能。\" }],\n  responsibility: [{ text: \"My responsibility is project support.\", translation: \"我的职责是项目支持。\" }],\n  strength: [{ text: \"My strength is clear communication.\", translation: \"我的优势是清晰沟通。\" }],\n  challenge: [{ text: \"This project is a new challenge for me.\", translation: \"这个项目对我来说是新的挑战。\" }],\n  process: [{ text: \"Please follow the standard process.\", translation: \"请按照标准流程操作。\" }],\n  standard: [{ text: \"This report must meet our quality standard.\", translation: \"这份报告必须达到我们的质量标准。\" }],\n  step: [{ text: \"The next step is to confirm the timeline.\", translation: \"下一步是确认时间线。\" }],\n  checklist: [{ text: \"Please use the checklist before delivery.\", translation: \"交付前请使用检查清单。\" }],\n  quality: [{ text: \"We need to improve the quality of the report.\", translation: \"我们需要提高报告质量。\" }],\n  budget: [{ text: \"The project budget is limited.\", translation: \"项目预算有限。\" }],\n  cost: [{ text: \"The cost is higher than expected.\", translation: \"成本比预期更高。\" }],\n  price: [{ text: \"Can you confirm the final price?\", translation: \"你能确认最终价格吗？\" }],\n  invoice: [{ text: \"Please send the invoice to finance.\", translation: \"请把发票发给财务。\" }],\n  payment: [{ text: \"The payment is scheduled for next week.\", translation: \"付款安排在下周。\" }],\n  sales: [{ text: \"The sales team needs the latest data.\", translation: \"销售团队需要最新数据。\" }],\n  order: [{ text: \"We received a new order this morning.\", translation: \"我们今天上午收到一个新订单。\" }],\n  contract: [{ text: \"The contract is ready for review.\", translation: \"合同已经准备好审阅。\" }],\n  customer: [{ text: \"The customer asked for a delivery update.\", translation: \"客户询问交付进展。\" }],\n  delivery: [{ text: \"The delivery date is next Friday.\", translation: \"交付日期是下周五。\" }],\n  operation: [{ text: \"Daily operation is running smoothly.\", translation: \"日常运营进展顺利。\" }],\n  service: [{ text: \"The service is working well today.\", translation: \"今天服务运行良好。\" }],\n  ticket: [{ text: \"The support ticket is still open.\", translation: \"这个支持工单还没有关闭。\" }],\n  response: [{ text: \"We need a quick response from the client.\", translation: \"我们需要客户快速回复。\" }],\n  \"daily report\": [{ text: \"Please submit your daily report before six.\", translation: \"请在六点前提交你的日报。\" }],\n  completed: [{ text: \"The task is completed and ready for review.\", translation: \"任务已经完成，可以审阅了。\" }],\n  \"in progress\": [{ text: \"Two tasks are still in progress.\", translation: \"还有两个任务正在进行中。\" }],\n  blocked: [{ text: \"This task is blocked by an access issue.\", translation: \"这个任务因为权限问题被阻塞了。\" }],\n  \"tomorrow plan\": [{ text: \"My tomorrow plan is to follow up with the client.\", translation: \"我明天的计划是跟进客户。\" }],\n  communicate: [{ text: \"We need to communicate the change clearly.\", translation: \"我们需要清楚地沟通这个变更。\" }],\n  coordinate: [{ text: \"I will coordinate with the design team.\", translation: \"我会和设计团队协调。\" }],\n  improve: [{ text: \"We need to improve the response time.\", translation: \"我们需要提升响应速度。\" }],\n  deliver: [{ text: \"We need to deliver the report on time.\", translation: \"我们需要按时交付报告。\" }],\n  continue: [{ text: \"Let's continue this discussion tomorrow.\", translation: \"我们明天继续这个讨论。\" }]\n};\n\nconst usedExampleTexts = new Set();\n\nfunction fallbackExamples(detail) {\n  return [\n    {\n      text: `Please include \"${detail.word}\" in the project update.`,\n      translation: `请在项目更新里提到“${detail.word}”。`\n    },\n    {\n      text: `Can you add \"${detail.word}\" to the meeting notes?`,\n      translation: `你能把“${detail.word}”加到会议记录里吗？`\n    },\n    {\n      text: `The team discussed \"${detail.word}\" during the review.`,\n      translation: `团队在评审时讨论了“${detail.word}”。`\n    },\n    {\n      text: `I will mention \"${detail.word}\" in the client update.`,\n      translation: `我会在客户更新里提到“${detail.word}”。`\n    },\n    {\n      text: `Please check how \"${detail.word}\" affects the timeline.`,\n      translation: `请确认“${detail.word}”如何影响时间线。`\n    }\n  ];\n}\n\nfunction buildDialogueLines(lesson) {\n  const baseLines = lesson.sentences.map((sentence) => ({\n    text: sentence,\n    translation: translateSentence(sentence)\n  }));\n  const extraLines = lesson.words\n    .map((word) => workExampleBank[word[0]] && workExampleBank[word[0]][0])\n    .filter(Boolean);\n\n  const lines = [...baseLines, ...extraLines]\n    .filter((item, index, items) => items.findIndex((other) => other.text === item.text) === index)\n    .slice(0, 6);\n\n  while (lines.length < 6) {\n    const fallback = fallbackExamples({ word: lesson.words[lines.length % lesson.words.length][0] })[0];\n    if (!lines.some((item) => item.text === fallback.text)) {\n      lines.push(fallback);\n    } else {\n      break;\n    }\n  }\n\n  return lines;\n}\n\nconst lessons = rawLessons.map((lesson) => {\n  const relatedWords = lesson.words.map((word) => word[0]);\n  const dialogueLines = buildDialogueLines(lesson);\n\n  function generatedExamples(detail) {\n    return workExampleBank[detail.word] || [{\n      text: `Please check \"${detail.word}\" in the work context.`,\n      translation: `请在工作语境里理解“${detail.word}”。`\n    }];\n  }\n\n  return {\n    ...lesson,\n    sentenceCards: lesson.sentences.map((sentence) => ({\n      text: sentence,\n      audio: audioPath(sentence)\n    })),\n    dialogueCards: dialogueLines.map((line, index) => ({\n      speaker: index % 2 === 0 ? \"A\" : \"B\",\n      text: line.text,\n      translation: line.translation,\n      audio: audioPath(line.text)\n    })),\n    words: lesson.words.map((word) => {\n      const detail = getWordDetail(word[0], word[1], relatedWords);\n      const matchedExamples = lesson.sentences.filter((sentence) =>\n        sentence.toLowerCase().includes(detail.word.toLowerCase())\n      ).map((sentence) => ({\n        text: sentence,\n        translation: translateSentence(sentence)\n      }));\n      const candidates = [...generatedExamples(detail), ...matchedExamples, ...fallbackExamples(detail)]\n        .filter((item, index, items) => items.findIndex((other) => other.text === item.text) === index)\n      const examples = [];\n      for (const item of candidates) {\n        if (!usedExampleTexts.has(item.text)) {\n          examples.push(item);\n          usedExampleTexts.add(item.text);\n        }\n        if (examples.length === 3) {\n          break;\n        }\n      }\n      detail.examples = examples;\n      detail.example = examples[0].text;\n      detail.exampleTranslation = examples[0].translation;\n      return detail;\n    })\n  };\n});\n\nmodule.exports = {\n  lessons\n};\n"
};

function saveState() {
  localStorage.setItem("yingbang_current_day", String(currentDay));
  localStorage.setItem("yingbang_completed_days", JSON.stringify(completedDays));
  localStorage.setItem("yingbang_favorite_words", JSON.stringify(favoriteWords));
}

async function loadCommonJs(path, modules) {
  const candidates = Array.isArray(path) ? path : [path];
  let response = null;
  let code = "";

  for (const candidate of candidates) {
    try {
      response = await fetch(candidate, { cache: "no-store" });
      if (response.ok) {
        break;
      }
    } catch (error) {
      response = null;
    }
  }

  if (!response || !response.ok) {
    const fallbackKey = String(candidates[0]).match(/([^/?]+\.js)/)?.[1];
    if (!fallbackKey || !embeddedModules[fallbackKey]) {
      throw new Error(`Cannot load ${candidates.join(", ")}`);
    }
    code = embeddedModules[fallbackKey];
  } else {
    code = await response.text();
  }

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

function audioSlug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const browserAudioModule = {
  audioSlug,
  audioPath(text) {
    return `${repoBasePath()}/assets/audio/${audioSlug(text)}.wav`;
  }
};

async function loadLessons() {
  if (Array.isArray(window.YINGBANG_LESSONS)) {
    lessons = window.YINGBANG_LESSONS;
    return;
  }

  const audioModule = browserAudioModule;
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
