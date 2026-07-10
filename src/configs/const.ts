// #region 类型定义
/** 怪物类型 */
export type MonsterType = "小怪" | "精英怪";
// #endregion

// #region 常量
export const
  /** 操作按钮标签 */
  ACTION_LABEL = "操作",
  /** 统计卡片与表单间距（像素） */
  COUNT_CARD_MARGIN_BOTTOM = 20,
  /** 统计卡片无单车数据时车数占位文案 */
  COUNT_CARD_NO_CELL_CAR_TEXT = "未设置单车数量",
  /** 统计卡片无单车数据时前缀文案 */
  COUNT_CARD_NO_CELL_PREFIX = "还差",
  /** 统计卡片无单车数据时后缀文案 */
  COUNT_CARD_NO_CELL_SUFFIX = "只怪上限",
  /** 统计卡片“本世界已无”前缀文案 */
  COUNT_CARD_NOT_IN_WORLD_PREFIX = "本世界已无：",
  /** 不在本世界展示文案 */
  CURRENT_WORLD_NO = "否",
  /** 在本世界展示文案 */
  CURRENT_WORLD_YES = "是",
  /** 默认怪物数量上限 */
  DEFAULT_MONSTER_COUNT_LIMIT = 2000,
  /** 默认怪物名称 */
  DEFAULT_MONSTER_NAME = "默认",
  /** 默认怪物类型 */
  DEFAULT_MONSTER_TYPE = "小怪",
  /** 精英怪数量上限 */
  ELITE_MONSTER_COUNT_LIMIT = 400,
  /** 精英怪物类型 */
  ELITE_MONSTER_TYPE = "精英怪",
  /** 空名称列表占位文案 */
  EMPTY_NAME_LIST_TEXT = "--",
  /** 表单默认怪物数量 */
  FORM_DEFAULT_MONSTER_COUNT = "26",
  /** 表单默认怪物名称 */
  FORM_DEFAULT_MONSTER_NAME = "月铁",
  /** 表单默认怪物类型 */
  FORM_DEFAULT_MONSTER_TYPE = "精英怪",
  /** 是否在本世界字段默认值为否 */
  IS_IN_CURRENT_WORLD_DEFAULT = false,
  /** 是否在本世界字段标签 */
  IS_IN_CURRENT_WORLD_LABEL = "是否在本世界",
  /** LocalStorage 日期文件列表 Key */
  LOCAL_STORAGE_FILES_KEY = "monster:files",
  /** LocalStorage 单个日期文件 Key 前缀 */
  LOCAL_STORAGE_FILE_PREFIX = "monster:file:",
  /** 毫秒基础单位 */
  MILLISECOND = 1,
  /** 每秒毫秒数 */
  MILLISECONDS_PER_SECOND = 1000,
  /** 每小时分数 */
  MINUTES_PER_HOUR = 60,
  /** 怪物数量标签 */
  MONSTER_COUNT_LABEL = "怪物数量",
  /** 怪物名称标签 */
  MONSTER_NAME_LABEL = "怪物名称",
  /** 怪物类型标签 */
  MONSTER_TYPE_LABEL = "怪物类型",
  /** 怪物类型下拉选项 */
  MONSTER_TYPE_OPTIONS: { label: MonsterType; value: MonsterType }[] = [
    { label: DEFAULT_MONSTER_TYPE, value: DEFAULT_MONSTER_TYPE },
    { label: ELITE_MONSTER_TYPE, value: ELITE_MONSTER_TYPE },
  ],
  /** 名称列表分隔符 */
  NAME_LIST_SEPARATOR = "、",
  /** 表格 scroll 的属性名x */
  SCROLL_X = "x",
  /** 每分秒数 */
  SECONDS_PER_MINUTE = 60,
  /** React useState 返回值：setter 所在下标 */
  STATE_SETTER_INDEX = 1,
  /** React useState 返回值：状态值所在下标 */
  STATE_VALUE_INDEX = 0,
  /** 表格序号偏移量 */
  TABLE_INDEX_OFFSET = 1,
  /** 计时器取消记录按钮文案 */
  TIMER_CANCEL_LABEL = "取消记录",
  /** 计时器显示格式：时:分:秒:毫秒 */
  TIMER_DISPLAY_FORMAT = "HH:mm:ss:SSS",
  /** 计时器结束按钮文案 */
  TIMER_END_LABEL = "结束",
  /** 计时器小数位位数 */
  TIMER_FRACTION_DIGITS = 3,
  /** 计时器标签 */
  TIMER_LABEL = "计时",
  /** 计时器暂停按钮文案 */
  TIMER_PAUSE_LABEL = "暂停",
  /** 计时器继续按钮文案 */
  TIMER_RESUME_LABEL = "继续",
  /** 计时器开始按钮文案 */
  TIMER_START_LABEL = "开始",
  /** 计时器刷新间隔（毫秒） */
  TIMER_UPDATE_INTERVAL = MILLISECOND,
  /** 表格时间列格式：时:分:秒 */
  TIME_FORMAT = "HH:mm:ss",
  /** 时间补零长度 */
  TIME_PAD_LENGTH = 2,
  /** 时间补零字符串 */
  TIME_PAD_STRING = "0",
  /** 时间分隔符 */
  TIME_SEPARATOR = ":",
  /** 截图背景色 */
  SCREENSHOT_BACKGROUND_COLOR = "#ffffff",
  /** 截图按钮提示文案 */
  SCREENSHOT_BUTTON_TITLE = "点击截图",
  /** 截图图片 MIME 类型 */
  SCREENSHOT_MIME_TYPE = "image/png",
  /** 截图像素比 */
  SCREENSHOT_PIXEL_RATIO = 2,
  /** 删除成功提示 */
  DELETE_SUCCESS_MESSAGE = "删除成功",
  /** 修改成功提示 */
  EDIT_SUCCESS_MESSAGE = "修改成功",
  /** 截图失败提示 */
  SCREENSHOT_FAILURE_MESSAGE = "截图失败，请重试",
  /** 截图成功提示 */
  SCREENSHOT_SUCCESS_MESSAGE = "截图成功，已复制到剪切板",
  /** 切换日期提示前缀 */
  SELECT_DATE_MESSAGE_PREFIX = "已切换至",
  /** 取消记录提示 */
  TIMER_CANCEL_MESSAGE = "取消记录",
  /** 结束并记录成功提示 */
  TIMER_CONFIRM_MESSAGE = "结束并记录成功",
  /** 暂停计时提示 */
  TIMER_PAUSE_MESSAGE = "暂停计时",
  /** 继续计时提示 */
  TIMER_RESUME_MESSAGE = "继续计时",
  /** 开始计时提示 */
  TIMER_START_MESSAGE = "开始计时",
  /** 不计用时确认提示取消按钮文案 */
  NO_TIME_RECORD_CANCEL_TEXT = "取消",
  /** 不计用时确认提示标题 */
  NO_TIME_RECORD_CONFIRM_TITLE = "是否不计用时记录？",
  /** 不计用时确认提示确认按钮文案 */
  NO_TIME_RECORD_OK_TEXT = "确认",
  /** 不计用时记录成功提示 */
  NO_TIME_RECORD_SUCCESS_MESSAGE = "不计用时记录成功",
  /** 零值常量 */
  ZERO = 0;
// #endregion
