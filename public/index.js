const AndroidEventMap = {}
function AndroidOnKey(keyCode) {
  AndroidEventMap[keyCode]()
}
try {
  setWindowsStatusBar(2)
} catch (error) {
  console.log(error)
}

const Message = new class MessageImpl {
  constructor() {
    this.nowMessageBox = null
  }
  getMaxZIndex() {
    let maxZIndex = 0; // 初始化最大zIndex为0
    const elements = document.querySelectorAll('*'); // 选择页面中的所有元素

    elements.forEach((element) => {
      const zIndex = window.getComputedStyle(element).zIndex; // 获取元素的z-index样式

      if (!isNaN(zIndex)) { // 检查z-index是否为有效数字
        maxZIndex = Math.max(maxZIndex, parseInt(zIndex, 10)); // 更新最大zIndex
      }
    });
    return maxZIndex;
  }

  tip(message, time = ((message.length * 100) < 1500) ? 1500 : message.length * 100) {
    if (this.nowMessageBox) {
      this.nowMessageBox.style.display = 'none'
    }
    let messageBox = dc('div')
    messageBox.className = 'MESSAGE_BOX'
    messageBox.innerText = message
    messageBox.style.zIndex = this.getMaxZIndex() + 1
    messageBox.style.display = 'block'
    document.body.appendChild(messageBox)
    this.nowMessageBox = messageBox
    setTimeout(() => {
      messageBox.remove()
    }, time)
  }
}

//生成dom队列
function dp(pageString) {
  let domElement = {}
  pageString = pageString.replaceAll("\n", '').replaceAll("\t", '');
  let content = document.createElement("div")
  content.innerHTML = pageString
  domList(content.childNodes[0], domElement)
  content.childNodes[0]['refs'] = domElement
  return content.childNodes[0]
}

//生成dom队列
function domList(dom, domElement) {
  initDomFunctions(dom)
  if (dom.getAttribute != null && dom.getAttribute("ref") != "" && dom.getAttribute("ref") != null) {
    domElement[dom.getAttribute("ref")] = dom
  }
  if (dom.childNodes.length > 0) {
    dom.childNodes.forEach((node) => {
      domList(node, domElement)
    })
  }
}

function dc(tag, Class) {
  let element = document.createElement(tag)
  if (Class != null) {
    if (typeof Class == "string") {
      element.classList.add(Class)
    } else {
      Class.forEach((className) => {
        element.classList.add(className)
      })
    }
  }
  initDomFunctions(element)
  return element
}

//初始化Dom的函数
function initDomFunctions(dom) {
  dom["show"] = (display) => {
    if (display == null) {
      dom.style.display = "block"
    } else {
      dom.style.display = display
    }
    return dom
  }
  dom["hide"] = () => {
    dom.style.display = "none"
    return dom
  }
  dom["val"] = (val) => {
    dom.value = val
    return dom
  }
  dom["txt"] = (text) => {
    dom.innerText = text
    return dom
  }
  dom["add"] = (ele) => {
    dom.appendChild(ele)
    return dom
  }
  dom['remove'] = () => {
    if (dom.parentNode != null) {
      dom.parentNode.removeChild(dom)
    }
  }
}


