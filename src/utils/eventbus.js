//on  绑定
//on(eventName,callback)
const EventList = {
    
}
const on = function(eventName,callback){
    if(!EventList[eventName]){
        EventList[eventName] = [];
    }
    EventList[eventName].push(callback);
}
//emit  触发
//emit(eventName,params)
const emit = function(eventName,params){
    if(!EventList[eventName]) return;
    EventList[eventName].map((cb)=>{
        cb(params);
    })
}
//off  绑定
//off(eventName,[callback])
const off = function(eventName,callback){
    if(!EventList[eventName]) return;
    if(callback){
        let index = EventList[EventName].indexOf(callback);
        EventList[EventName].splice(index,1);
    }else{
        EventList[EventName] = [];
    }
}
export {
    on,emit,off
}