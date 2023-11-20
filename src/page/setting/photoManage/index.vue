<template>
<div>
  <div class="content">
    <div class="groupList_v2">
      <div class="menuType" >
        <div class="iconContainer">
          <!--<i class="el-icon-menu" @click="displayByOrganization" lableToolTip="按组织查询"></i> !-->
          <i class="el-icon-date" @click="selectPicDate" lableToolTip="按日期查询"></i>
          <i class="el-icon-picture" @click="displayPicAll" lableToolTip="展示全部照片"></i>
          <i class="el-icon-delete" @click="deletePic" lableToolTip="删除照片"></i>
        </div>
      </div>
      <tree 
        :deviceGroupsDelete="deviceGroupsDelete" 
        :users="dataAll" 
        :targetUserGroupId ="targetUserGroupId" 
        :status = status 
        :addr="OrgUrl" 
        ref="tree" 
        :lable="labels" 
        @setInitData="initDatas" 
        @refresh="refresh"
        >
      </tree>
    </div>

    <div class="photoContainer">
      <div v-viewer class="pic" v-if="picShow">
        <div 
          v-for="(item, index) in imgList"
          :key="item.photoid"
          >
          <img 
            :src="item.tiny_photopath" 
            :data-source="item.photopath"
            class="picc" 
            @click="item.check=!item.check"
            />
          <div class="imgDescription">
            <div class="deleteBox" v-show="deleteBoxShow" @click="item.check=!item.check">
              <i class="el-icon-check" v-show="item.check"></i>
            </div>
            <div>[{{item.devicename}}] {{item.uploadtime}}</div>
          </div>
        </div>
      </div>
      <div class="deleteBtnContainer">
        <div class="deleteBtn" v-show="deleteBtnShow">
          <el-button type="primary" round @click="clickReturn">返回</el-button>
          <el-button type="success" round @click="clickSelectAll">全选</el-button>
          <el-button type="danger" round @click="clickDelete">删除</el-button>
        </div>
      </div>
    </div>

    <el-dialog 
      title="选择日期和时间" :visible.sync="timeDialogVisible" width="30%">
      <div>
        <el-date-picker
          v-model="timeValue" type="datetimerange" :picker-options="pickerOptions"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          style="border: 1px solid #c4c4c4">
        </el-date-picker>
      </div>

      <span slot="footer" class="dialog-footer">
        <button @click="timeDialogVisible = false" class="cancelBtn">取 消</button>
        <el-button type="primary" @click="confirmTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
  <div class="block">
    <el-pagination
      layout="sizes, total, prev, pager, next, jumper"
      :page-sizes="[10,15,20,25]"
      :page-size.sync="pageSize"
      :current-page.sync="pageIndex"
      :total="total"
      :pager-count="5"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      hide-on-single-page="false">
    </el-pagination>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import tree from "../structureTree/index.vue";
import { page } from "components";
import { getHeights } from "utils/page/setting";
import { GET_USER_INFO } from "store/getters/type";
const labels = {
  defaultId: "organizationid",
  treeName: "orgname",
};

