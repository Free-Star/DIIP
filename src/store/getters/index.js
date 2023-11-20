
import * as type from 'store/getters/type'

export default {
  //获取用户信息
  [type.GET_USER_INFO]: state => {
    return state.user_info
  },
  LoginId: state => {
    state.LoginId = state.user_info.user.UserID
    return state.LoginId
  },
  nameNumberMap: state => {
    return state.nameNumberMap
  },
  getCount: state => {
    return state.count
  },
  pageData: state => {
    return state.pageData
  },
  btns: state => {
    return state.btns
  },
  batchSelectArr: state => {
    return state.batchSelectArr
  },
  dialogFormVisible: state => {
    return state.dialogFormVisible
  },
  updateState: state => {
    return state.updateState
  },
  TreeData: state => {
    return state.TreeData
  },
  TreeObj: state => {
    return state.TreeObj
  },
  phoneShow: state => {
    return state.phoneShow
  },
  mediaPath: state => {
    return state.mediaPath
  },
  name: state => {
    return state.user_info.orgname
  },
  dialogShow: state => {
    return state.dialogShow
  },
  dialogStatu: state => {
    return state.dialogStatu
  },
  phoneNum: state => {
    return state.phoneNum
  },
  // verto.js about
  vertoClose: state => {
    return state.vertoClose
  },
  vertoHandle: state => {
    return state.vertoHandle
  },
  group_users: state => {
    return state.group_users
  },
  deviceList: state => {
    return state.deviceList
  },
  currentLoginUser: state => {
    return state.currentLoginUser
  },
  callQueue: state => {
    return state.callQueue
  },
  curCall: state => {
    return state.curCall
  },
  playlist: state => {
    return state.playlist
  },
  play: state => {
    return state.play
  },
  use_livearray: state => {
    return state.use_livearray
  },
  whetherPlayAnotherSong: state => {
    return state.whetherPlayAnotherSong
  },
  whetherPlayAnotherRecord: state => {
    return state.whetherPlayAnotherRecord 
  },
  confLeft: state=> {
    return  state.confLeft
  },
  confAlarm: state=> {
    return  state.confAlarm
  },
  confIpBoard: state=> {
    return  state.confIpBoard
  },
  confMeeting: state=> {
    return  state.confMeeting
  },
  selectedAlarm: state=> {
    return  state.selectedAlarm
  },
  userGroup: state=> {
    return  state.userGroup
  },
  alarmAddress: state=> {
    return  state.alarmAddress
  },
  playFileDoneFlag: state=> {
    return  state.playFileDoneFlag
  },
  choosenConfLeft: state=> {
    return  state.choosenConfLeft
  },
  choosenConfIpboard: state=> {
    return  state.choosenConfIpboard
  },
  selectPhonex: state=> {
    return  state.selectPhonex
  },
  choosenConfMeeting: state=> {
    return  state.choosenConfMeeting
  },
  adminState: state=> {
    return state.adminState
  },
  deviceStatus: state=>{
    return state.deviceStatus
  },
  dialogVisible: state=>{
    return state.dialogVisible
  },
  videoVisible: state=>{
    return state.videoVisible
  },
  init: state=>{
    return state.init
  },
  isVideo: state=>{
    return state.isVideo
  },
  fromm: state=>{
    return state.fromm
  },
  sx: state=>{
    return state.sx
  },
  buttonShow: state => {
    return state.buttonShow
  }
}
