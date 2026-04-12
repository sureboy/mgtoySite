<script lang="ts">
//import {jsonToHash,hashToJson} from "$lib/hashTOJson"
import { onMount } from 'svelte';
type  signalingStruct = {
  ICEList:RTCIceCandidateInit[],
  offer?:string,
  answer?:string,
}
onMount(() => {
    if (window.location.hash){
        handleOffer(JSON.parse(decodeURIComponent(window.location.hash.slice(1))));
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
                const ans = JSON.stringify(msgAnswer)
                console.log(ans)
                const link = document.createElement("a")
                link.target="_blank"
                link.href="http://localhost:3000/test.html#"+encodeURIComponent(ans)
                link.click();
                //encodeURIComponent(JSON.stringify(msgList))
            }
        };

        // 监听 Data Channel，接收消息
        peerConnection.ondatachannel = (event) => {
            const receiveChannel = event.channel;
            receiveChannel.onmessage = (event) => {
                console.log(`对方: ${event.data}`)
                //messages = [...messages, `对方: ${event.data}`];
            };
        };
    }


</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
