// 引入 events 模块
var events = require('events');


class EventEmitter {
    static instance
    eventEmitter
    constructor() {
        console.log('执行一次');
        
        // 创建 eventEmitter 对象
        this.eventEmitter = new events.EventEmitter();
    }

    static getInstance() {
        console.log(222);
        
        if(!EventEmitter.instance) {
        
            EventEmitter.instance = new EventEmitter().eventEmitter
        }
        return EventEmitter.instance
    }
}

export default EventEmitter.getInstance()