export default {
  directives: {
    focus: {
      update: function (el, { value }) {
        if (value) {
          el.focus();
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO,
      updateState: "updateState",
      TreeData: "TreeData",
    }),
  },
  data() {
    return {
      status: "show",
      showDeviceList: false,
      labels,
      selectUser: [],
      dataAll: [],
      targetMenu: {},
      self: this,
      modolType: null,
      targetUserGroup: null,
      targetUserGroupId: "",
      transferdata: { deviceId: "", targetMenuId: "" },
      deviceGroupsDelete: [],
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      total: null, //初始图片总条数
      pageIndex: 1, //默认当前页码
      pageSize: 14, //默认每页条数
      organizationid: null, //组织id
      imgSrc: '', //一张照片的src,
      imgList: [], //一组照片列表，一个图片是一个对象，有src和check属性
      picShow: 2, //图片展示方式，图标从左到右1234，默认展示全部
      deleteBoxShow: false, //选择删除框显示
      deleteBtnShow: false, //删除状态下的一组按钮
      isAllCheck: false, //是否全选
      timeDialogVisible: false, //日期时间选择弹窗
      startTime: null, //起始时间
      endTime: null, //结束时间
      pickerOptions: { //日期时间选择器
        shortcuts: [{ //快捷选项
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      timeValue: '', //选中的值，是数组
    };
  },
  watch: {
    TreeData: {
      handler: function (data) {
        this.targetMenu = data;
        this.transferdata.targetMenuId = data.organizationid;
        this.organizationid = data.organizationid; // 拿到组织id
        this.targetUserGroup = data.orgname;
        this.modolType = null;
        this.$nextTick(function () {
          this.refresh();
          this.getPhoto(); // 组织id每次变化后重新获取照片
        });
      },
      deep: true,
    },
    updateState: function () {
      if (this.updateState === 1) {
        this.refresh();
      } else if (this.updateState === 2) {
        this.refresh();
        this.$refs.tree.refresh(this.targetMenu);
      }
      this.$store.state.updateState = 0;
    },
  },
  components: {
    tree,
  },
  created() {
    this.$nextTick(() => {
      this.refresh();
      getHeights();
    });
    this.targetMenu = this.TreeData;
    if (!this.targetMenu.hasOwnProperty("organizationid"))
      this.targetMenu = { organizationid: "b202669251a046bbbc727ff3fb25f9f4" };
    this.targetUserGroup = this.$store.state.user_info.user.orgname;
    this.OrgUrl =
      "Organization/TreeRoot/" +
      this.$store.state.user_info.user.organizationid;
    this.getPhoto();
  },
  methods: {
    //获取照片列表
    getPhoto(){
      this.$ajax({
        method: 'get',
        url: '/Photo/List',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        responseType: 'arraybuffer',
        params: {
          pageIndex: (this.pageIndex - 1) * this.pageSize, //从第几条开始
          pageSize: this.pageSize, //要几条
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          organizationid: this.organizationid, //所选中的组织id
        }
      }).then((res) => {
        //法一：一张图片
        // console.log('照片:', res.data);
        // this.imgSrc = 'data:image/png;base64,' + Buffer.from(res.data).toString('base64');

        // this.imgSrc = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        // console.log(this.imgSrc);

        //法二：一组图片，将arraybuffer转成json
        let uint8_msg = new Uint8Array(res.data);
        let decodedString = String.fromCharCode.apply(null, uint8_msg); // 解码成字符串
        let obj = JSON.parse(decodedString); // parse,转成json数据
        // console.log(obj.result.photos);
        this.total = parseInt(obj.result.total); //获取总图片数
        this.imgList = []; //清空之前的图片列表
        for(let key in obj.result.photos){
          let sameDeviceImgs = obj.result.photos[key]; //获取一个设备的一组图片
          // console.log("每个设备的一组照片：", sameDeviceImgs);
          for(let i = 0; i < sameDeviceImgs.length; ++i){ //提取信息，构造图片对象，加入图片列表
            this.imgList.push({
              photoid: sameDeviceImgs[i].photoid,
              photopath: sameDeviceImgs[i].photopath,
              tiny_photopath: sameDeviceImgs[i].tiny_photopath,
              photoname: sameDeviceImgs[i].filename, 
              devicename: sameDeviceImgs[i].devicename,
              uploadtime: sameDeviceImgs[i].uploadtime.slice(0,10),
              check: false,
            });//check表示此图片是否选中
          }
        }      
        // console.log("照片对象数组：", this.imgList);
      }).catch((err) => {
        console.log(err);
      });
    },
    //将二进制数据arrayBuffer转为转为base64
    arrayBufferToBase64(buffer) {
      let binary = '';
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    //向数据库上传图片
    uploadPhoto(){
      this.$ajax({
        method: 'post',
        url: 'Photo/Upload/1001',
        data: '/src/assets/img/user.png',
      }).then((res) => {
        console.log("成功!",res);
      }).catch((err) => {
        console.log("失败!",err);
      })
    },
    //按设备展示图片
    // displayByOrganization(){
    //   this.organizationid = this.targetMenu.organizationid; //由当前点击的节点获取组织id
    //   this.getPhoto(); //按组织id查询获取图片
    //   this.organizationid = null; //获取图片之后，清空本次点击的组织id，避免其他请求传送此参数
    // },
    //展示所有图片
    displayPicAll(){
      this.organizationid = null; // 先清空之前选中的组织id
      this.getPhoto();
    },
    //选择图片日期
    selectPicDate(){
      this.timeDialogVisible = true; //弹出选择日期时间的弹窗
    },
    //删除图片
    deletePic(){
      this.deleteBoxShow = true; //显示删除框和按钮
      this.deleteBtnShow = true;
      this.isAllCheck = false; //全选标志位重置
      for(let item of this.imgList){ //所有图片的选中状态重置
        item.check = false;
      }
    },
    clickPic(event){
      let target = event.target;
      if(target.className === 'picc'){ //点击图片
        let srcParts = target.src.split("/");
        let photoName = srcParts[srcParts.length-1];//获取所点击图片的name
      }
    },
    //删除页面点击返回按钮
    clickReturn(event){
      this.deleteBoxShow = false;
      this.deleteBtnShow = false;
    },
    //删除页面点击全选按钮
    clickSelectAll(){
      if(this.isAllCheck === false){ //未全选——遍历图片列表，全部选中；将全选标志位设为true
        for(let item of this.imgList){ 
          item.check = true;
        }
        this.isAllCheck = true; 
      }else{ //已全选——全部取消；将全选标志位设为false
        for(let item of this.imgList){ 
          item.check = false;
        }
        this.isAllCheck = false; 
      }
    },
    //删除页面点击删除按钮
    clickDelete(){
      this.$confirm('此操作将永久删除选中图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //整理已选中的图片
        let deletePicArr = [];
        for(let item of this.imgList){ //遍历当前图片数组
          if(item.check){ //如果被选中，则将其id加入数组
            deletePicArr.push(item.id);
          }
        }
        if(deletePicArr.length === 0){
          this.$message({
            type: 'info',
            message: '选择为空！'
          }); 
        }
        let deleteData = {"photoids": deletePicArr};
        // console.log(JSON.stringify(deleteData));
        //发送请求
        this.$ajax({
          method: 'post',
          url: '/Photo/Delete',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify(deleteData)
        }).then((res)=> {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch((err) => {
          console.log(err);
          this.$message({
            type: 'info',
            message: '删除失败！'
          }); 
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      this.getPhoto(); // 删除后重新显示
    },
    //将中国标准时间转换成标准日期时间
    transferTime(time){
      let datetime = new Date(time);
      let year = datetime.getFullYear();
      let month = datetime.getMonth();
      let date = datetime.getDate();
      let hour = datetime.getHours();
      let minute = datetime.getMinutes();
      let second = datetime.getSeconds();
      let res = year + 
        '-' + 
        ((month + 1) < 10 ? '0' + (month + 1) : (month + 1)) + 
        '-' + 
        (date < 10 ? '0' + date : date) + 
        ' ' + 
        (hour < 10 ? '0' + hour : hour) +
        ':' + 
        (minute < 10 ? '0' + minute : minute) + 
        ':' + 
        (second < 10 ? '0' + second : second);
      return res;
    },
    //确认日期时间
    confirmTime(){
      this.startTime = this.transferTime(this.timeValue[0]); //得到转换成标准格式的开始结束日期
      this.endTime = this.transferTime(this.timeValue[1]); 
      this.getPhoto();
      this.timeDialogVisible = false;//关闭弹窗
      this.startTime = null; // 每次查询后清空本次时间参数
      this.endTime = null;
    },
    //关闭选择日期时间弹窗前的确认处理
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //每页条数pageSize变化时触发
    handleSizeChange(val) {
      this.pageSize = val;
      // console.log("每页条数：", this.pageSize);
      this.getPhoto();
    },
    //当前页currentPage变化时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      // console.log("当前页码：", this.pageIndex);
      this.getPhoto();
    },
    initDatas(data) {
      if (!this.targetMenu.hasOwnProperty("organizationid") && data) {
        this.targetMenu = data;
        this.refresh();
      }
    },
    // 渲染表格数据
    refresh() {
      let request = {
        organizationid: this.targetMenu.organizationid,
      };
      this.$ajax.post("User/List", request).then((res) => {
        if (res.data.code === 1) {
          this.dataAll = res.data.result;
        }
      });
      if (
        this.transferdata.targetMenuId != undefined &&
        this.transferdata.targetMenuId != ""
      )
        this.$ajax
          .get(`Organization/Detail/${this.transferdata.targetMenuId}`)
          .then((res) => {
            if (res.data.code === 1) {
              this.verto = res.data.result.vertoid;
              this.meeting = res.data.result.meetingid;
              this.voice = res.data.result.voicecallid;
              this.alarm = res.data.result.alarmid;
              this.broad = res.data.result.broadid;
              this.instance({
                method: "get",
                url: "/organization/" + this.transferdata.targetMenuId,
              }).then((res) => {
                this.left_watcher = res.data.left_watcher;
                this.right_watcher = res.data.right_watcher;
                this.out_watcher = res.data.out_watcher;
                this.enable_left_watcher = res.data.enable_left_watcher;
                this.enable_right_watcher = res.data.enable_right_watcher;
                this.enable_out_watcher = res.data.enable_out_watcher;
              });
              this.instance({
                method: "get",
                url: "/alarm_control/" + this.transferdata.targetMenuId,
              }).then((res) => {
                this.alarm_control = res.data.alarm_control;
                if (this.alarm_control == "") this.alarm_control = "router";
              });
            }
          });
      this.$ajax
        .get(`Feature/getFeatureByOrg/${this.targetMenu.organizationid}`)
        .then((res) => {
          if (res.data.code === 1) {
            this.allDevices = res.data.result;
            this.allDevices.sort((x, y) => {
              return x.devicecode - y.devicecode;
            });
          }
        });
      this.$ajax.post(`Role/List`).then((res) => {
        if (res.data.code === 1) {
          let groupList = res.data.result;
          this.targetUserGroupId = "";
          groupList.forEach((element) => {
            if (element.rolename == this.targetUserGroup) {
              this.targetUserGroupId = element.roleid;
            }
          });
          if (this.targetUserGroupId != "")
            this.instance({
              method: "get",
              url: `Role/getDeviceGroup/${this.targetUserGroupId}`,
            }).then((res) => {
              if (res.data.code === 1) {
                let result = res.data.result;
                let length = result.length;
                this.deviceGroups = [];
                let axios = [];
                for (let i = 0; i < length; i++) {
                  axios.push(
                    this.instance({
                      method: "get",
                      url: `DeviceGroup/Detail/${result[i].devicegroupid}`,
                    })
                  );
                }
                this.$ajax.all(axios).then((res) => {
                  for (let i = 0; i < length; i++) {
                    if (
                      !this.deviceGroups.some((item) => {
                        return (
                          item.devicegroupid == res[i].data.result.devicegroupid
                        );
                      })
                    ) {
                      res[i].data.result.deviceGroups.sort((x, y) => {
                        return x.devicecode - y.devicecode;
                      });
                      this.deviceGroups.push(res[i].data.result);
                      this.deviceGroupsDelete.push(
                        res[i].data.result.devicegroupid
                      );
                    }
                  }
                });
              }
            });
          else this.deviceGroups = [];
        }
      });
    },
    transferData(selectDevice, newDeviceGroupName, newDeviceGroupType) {
      this.instance({
        method: "post",
        url: "DeviceGroup/Create",
        data: {
          name: newDeviceGroupName,
          devicegroup_type: newDeviceGroupType,
          deviceGroups: selectDevice,
        },
      }).then((res) => {
        if (res.data.code === 1) {
          let targetDeviceGroup = res.data.result.devicegroupid;
          this.deviceGroups = this.deviceGroups.concat([
            { devicegroupid: targetDeviceGroup },
          ]);
          this.$ajax
            .post(
              `Role/opRoleDevice/${this.targetUserGroupId}`,
              this.deviceGroups
            )
            .then((res) => {
              if (res.data.code === 1) {
                this.refresh();
              }
            });
        }
      });
    },
  }
}

</script>

<style scoped>
.content {
  display:flex;
}
.watcher {
  margin-left: 5px;
}
.groupList_v2{
	flex:0 0 235px;
  margin-top:20px;
  margin-left:15px;
  background:#222428;
  border-radius:5px;
}
.iconContainer{
  display:flex;
  justify-content:space-between;
  margin:10px;
}
.photoContainer{
  flex:1;
  margin:20px 20px 0 20px;
  background-color: #222428;
}
.pic{
  display: flex;
  height: 80vh;
  flex-wrap: wrap;
  justify-content: left;
  padding: 10px 0;
  overflow: auto;
}
.picc{
  width: 200px;
  flex: 1 0 auto;
  padding: 10px 20px;
  cursor: pointer;
}
.cancelBtn{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c4c4;
  color: #1f2d3d;
  margin: 0;
  padding: 10px 15px;
  border-radius: 4px;
}
.deleteBox{
  width: 20px;
  height: 20px;
  border: 2px solid #c4c4c4;
  margin: 0 10px;
}
.deleteBtn{
  margin: 10px 400px;
}
.block {
  display: block;
  margin: 0px 550px;
}
.imgDescription{
  display: flex;
  justify-content: center;
}
span{ 
  text-size:20px; 
  color:#000000;
}
.el-icon-menu{
  cursor: pointer;
}
.el-icon-picture{
  cursor: pointer;
}
.el-icon-date{
  cursor: pointer;
}
.el-icon-delete{
  cursor: pointer;
}
.el-icon-menu:hover::after{
  content: attr(lableToolTip);
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: black;
  background-color: #EEE;
  position: fixed; 
  line-height:18px;
  white-space: pre-wrap;
}
.el-icon-picture:hover::after{
  content: attr(lableToolTip);
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: black;
  background-color: #EEE;
  position: fixed; 
  line-height:18px;
  white-space: pre-wrap;
}
.el-icon-date:hover::after{
  content: attr(lableToolTip);
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: black;
  background-color: #EEE;
  position: fixed; 
  line-height:18px;
  white-space: pre-wrap;
}
.el-icon-delete:hover::after{
  content: attr(lableToolTip);
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: black;
  background-color: #EEE;
  position: fixed; 
  line-height:18px;
  white-space: pre-wrap;
}
</style>
