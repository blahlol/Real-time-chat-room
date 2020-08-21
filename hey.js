buttons=document.querySelector('#buttons');
messages=document.querySelector('div.messages');
let name;
let sub;
chatform=document.forms['chat'];
let channel;
nameform=document.forms['username'];

nameform.addEventListener('submit',e=>{
    e.preventDefault();
    name=nameform['username'].value;
    nameform.style.display='none';
    buttons.style.display='block';
})

function getMessages(channel){
    console.log(channel)
    sub=db.collection('chats')
    .where('channel','==',channel)
    .orderBy('time')
    .onSnapshot(data=>{
        data.docChanges().forEach(change=>{
            person=change.doc.data().name;
            msg=change.doc.data().message;
            console.log(person,msg)
            messages.innerHTML+=`<p class='alert alert-success'><b>${person}</b>: ${msg}</p>`;
        })
    })
}
getMessages('');

buttons.addEventListener('click',(e)=>{
if(e.target.tagName=='BUTTON'){
    messages.innerHTML='';
    messages.style.display='block';
    sub();
    channel=e.target.textContent;
    getMessages(channel);
    chatform.style.display='block';
}
})

chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
    text=chatform['message'].value;
    now=new Date();
    date=firebase.firestore.Timestamp.fromDate(now);
    obj={'channel':channel,'name':name,'message':text,'time':date};
    db.collection('chats').add(obj).then(()=>{
        console.log('added');
    }).catch((err)=>{
        console.log(err);
    })
    chatform['message'].value='';

})