const Confirm = new class ConfirmImpl {
  constructor() {
  }
  getType(type) {
    switch (type) {
      case "text":
        return `<input ref="input" class="input">`
      case "longtext":
        return `<textarea ref="input" style="height:150px;" class="textarea"></textarea>`
      case "email":
        return `<input ref="input" class="input" type="email">`
      case "sex":
        return `<select ref="input" class="input">
                      <option value="1">男</option>
                      <option value="0">女</option>
                    </select>`
      case "year":
        return `<select ref="input" class="input">
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>`
      default:
        return `<input ref="input" class="input">`
    }
  }


  edit({ title, text, confirm, cancle, confirmStr, cancelStr, placeholder, check, checkLabel, type, tip, disabled, limit }) {
    let cover = dc("div", "CONFIRMCOVER")
    let confirmEle = dp(`<div class="CONFIRMDIALOGEDIT">
                        <div class="title">
                          <div class="font"  ref="title">标题</div>
                          <div class="closeButton" ref="close">关闭</div>
                        </div>
                        <div class="content">
                          ${this.getType(type)}
                          <span ref="limit" class=limit></span>
                        </div>
                        <div class="content" style="display:flex;font-size:14px;color:#777;line-height:27px;${check != null ? '' : 'display:none;'}">
                          展示该信息至主页：<input type="checkbox" ref="switch" style="margin-left:10px;width:20px;height:20px;">
                        </div>
                        <div style="font-size:13px;color:#888;" ref="tip">${tip}</div>
                        <div class="bottomMenu">
                          <button class="cancel" ref="cancel">取消</button>
                          <button class="sure" ref="sure">确定</button>
                        </div>
                      </div>`)
    if (text == null) text = ""
    confirmEle.refs.title.innerText = title
    confirmEle.refs.input.value = text
    if (disabled) confirmEle.refs.input.disabled = disabled
    if (limit != null && typeof limit == "number") {
      confirmEle.refs.input.oninput = () => {
        confirmEle.refs.limit.innerText = `${confirmEle.refs.input.value.length}/${limit}`
      }
      confirmEle.refs.limit.innerText = `${confirmEle.refs.input.value.length}/${limit}`
    } else {
      confirmEle.refs.limit.remove()
    }
    if (tip == null) confirmEle.refs.tip.remove()
    if (check != null) {
      confirmEle.refs.switch.value = check
    }
    placeholder ? confirmEle.refs.input.placeholder = placeholder : ""
    confirmStr ? confirmEle.refs.sure.innerText = confirmStr : ''
    cancelStr ? confirmEle.refs.cancel.innerText = cancelStr : ''
    document.body.appendChild(cover)
    document.body.appendChild(confirmEle)
    confirmEle.refs.close.onclick = () => {
      cover.remove()
      confirmEle.remove()
    }
    confirmEle.refs.input.addEventListener("input", () => {
      if (limit && confirmEle.refs.input.value.length > limit) {
        confirmEle.refs.input.value = confirmEle.refs.input.value.substring(0, limit)
        confirmEle.refs.limit.innerText = `${confirmEle.refs.input.value.length}/${limit}`
      }
    })
    confirmEle.refs.input.focus()
    confirmEle.refs.sure.onclick = async () => {
      if (limit != null && confirmEle.refs.input.value.length > limit) {
        Message.tip("输入字数超出限制")
        return
      }
      let funRetrun = null
      if (confirm != null) {
        let res = { text: confirmEle.refs.input.value }
        if (check) {
          res.switch = confirmEle.refs.switch.value
        }
        funRetrun = await confirm(res)
      }
      console.log(funRetrun);

      if (funRetrun != -1) {
        cover.remove()
        confirmEle.remove()
      }
    }
    confirmEle.refs.cancel.onclick = () => {
      if (cancle != null) {
        cancle()
      }
      cover.remove()
      confirmEle.remove()
    }
    cover.onclick = () => {
      cover.remove()
      confirmEle.remove()
    }
  }



  show({ title, content, confirm, cancle, confirmStr, noStr }) {
    let cover = dc("div", "CONFIRMCOVER")
    let confirmEle = dp(`<div class="CONFIRMDIALOG">
                            <div class="title">
                              <div class="font"  ref="title"></div>
                              <div class="closeButton" ref="close">关闭</div>
                            </div>
                            <div class="content" ref="content">
                            </div>
                            <div class="bottomMenu">
                              <button class="sure" ref="cancel">取消</button>
                              <button class="cancel"ref="sure" >确定</button>
                            </div>
                          </div>`)
    confirmEle.refs.title.innerText = title
    confirmEle.refs.content.innerText = content
    confirmStr ? confirmEle.refs.sure.innerText = confirmStr : ''
    noStr ? confirmEle.refs.cancel.innerText = noStr : ''
    document.body.appendChild(cover)
    document.body.appendChild(confirmEle)

    confirmEle.refs.close.onclick = () => {
      cover.remove()
      confirmEle.remove()
    }

    confirmEle.refs.sure.onclick = () => {
      if (confirm != null) {
        confirm()
      }
      cover.remove()
      confirmEle.remove()
    }
    confirmEle.refs.cancel.onclick = () => {
      if (cancle != null) {
        cancle()
      }
      cover.remove()
      confirmEle.remove()
    }
    cover.onclick = () => {
      cover.remove()
      confirmEle.remove()
    }
  }
}

