<script lang="ts">
//import {jsonToHash,hashToJson} from "$lib/hashTOJson"
import Dialog from '$lib/components/Dialog.svelte'
import type {dialogStruct} from '$lib/components/Dialog.svelte'
import { onMount } from 'svelte';
//let dialog:any
const dialogConfig:dialogStruct = {
    //open:true,
    //dialogEl:undefined,
    title:"SolidJScad",
    closeOnBackdrop:false,
    closeOnEsc:false,
} ;
type  signalingStruct = {
  ICEList:RTCIceCandidateInit[],
  offer?:string,
  answer?:string,
  backUrl?:string,
}
onMount(() => { 
    //dialogConfig.dialogEl?.showModal()
    //return;
    if (window.location.hash   ){
        try{
            handleOffer(JSON.parse(decodeURIComponent(window.location.hash.slice(1))));
        }catch(e){
            console.error(e)
        } 
        location.hash = '';       
    }
    
});
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
async function handleOffer(sign:signalingStruct) {
        const peerConnection = new RTCPeerConnection(configuration);

        // 设置远程描述为收到的 Offer
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription({sdp:sign.offer,type:"offer"}));
        console.log('远程 Offer 已设置');
        sign.ICEList.forEach(ice=>{
            peerConnection.addIceCandidate(ice);
        })
        
        // 创建 Answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('本地 Answer 已创建');

        // 通过信令服务器发送 Answer
        const msgAnswer:signalingStruct = {   answer: peerConnection.localDescription?.sdp,ICEList:[] }
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                msgAnswer.ICEList.push (event.candidate);
                console.log('ICE Candidate 已发送');
            }else{
                //config.open = true;
                const ans = JSON.stringify(msgAnswer)
                //console.log(ans)
                const link = document.createElement("a")
                link.target="_blank"
                link.textContent = "请求连接"
                link.href=sign.backUrl+"#"+encodeURIComponent(ans)
                document.getElementById("test")?.appendChild(link)
                dialogConfig.dialogEl?.showModal()
                link.click();
                return
                
                
                //encodeURIComponent(JSON.stringify(msgList))
            }
        };

        // 监听 Data Channel，接收消息
        peerConnection.ondatachannel = (event) => {
            const receiveChannel = event.channel;
            receiveChannel.onmessage = (event) => {
                console.log(`对方: ${event.data}`)
                dialogConfig.dialogEl?.close();
                //messages = [...messages, `对方: ${event.data}`];
            };
        };
    }


</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<Dialog {dialogConfig}   >
    <!-- 自定义内容（带超链接） -->
     
     <p id="test"><button onclick={()=>{
        window.location.href="/#new"
        window.location.reload()
    }}  >从这里开始</button></p>
    <p>参数化 3D 建模 <a href="/docs/" aria-current="page"  rel="noopener noreferrer">文档</a></p> 
    <p><a href="/home/" aria-current="page"  rel="noopener noreferrer">Home</a></p>
    <a href="/docs/UserAgreement" aria-current="page" rel="noopener noreferrer">用户协议</a>
    <a href="/docs/PrivacyPolicy" aria-current="page"  rel="noopener noreferrer">隐私政策</a> 
    
</Dialog>