<template>

</template>

<script>
import newOrder from '@/assets/mp3/newOrder.mp3'
import newOrderz from '@/assets/mp3/newOrderz.mp3'
import cancelAudio from '@/assets/mp3/cancel.mp3'
import $ from '../utils/jquery-1.11.3'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            websock: null,//建立的连接
            lockReconnect: false,//是否真正建立连接
            timeout: 30*1000,//30秒一次心跳
            timeoutObj: null,//心跳心跳倒计时
            serverTimeoutObj: null,//心跳倒计时
            timeoutnum: null,//断开 重连倒计时
            newOrder,
            newOrderz,
            cancelAudio
        };
    },
    created() {
        //页面刚进入时开启长连接
        // this.initWebSocket();
    },
    destroyed: function() {
        //页面销毁时关闭长连接
        this.websocketclose();
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        })
    },
    methods: {
        initWebSocket(){//建立连接
            //初始化weosocket
           const wsuri = "ws://be.qudayin.cn/api/dayin/ws/oneToOne" 
           //建立连接
            this.websock = new WebSocket(wsuri);
            //连接成功
            this.websock.onopen = this.websocketonopen;
            //连接错误
            this.websock.onerror = this.websocketonerror;
            //接收信息
            this.websock.onmessage = this.websocketonmessage;
            //连接关闭
            this.websock.onclose = this.websocketclose;
        },
        reconnect() {//重新连接
            var that = this;
            if(!this.$store.state.user.userInfo.userauthid){
                return
            }
            if(that.lockReconnect) {
                return;
            };
            that.lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            that.timeoutnum && clearTimeout(that.timeoutnum);
            that.timeoutnum = setTimeout(function () {
                //新连接
                that.initWebSocket();
                that.lockReconnect = false;
            },1000);
        },
        reset(){//重置心跳
            var that = this;
            //清除时间
            clearTimeout(that.timeoutObj);
            clearTimeout(that.serverTimeoutObj);
            //重启心跳
            that.start();
        },
        start(){//开启心跳
            console.log("心跳")
            var self = this;
            self.timeoutObj && clearTimeout(self.timeoutObj);
            self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
            self.timeoutObj = setTimeout(function(){
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                if (self.websock.readyState == 1) {//如果连接正常
                    const param = {message: self.$store.state.user.userInfo.userauthid, type: 2}
                    self.websock.send(JSON.stringify(param));
                }else{//否则重连
                    self.reconnect();
                }
                self.serverTimeoutObj = setTimeout(function() {
                    //超时关闭
                    self.websock.close();
                }, self.timeout);

            }, self.timeout)
        },
        playNew(){//播放声音
            var borswer = window.navigator.userAgent.toLowerCase();
            if (borswer.indexOf("ie") >= 0) {
                //IE内核浏览器
                var strEmbed = '<embed name="embedPlay" src="'+this.newOrder+'" autostart="true" hidden="true" loop="false"></embed>';
                $("body").find("embed").remove()
                if ($("body").find("embed").length <= 0){
                    $("body").append(strEmbed);
                }
                const body = document.querySelector("body");
                if (body.append) {
                    body.append(strEmbed);
                } else {
                    body.appendChild(strEmbed);
                }
                var embed = document.embedPlay;
                //浏览器不支持 audion，则使用 embed 播放
                embed.volume = 100;
                //embed.play();这个不需要
            } else {
                //非IE内核浏览器
                var strAudio = "<audio id='audioPlay' type='audio/mpeg' src='"+this.newOrder+"' hidden='true'>";
                $("body").find("audio").remove()
                if ($("body").find("audio").length <= 0){
                    $("body").append(strAudio);
                }
                var audio = document.getElementById("audioPlay");

                var currentTime = Date.now();
                var protectTime = 500;//设置保护性延时 单位毫秒，不要小于50 建议100以上
                if((currentTime - this.lastRunTime) < protectTime){
                        return;//两次执行太过频繁，直接退出
                }
                if(audio.paused){
                    audio.play();
                }else{
                    audio.pause();
                }
                this.lastRunTime = Date.now();
            }
        },
        playNewz(){//播放声音
            var borswer = window.navigator.userAgent.toLowerCase();
            if (borswer.indexOf("ie") >= 0) {
                //IE内核浏览器
                var strEmbed = '<embed name="embedPlay" src="'+this.newOrderz+'" autostart="true" hidden="true" loop="false"></embed>';
                $("body").find("embed").remove()
                if ($("body").find("embed").length <= 0){
                    $("body").append(strEmbed);
                }
                const body = document.querySelector("body");
                if (body.append) {
                    body.append(strEmbed);
                } else {
                    body.appendChild(strEmbed);
                }
                var embed = document.embedPlay;
                //浏览器不支持 audion，则使用 embed 播放
                embed.volume = 100;
                //embed.play();这个不需要
            } else {
                //非IE内核浏览器
                var strAudio = "<audio id='audioPlay' type='audio/mpeg' src='"+this.newOrderz+"' hidden='true'>";
                $("body").find("audio").remove()
                if ($("body").find("audio").length <= 0){
                    $("body").append(strAudio);
                }
                var audio = document.getElementById("audioPlay");

                var currentTime = Date.now();
                var protectTime = 500;//设置保护性延时 单位毫秒，不要小于50 建议100以上
                if((currentTime - this.lastRunTime) < protectTime){
                        return;//两次执行太过频繁，直接退出
                }
                if(audio.paused){
                    audio.play();
                }else{
                    audio.pause();
                }
                this.lastRunTime = Date.now();
            }
        },
        playCancel(){//播放声音
            var borswer = window.navigator.userAgent.toLowerCase();
            if (borswer.indexOf("ie") >= 0) {
                //IE内核浏览器
                var strEmbed = '<embed name="embedPlay" src="'+this.cancelAudio+'" autostart="true" hidden="true" loop="false"></embed>';
                $("body").find("embed").remove()
                if ($("body").find("embed").length <= 0){
                    $("body").append(strEmbed);
                }
                const body = document.querySelector("body");
                if (body.append) {
                    body.append(strEmbed);
                } else {
                    body.appendChild(strEmbed);
                }
                var embed = document.embedPlay;
                //浏览器不支持 audion，则使用 embed 播放
                embed.volume = 100;
                //embed.play();这个不需要
            } else {
                //非IE内核浏览器
                var strAudio = "<audio id='audioPlay' type='audio/mpeg' src='"+this.cancelAudio+"' hidden='true'>";
                $("body").find("audio").remove()
                if ($("body").find("audio").length <= 0){
                    $("body").append(strAudio);
                }
                var audio = document.getElementById("audioPlay");

                var currentTime = Date.now();
                var protectTime = 500;//设置保护性延时 单位毫秒，不要小于50 建议100以上
                if((currentTime - this.lastRunTime) < protectTime){
                        return;//两次执行太过频繁，直接退出
                }
                if(audio.paused){
                    audio.play();
                }else{
                    audio.pause();
                }
                this.lastRunTime = Date.now();
            }
        },
        showNew(payload){
            console.log(payload)
            // 新订单提示消息
            this.ebus.$emit("waitingAcceptNum",payload.waitPrintOrderNum)
            let _this = this;
            this.$notify({
                title: '通知',
                dangerouslyUseHTMLString: true,
                message: `<p>您有新的订单，请注意查收</p>
                    <p>订单号：<span style="color:rgba(0,0,0,0.65)">${payload.orderNum}</span></p>
                    <p style="text-align:right;color:#1890ff;text-decoration:underline;cursor:pointer;">立即查看</p>`,
                position: 'bottom-right',
                onClick() {
                    _this.goWait(); //自定义回调,message为传的参数
                }
            });
        },
        goWait(){
            if(this.$route.path == "/order/waitingAccept"){
                this.ebus.$emit("waitingAcceptRefresh")
            }else{
                this.$router.push("/order/waitingAccept")
            }
        },
        showNewz(payload){
            console.log(payload)
            // 新订单提示消息
            this.ebus.$emit("waitingAcceptNum",payload.waitPrintOrderNum)
            let _this = this;
            this.$notify({
                title: '通知',
                dangerouslyUseHTMLString: true,
                message: `<p>您有新的订单，系统已自动接单，请注意查收</p>
                    <p>订单号：<span style="color:rgba(0,0,0,0.65)">${payload.orderNum}</span></p>
                    <p style="text-align:right;color:#1890ff;text-decoration:underline;cursor:pointer;">立即查看</p>`,
                position: 'bottom-right',
                onClick() {
                    _this.goWaitz(); //自定义回调,message为传的参数
                }
            });
        },
        goWaitz(){
            if(this.$route.path == "/order/waitingPrint"){
                this.ebus.$emit("waitingPrintRefresh")
            }else{
                this.$router.push("/order/waitingPrint")
            }
        },
        showCancel(payload){
            // 取消订单提示消息
            let _this = this;
            this.$notify({
                title: '通知',
                dangerouslyUseHTMLString: true,
                message: `<p>您有订单被取消，请注意查看</p>
                    <p>订单号：<span style="color:rgba(0,0,0,0.65)">${payload.orderNum}</span></p>
                    <p style="text-align:right;color:#1890ff;text-decoration:underline;cursor:pointer;">立即查看</p>`,
                position: 'bottom-right',
                onClick() {
                    _this.goCancel(); //自定义回调,message为传的参数
                }
            });
        },
        goCancel(){
            if(this.$route.path == "/order/cancel"){
                this.ebus.$emit("cancelRefresh")
            }else{
                this.$router.push("/order/cancel")
            }
        },
        websocketonopen() {//连接成功事件
            //提示成功
            const param = {message: this.$store.state.user.userInfo.userauthid, type: 1}
            this.websocketsend(JSON.stringify(param))
            //开启心跳
            this.start();
        },
        
        websocketonerror(e) {//连接失败事件
            //错误
            console.log("WebSocket连接发生错误");
            
            //重连
            this.reconnect();
        },
        websocketclose(e) {//连接关闭事件
            //关闭
            console.log("connection closed (" + JSON.stringify(e) + ")");
            //重连
            this.reconnect();
        },
        websocketonmessage(event) {//接收服务器推送的信息
            let res = JSON.parse(event.data)
            console.log(res)
            if(res.type == 1){
                // 创建订单
                console.log(this.userInfo.state)
                if(this.userInfo.state == 1){
                    this.playNewz()
                    this.showNewz(res.payload)
                }else if(this.userInfo.state == 2){
                    this.playNew()
                    this.showNew(res.payload)
                }
                
            }else if(res.type == 3 || res.type == 4){
                // 已取消订单
                this.playCancel()
                this.showCancel(res.payload)
            }
            //收到服务器信息，心跳重置
            this.reset();
        },
        websocketsend(msg) {//向服务器发送信息
            //数据发送
            this.websock.send(msg);
        },
    }
};

</script>
<style>
.el-notification{
    width: 280px;
}
</style>