// 定义Bridge类的实现
const Bridge = new class BridgeImpl {
  // 构造函数
  constructor() {
    // localStorage.clear()
    // 初始化数据
    this.data = {}
    this.logData = []
    this.chatData = []
    this.cancleRefresh
    this.state = "loading"
    //初始化用户数据模板
    this.userDataTemp
    this.socket = null
    this.eventMap = new Map()
    this.likeNumScore = 3
    this.replyNumScore = 2
    this.readNumScore = 1
    this.collectNumScore = 5
    this.timeScore = 1.5
    // 初始化关注用户数据模板
    this.followUserDataTemp = []
    // 初始化用户订阅认证数据
    this.userFollowVerifyDataTemp = []
    // 初始化关注用户映射
    this.followUserMap = new Map()
    // 初始化关注哈希数据模板
    this.followHashDataTemp = []
    // 初始化用户喜欢数据模板
    this.userLikeDataTemp = []
    // 初始化用户回复喜欢数据模板
    this.userReplyLikeDataTemp = []
    // 初始化用户搜索历史数据模板
    this.userSearchHistoryTemp = []
    this.init()
    this.initAndroidEvent()

    // 初始化帖子热度计算分值
    this.initPostHotScore()
  }
  //当项目运行在android环境时
  initAndroidEvent() {
    if (window.AndroidtoJs) {
      // for(var key in window.AndroidtoJs){
      //   document.getElementById("log").innerText+=key+"\n"
      // }

    }
    try {
      this.set("userAgent", navigator.userAgent)
      this.log(navigator.userAgentData)
    } catch (error) {
      this.log(error)
    }
    try {
      this.log(android.os.Build.MODEL);
    } catch (error) {
      this.log(error)
    }
    try {
      this.log(android.os.Build.BRAND);
    } catch (error) {
      this.log(error)
    }
    try {
      this.log(AndroidDevice.getDeviceModel());
    } catch (error) {
      this.log(error)
    }

  }
  init() {
    console.log(navigator.userAgent);
    const token = window.sessionStorage.getItem('token')
    const UserId = window.sessionStorage.getItem("UserId")
    const userData = JSON.parse(window.sessionStorage.getItem("userData"))
    if (token && UserId && userData) {
      this.userData = userData
    }
  }

  toAppHome() {
    GoToActivity(1);
  }
  addAndroidEvent(keyCode, callback) {
    if (window.AndroidtoJs) {
      window.AndroidtoJs.RegisterKeyDown(keyCode)
      AndroidEventMap[keyCode] = callback
    }
  }
  // 初始化帖子热度计算分值
  initPostHotScore() {
    this.likeNumScore = 3 + Math.random() * 30
    this.replyNumScore = 2 + Math.random() * 30
    this.readNumScore = 1 + Math.random() * 30
    this.collectNumScore = 5 + Math.random() * 30
    this.timeScore = 1 + Math.random() * 1.5
  }

  verifyUserInfoToWebSocket() {
    this.wsSend('verifyUserInfo', this.userData)
  }

  wsOnmessage(code, type, message, senderInfo, chatDto, dateTime) {
    if (code == 200) {
      switch (type) {
        case 'chat':
          this.newChatMessage(chatDto, dateTime)
          break
        case 'render':
          this.newRenderMessage(message)
          break
      }
    }
  }

  newRenderMessage(message) {
    switch (message) {
      case 'userInfo':
        this.dispatchEvent('renderUserInfo')
        break
    }

  }
  player(e) {
    this.dispatchEvent("player", e);
  }
  newChatMessage(chatDto, dateTime) {
    chatDto.dateTime = dateTime
    chatDto.isRead = 0
    this.dispatchEvent('newChatMessage', chatDto)
  }

  wsSend(type, message) {
    this.socket.send(JSON.stringify({
      type: type,
      message: typeof message == 'object' ? JSON.stringify(message) : message
    }))
  }

  log(String) {
    if (typeof String == "object") {
      String = JSON.stringify(String)
    }

    this.logData.push(String)
    this.dispatchEvent("log")
  }

  addEventListener(event, callback) {
    if (this.eventMap.has(event)) {
      this.eventMap.get(event).push(callback)
    } else {
      this.eventMap.set(event, [callback])
    }
  }

  dispatchEvent(event, data) {
    if (this.eventMap.has(event)) {
      this.eventMap.get(event).forEach(callback => callback(data))
    }
  }

  // 获取用户搜索历史数据的getter
  get userSearchHistory() {
    return this.userSearchHistoryTemp
  }

  // 设置用户搜索历史数据的setter
  set userSearchHistory(data) {
    this.userSearchHistoryTemp = data
    //console.log(data);
    // 保存数据到localStorage

  }

  get userFollowVerifyData() {
    return this.userFollowVerifyDataTemp
  }

  set userFollowVerifyData(data) {
    this.userFollowVerifyDataTemp = data
    // 保存数据到localStorage

  }
  devLog(str) {
    if (this.get("developer")) {
      Message.tip(str);
    }
  }
  addSearchHistory(data) {
    if (this.userSearchHistory.includes(data)) {
      this.userSearchHistory = this.userSearchHistory.filter(item => item != data)
    }
    this.userSearchHistory.unshift(data)
    this.userSearchHistory.splice(20, this.userSearchHistory.length)
    //console.log(this.userSearchHistory);

    // 保存数据到localStorage

  }

  delSearchHistory(data) {
    this.userSearchHistory = this.userSearchHistory.filter(item => item != data)
    // 保存数据到localStorage

  }

  // 获取用户喜欢数据的getter
  get userLikeData() {
    return this.userLikeDataTemp
  }

  // 设置用户喜欢数据的setter
  set userLikeData(data) {
    this.userLikeDataTemp = data
    // 保存数据到localStorage

  }
  // 获取用户数据的getter
  get userData() {
    return this.userDataTemp || JSON.parse(window.sessionStorage.getItem("userData"))
  }

  // 设置用户数据的setter
  set userData(data) {
    this.userDataTemp = data
    // 保存数据到localStorage

  }

  // 获取关注用户数据的getter
  get followUserData() {
    return this.followUserDataTemp
  }
  // 设置关注用户数据的setter
  set followUserData(data) {
    this.followUserDataTemp = data
    // 保存数据到localStorage

    // 刷新关注用户映射
    this.refreshFollowUserMap()
  }
  // 刷新关注用户映射
  refreshFollowUserMap() {
    this.followUserMap = new Map()
    this.followUserData.forEach(item => {
      this.followUserMap.set(item.id, item)
    })
  }
  // 获取关注哈希数据的getter
  get followHashData() {
    return this.followHashDataTemp
  }

  // 设置关注哈希数据的setter
  set followHashData(data) {
    this.followHashDataTemp = data
  }

  // 设置数据
  set(key, data) {
    this.data[key] = data
    window.sessionStorage.setItem(key, JSON.stringify(data))
  }

  // 获取数据
  get(key) {
    let res = this.data[key]
    if (res == null) {
      res = JSON.parse(window.sessionStorage.getItem(key))
    }
    return res
  }

  // 删除数据
  del(key) {
    delete this.data[key]
    window.sessionStorage.removeItem(key)
  }
}